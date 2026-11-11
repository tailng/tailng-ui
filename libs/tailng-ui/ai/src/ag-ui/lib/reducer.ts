/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- The normalized store is intentionally stateful. */
import { EventType } from '@ag-ui/core';
import type {
  Event,
  Message,
  MessagesSnapshotEvent,
  RunErrorEvent,
  RunFinishedEvent,
  RunStartedEvent,
  TextMessageChunkEvent,
  TextMessageContentEvent,
  TextMessageEndEvent,
  TextMessageStartEvent,
  TokenUsage,
  ToolCallArgsEvent,
  ToolCallChunkEvent,
  ToolCallEndEvent,
  ToolCallResultEvent,
  ToolCallStartEvent,
} from '@ag-ui/core';
// eslint-disable-next-line @nx/enforce-module-boundaries -- The secondary entry point consumes the primary public API.
import {
  appendTngAiTextDelta,
  appendTngAiToolInput,
  completeTngAiTextPart,
  completeTngAiToolInput,
  transitionTngAiToolCall,
  validateTngAiJsonValue,
  type TngAiChatStore,
  type TngAiJsonValue,
  type TngAiMessage,
  type TngAiRun,
  type TngAiTextPart,
  type TngAiToolCallPart,
  type TngAiToolResultPart,
  type TngAiUsage,
} from '@tailng-ui/ai';
import { validateTngAgUiEvent } from './event-validation';
import type { TngAgUiValidationOptions } from './event-validation';

export type TngAgUiReducerDiagnostic = {
  readonly code:
    | 'invalid-event'
    | 'unsupported-event'
    | 'limit-exceeded'
    | 'invalid-lifecycle'
    | 'invalid-tool-arguments'
    | 'orphan-event';
  readonly message: string;
  readonly eventType?: string;
  readonly id?: string;
};

export type TngAgUiReduceResult =
  | { readonly applied: true }
  | { readonly applied: false; readonly diagnostic: TngAgUiReducerDiagnostic };

export type TngAgUiReducerOptions = TngAgUiValidationOptions & {
  readonly maxToolInputBytes?: number;
};

type RunEvent = RunStartedEvent | RunFinishedEvent | RunErrorEvent;
type TextEvent =
  | TextMessageStartEvent
  | TextMessageContentEvent
  | TextMessageEndEvent
  | TextMessageChunkEvent;
type ToolEvent =
  | ToolCallStartEvent
  | ToolCallArgsEvent
  | ToolCallEndEvent
  | ToolCallChunkEvent
  | ToolCallResultEvent;

type ToolLocation = {
  readonly message: TngAiMessage;
  readonly part: TngAiToolCallPart;
};

type ToolHostContext = {
  readonly threadId: string;
  readonly runId: string;
  readonly timestamp?: number;
};

const RUN_EVENT_TYPES = new Set<EventType>([
  EventType.RUN_STARTED,
  EventType.RUN_FINISHED,
  EventType.RUN_ERROR,
]);
const TEXT_EVENT_TYPES = new Set<EventType>([
  EventType.TEXT_MESSAGE_START,
  EventType.TEXT_MESSAGE_CONTENT,
  EventType.TEXT_MESSAGE_END,
  EventType.TEXT_MESSAGE_CHUNK,
]);
const TOOL_EVENT_TYPES = new Set<EventType>([
  EventType.TOOL_CALL_START,
  EventType.TOOL_CALL_ARGS,
  EventType.TOOL_CALL_END,
  EventType.TOOL_CALL_CHUNK,
  EventType.TOOL_CALL_RESULT,
]);
const MAX_DIAGNOSTICS = 100;
const DEFAULT_MAX_TOOL_INPUT_BYTES = 262_144;

export class TngAgUiReducer {
  private readonly reducerDiagnostics: TngAgUiReducerDiagnostic[] = [];
  private activeThreadId: string | undefined;
  private activeRunId: string | undefined;
  private activeTextChunkId: string | undefined;
  private activeToolChunkId: string | undefined;
  private readonly toolMessageIds = new Map<string, string>();

  public constructor(
    private readonly store: TngAiChatStore,
    private readonly validationOptions: TngAgUiReducerOptions = {},
  ) {}

  public diagnostics(): readonly TngAgUiReducerDiagnostic[] {
    return this.reducerDiagnostics;
  }

  public reduce(value: unknown): TngAgUiReduceResult {
    const validation = validateTngAgUiEvent(value, this.validationOptions);
    if (!validation.valid) {
      return this.reject({
        code: validation.diagnostic.code,
        message: validation.diagnostic.message,
      });
    }
    return this.reduceEvent(validation.event);
  }

  private reduceEvent(event: Event): TngAgUiReduceResult {
    if (isRunEvent(event)) {
      return this.reduceRun(event);
    }
    if (isTextEvent(event)) {
      return this.reduceText(event);
    }
    if (isToolEvent(event)) {
      return this.reduceTool(event);
    }
    if (event.type === EventType.MESSAGES_SNAPSHOT) {
      return this.reduceMessagesSnapshot(event);
    }
    return this.reject({
      code: 'unsupported-event',
      eventType: event.type,
      message: `Reducer support for ${event.type} is not implemented.`,
    });
  }

  private reduceRun(event: RunEvent): TngAgUiReduceResult {
    switch (event.type) {
      case EventType.RUN_STARTED:
        return this.startRun(event);
      case EventType.RUN_FINISHED:
        return this.finishRun(event);
      case EventType.RUN_ERROR:
        return this.failRun(event);
    }
  }

  private reduceText(event: TextEvent): TngAgUiReduceResult {
    switch (event.type) {
      case EventType.TEXT_MESSAGE_START:
        return this.startText(event);
      case EventType.TEXT_MESSAGE_CONTENT:
        return this.appendText(event);
      case EventType.TEXT_MESSAGE_END:
        return this.endText(event);
      case EventType.TEXT_MESSAGE_CHUNK:
        return this.chunkText(event);
    }
  }

  private reduceTool(event: ToolEvent): TngAgUiReduceResult {
    switch (event.type) {
      case EventType.TOOL_CALL_START:
        return this.startTool(event);
      case EventType.TOOL_CALL_ARGS:
        return this.appendToolArgs(event);
      case EventType.TOOL_CALL_END:
        return this.endTool(event);
      case EventType.TOOL_CALL_CHUNK:
        return this.chunkTool(event);
      case EventType.TOOL_CALL_RESULT:
        return this.addToolResult(event);
    }
  }

  private reduceMessagesSnapshot(event: MessagesSnapshotEvent): TngAgUiReduceResult {
    const context = this.activeContext(event.type, 'messages-snapshot');
    if (!context.ok) {
      return context.result;
    }
    const messages = event.messages.map((message) =>
      convertSnapshotMessage(message, context.threadId, context.runId),
    );
    for (const message of messages) {
      this.store.upsertMessage(message);
      for (const part of message.parts) {
        if (part.type === 'tool-call') {
          this.toolMessageIds.set(part.toolCallId, message.id);
        }
      }
    }
    return { applied: true };
  }

  private startRun(event: RunStartedEvent): TngAgUiReduceResult {
    const existing = this.store.snapshot().runs.get(event.runId);
    if (existing !== undefined && !sameRunStart(existing, event)) {
      return this.lifecycle(event.type, event.runId, 'Run ID was reused with conflicting data.');
    }
    this.activeThreadId = event.threadId;
    this.activeRunId = event.runId;
    if (existing !== undefined) {
      return { applied: true };
    }

    this.store.upsertThread({ id: event.threadId });
    this.store.upsertRun({
      id: event.runId,
      threadId: event.threadId,
      parentRunId: event.parentRunId,
      status: 'running',
      startedAt: event.timestamp,
      metadata: eventMetadata(event.metadata),
    });
    return { applied: true };
  }

  private finishRun(event: RunFinishedEvent): TngAgUiReduceResult {
    const existing = this.store.snapshot().runs.get(event.runId);
    if (existing === undefined) {
      return this.orphan(event.type, event.runId, 'Run finished before it started.');
    }
    const status = finishedRunStatus(event);
    if (existing.status === status) {
      return { applied: true };
    }
    if (existing.status !== 'running' || existing.threadId !== event.threadId) {
      return this.lifecycle(event.type, event.runId, 'A terminal run cannot change outcome.');
    }

    this.closeActiveTextChunk();
    this.closeActiveToolChunk();
    this.store.upsertRun({
      ...existing,
      status,
      finishedAt: event.timestamp,
      usage: aggregateUsage(event.usage),
      metadata: finishedRunMetadata(existing.metadata, event),
    });
    return { applied: true };
  }

  private failRun(event: RunErrorEvent): TngAgUiReduceResult {
    const existing = this.activeRun();
    if (existing === undefined) {
      return this.orphan(event.type, undefined, 'Run error arrived without an active run.');
    }
    if (existing.status === 'failed' && existing.error?.message === event.message) {
      return { applied: true };
    }
    if (existing.status !== 'running') {
      return this.lifecycle(event.type, existing.id, 'A terminal run cannot change outcome.');
    }

    this.store.upsertRun({
      ...existing,
      status: 'failed',
      finishedAt: event.timestamp,
      error: { code: event.code ?? 'ag-ui-run-error', message: event.message },
      usage: aggregateUsage(event.usage),
      metadata: mergeMetadata(existing.metadata, event.metadata),
    });
    this.activeTextChunkId = undefined;
    this.activeToolChunkId = undefined;
    return { applied: true };
  }

  private startText(event: TextMessageStartEvent): TngAgUiReduceResult {
    const context = this.activeContext(event.type, event.messageId);
    if (!context.ok) {
      return context.result;
    }
    const existing = this.store.snapshot().messages.get(event.messageId);
    if (existing !== undefined) {
      return sameTextStart(existing, event)
        ? { applied: true }
        : this.lifecycle(event.type, event.messageId, 'Message ID was reused with conflicting data.');
    }

    const message: TngAiMessage = {
      id: event.messageId,
      threadId: context.threadId,
      runId: context.runId,
      role: event.role ?? 'assistant',
      status: 'streaming',
      parts: [textPart(event.messageId)],
      author: event.name === undefined ? undefined : { name: event.name },
      createdAt: event.timestamp,
      metadata: eventMetadata(event.metadata),
    };
    this.store.upsertMessage(message);
    return { applied: true };
  }

  private appendText(event: TextMessageContentEvent): TngAgUiReduceResult {
    const message = this.store.snapshot().messages.get(event.messageId);
    if (message === undefined) {
      return this.orphan(event.type, event.messageId, 'Text content arrived before start.');
    }
    if (message.status === 'complete') {
      return this.lifecycle(event.type, event.messageId, 'Completed message cannot accept content.');
    }

    const operation = appendTngAiTextDelta(message, textPartId(event.messageId), event.delta);
    if (!operation.ok) {
      return this.lifecycle(event.type, event.messageId, operation.error.message);
    }
    const next = mergeMessageEvent(operation.value, event.timestamp, event.metadata);
    this.store.upsertMessage(next);
    return { applied: true };
  }

  private endText(event: TextMessageEndEvent): TngAgUiReduceResult {
    const message = this.store.snapshot().messages.get(event.messageId);
    if (message === undefined) {
      return this.orphan(event.type, event.messageId, 'Text end arrived before start.');
    }
    if (message.status === 'complete') {
      this.clearActiveTextChunk(event.messageId);
      return { applied: true };
    }

    const operation = completeTngAiTextPart(message, textPartId(event.messageId));
    if (!operation.ok) {
      return this.lifecycle(event.type, event.messageId, operation.error.message);
    }
    const next = mergeMessageEvent(
      { ...operation.value, status: 'complete' },
      event.timestamp,
      event.metadata,
    );
    this.store.upsertMessage(next);
    this.clearActiveTextChunk(event.messageId);
    return { applied: true };
  }

  private chunkText(event: TextMessageChunkEvent): TngAgUiReduceResult {
    const messageId = event.messageId ?? this.activeTextChunkId;
    if (messageId === undefined) {
      return this.orphan(event.type, undefined, 'First text chunk requires a message ID.');
    }
    const closed = this.closePreviousTextChunk(messageId);
    if (!closed.applied) {
      return closed;
    }
    const started = this.ensureChunkMessage(event, messageId);
    if (!started.applied) {
      return started;
    }

    this.activeTextChunkId = messageId;
    return event.delta === undefined
      ? this.mergeChunkMetadata(messageId, event)
      : this.appendText(chunkContentEvent(event, messageId));
  }

  private closePreviousTextChunk(messageId: string): TngAgUiReduceResult {
    return this.activeTextChunkId === undefined || this.activeTextChunkId === messageId
      ? { applied: true }
      : this.closeActiveTextChunk();
  }

  private ensureChunkMessage(
    event: TextMessageChunkEvent,
    messageId: string,
  ): TngAgUiReduceResult {
    return this.store.snapshot().messages.has(messageId)
      ? { applied: true }
      : this.startText(chunkStartEvent(event, messageId));
  }

  private closeActiveTextChunk(): TngAgUiReduceResult {
    const messageId = this.activeTextChunkId;
    if (messageId === undefined) {
      return { applied: true };
    }
    return this.endText({ type: EventType.TEXT_MESSAGE_END, messageId });
  }

  private clearActiveTextChunk(messageId: string): void {
    if (this.activeTextChunkId === messageId) {
      this.activeTextChunkId = undefined;
    }
  }

  private mergeChunkMetadata(
    messageId: string,
    event: TextMessageChunkEvent,
  ): TngAgUiReduceResult {
    const message = this.store.snapshot().messages.get(messageId);
    if (message !== undefined) {
      this.store.upsertMessage(mergeMessageEvent(message, event.timestamp, event.metadata));
    }
    return { applied: true };
  }

  private startTool(event: ToolCallStartEvent): TngAgUiReduceResult {
    const existing = this.findTool(event.toolCallId);
    if (existing !== undefined) {
      return existing.part.name === event.toolCallName
        ? { applied: true }
        : this.lifecycle(event.type, event.toolCallId, 'Tool call ID was reused with another name.');
    }
    const context = this.activeContext(event.type, event.toolCallId);
    if (!context.ok) {
      return context.result;
    }

    const messageId = event.parentMessageId ?? toolHostMessageId(event.toolCallId);
    const message = this.store.snapshot().messages.get(messageId) ??
      createToolHostMessage(messageId, {
        threadId: context.threadId,
        runId: context.runId,
        timestamp: event.timestamp,
      });
    const part: TngAiToolCallPart = {
      id: toolPartId(event.toolCallId),
      type: 'tool-call',
      toolCallId: event.toolCallId,
      name: event.toolCallName,
      status: 'input-streaming',
      metadata: eventMetadata(event.metadata),
    };
    this.store.upsertMessage({ ...message, status: 'streaming', parts: [...message.parts, part] });
    this.toolMessageIds.set(event.toolCallId, messageId);
    return { applied: true };
  }

  private appendToolArgs(event: ToolCallArgsEvent): TngAgUiReduceResult {
    const location = this.findTool(event.toolCallId);
    if (location === undefined) {
      return this.orphan(event.type, event.toolCallId, 'Tool arguments arrived before start.');
    }
    if (this.exceedsToolInputLimit(location.part, event.delta)) {
      this.failOversizedTool(location);
      return this.reject({
        code: 'limit-exceeded',
        eventType: event.type,
        id: event.toolCallId,
        message: 'Accumulated tool arguments exceed the configured limit.',
      });
    }

    const operation = appendTngAiToolInput(location.message, location.part.id, event.delta);
    return this.applyToolOperation(event.type, event.toolCallId, operation);
  }

  private endTool(event: ToolCallEndEvent): TngAgUiReduceResult {
    let location = this.findTool(event.toolCallId);
    if (location === undefined) {
      return this.orphan(event.type, event.toolCallId, 'Tool end arrived before start.');
    }
    if (location.part.rawInput === undefined) {
      const empty = appendTngAiToolInput(location.message, location.part.id, '{}');
      if (!empty.ok) {
        return this.lifecycle(event.type, event.toolCallId, empty.error.message);
      }
      this.store.upsertMessage(empty.value);
      location = this.findTool(event.toolCallId);
    }
    if (location === undefined) {
      return this.orphan(event.type, event.toolCallId, 'Tool call disappeared during reduction.');
    }

    const operation = completeTngAiToolInput(location.message, location.part.id);
    const result = this.applyToolOperation(event.type, event.toolCallId, operation);
    this.clearActiveToolChunk(event.toolCallId);
    return result;
  }

  private addToolResult(event: ToolCallResultEvent): TngAgUiReduceResult {
    const context = this.activeContext(event.type, event.toolCallId);
    if (!context.ok) {
      return context.result;
    }
    const existing = this.store.snapshot().messages.get(event.messageId);
    if (existing !== undefined) {
      return hasMatchingToolResult(existing, event.toolCallId)
        ? { applied: true }
        : this.lifecycle(event.type, event.messageId, 'Tool result message ID was reused.');
    }

    const part = toolResultPart(event);
    this.store.upsertMessage({
      id: event.messageId,
      threadId: context.threadId,
      runId: context.runId,
      role: 'tool',
      status: 'complete',
      createdAt: event.timestamp,
      metadata: eventMetadata(event.metadata),
      parts: [part],
    });
    if (this.findTool(event.toolCallId) === undefined) {
      this.note({
        code: 'orphan-event',
        eventType: event.type,
        id: event.toolCallId,
        message: 'Tool result is retained while waiting for its call.',
      });
    }
    return { applied: true };
  }

  private chunkTool(event: ToolCallChunkEvent): TngAgUiReduceResult {
    const toolCallId = event.toolCallId ?? this.activeToolChunkId;
    if (toolCallId === undefined) {
      return this.orphan(event.type, undefined, 'First tool chunk requires a call ID.');
    }
    const closed = this.closePreviousToolChunk(toolCallId);
    if (!closed.applied) {
      return closed;
    }
    const started = this.ensureChunkTool(event, toolCallId);
    if (!started.applied) {
      return started;
    }

    this.activeToolChunkId = toolCallId;
    return event.delta === undefined
      ? { applied: true }
      : this.appendToolArgs({ type: EventType.TOOL_CALL_ARGS, toolCallId, delta: event.delta });
  }

  private closePreviousToolChunk(toolCallId: string): TngAgUiReduceResult {
    return this.activeToolChunkId === undefined || this.activeToolChunkId === toolCallId
      ? { applied: true }
      : this.closeActiveToolChunk();
  }

  private ensureChunkTool(
    event: ToolCallChunkEvent,
    toolCallId: string,
  ): TngAgUiReduceResult {
    if (this.findTool(toolCallId) !== undefined) {
      return { applied: true };
    }
    return event.toolCallName === undefined
      ? this.orphan(event.type, toolCallId, 'First tool chunk requires a tool name.')
      : this.startTool({
          type: EventType.TOOL_CALL_START,
          toolCallId,
          toolCallName: event.toolCallName,
          parentMessageId: event.parentMessageId,
          timestamp: event.timestamp,
          metadata: event.metadata,
          subagentRunId: event.subagentRunId,
        });
  }

  private closeActiveToolChunk(): TngAgUiReduceResult {
    const toolCallId = this.activeToolChunkId;
    return toolCallId === undefined
      ? { applied: true }
      : this.endTool({ type: EventType.TOOL_CALL_END, toolCallId });
  }

  private clearActiveToolChunk(toolCallId: string): void {
    if (this.activeToolChunkId === toolCallId) {
      this.activeToolChunkId = undefined;
    }
  }

  private findTool(toolCallId: string): ToolLocation | undefined {
    const knownMessageId = this.toolMessageIds.get(toolCallId);
    const knownMessage = knownMessageId === undefined
      ? undefined
      : this.store.snapshot().messages.get(knownMessageId);
    const knownPart = knownMessage?.parts.find(
      (part): part is TngAiToolCallPart => part.type === 'tool-call' && part.toolCallId === toolCallId,
    );
    if (knownMessage !== undefined && knownPart !== undefined) {
      return { message: knownMessage, part: knownPart };
    }
    return this.scanForTool(toolCallId);
  }

  private scanForTool(toolCallId: string): ToolLocation | undefined {
    for (const message of this.store.snapshot().messages.values()) {
      const part = message.parts.find(
        (candidate): candidate is TngAiToolCallPart =>
          candidate.type === 'tool-call' && candidate.toolCallId === toolCallId,
      );
      if (part !== undefined) {
        this.toolMessageIds.set(toolCallId, message.id);
        return { message, part };
      }
    }
    return undefined;
  }

  private exceedsToolInputLimit(part: TngAiToolCallPart, delta: string): boolean {
    const maximum = this.validationOptions.maxToolInputBytes ?? DEFAULT_MAX_TOOL_INPUT_BYTES;
    return new TextEncoder().encode((part.rawInput ?? '') + delta).byteLength > maximum;
  }

  private failOversizedTool(location: ToolLocation): void {
    const failed = transitionTngAiToolCall(location.message, location.part.id, 'failed');
    if (failed.ok) {
      this.store.upsertMessage(failed.value);
    }
  }

  private applyToolOperation(
    eventType: string,
    toolCallId: string,
    operation: ReturnType<typeof appendTngAiToolInput>,
  ): TngAgUiReduceResult {
    if (!operation.ok) {
      return this.lifecycle(eventType, toolCallId, operation.error.message);
    }
    this.store.upsertMessage(operation.value);
    for (const item of operation.diagnostics ?? []) {
      this.note({
        code: item.code === 'invalid-tool-arguments' ? item.code : 'invalid-lifecycle',
        eventType,
        id: toolCallId,
        message: item.message,
      });
    }
    return { applied: true };
  }

  private activeRun(): TngAiRun | undefined {
    return this.activeRunId === undefined
      ? undefined
      : this.store.snapshot().runs.get(this.activeRunId);
  }

  private activeContext(
    eventType: string,
    id: string,
  ):
    | { readonly ok: true; readonly threadId: string; readonly runId: string }
    | { readonly ok: false; readonly result: TngAgUiReduceResult } {
    if (this.activeThreadId === undefined || this.activeRunId === undefined) {
      return {
        ok: false,
        result: this.orphan(eventType, id, 'Message event arrived without an active run.'),
      };
    }
    return { ok: true, threadId: this.activeThreadId, runId: this.activeRunId };
  }

  private lifecycle(eventType: string, id: string, message: string): TngAgUiReduceResult {
    return this.reject({ code: 'invalid-lifecycle', eventType, id, message });
  }

  private orphan(eventType: string, id: string | undefined, message: string): TngAgUiReduceResult {
    return this.reject({ code: 'orphan-event', eventType, id, message });
  }

  private reject(diagnostic: TngAgUiReducerDiagnostic): TngAgUiReduceResult {
    this.note(diagnostic);
    return { applied: false, diagnostic };
  }

  private note(diagnostic: TngAgUiReducerDiagnostic): void {
    this.reducerDiagnostics.push(diagnostic);
    if (this.reducerDiagnostics.length > MAX_DIAGNOSTICS) {
      this.reducerDiagnostics.shift();
    }
  }
}

function isRunEvent(event: Event): event is RunEvent {
  return RUN_EVENT_TYPES.has(event.type);
}

function isTextEvent(event: Event): event is TextEvent {
  return TEXT_EVENT_TYPES.has(event.type);
}

function isToolEvent(event: Event): event is ToolEvent {
  return TOOL_EVENT_TYPES.has(event.type);
}

function sameRunStart(run: TngAiRun, event: RunStartedEvent): boolean {
  return (
    run.status === 'running' &&
    run.threadId === event.threadId &&
    run.parentRunId === event.parentRunId
  );
}

function finishedRunStatus(event: RunFinishedEvent): TngAiRun['status'] {
  if (event.outcome?.type === 'cancelled') {
    return 'cancelled';
  }
  return event.outcome?.type === 'interrupt' ? 'awaiting-input' : 'complete';
}

function aggregateUsage(entries: TokenUsage[] | undefined): TngAiUsage | undefined {
  if (entries === undefined) {
    return undefined;
  }
  return {
    inputTokens: sumUsage(entries, 'inputTokens'),
    outputTokens: sumUsage(entries, 'outputTokens'),
    totalTokens: sumUsage(entries, 'totalTokens'),
    cachedInputTokens: sumUsage(entries, 'cachedInputTokens'),
  };
}

function sumUsage(entries: readonly TokenUsage[], key: keyof TngAiUsage): number | undefined {
  const values = entries
    .map((entry) => entry[key as keyof TokenUsage])
    .filter((value): value is number => typeof value === 'number');
  return values.length === 0 ? undefined : values.reduce((total, value) => total + value, 0);
}

function sameTextStart(message: TngAiMessage, event: TextMessageStartEvent): boolean {
  return message.status === 'streaming' && message.role === (event.role ?? 'assistant');
}

function textPart(messageId: string): TngAiTextPart {
  return {
    id: textPartId(messageId),
    type: 'text' as const,
    text: '',
    format: 'plain' as const,
    status: 'streaming' as const,
  };
}

function textPartId(messageId: string): string {
  return `${messageId}:text`;
}

function toolHostMessageId(toolCallId: string): string {
  return `tool-call:${toolCallId}`;
}

function toolPartId(toolCallId: string): string {
  return `tool-call:${toolCallId}`;
}

function createToolHostMessage(
  messageId: string,
  context: ToolHostContext,
): TngAiMessage {
  return {
    id: messageId,
    threadId: context.threadId,
    runId: context.runId,
    role: 'assistant',
    status: 'streaming',
    createdAt: context.timestamp,
    parts: [],
  };
}

function hasMatchingToolResult(message: TngAiMessage, toolCallId: string): boolean {
  return message.parts.some(
    (part) => part.type === 'tool-result' && part.toolCallId === toolCallId,
  );
}

function toolResultPart(event: ToolCallResultEvent): TngAiToolResultPart {
  const text = toolResultText(event);
  const output = toolResultOutput(event);
  return {
    id: `${event.messageId}:tool-result`,
    type: 'tool-result',
    toolCallId: event.toolCallId,
    text,
    output,
  };
}

function toolResultText(event: ToolCallResultEvent): string | undefined {
  if (typeof event.content === 'string') {
    return event.content;
  }
  const text = event.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
  return text.length === 0 ? undefined : text;
}

function toolResultOutput(event: ToolCallResultEvent): TngAiJsonValue | undefined {
  if (typeof event.content !== 'string') {
    return event.content as TngAiJsonValue;
  }
  try {
    const parsed: unknown = JSON.parse(event.content) as unknown;
    const validation = validateTngAiJsonValue(parsed);
    return validation.valid ? validation.value : undefined;
  } catch {
    return undefined;
  }
}

function chunkStartEvent(
  event: TextMessageChunkEvent,
  messageId: string,
): TextMessageStartEvent {
  return {
    type: EventType.TEXT_MESSAGE_START,
    messageId,
    role: event.role,
    name: event.name,
    timestamp: event.timestamp,
    metadata: event.metadata,
    subagentRunId: event.subagentRunId,
  };
}

function chunkContentEvent(
  event: TextMessageChunkEvent,
  messageId: string,
): TextMessageContentEvent {
  return {
    type: EventType.TEXT_MESSAGE_CONTENT,
    messageId,
    delta: event.delta ?? '',
    timestamp: event.timestamp,
    metadata: event.metadata,
    subagentRunId: event.subagentRunId,
  };
}

function mergeMessageEvent(
  message: TngAiMessage,
  timestamp: number | undefined,
  metadata: Record<string, unknown> | undefined,
): TngAiMessage {
  const merged = mergeMetadata(message.metadata, metadata);
  return timestamp === undefined && merged === message.metadata
    ? message
    : { ...message, updatedAt: timestamp ?? message.updatedAt, metadata: merged };
}

function mergeMetadata(
  existing: Readonly<Record<string, TngAiJsonValue>> | undefined,
  incoming: Record<string, unknown> | undefined,
): Readonly<Record<string, TngAiJsonValue>> | undefined {
  if (incoming === undefined || Object.keys(incoming).length === 0) {
    return existing;
  }
  return { ...existing, ...(incoming as Readonly<Record<string, TngAiJsonValue>>) };
}

function eventMetadata(
  metadata: Record<string, unknown> | undefined,
): Readonly<Record<string, TngAiJsonValue>> | undefined {
  return metadata as Readonly<Record<string, TngAiJsonValue>> | undefined;
}

function finishedRunMetadata(
  existing: Readonly<Record<string, TngAiJsonValue>> | undefined,
  event: RunFinishedEvent,
): Readonly<Record<string, TngAiJsonValue>> | undefined {
  const merged = mergeMetadata(existing, event.metadata);
  return event.result === undefined
    ? merged
    : { ...merged, 'ag-ui/result': event.result as TngAiJsonValue };
}

function convertSnapshotMessage(
  message: Message,
  threadId: string,
  runId: string,
): TngAiMessage {
  const base = {
    id: message.id,
    threadId,
    runId,
    status: 'complete' as const,
    metadata: snapshotMetadata(message),
  };
  switch (message.role) {
    case 'developer':
    case 'system':
      return { ...base, role: message.role, author: author(message.name), parts: textParts(message) };
    case 'user':
      return { ...base, role: 'user', author: author(message.name), parts: contentParts(message) };
    case 'assistant':
      return { ...base, role: 'assistant', author: author(message.name), parts: assistantParts(message) };
    case 'tool':
      return { ...base, role: 'tool', parts: [snapshotToolResult(message)] };
    case 'activity':
      return { ...base, role: 'activity', parts: [snapshotActivity(message)] };
    case 'reasoning':
      return { ...base, role: 'reasoning', parts: [snapshotReasoning(message)] };
  }
}

function textParts(message: Extract<Message, { readonly content: string }>): readonly TngAiTextPart[] {
  return [completeText(message.id, message.content)];
}

function contentParts(message: Extract<Message, { readonly role: 'user' }>): TngAiMessage['parts'] {
  if (typeof message.content === 'string') {
    return [completeText(message.id, message.content)];
  }
  return message.content.map((part, index) => {
    if (part.type === 'text') {
      return completeText(message.id, part.text, index);
    }
    return {
      id: `${message.id}:content:${index}`,
      type: 'data' as const,
      name: `ag-ui/${part.type}`,
      value: part as TngAiJsonValue,
    };
  });
}

function assistantParts(
  message: Extract<Message, { readonly role: 'assistant' }>,
): TngAiMessage['parts'] {
  const parts: TngAiMessage['parts'][number][] = [];
  if (message.content !== undefined) {
    parts.push(completeText(message.id, message.content));
  }
  for (const call of message.toolCalls ?? []) {
    const input = parseJsonText(call.function.arguments);
    parts.push({
      id: toolPartId(call.id),
      type: 'tool-call',
      toolCallId: call.id,
      name: call.function.name,
      rawInput: call.function.arguments,
      input,
      status: input === undefined ? 'failed' : 'running',
      metadata: eventMetadata(call.metadata),
    });
  }
  return parts;
}

function snapshotToolResult(
  message: Extract<Message, { readonly role: 'tool' }>,
): TngAiToolResultPart {
  const event = {
    type: EventType.TOOL_CALL_RESULT,
    messageId: message.id,
    toolCallId: message.toolCallId,
    content: message.content,
  } satisfies ToolCallResultEvent;
  return { ...toolResultPart(event), isError: message.error !== undefined };
}

function snapshotActivity(
  message: Extract<Message, { readonly role: 'activity' }>,
): TngAiMessage['parts'][number] {
  return {
    id: `${message.id}:activity`,
    type: 'activity',
    name: message.activityType,
    status: 'complete',
    data: message.content as TngAiJsonValue,
  };
}

function snapshotReasoning(
  message: Extract<Message, { readonly role: 'reasoning' }>,
): TngAiMessage['parts'][number] {
  return {
    id: `${message.id}:reasoning`,
    type: 'reasoning',
    visibility: 'hidden',
    text: message.content,
    encryptedValue: message.encryptedValue,
    status: 'complete',
  };
}

function completeText(messageId: string, text: string, index?: number): TngAiTextPart {
  return {
    id: index === undefined ? textPartId(messageId) : `${messageId}:text:${index}`,
    type: 'text',
    text,
    format: 'plain',
    status: 'complete',
  };
}

function author(name: string | undefined): TngAiMessage['author'] {
  return name === undefined ? undefined : { name };
}

function parseJsonText(value: string): TngAiJsonValue | undefined {
  try {
    const parsed: unknown = JSON.parse(value) as unknown;
    const result = validateTngAiJsonValue(parsed);
    return result.valid ? result.value : undefined;
  } catch {
    return undefined;
  }
}

function snapshotMetadata(message: Message): Readonly<Record<string, TngAiJsonValue>> | undefined {
  const metadata = eventMetadata(message.metadata);
  const additions: Record<string, TngAiJsonValue> = {};
  if ('encryptedValue' in message && message.encryptedValue !== undefined) {
    additions['ag-ui/encryptedValue'] = message.encryptedValue;
  }
  if (message.subagentRunId !== undefined) {
    additions['ag-ui/subagentRunId'] = message.subagentRunId;
  }
  return Object.keys(additions).length === 0 ? metadata : { ...metadata, ...additions };
}
