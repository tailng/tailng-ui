import { describe, expect, it } from 'vitest';
import { TngAgUiReducer } from './reducer';
import { TngAiChatStore } from '../../lib/store/chat-store';

describe('TngAgUiReducer run lifecycle', () => {
  it('AI-AGUI-RUN-001 reduces RUN_STARTED with stable IDs', () => {
    const { reducer, store } = setup();

    expect(reducer.reduce(runStarted())).toEqual({ applied: true });
    expect(store.snapshot().runs.get('run-1')).toMatchObject({
      id: 'run-1',
      threadId: 'thread-1',
      status: 'running',
    });
  });

  it('AI-AGUI-RUN-002 preserves the parent run ID', () => {
    const { reducer, store } = setup();

    reducer.reduce(runStarted({ parentRunId: 'parent:/✓' }));

    expect(store.snapshot().runs.get('run-1')?.parentRunId).toBe('parent:/✓');
  });

  it('AI-AGUI-RUN-003 treats an identical duplicate start as idempotent', () => {
    const { reducer, store } = setup();
    const event = runStarted();

    reducer.reduce(event);
    expect(reducer.reduce(event)).toEqual({ applied: true });

    expect(store.snapshot().runs.size).toBe(1);
    expect(reducer.diagnostics()).toEqual([]);
  });

  it('AI-AGUI-RUN-004 rejects a conflicting duplicate start', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());

    const result = reducer.reduce(runStarted({ threadId: 'thread-2' }));

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'invalid-lifecycle' } });
    expect(store.snapshot().runs.get('run-1')?.threadId).toBe('thread-1');
  });

  it('AI-AGUI-RUN-005 completes a run with aggregated usage', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());

    reducer.reduce({
      type: 'RUN_FINISHED',
      threadId: 'thread-1',
      runId: 'run-1',
      timestamp: 200,
      result: { answer: 42 },
      usage: [
        { inputTokens: 2, outputTokens: 3, totalTokens: 5 },
        { inputTokens: 7, outputTokens: 11, totalTokens: 18 },
      ],
    });

    expect(store.snapshot().runs.get('run-1')).toMatchObject({
      status: 'complete',
      finishedAt: 200,
      usage: { inputTokens: 9, outputTokens: 14, totalTokens: 23 },
      metadata: { 'ag-ui/result': { answer: 42 } },
    });
  });

  it('AI-AGUI-RUN-006 rejects finish before start', () => {
    const { reducer, store } = setup();

    const result = reducer.reduce({ type: 'RUN_FINISHED', threadId: 'thread-1', runId: 'run-1' });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'orphan-event' } });
    expect(store.snapshot().runs.size).toBe(0);
  });

  it('AI-AGUI-RUN-007 maps RUN_ERROR to a safe canonical error', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());

    reducer.reduce({ type: 'RUN_ERROR', message: 'Provider unavailable', code: 'provider_down' });

    expect(store.snapshot().runs.get('run-1')).toMatchObject({
      status: 'failed',
      error: { code: 'provider_down', message: 'Provider unavailable' },
    });
  });

  it('AI-AGUI-RUN-008 retains partial text when a run fails', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: 'partial' });

    reducer.reduce({ type: 'RUN_ERROR', message: 'Failed' });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'partial' });
    expect(store.snapshot().runs.get('run-1')?.status).toBe('failed');
  });

  it('AI-AGUI-RUN-009 keeps an identical repeated terminal event stable', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());
    const terminal = { type: 'RUN_FINISHED', threadId: 'thread-1', runId: 'run-1' };
    reducer.reduce(terminal);
    const record = store.snapshot().runs.get('run-1');

    expect(reducer.reduce(terminal)).toEqual({ applied: true });
    expect(store.snapshot().runs.get('run-1')).toBe(record);
  });

  it('AI-AGUI-RUN-010 keeps the first conflicting terminal state', () => {
    const { reducer, store } = setup();
    reducer.reduce(runStarted());
    reducer.reduce({ type: 'RUN_ERROR', message: 'First failure' });

    const result = reducer.reduce({
      type: 'RUN_FINISHED',
      threadId: 'thread-1',
      runId: 'run-1',
    });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'invalid-lifecycle' } });
    expect(store.snapshot().runs.get('run-1')?.status).toBe('failed');
  });
});

describe('TngAgUiReducer text lifecycle', () => {
  it('AI-AGUI-TEXT-001 creates one open message and text part', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      id: 'message-1',
      status: 'streaming',
      parts: [{ id: 'message-1:text', type: 'text', text: '', status: 'streaming' }],
    });
  });

  it('AI-AGUI-TEXT-002 defaults an omitted role to assistant', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    expect(store.selectMessages('thread-1')[0]?.role).toBe('assistant');
  });

  it('AI-AGUI-TEXT-003 maps a supported role and display name', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'TEXT_MESSAGE_START',
      messageId: 'message-1',
      role: 'user',
      name: 'Person',
    });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      role: 'user',
      author: { name: 'Person' },
    });
  });

  it('AI-AGUI-TEXT-004 appends one delta to the stable part', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: 'Hello' });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({
      id: 'message-1:text',
      text: 'Hello',
    });
  });

  it('AI-AGUI-TEXT-005 and AI-AGUI-BASE-005 use arrival order, not timestamps', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'A',
      timestamp: 200,
    });
    reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'B',
      timestamp: 100,
    });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'AB' });
  });

  it('AI-AGUI-TEXT-006 isolates interleaved message streams', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-2' });

    reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-2', delta: 'two' });
    reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: 'one' });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'one' });
    expect(store.selectMessages('thread-1')[1]?.parts[0]).toMatchObject({ text: 'two' });
  });

  it('AI-AGUI-TEXT-007 rejects orphan content', () => {
    const { reducer, store } = runningSetup();

    const result = reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'missing',
      delta: 'ignored',
    });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'orphan-event' } });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });

  it('AI-AGUI-TEXT-008 ignores an empty content delta', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    const record = store.selectMessages('thread-1')[0];

    expect(
      reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: '' }),
    ).toEqual({ applied: true });
    expect(store.selectMessages('thread-1')[0]).toBe(record);
  });

  it('AI-AGUI-TEXT-009 rejects content after message completion', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    reducer.reduce({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'message-1', delta: 'done' });
    reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' });

    const result = reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'late',
    });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'invalid-lifecycle' } });
    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'done' });
  });

  it('AI-AGUI-TEXT-010 completes the part and message', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      status: 'complete',
      parts: [{ status: 'complete' }],
    });
  });

  it('AI-AGUI-TEXT-011 rejects an end without a start', () => {
    const { reducer } = runningSetup();

    expect(reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'missing' })).toMatchObject({
      applied: false,
      diagnostic: { code: 'orphan-event' },
    });
  });

  it('AI-AGUI-TEXT-012 treats duplicate end as idempotent', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' });
    const record = store.selectMessages('thread-1')[0];

    expect(reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' })).toEqual({
      applied: true,
    });
    expect(store.selectMessages('thread-1')[0]).toBe(record);
  });

  it('AI-AGUI-TEXT-013 retains an empty completed message', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });
    reducer.reduce({ type: 'TEXT_MESSAGE_END', messageId: 'message-1' });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      status: 'complete',
      parts: [{ text: '' }],
    });
  });

  it('AI-AGUI-TEXT-014 opens the canonical lifecycle from the first chunk', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'TEXT_MESSAGE_CHUNK',
      messageId: 'message-1',
      role: 'assistant',
      delta: 'Hello',
    });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      id: 'message-1',
      status: 'streaming',
      parts: [{ id: 'message-1:text', text: 'Hello' }],
    });
  });

  it('AI-AGUI-TEXT-015 appends continuation chunks to the same part', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', messageId: 'message-1', delta: 'A' });

    reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', delta: 'B' });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'AB' });
  });

  it('AI-AGUI-TEXT-016 closes the previous chunk message when identity changes', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', messageId: 'message-1', delta: 'first' });

    reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', messageId: 'message-2', delta: 'second' });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({ status: 'complete' });
    expect(store.selectMessages('thread-1')[1]).toMatchObject({ status: 'streaming' });
  });

  it('AI-AGUI-TEXT-017 finalizes an open chunk message when the run finishes', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', messageId: 'message-1', delta: 'done' });

    reducer.reduce({ type: 'RUN_FINISHED', threadId: 'thread-1', runId: 'run-1' });

    expect(store.selectMessages('thread-1')[0]).toMatchObject({
      status: 'complete',
      parts: [{ status: 'complete' }],
    });
  });

  it('AI-AGUI-TEXT-018 rejects a first chunk without message identity', () => {
    const { reducer, store } = runningSetup();

    const result = reducer.reduce({ type: 'TEXT_MESSAGE_CHUNK', delta: 'orphan' });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'orphan-event' } });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });

  it('AI-AGUI-TEXT-019 merges event metadata key by key', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({
      type: 'TEXT_MESSAGE_START',
      messageId: 'message-1',
      metadata: { stable: true, replaced: 'old' },
    });

    reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'text',
      metadata: { replaced: 'new', added: 2 },
    });

    expect(store.selectMessages('thread-1')[0]?.metadata).toEqual({
      stable: true,
      replaced: 'new',
      added: 2,
    });
  });

  it('AI-AGUI-BASE-006/007/008 preserve metadata but never derive behavior from it', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'message-1' });

    reducer.reduce({
      type: 'TEXT_MESSAGE_CONTENT',
      messageId: 'message-1',
      delta: 'safe',
      rawEvent: { delta: 'raw override' },
      metadata: { delta: 'metadata override', execute: 'tool' },
    });

    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'safe' });
    expect(store.selectMessages('thread-1')[0]?.metadata).toEqual({
      delta: 'metadata override',
      execute: 'tool',
    });
  });
});

describe('TngAgUiReducer tool lifecycle', () => {
  it('AI-AGUI-TOOL-001 creates a stable call under its parent message', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TEXT_MESSAGE_START', messageId: 'assistant-1' });

    reducer.reduce({
      type: 'TOOL_CALL_START',
      toolCallId: 'call-1',
      toolCallName: 'search',
      parentMessageId: 'assistant-1',
    });

    expect(store.snapshot().messages.get('assistant-1')?.parts[1]).toMatchObject({
      id: 'tool-call:call-1',
      type: 'tool-call',
      toolCallId: 'call-1',
      name: 'search',
      status: 'input-streaming',
    });
  });

  it('AI-AGUI-TOOL-002 retains a call without an optional parent', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      toolCallId: 'call-1',
    });
  });

  it('AI-AGUI-TOOL-003/004 deduplicates identical starts and rejects conflicts', () => {
    const { reducer, store } = runningSetup();
    const start = { type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' };

    expect(reducer.reduce(start)).toEqual({ applied: true });
    expect(reducer.reduce(start)).toEqual({ applied: true });
    expect(
      reducer.reduce({ ...start, toolCallName: 'conflicting-search' }),
    ).toMatchObject({ applied: false, diagnostic: { code: 'invalid-lifecycle' } });
    expect(store.snapshot().messages.get('tool-call:call-1')?.parts).toHaveLength(1);
  });

  it('AI-AGUI-TOOL-005/006 accumulates fragmented JSON and parses when complete', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });

    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: '{"query":' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: '"tailng"}' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      rawInput: '{"query":"tailng"}',
      input: { query: 'tailng' },
    });
  });

  it('AI-AGUI-TOOL-007 preserves Unicode across argument fragments', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });

    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: '{"query":"नम' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: 'स्ते ✓"}' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      input: { query: 'नमस्ते ✓' },
    });
  });

  it('AI-AGUI-TOOL-008 rejects arguments without a call start', () => {
    const { reducer } = runningSetup();

    expect(
      reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'missing', delta: '{}' }),
    ).toMatchObject({ applied: false, diagnostic: { code: 'orphan-event' } });
  });

  it('AI-AGUI-TOOL-009 bounds accumulated tool arguments', () => {
    const { reducer, store } = runningSetup({ maxToolInputBytes: 8 });
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });

    const result = reducer.reduce({
      type: 'TOOL_CALL_ARGS',
      toolCallId: 'call-1',
      delta: '0123456789',
    });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'limit-exceeded' } });
    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      status: 'failed',
    });
  });

  it('AI-AGUI-TOOL-010 finalizes valid arguments as running', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: '{}' });

    reducer.reduce({ type: 'TOOL_CALL_END', toolCallId: 'call-1' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      status: 'running',
      input: {},
    });
  });

  it('AI-AGUI-TOOL-011 retains malformed input and records a diagnostic', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-1', delta: '{bad' });

    reducer.reduce({ type: 'TOOL_CALL_END', toolCallId: 'call-1' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      status: 'failed',
      rawInput: '{bad',
    });
    expect(reducer.diagnostics().at(-1)?.code).toBe('invalid-tool-arguments');
  });

  it('AI-AGUI-TOOL-012 treats an argument-less call as an empty object', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'noArgs' });

    reducer.reduce({ type: 'TOOL_CALL_END', toolCallId: 'call-1' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      status: 'running',
      input: {},
    });
  });

  it('AI-AGUI-TOOL-013 rejects call end without start', () => {
    const { reducer } = runningSetup();

    expect(reducer.reduce({ type: 'TOOL_CALL_END', toolCallId: 'missing' })).toMatchObject({
      applied: false,
      diagnostic: { code: 'orphan-event' },
    });
  });

  it('AI-AGUI-TOOL-014 creates a result correlated by tool call ID', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-1', toolCallName: 'search' });

    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-1',
      toolCallId: 'call-1',
      content: 'Found it',
    });

    expect(store.snapshot().messages.get('result-1')?.parts[0]).toMatchObject({
      type: 'tool-result',
      toolCallId: 'call-1',
      text: 'Found it',
    });
  });

  it('AI-AGUI-TOOL-015/016 safely retains a result before or without its call', () => {
    const { reducer, store } = runningSetup();

    expect(
      reducer.reduce({
        type: 'TOOL_CALL_RESULT',
        messageId: 'result-1',
        toolCallId: 'late-call',
        content: 'early',
      }),
    ).toEqual({ applied: true });
    expect(reducer.diagnostics().at(-1)?.code).toBe('orphan-event');
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'late-call', toolCallName: 'late' });

    expect(store.snapshot().messages.get('result-1')?.parts[0]).toMatchObject({
      toolCallId: 'late-call',
    });
  });

  it('AI-AGUI-TOOL-017/018 isolates parallel arguments and reverse-order results', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-a', toolCallName: 'a' });
    reducer.reduce({ type: 'TOOL_CALL_START', toolCallId: 'call-b', toolCallName: 'b' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-b', delta: '{"b":2}' });
    reducer.reduce({ type: 'TOOL_CALL_ARGS', toolCallId: 'call-a', delta: '{"a":1}' });
    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-b',
      toolCallId: 'call-b',
      content: 'B',
    });
    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-a',
      toolCallId: 'call-a',
      content: 'A',
    });

    expect(store.snapshot().messages.get('tool-call:call-a')?.parts[0]).toMatchObject({
      input: { a: 1 },
    });
    expect(store.snapshot().messages.get('tool-call:call-b')?.parts[0]).toMatchObject({
      input: { b: 2 },
    });
    expect(store.snapshot().messages.get('result-a')?.parts[0]).toMatchObject({ toolCallId: 'call-a' });
    expect(store.snapshot().messages.get('result-b')?.parts[0]).toMatchObject({ toolCallId: 'call-b' });
  });

  it('AI-AGUI-TOOL-019 normalizes chunks like start, args, and end', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'TOOL_CALL_CHUNK',
      toolCallId: 'call-1',
      toolCallName: 'search',
      delta: '{"q":',
    });
    reducer.reduce({ type: 'TOOL_CALL_CHUNK', delta: '"value"}' });
    reducer.reduce({ type: 'RUN_FINISHED', threadId: 'thread-1', runId: 'run-1' });

    expect(store.snapshot().messages.get('tool-call:call-1')?.parts[0]).toMatchObject({
      status: 'running',
      input: { q: 'value' },
    });
  });

  it('AI-AGUI-TOOL-020/021 retains text and parsed JSON result content', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-text',
      toolCallId: 'call-text',
      content: '<b>literal</b>',
    });
    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-json',
      toolCallId: 'call-json',
      content: '{"value":42}',
    });

    expect(store.snapshot().messages.get('result-text')?.parts[0]).toMatchObject({
      text: '<b>literal</b>',
    });
    expect(store.snapshot().messages.get('result-json')?.parts[0]).toMatchObject({
      output: { value: 42 },
    });
  });

  it('AI-AGUI-TOOL-022 retains provider metadata as inert namespaced data', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'TOOL_CALL_RESULT',
      messageId: 'result-1',
      toolCallId: 'call-1',
      content: 'result',
      metadata: { 'provider.dev/trace': 'trace-1', authorize: true },
    });

    expect(store.snapshot().messages.get('result-1')?.metadata).toEqual({
      'provider.dev/trace': 'trace-1',
      authorize: true,
    });
  });
});

describe('TngAgUiReducer message snapshots', () => {
  it('AI-AGUI-STATE-008 normalizes snapshot messages in source order', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [
        { id: 'user-1', role: 'user', content: 'Hello' },
        { id: 'assistant-1', role: 'assistant', content: 'Hi' },
      ],
    });

    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual([
      'user-1',
      'assistant-1',
    ]);
    expect(store.snapshot().messages.get('user-1')?.parts[0]).toMatchObject({ text: 'Hello' });
  });

  it('AI-AGUI-STATE-009 reconciles a restated message without duplication', () => {
    const { reducer, store } = runningSetup();
    reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [{ id: 'assistant-1', role: 'assistant', content: 'Old' }],
    });

    reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [{ id: 'assistant-1', role: 'assistant', content: 'Updated' }],
    });

    expect(store.selectMessages('thread-1')).toHaveLength(1);
    expect(store.snapshot().messages.get('assistant-1')?.parts[0]).toMatchObject({ text: 'Updated' });
  });

  it('AI-AGUI-STATE-010 preserves tool call/result correlation in a snapshot', () => {
    const { reducer, store } = runningSetup();

    reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [
        {
          id: 'assistant-1',
          role: 'assistant',
          toolCalls: [
            {
              id: 'call-1',
              type: 'function',
              function: { name: 'search', arguments: '{"q":"tailng"}' },
            },
          ],
        },
        { id: 'result-1', role: 'tool', toolCallId: 'call-1', content: 'result' },
      ],
    });

    expect(store.snapshot().messages.get('assistant-1')?.parts[0]).toMatchObject({
      toolCallId: 'call-1',
      input: { q: 'tailng' },
    });
    expect(store.snapshot().messages.get('result-1')?.parts[0]).toMatchObject({
      toolCallId: 'call-1',
    });
  });

  it('AI-AGUI-STATE-011 does not purge independently paged older history', () => {
    const { reducer, store } = runningSetup();
    store.upsertMessage({
      id: 'older-1',
      threadId: 'thread-1',
      role: 'user',
      status: 'complete',
      parts: [{ id: 'older-1:text', type: 'text', text: 'Older', format: 'plain' }],
    });

    reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [{ id: 'newer-1', role: 'assistant', content: 'Newer' }],
    });

    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual(['older-1', 'newer-1']);
  });

  it('AI-AGUI-STATE-012 rejects an invalid snapshot atomically', () => {
    const { reducer, store } = runningSetup();

    const result = reducer.reduce({
      type: 'MESSAGES_SNAPSHOT',
      messages: [
        { id: 'valid-1', role: 'user', content: 'valid' },
        { id: 'invalid-1', role: 'unknown', content: 'invalid' },
      ],
    });

    expect(result).toMatchObject({ applied: false, diagnostic: { code: 'invalid-event' } });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });
});

function setup(options: ConstructorParameters<typeof TngAgUiReducer>[1] = {}) {
  const store = new TngAiChatStore();
  const reducer = new TngAgUiReducer(store, options);
  return { reducer, store };
}

function runningSetup(options: ConstructorParameters<typeof TngAgUiReducer>[1] = {}) {
  const result = setup(options);
  result.reducer.reduce(runStarted());
  return result;
}

function runStarted(overrides: Readonly<Record<string, unknown>> = {}) {
  return {
    type: 'RUN_STARTED',
    threadId: 'thread-1',
    runId: 'run-1',
    timestamp: 100,
    ...overrides,
  };
}
