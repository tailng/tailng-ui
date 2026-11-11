# Chat History and Performance Plan

Status: Proposed

## Performance objective

A conversation may contain thousands of messages, large Markdown responses, code blocks, images,
files, tool traces, and streamed updates. Browser work must remain bounded by the active viewport and
a configurable recent-message cache, not by total thread length.

## Storage tiers

```text
Durable server history
        |
        | cursor pages
        v
Optional IndexedDB cache
        |
        | recent pages
        v
Bounded in-memory normalized store
        |
        | visible IDs + overscan
        v
Virtualized Angular DOM
```

The server is the source of truth. IndexedDB is an optional performance cache and is never required
for correctness.

## Initial budgets

These defaults are starting points and must remain configurable:

| Budget | Initial default |
| --- | ---: |
| History page | 40 messages |
| History prefetch threshold | 10 messages from loaded start |
| In-memory message records | 300 per active thread |
| Recently opened thread cache | 3 threads |
| Mounted message views | Target 20-60, based on viewport and overscan |
| Visible-range overscan | 1 viewport above and below |
| Stream presentation batch | One animation frame, with a 50 ms maximum interval |

These are budgets, not correctness limits. Active messages, focused content, an anchor message, and
in-flight operations may be pinned temporarily.

## History source

TailNG consumes an application-owned cursor source, conceptually:

```ts
export interface TngAiHistoryPage {
  readonly items: readonly TngAiMessage[];
  readonly previousCursor?: string;
  readonly hasMore: boolean;
}

export interface TngAiHistorySource {
  loadBefore(request: {
    readonly threadId: string;
    readonly cursor?: string;
    readonly limit: number;
    readonly signal?: AbortSignal;
  }): Promise<TngAiHistoryPage>;
}
```

The final API may use an async abstraction consistent with TailNG conventions. Required ownership:

- The application performs the request and authorization.
- Cursors are opaque.
- TailNG deduplicates by message ID.
- Switching threads cancels or ignores stale page results.
- Loading failure preserves already visible messages and exposes a retry request.

Offset pagination is not recommended because retries, edits, deletions, and branches can shift
positions.

## Normalized store

The store keeps order separate from message records:

```text
orderedIdsByThread[threadId] -> [messageId, ...]
messagesById[messageId]      -> TngAiMessage
runsById[runId]              -> TngAiRun
```

Implementation rules:

- Updating streamed text changes one message record, not the ordered ID array.
- Adding or removing a message changes the order once.
- Selectors return stable references when their inputs did not change.
- Rendering tracks by message ID and part ID.
- Reducers accept deeply frozen input and do not mutate it.
- Cache eviction removes complete unpinned pages, not arbitrary records needed by an active anchor.
- The store records page boundaries and cursors separately from message metadata.

Do not use one computed value that clones, sorts, or maps the complete thread for every token.

## Virtualization

Variable-height transcript virtualization is required for long-thread support.

Generic measurement and range calculation should live in a new CDK entry point when practical:

```text
@tailng-ui/cdk/virtual-scroll
```

The AI package owns chat-specific policy on top of it:

- Near-bottom threshold.
- Follow mode.
- History prefetch.
- Latest-message button.
- Pinned active streaming message.
- Transcript anchor restoration.

### Required variable-height behavior

- Start from estimated heights.
- Measure mounted rows.
- Cache measurements by message ID and width bucket.
- Invalidate measurements when container width changes.
- Observe mounted row resize caused by streaming, media, code, or disclosure.
- Adjust scroll offset to preserve the visible anchor when a row above it changes height.
- Never use array index as row identity.
- Keep a focused row mounted until focus safely leaves or moves.

`content-visibility: auto` may supplement virtualization but cannot replace it because Angular views
and DOM nodes would still accumulate.

## Scroll anchoring

Before prepending older history, capture:

```text
anchor message ID
anchor offset from scroll container top
```

After the new page renders and measurements settle, restore that same visual offset. Do not restore
only absolute `scrollTop`; prepending content changes the coordinate system.

When content grows:

- If following latest, keep the end visible.
- If the user is reading older content, preserve the visible anchor.
- If a change occurs below the viewport, do not move the viewport.
- If a change occurs above the viewport, compensate by the measured height delta.

## Streaming performance

Protocol reduction and UI presentation are separate:

1. Consume and validate every event in order.
2. Append deltas to one logical text/tool buffer.
3. Schedule a bounded presentation update.
4. Render at most once per animation frame under normal load.
5. Force a final presentation update when a part or run ends.

Do not:

- Store one object per token.
- Recreate the complete message array per delta.
- Reparse the complete transcript per delta.
- Syntax-highlight incomplete code on every delta.
- Announce every delta through `aria-live`.

Markdown parsing may be throttled during streaming. Full sanitization and syntax highlighting run
after stabilization or completion, while preserving readable escaped text during the stream.

## Rich media and large content

- Store file references and metadata, not Base64 payloads.
- Lazy-load images near the viewport.
- Decode thumbnails instead of original images for compact previews.
- Revoke temporary object URLs when no longer used.
- Pause and release audio/video resources when unmounted.
- Bound source excerpts, JSON fallbacks, tool arguments, and tool outputs shown in the DOM.
- Collapse large tool payloads behind an explicit user action.
- Run expensive Markdown or highlighting work outside the critical scroll path; use a worker only if
  profiling justifies its lifecycle cost.

## IndexedDB cache

Optional cache candidates:

- Recently loaded immutable history pages.
- Unsent drafts.
- Lightweight message metadata.
- Resumable upload metadata that contains no credentials.

Required cache policy:

- Versioned schema.
- Maximum age.
- Maximum approximate byte size.
- Least-recently-used eviction.
- Per-user and per-tenant namespace.
- Complete purge on sign-out when required by product policy.
- No access tokens, signed secrets, raw provider requests, or hidden prompts.

Do not use synchronous `localStorage` for complete transcripts.

## Thread switching

- The sidebar stores summaries, not message histories.
- Switching thread detaches the previous visible-range observers and active renderers.
- The in-memory LRU may retain a bounded number of recent thread pages.
- Active streams are cancelled, moved to a background owner, or explicitly retained by application
  policy; the component must not accidentally keep them alive.
- Restoring a thread uses saved anchor information only if the associated page and width bucket are
  still valid.

## Cleanup

Destroy or unregister:

- AG-UI stream subscriptions and abort controllers.
- Resize and intersection observers.
- Scroll and window listeners.
- Scheduled animation frames and timers.
- Temporary object URLs.
- Markdown/highlighting workers.
- Media playback and decode resources.
- Renderer-specific overlays, menus, and tooltips.
- Pending history requests whose results are no longer applicable.

## Performance test gates

The executable specification is defined by `AI-VIRT-*` and `AI-PERF-*` in
[Virtualization and performance tests](./tests/virtualization-and-performance.md). Performance
behavior must be test-first: deterministic range/scheduler tests precede implementation, followed by
real-browser budget verification.

- [ ] 10,000-message synthetic thread does not create 10,000 message DOM nodes.
- [ ] Mounted message views remain within the configured range plus documented pinned exceptions.
- [ ] A 2-minute token stream does not grow one retained object per token.
- [ ] Streaming one message does not recreate unaffected message components.
- [ ] Prepending a page changes the anchor position by no more than 1 CSS pixel after settling.
- [ ] Expanding content above the viewport preserves the anchor.
- [ ] User scroll-up disables follow mode; new tokens do not pull the viewport down.
- [ ] Returning to latest re-enables follow mode predictably.
- [ ] Thread switching releases observers, media, timers, and object URLs.
- [ ] Cache eviction never removes active, focused, anchored, or streaming records.
- [ ] Memory stabilizes during repeated page load/evict cycles in a real browser.

## Profiling deliverables

Record before release:

- DOM node count by loaded thread size.
- Angular view creation and destruction counts.
- Stream update frequency and frame time.
- Markdown and syntax-highlighting cost.
- Heap snapshots before and after repeated thread switching.
- Scroll-anchor error during prepend and dynamic resizing.
- Low-memory/mobile behavior using CPU and network throttling.

