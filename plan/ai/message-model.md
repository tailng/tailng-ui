# Canonical TailNG AI Message Model

Status: Proposed contract

## Purpose

This model is the stable boundary used by TailNG stores, components, history pages, and renderers.
Protocol adapters translate external formats into this model. Components do not consume raw AG-UI,
Mastra, provider, or AI SDK messages.

## JSON foundation

All persisted protocol values use a strict JSON type:

```ts
export type TngAiJsonPrimitive = string | number | boolean | null;

export type TngAiJsonValue =
  | TngAiJsonPrimitive
  | readonly TngAiJsonValue[]
  | { readonly [key: string]: TngAiJsonValue };
```

Metadata is an object whose values are JSON values. It must never contain functions, `Date`, `File`,
`Blob`, class instances, DOM references, Angular objects, or cyclic structures.

## Thread

```ts
export interface TngAiThread {
  readonly id: string;
  readonly title?: string;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

The application owns thread creation, persistence, title generation, retention, and deletion.

## Run

A run is one invocation of an agent within a thread.

```ts
export type TngAiRunStatus =
  | 'idle'
  | 'queued'
  | 'running'
  | 'awaiting-input'
  | 'complete'
  | 'cancelled'
  | 'failed';

export interface TngAiRun {
  readonly id: string;
  readonly threadId: string;
  readonly parentRunId?: string;
  readonly status: TngAiRunStatus;
  readonly startedAt?: number;
  readonly finishedAt?: number;
  readonly error?: TngAiError;
  readonly usage?: TngAiUsage;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

Run status and message status are separate. A run may fail after producing one or more complete
messages, and one run may emit several messages or tool activities.

## Roles

```ts
export type TngAiRole =
  | 'developer'
  | 'system'
  | 'assistant'
  | 'user'
  | 'tool'
  | 'activity'
  | 'reasoning';
```

The role set intentionally aligns with materialized AG-UI 1.0 roles. Default transcript policy:

- `user` and `assistant` are visible messages.
- `tool` and `activity` are visible through specialized renderers or grouped disclosure.
- `system` and `developer` are hidden unless a consumer explicitly supplies a renderer and policy.
- `reasoning` is hidden unless it is an explicitly display-safe summary.

Role does not determine display identity. Multiple agents may share the assistant role.

## Message

```ts
export type TngAiMessageStatus =
  | 'queued'
  | 'sending'
  | 'streaming'
  | 'complete'
  | 'stopped'
  | 'failed';

export interface TngAiMessage {
  readonly id: string;
  readonly threadId: string;
  readonly runId?: string;
  readonly parentMessageId?: string;
  readonly role: TngAiRole;
  readonly status: TngAiMessageStatus;
  readonly parts: readonly TngAiMessagePart[];
  readonly author?: TngAiAuthor;
  readonly createdAt?: number;
  readonly updatedAt?: number;
  readonly finishReason?: TngAiFinishReason;
  readonly error?: TngAiError;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

### Message invariants

- `id` is unique within a thread and remains stable across streaming updates and snapshots.
- `threadId`, `runId`, and `parentMessageId` are opaque strings.
- `parts` are ordered and that order is meaningful.
- Each part ID is unique within its message.
- Streaming updates replace or extend an existing part; they do not create one part per token.
- `updatedAt` may change without changing message identity.
- `failed` does not require discarding partial content.
- `stopped` means the user or application ended generation while retaining any partial content.
- The model does not infer a branch merely because `parentMessageId` is present. Branch selection is
  application-owned.

## Author

```ts
export interface TngAiAuthor {
  readonly id?: string;
  readonly name?: string;
  readonly avatarUrl?: string;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

Avatar URLs are untrusted. The renderer applies the same remote-media and fallback policy as the
existing TailNG avatar component.

## Message parts

```ts
export type TngAiMessagePart =
  | TngAiTextPart
  | TngAiReasoningPart
  | TngAiToolCallPart
  | TngAiToolResultPart
  | TngAiFilePart
  | TngAiSourcePart
  | TngAiDataPart
  | TngAiActivityPart
  | TngAiUiPart
  | TngAiExtensionPart;

export interface TngAiPartBase {
  readonly id: string;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

### Text

```ts
export interface TngAiTextPart extends TngAiPartBase {
  readonly type: 'text';
  readonly text: string;
  readonly format: 'plain' | 'markdown';
  readonly status?: 'streaming' | 'complete';
  readonly annotations?: readonly TngAiTextAnnotation[];
}
```

The package renders plain text safely by default. Markdown rendering is an injected renderer. The
default implementation must never treat a Markdown string as trusted HTML.

Text annotations may reference sources without copying a complete source record into every span:

```ts
export interface TngAiTextAnnotation {
  readonly type: 'source';
  readonly sourceId: string;
  readonly start: number;
  readonly end: number;
}
```

Offsets require a documented string unit before release. Use zero-based UTF-16 offsets if TailNG
exposes offsets directly, matching JavaScript string indexing.

### Reasoning

```ts
export interface TngAiReasoningPart extends TngAiPartBase {
  readonly type: 'reasoning';
  readonly visibility: 'hidden' | 'summary';
  readonly text?: string;
  readonly status?: 'streaming' | 'complete';
  readonly encryptedValue?: string;
}
```

`encryptedValue` is opaque transport material and is never displayed. Raw private chain-of-thought
must not be converted into a visible summary by the UI package.

### Tool call

```ts
export type TngAiToolCallStatus =
  | 'input-streaming'
  | 'awaiting-approval'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled';

export interface TngAiToolCallPart extends TngAiPartBase {
  readonly type: 'tool-call';
  readonly toolCallId: string;
  readonly name: string;
  readonly input?: TngAiJsonValue;
  readonly rawInput?: string;
  readonly status: TngAiToolCallStatus;
  readonly approval?: TngAiToolApproval;
}
```

`rawInput` preserves invalid or partially streamed JSON without pretending that parsing succeeded.
The renderer displays malformed input safely and never executes it.

### Tool result

```ts
export interface TngAiToolResultPart extends TngAiPartBase {
  readonly type: 'tool-result';
  readonly toolCallId: string;
  readonly output?: TngAiJsonValue;
  readonly text?: string;
  readonly isError?: boolean;
}
```

The shared `toolCallId` correlates a result with its call. The store must support interleaved and
parallel tool calls.

### File

```ts
export interface TngAiFilePart extends TngAiPartBase {
  readonly type: 'file';
  readonly fileId: string;
  readonly name: string;
  readonly mediaType: string;
  readonly size?: number;
  readonly url?: string;
  readonly previewUrl?: string;
}
```

Files contain references and metadata only. Base64 data, `File`, and `Blob` values are excluded from
persisted messages.

### Source

```ts
export interface TngAiSourcePart extends TngAiPartBase {
  readonly type: 'source';
  readonly sourceId: string;
  readonly title?: string;
  readonly url?: string;
  readonly mediaType?: string;
  readonly excerpt?: string;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

Source URLs use an allow-list of safe schemes. Excerpts are untrusted text.

### Structured data

```ts
export interface TngAiDataPart extends TngAiPartBase {
  readonly type: 'data';
  readonly name: string;
  readonly value: TngAiJsonValue;
}
```

The renderer registry matches known names. Unknown data uses a bounded safe fallback and must not
automatically dump secrets or extremely large objects into the DOM.

### Activity

```ts
export interface TngAiActivityPart extends TngAiPartBase {
  readonly type: 'activity';
  readonly name: string;
  readonly status: 'pending' | 'active' | 'complete' | 'failed';
  readonly description?: string;
  readonly data?: TngAiJsonValue;
}
```

Activities cover display-safe progress such as searching, reading, generating, or waiting. They are
not a substitute for raw runtime logs.

### Generated UI

```ts
export interface TngAiUiPart extends TngAiPartBase {
  readonly type: 'ui';
  readonly protocol: 'a2ui' | 'mcp-app';
  readonly payload: TngAiJsonValue;
}
```

This is reserved in the first release. Without the corresponding optional renderer and validation,
the package displays an unsupported-content fallback.

### Extensions

```ts
export interface TngAiExtensionPart extends TngAiPartBase {
  readonly type: 'extension';
  readonly name: string;
  readonly value: TngAiJsonValue;
}
```

Names must be namespaced, for example `tailng.dev/workflow-diff` or `example.com/order-preview`.
Extensions require an explicitly registered renderer. They never carry executable templates.

## Errors

```ts
export interface TngAiError {
  readonly code: string;
  readonly message: string;
  readonly retryable?: boolean;
  readonly details?: TngAiJsonValue;
}
```

- `message` is safe for user display only when the producer declares it so through policy.
- Stack traces, credentials, provider request bodies, and internal prompts must not be placed here.
- Components render a generic fallback when no display-safe message is available.

## Finish reason and usage

```ts
export type TngAiFinishReason =
  | 'stop'
  | 'length'
  | 'content-filter'
  | 'tool-calls'
  | 'cancelled'
  | 'error'
  | 'other';

export interface TngAiUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly totalTokens?: number;
  readonly cachedInputTokens?: number;
  readonly metadata?: Readonly<Record<string, TngAiJsonValue>>;
}
```

Usage is optional and informational. Components must not assume all providers report equivalent
token accounting.

## Action requests

Components emit requests rather than performing application operations:

```ts
export type TngAiActionRequest =
  | TngAiSubmitRequest
  | TngAiStopRequest
  | TngAiRetryRequest
  | TngAiEditRequest
  | TngAiFeedbackRequest
  | TngAiToolApprovalRequest
  | TngAiLoadHistoryRequest;
```

Every request contains the minimum stable IDs needed to act. It may contain a source such as
`'pointer' | 'keyboard' | 'programmatic'` when interaction provenance matters. Action requests do
not contain Angular events or DOM elements.

## Compatibility rules

- Adding a new optional field is additive.
- Adding a new part kind requires a safe unknown-part fallback before release.
- Existing `type`, `role`, status, and finish-reason meanings are stable.
- Adapters may store provider-specific material only under namespaced metadata.
- Components must tolerate unknown metadata keys and must not use metadata to alter security policy.
- Serialization round trips must preserve unknown extension values.

## Contract tests

The executable specification is defined by `AI-CORE-*`, `AI-STORE-*`, and `AI-HIST-*` in
[Core model, store, and history tests](./tests/core-model-and-store.md). The checklist below is a
summary gate.

- [ ] Every canonical record is JSON serializable.
- [ ] Deeply frozen messages can be reduced without mutation.
- [ ] Part ordering and IDs survive snapshot conversion.
- [ ] Streaming text updates one stable part.
- [ ] Parallel tool calls correlate results by `toolCallId`.
- [ ] Invalid tool JSON preserves `rawInput` and does not throw away the call.
- [ ] Unknown extensions survive storage and use the safe fallback renderer.
- [ ] Hidden roles and reasoning are not rendered by default.
- [ ] File parts reject inline binary objects at the public boundary.

