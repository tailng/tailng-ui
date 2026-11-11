# AG-UI 1.0 Integration Plan

Status: Proposed

Normative source: [AG-UI 1.0 schema](https://github.com/ag-ui-protocol/ag-ui/blob/main/docs/spec/1.0/schema.json)

## Decision

AG-UI 1.0 is the preferred live protocol between an agent runtime and a TailNG application.
`@tailng-ui/ai/ag-ui` translates that protocol into the canonical TailNG model. Raw events do not
flow into chat components.

```text
RunAgentInput -> application transport -> agent
agent events  -> validation -> AG-UI reducer -> TailNG store -> components
```

The adapter is protocol-aware but transport-light. It can consume an `AsyncIterable` or equivalent
application-supplied stream, but it does not own endpoint URLs, cookies, authentication, or retry
policy.

## Conformance scope

### Required chat profile

The first usable integration must support:

- `RUN_STARTED`
- `RUN_FINISHED`
- `RUN_ERROR`
- `TEXT_MESSAGE_START`
- `TEXT_MESSAGE_CONTENT`
- `TEXT_MESSAGE_END`
- `TEXT_MESSAGE_CHUNK`
- `TOOL_CALL_START`
- `TOOL_CALL_ARGS`
- `TOOL_CALL_END`
- `TOOL_CALL_CHUNK`
- `TOOL_CALL_RESULT`
- `MESSAGES_SNAPSHOT`

### Complete AG-UI 1.0 profile

Before declaring full 1.0 support, add:

- `STEP_STARTED`
- `STEP_FINISHED`
- `REASONING_START`
- `REASONING_END`
- `REASONING_MESSAGE_START`
- `REASONING_MESSAGE_CONTENT`
- `REASONING_MESSAGE_END`
- `REASONING_MESSAGE_CHUNK`
- `REASONING_ENCRYPTED_VALUE`
- `STATE_SNAPSHOT`
- `STATE_DELTA`
- `ACTIVITY_SNAPSHOT`
- `ACTIVITY_DELTA`
- `SUBAGENT_STARTED`
- `SUBAGENT_FINISHED`
- `SUBAGENT_ERROR`
- `RAW`
- `CUSTOM`

TailNG documentation must state whether a release implements the required chat profile or the
complete profile. It must not claim AG-UI 1.0 conformance based only on text streaming.

## Protocol invariants

The reducer follows the AG-UI processing rules:

- Arrival order is authoritative. `timestamp` is informational and never used to reorder events.
- `threadId`, `runId`, `messageId`, `toolCallId`, and `subagentRunId` are opaque.
- An identifier is never parsed for type, date, tenant, or hierarchy.
- Optional absent values are omitted rather than represented as top-level `null` fields.
- Metadata is open by key; the `ag-ui` metadata key remains reserved for protocol use.
- Unknown supported-version material is handled according to AG-UI's processing and compatibility
  rules, not rendered directly.
- `rawEvent` is diagnostic material and never drives protocol behavior.

## Run input boundary

The application constructs `RunAgentInput`. TailNG may provide a pure helper, but it does not submit
the request itself.

Required AG-UI fields include:

```text
threadId
runId
messages
```

Other fields such as state, tools, context, forwarded properties, parent run, and interrupt resume
data remain application policy.

Two history modes are supported:

### Server history mode (recommended)

- The server owns durable conversation history.
- The client sends the new turn and identifiers needed by the backend integration.
- The backend hydrates model context from storage.
- The browser does not resend an unbounded transcript on every run.

### Client history mode

- The application supplies the message context expected by its runtime.
- The application chooses a bounded context window or summary strategy.
- TailNG does not silently truncate messages because that changes agent behavior.

The adapter exposes conversion utilities for messages the application chooses to send. It does not
decide the model context window.

## Event mapping

| AG-UI event family | TailNG target | Reducer behavior |
| --- | --- | --- |
| Run | `TngAiRun` | Create/update the run without rewriting prior messages. |
| Step | Run activity | Record display-safe step activity; never expose raw runtime logs by default. |
| Text | Text message part | Start one stable part, append deltas, finalize it. |
| Tool call | Tool call/result parts | Correlate by `toolCallId`; preserve invalid streamed arguments. |
| Reasoning | Reasoning part | Hidden by default; retain encrypted values as opaque data. |
| State | Shared state channel | Apply snapshot or JSON Patch outside message content. |
| Message snapshot | Normalized message store | Reconcile by ID without replacing unrelated history pages. |
| Activity | Activity state/part | Apply snapshot or delta through registered activity presentation. |
| Subagent | Run/author activity | Attribute only when allowed by application presentation policy. |
| `CUSTOM` | Extension registry | Accept namespaced registered values; otherwise preserve safely. |
| `RAW` | Diagnostics | Never render or use to drive normal behavior. |

## Text lifecycle

The canonical sequence is:

```text
TEXT_MESSAGE_START
TEXT_MESSAGE_CONTENT x 0..n
TEXT_MESSAGE_END
```

`TEXT_MESSAGE_CHUNK` is convenience input and is normalized into the same lifecycle before it
reaches the store.

Rules:

- Start creates or opens one message and one stable text part.
- Content appends a non-empty delta to the matching open part.
- End marks the part complete and resolves message status when no other open work remains.
- Duplicate starts, content after end, end without start, and conflicting IDs produce typed adapter
  diagnostics. They do not crash the transcript.
- UI updates are batched separately from protocol reduction; no event is lost because rendering is
  throttled.

## Tool-call lifecycle

Canonical sequence:

```text
TOOL_CALL_START
TOOL_CALL_ARGS x 0..n
TOOL_CALL_END
TOOL_CALL_RESULT
```

Rules:

- Argument fragments accumulate as a string.
- JSON parsing occurs when sufficient input is available and again at end.
- Invalid JSON remains available as `rawInput` with `input` omitted.
- A result may arrive after other calls start or finish.
- Calls and results correlate only through `toolCallId`.
- The renderer does not invoke tools.
- Approval state is application-owned and converted into AG-UI interrupt/resume behavior by the
  application or higher-level adapter.

## Snapshots and long history

`MESSAGES_SNAPSHOT` is supported for protocol synchronization, reconnect, and adapter correctness.
It is not the default history-pagination mechanism.

Reconciliation rules:

- Normalize snapshot records before writing to the store.
- Reconcile by message ID and part/tool-call IDs.
- Preserve locally loaded pages that are outside the authoritative scope of the snapshot.
- Do not append duplicate messages merely because a later run restates them.
- Document whether a particular transport treats a snapshot as the entire thread or the active
  synchronization window.
- Never emit repeated whole-thread snapshots solely to update one streaming message.

Historical loading uses `TngAiHistorySource`, described in the performance plan.

## State and activity deltas

AG-UI state and activity deltas use patch semantics. The adapter must:

- Validate the patch structure.
- Apply patches to a copy, never a consumer-owned object.
- Reject prototype-polluting or otherwise unsafe paths.
- Set configurable limits for operation count, nesting depth, and payload size.
- Produce a diagnostic and preserve the last valid state when a patch cannot be applied.

Shared state is not automatically rendered. Consumers select state through explicit inputs or
registered renderers.

## Reasoning policy

- Encrypted reasoning values are opaque and never displayed.
- Raw reasoning text is hidden by default.
- A consumer can enable a display-safe reasoning-summary renderer explicitly.
- The adapter must not relabel raw reasoning as a safe summary.
- Accessibility announcements describe progress, not private reasoning content.

## Custom events

`CUSTOM` events are converted only through a registry:

```text
event name -> validator -> TailNG extension or activity update
```

Requirements:

- Names are namespaced.
- Each registration provides runtime validation.
- Unknown events may be retained for diagnostics or ignored according to policy.
- No custom event may insert HTML, execute JavaScript, invoke a tool, or select an Angular component
  without an explicit application registration.

## Mastra integration

Mastra agents are supported through the external `@ag-ui/mastra` adapter:

```text
Mastra Agent -> @ag-ui/mastra -> AG-UI 1.0 -> @tailng-ui/ai/ag-ui
```

Reference integration requirements:

- Pin a tested combination of `@ag-ui/core`, `@ag-ui/client`, and `@ag-ui/mastra` in examples.
- Test streaming text, parallel tool calls, tool results, cancellation, and persisted thread IDs.
- Test frontend tool approval/resume separately for each supported model family.
- Test attributed subagents only after the complete profile is implemented.
- Do not import Mastra from the TailNG package.

Mastra workflow streaming may use a different adapter path until workflow-to-AG-UI behavior is
verified. TailNG's normalized message model allows a future AI SDK adapter without changing chat
components.

## Transport interface

The adapter should accept a minimal consumer-supplied transport contract, conceptually:

```ts
export interface TngAgUiTransport {
  run(input: unknown, options?: { signal?: AbortSignal }): AsyncIterable<unknown>;
}
```

The final contract should use AG-UI types inside the secondary entry point. The conceptual shape is
shown here to freeze ownership:

- TailNG may validate and reduce yielded events.
- The application supplies authorization and endpoint behavior.
- Cancellation uses `AbortSignal` or the transport's equivalent.
- Reconnection, SSE event IDs, and retry backoff are transport concerns.
- A stop action does not synthesize `RUN_FINISHED`; it waits for transport/runtime resolution or
  records a local cancelled presentation state according to an explicit option.

## Security and limits

- Validate every external event before reduction.
- Set maximum event, text-delta, metadata, state, tool-argument, and snapshot sizes.
- Set maximum nesting depth for arbitrary JSON values.
- Sanitize all displayable text at the renderer boundary.
- Use safe URL-scheme policies for links and media.
- Never authorize a tool action based only on event metadata.
- Keep tenant and user authorization on the server.
- Redact raw events and tool arguments from production logging by default.
- Do not expose system/developer messages unless the application opts in.

## Adapter diagnostics

Protocol problems are observable without becoming transcript messages by default:

```text
invalid-event
unsupported-event
invalid-lifecycle
orphan-message-delta
orphan-tool-result
invalid-tool-arguments
invalid-patch
limit-exceeded
renderer-unavailable
```

Diagnostics include safe identifiers and codes, not complete sensitive payloads.

## Verification checklist

The executable protocol specification is defined by the `AI-AGUI-*` catalog in
[AG-UI adapter tests](./tests/ag-ui-adapter.md). Every supported event and lifecycle rule must begin
as an observed failing test before adapter behavior is implemented.

### Schema and compatibility

- [ ] Official AG-UI 1.0 fixtures validate and reduce.
- [ ] Optional absent fields are not serialized as placeholder `null`.
- [ ] Unknown metadata survives without affecting security behavior.
- [ ] Arrival order is preserved when timestamps are absent or out of order.

### Streaming

- [ ] Text start/content/end creates one stable TailNG text part.
- [ ] Chunk events normalize to the same final result.
- [ ] Parallel text and tool sequences remain correctly correlated.
- [ ] Cancellation retains partial output.

### Tools

- [ ] Fragmented arguments parse when complete.
- [ ] Invalid arguments preserve `rawInput`.
- [ ] Parallel tool results attach to the correct call.
- [ ] A tool result arriving after a snapshot does not duplicate the call.

### State, activity, and reasoning

- [ ] Valid patches apply immutably.
- [ ] Invalid patches preserve the last valid state.
- [ ] Reasoning is hidden by default.
- [ ] Encrypted reasoning is never displayed.
- [ ] Unknown activities and custom events use safe fallbacks.

### Mastra

- [ ] Reference Mastra agent streams text through the adapter.
- [ ] Reference tool call and result render correctly.
- [ ] Persisted `threadId` survives a subsequent run.
- [ ] Stop aborts the active run without corrupting the next run.
- [ ] Long-thread mode does not resend or snapshot an unbounded history by default.

