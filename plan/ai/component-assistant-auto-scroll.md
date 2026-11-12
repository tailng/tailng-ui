# Component Assistant Auto-Scroll Plan

Status: Core follow/pause behavior implemented; advanced anchoring and responsive cases remain open

Delivery method: strict test-driven development

Scope:

- Shared TailNG component-assistant demo
- Full AI Chat examples-page variant
- Compact documentation landing-page variant

Related contracts:

- `AI-CMP-LIST-*` in [components and accessibility tests](./tests/components-and-accessibility.md)
- `AI-VIRT-ANCHOR-*` in [virtualization and performance tests](./tests/virtualization-and-performance.md)
- [History and performance](./history-and-performance.md)

## Tracking convention

- `[ ]` marks an open decision, test, implementation item, acceptance criterion, or verification gate.
- `[x]` is used only after the stated condition has verifiable evidence at its required test level.
- Every implementation slice follows Specify, Red, Green, Refactor, Verify.
- No production behavior is added before its named executable test is observed failing for the
  intended missing behavior.

## Problem statement

The transcript was a bounded scroll container, but message updates only replaced the Angular message
signal. The earlier implementation did not observe the scroll position, retain follow state, wait for
the updated DOM, or move the transcript to its new end. New user messages, assistant messages,
streaming text, tool details, prompt options, and component previews could therefore appear below the
visible viewport. The checked core items below now cover that failure; unchecked items retain the
advanced anchoring and cross-viewport backlog.

Naively setting `scrollTop = scrollHeight` on every update would fix the immediate symptom but would
create another bug: a user reading an older message would be pulled back to the bottom by each token.

## Product behavior

### Follow mode

- [x] Treat the transcript as following when its distance from the bottom is at most 48 CSS pixels.
- [x] Start each mounted assistant in follow mode.
- [x] After a user submits a message or activates a prompt option, resume follow mode and reveal that
      message plus the incoming response.
- [x] While following, keep the latest content visible after messages, parts, tool details, prompt
      options, and previews render.
- [x] Use immediate scrolling for automatic streaming updates; do not smooth-scroll once per token.
- [x] Never move keyboard focus into the transcript when following or jumping to the latest content.

Distance from the bottom is defined as:

```text
scrollHeight - clientHeight - scrollTop
```

Values from `0` through `48` are inside the near-bottom threshold. Small negative values caused by
rounding or browser overscroll are clamped to `0`.

### User-controlled pause and resume

- [x] When the user scrolls more than 48 CSS pixels from the bottom, pause follow mode immediately.
- [x] While paused, preserve the visible reading position when new messages or streaming content
      arrive below it.
- [x] Do not resume merely because a message, tool result, preview, timer, or change-detection pass
      occurs.
- [ ] Resume automatically when the user manually returns within the near-bottom threshold.
- [x] Show a “Jump to latest” button while follow mode is paused and unseen content exists.
- [x] Activating “Jump to latest” reveals the end, clears unseen state, and resumes follow mode.
- [ ] Use smooth scrolling for an explicit “Jump to latest” action only when reduced motion is not
      requested; otherwise use immediate scrolling.

### Unseen-content policy

- [x] Increment the unseen count once when a new message begins while follow mode is paused.
- [x] Do not increment the count for every token or every part added to the same message.
- [x] If an existing latest message gains a tool result, option group, or component preview while
      paused, ensure the latest button remains visible without inflating the message count.
- [x] Bound the visible label at `99+` while retaining the exact internal count.
- [x] Announce newly unseen messages through a polite status update no more than once per logical
      message.
- [ ] Clear unseen state when the end becomes visible, the user jumps to latest, the active thread is
      replaced, or the component is destroyed.

### History prepend

- [ ] Before loading earlier history, capture a stable visible message ID and its offset from the
      transcript container top.
- [ ] After older messages render, restore that message to the same visual offset within 1 CSS pixel.
- [x] Do not jump to the bottom after history is prepended.
- [x] Do not count prepended history as unseen latest content.
- [ ] Preserve focused content and text selection during prepend where the browser permits it.
- [ ] If the captured anchor no longer exists, fall back deterministically to the nearest surviving
      message without jumping to the end.

### Dynamic-height content

- [ ] While following, keep the end visible when the active row grows because of streaming text,
      tool arguments, a chart, a datepicker, a table, tags, or responsive reflow.
- [ ] While paused, compensate only for height changes above the visible anchor.
- [ ] Do not change `scrollTop` when content strictly below the visible anchor changes height.
- [x] Observe transcript/row size changes through one component-owned observer strategy rather than
      attaching one global listener per message.
- [x] Coalesce repeated message and resize notifications into at most one scroll reconciliation per
      animation frame.

## Recommended internal design

Keep the behavior docs-owned for the current demo. Do not publish a new `@tailng-ui/ai` API until the
generic transcript component and virtualization contracts are implemented.

### Template boundary

- [x] Add a stable template reference to the transcript scroll container.
- [ ] Add a stable end sentinel after the last transcript row.
- [x] Expose the latest control outside the scrolling list so it remains reachable when the list is
      paused above the end.
- [x] Keep the existing ordered-list and message semantics intact.

### Per-instance scroll state

Each mounted assistant owns independent state:

```ts
type TranscriptFollowState = Readonly<{
  following: boolean;
  unseenMessageIds: ReadonlySet<string>;
  pendingFrame: boolean;
  destroyed: boolean;
}>;
```

- [x] Do not store element references, observers, or animation-frame IDs in the shared chat store.
- [x] Do not introduce singleton follow state shared between the landing and examples surfaces.
- [x] Derive the visible unseen label from the per-instance set of message IDs.

### Update sequence

```text
Before store/signal update
  -> capture following state or history anchor

Store/signal update
  -> Angular renders the new message/part

One scheduled animation frame
  -> read final scroll geometry
  -> if following: reveal the end
  -> if paused: preserve anchor and update unseen state
```

- [x] Never calculate the final `scrollHeight` synchronously before Angular renders the update.
- [x] Use Angular post-render scheduling plus one animation-frame reconciliation.
- [x] Deduplicate multiple AG-UI events that arrive before the scheduled frame.
- [x] Cancel the scheduled frame and disconnect observers during component destruction.

### Event classification

- [x] Classify user submit and prompt activation as explicit resume-follow actions.
- [x] Classify assistant message start as one potentially unseen logical message.
- [x] Classify text deltas, tool transitions, results, extensions, and preview resizing as growth of an
      existing logical message.
- [x] Classify history loads as prepend operations with anchor preservation.
- [x] Keep scroll behavior independent from AG-UI transport details; it reacts to normalized view
      changes and explicit local actions.

## Accessibility requirements

- [x] Give the latest control an accessible name that includes the bounded unseen count when nonzero.
- [x] Keep the control reachable by keyboard without moving focus into the transcript automatically.
- [ ] Preserve focus in the composer after send unless an existing documented policy moves it.
- [x] Do not announce token-sized scroll updates.
- [x] Announce paused unseen-message changes politely and at a bounded cadence.
- [ ] Respect `prefers-reduced-motion` for explicit latest navigation.
- [ ] Ensure the latest control remains visible and usable at 200% and 400% zoom.
- [ ] Confirm the control does not obscure message content or the composer at a 320 CSS-pixel width.

## TDD test catalog

### Follow and incoming content

| Done | ID                 | Scenario                                        | Expected                                                               | Level             |
| ---- | ------------------ | ----------------------------------------------- | ---------------------------------------------------------------------- | ----------------- |
| [x]  | AI-DEMO-SCROLL-001 | Mount a short transcript.                       | Transcript begins in follow mode with its end visible.                 | component/browser |
| [x]  | AI-DEMO-SCROLL-002 | Submit a message while at the end.              | User message and assistant start become visible after render.          | browser           |
| [x]  | AI-DEMO-SCROLL-003 | Append a new assistant message while following. | End remains visible without focus movement.                            | browser           |
| [x]  | AI-DEMO-SCROLL-004 | Stream multiple text deltas while following.    | End follows growth with at most one reconciliation per frame.          | browser/unit      |
| [x]  | AI-DEMO-SCROLL-005 | Append tool call and result while following.    | Expanded tool content remains visible.                                 | browser           |
| [x]  | AI-DEMO-SCROLL-006 | Render prompt options while following.          | Entire option region is reachable and latest remains visible.          | browser           |
| [x]  | AI-DEMO-SCROLL-007 | Render each component preview while following.  | Preview arrival/resize keeps the latest content reachable.             | browser           |
| [x]  | AI-DEMO-SCROLL-008 | Activate a prompt while paused above the end.   | Explicit local action resumes follow and reveals the submitted prompt. | browser           |

### Pause, unseen state, and latest control

| Done | ID                 | Scenario                                     | Expected                                                                    | Level             |
| ---- | ------------------ | -------------------------------------------- | --------------------------------------------------------------------------- | ----------------- |
| [x]  | AI-DEMO-SCROLL-009 | Scroll 49+ pixels above the end.             | Follow mode pauses.                                                         | unit/browser      |
| [x]  | AI-DEMO-SCROLL-010 | Stream content while paused.                 | Reading anchor stays fixed and latest control appears.                      | browser           |
| [x]  | AI-DEMO-SCROLL-011 | Receive many deltas for one unseen message.  | Unseen count increases once.                                                | unit/browser      |
| [ ]  | AI-DEMO-SCROLL-012 | Receive three new messages while paused.     | Count is three and accessible label reflects it.                            | component/browser |
| [ ]  | AI-DEMO-SCROLL-013 | Receive more than 99 unseen messages.        | Visible count is `99+`; internal IDs remain bounded by loaded records.      | unit/component    |
| [ ]  | AI-DEMO-SCROLL-014 | Manually return within 48 pixels of the end. | Follow resumes and unseen state clears.                                     | browser           |
| [x]  | AI-DEMO-SCROLL-015 | Activate “Jump to latest.”                   | End is visible, focus is not moved into the transcript, and follow resumes. | browser           |
| [ ]  | AI-DEMO-SCROLL-016 | Activate latest with reduced motion enabled. | Navigation is immediate rather than smooth.                                 | browser           |
| [x]  | AI-DEMO-SCROLL-017 | A programmatic scroll emits a scroll event.  | It does not incorrectly pause follow mode.                                  | unit/browser      |

### History and dynamic heights

| Done | ID                 | Scenario                                       | Expected                                                        | Level               |
| ---- | ------------------ | ---------------------------------------------- | --------------------------------------------------------------- | ------------------- |
| [ ]  | AI-DEMO-SCROLL-018 | Prepend the earlier-history fixture.           | Previous visible message retains its offset within 1 CSS pixel. | browser             |
| [ ]  | AI-DEMO-SCROLL-019 | Prepend while a transcript control is focused. | Focus and anchor remain stable.                                 | browser/a11y        |
| [ ]  | AI-DEMO-SCROLL-020 | Resize a row above the paused anchor.          | Scroll compensation equals the height delta.                    | browser             |
| [ ]  | AI-DEMO-SCROLL-021 | Resize a row below the paused anchor.          | Current viewport does not move.                                 | browser             |
| [x]  | AI-DEMO-SCROLL-022 | Resize the latest row while following.         | End remains visible.                                            | unit/browser        |
| [ ]  | AI-DEMO-SCROLL-023 | Change transcript width responsively.          | Anchor/follow policy remains correct after reflow.              | browser             |
| [ ]  | AI-DEMO-SCROLL-024 | History and incoming message settle together.  | Prepend anchor is preserved; new content becomes unseen.        | integration/browser |

### Lifecycle, isolation, and responsiveness

| Done | ID                 | Scenario                                     | Expected                                                                     | Level               |
| ---- | ------------------ | -------------------------------------------- | ---------------------------------------------------------------------------- | ------------------- |
| [ ]  | AI-DEMO-SCROLL-025 | Mount full and compact variants together.    | Each transcript maintains independent follow/unseen state.                   | component/browser   |
| [ ]  | AI-DEMO-SCROLL-026 | Destroy with a reconciliation frame pending. | Frame is cancelled or safely ignored; no detached mutation occurs.           | unit/browser        |
| [ ]  | AI-DEMO-SCROLL-027 | Destroy with resize observation active.      | Observer disconnects and callbacks cannot update disposed state.             | browser/performance |
| [ ]  | AI-DEMO-SCROLL-028 | Run continuous deterministic streaming.      | Scroll reconciliation is bounded to one per animation frame.                 | performance         |
| [ ]  | AI-DEMO-SCROLL-029 | Test at 320 px, tablet, and desktop widths.  | Latest control, transcript, and composer remain reachable without overflow.  | browser             |
| [ ]  | AI-DEMO-SCROLL-030 | Load the landing assistant through `@defer`. | Follow state initializes after deferred mount and latest content is visible. | browser             |

## Delivery phases

### Phase 0: Confirm behavior

- [x] Approve the 48 CSS-pixel near-bottom threshold.
- [x] Approve explicit send/prompt activation as resume-follow actions.
- [x] Approve the “Jump to latest” control and bounded unseen-message count.
- [x] Approve immediate automatic scrolling and reduced-motion-aware explicit scrolling.
- [x] Approve stable-anchor behavior for earlier-history loading.

Exit gate:

- [x] No unresolved decision changes follow activation, unseen counting, history anchoring, or
      reduced-motion behavior.

### Phase 1: Red tests and pure policy

- [ ] Add a pure follow-policy helper shell with injected threshold and scheduler contracts.
- [ ] Add failing threshold, unseen-ID, deduplication, and action-classification unit tests.
- [ ] Add failing component tests for latest-control visibility, label, and per-instance isolation.
- [x] Record the intended Red failures before adding policy behavior.
- [x] Implement the minimum pure policy required to turn the unit cases green.

Exit gate:

- [x] Follow/unseen decisions are deterministic without a browser DOM.

### Phase 2: Browser follow behavior

- [x] Add failing real-browser tests for send, incoming messages, streaming, options, tools, and all
      four preview types.
- [x] Add transcript reference, scroll-state handling, and post-render frame reconciliation.
- [x] Add user-scroll pause and explicit latest-control resume.
- [ ] Turn `AI-DEMO-SCROLL-001..017` green.
- [x] Confirm focus never moves into the transcript as a side effect of automatic scrolling.

Exit gate:

- [x] New content is immediate while following and never steals a reader's older-message position.

### Phase 3: History and dynamic content

- [ ] Add failing browser tests for prepend anchoring and dynamic row-height changes.
- [ ] Implement stable-ID anchor capture/restoration.
- [x] Implement resize reconciliation and one-frame coalescing.
- [ ] Turn `AI-DEMO-SCROLL-018..024` green.
- [x] Verify history prepend never increments unseen-latest state.

Exit gate:

- [ ] Prepend and resize anchor error is at most 1 CSS pixel after stabilization.

### Phase 4: Lifecycle and responsive verification

- [ ] Add cleanup, two-instance, deferred-mount, viewport, and cadence tests.
- [x] Disconnect observers and cancel frames during teardown.
- [ ] Turn `AI-DEMO-SCROLL-025..030` green.
- [ ] Run focused unit/component/browser suites, docs tests, typecheck, lint, docs build, route checks,
      and landing/examples prerender.
- [x] Update human and AI-readable documentation with the follow/pause/latest behavior.

Exit gate:

- [ ] Both surfaces follow correctly, preserve user intent, clean up fully, and remain responsive.

## Definition of done

- [x] A user at the transcript end sees every new message and streamed update without manual scrolling.
- [x] A user reading older content is never pulled to the end by incoming content.
- [x] “Jump to latest” exposes bounded unseen state and predictably resumes following.
- [ ] Earlier-history loading and dynamic row heights preserve the correct visual anchor.
- [ ] Full and compact assistants keep independent scroll state.
- [x] Automatic scrolling does not move focus into the transcript or generate token-sized announcements.
- [ ] Reduced-motion, narrow viewport, zoom, keyboard, and screen-reader checks pass.
- [x] Scroll/resize work is coalesced and leaves no observer, frame, timer, or detached-node leak in
      the exercised component lifecycle.
- [ ] Every `AI-DEMO-SCROLL-*` case is green at its required level.

## Planned files

- [x] Pure transcript follow-policy helper and unit tests under the shared component-assistant demo.
- [x] Shared assistant component/template changes for transcript references and latest control.
- [x] Shared assistant CSS for a non-obscuring latest control.
- [ ] Real-browser geometry, history-anchor, responsive, and cleanup tests.
- [x] Examples-page and AI-readable documentation updates.
- [x] Plan/test index and traceability updates.
