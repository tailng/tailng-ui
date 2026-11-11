import { describe, expect, it } from 'vitest';
import {
  appendTngAiTextDelta,
  appendTngAiToolInput,
  completeTngAiTextPart,
  completeTngAiToolInput,
  resolveTngAiRoleVisibility,
  transitionTngAiToolCall,
  validateTngAiMessage,
} from './message-operations';
import type { TngAiMessage } from './message.types';

describe('TailNG AI message operations', () => {
  it('AI-CORE-MSG-012 reports duplicate part IDs', () => {
    const input = baseMessage({
      parts: [textPart('part-1', 'First'), textPart('part-1', 'Second')],
    });

    expect(validateTngAiMessage(input)).toEqual([
      expect.objectContaining({ code: 'duplicate-part', partId: 'part-1' }),
    ]);
  });

  it('AI-CORE-PART-007 accepts source annotations inside text bounds', () => {
    const input = baseMessage({
      parts: [
        {
          ...textPart('part-1', 'Citation'),
          annotations: [{ type: 'source', sourceId: 'source-1', start: 0, end: 8 }],
        },
      ],
    });

    expect(validateTngAiMessage(input)).toEqual([]);
  });

  it('AI-CORE-PART-008 rejects source annotations outside text bounds', () => {
    const input = baseMessage({
      parts: [
        {
          ...textPart('part-1', 'Short'),
          annotations: [{ type: 'source', sourceId: 'source-1', start: 0, end: 6 }],
        },
      ],
    });

    expect(validateTngAiMessage(input)).toEqual([
      expect.objectContaining({ code: 'invalid-annotation', partId: 'part-1' }),
    ]);
  });

  it('AI-CORE-PART-026 accepts a namespaced extension', () => {
    const input = baseMessage({
      parts: [{ id: 'part-1', type: 'extension', name: 'tailng.dev/example', value: true }],
    });

    expect(validateTngAiMessage(input)).toEqual([]);
  });

  it('AI-CORE-PART-027 rejects an unnamespaced extension', () => {
    const input = baseMessage({
      parts: [{ id: 'part-1', type: 'extension', name: 'example', value: true }],
    });

    expect(validateTngAiMessage(input)).toEqual([
      expect.objectContaining({ code: 'invalid-extension-name', partId: 'part-1' }),
    ]);
  });

  it.each(['user', 'assistant'] as const)(
    'AI-CORE-MSG-019 makes %s visible by default',
    (role) => expect(resolveTngAiRoleVisibility(role)).toBe(true),
  );

  it.each(['system', 'developer', 'reasoning'] as const)(
    'AI-CORE-MSG-018 hides %s by default',
    (role) => expect(resolveTngAiRoleVisibility(role)).toBe(false),
  );

  it('AI-CORE-MSG-018 permits an explicit role visibility policy', () => {
    expect(resolveTngAiRoleVisibility('reasoning', ['reasoning'])).toBe(true);
  });

  it('AI-CORE-PART-003 appends text to the stable part immutably', () => {
    const input = baseMessage({ parts: [textPart('part-1', 'Hello', 'streaming')] });

    const result = appendTngAiTextDelta(input, 'part-1', ' world');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.parts[0]).toMatchObject({ id: 'part-1', text: 'Hello world' });
    expect((input.parts[0] as { text: string }).text).toBe('Hello');
  });

  it('AI-CORE-PART-004 ignores an empty text delta', () => {
    const input = baseMessage({ parts: [textPart('part-1', 'Hello', 'streaming')] });

    expect(appendTngAiTextDelta(input, 'part-1', '')).toEqual({ ok: true, value: input });
  });

  it('AI-CORE-PART-005 rejects text appended after completion', () => {
    const input = baseMessage({ parts: [textPart('part-1', 'Done', 'complete')] });

    const result = appendTngAiTextDelta(input, 'part-1', '!');

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatchObject({ code: 'invalid-lifecycle', partId: 'part-1' });
  });

  it('AI-CORE-PART-006 completes a streaming text part', () => {
    const input = baseMessage({ parts: [textPart('part-1', 'Done', 'streaming')] });

    const result = completeTngAiTextPart(input, 'part-1');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.parts[0]).toMatchObject({ id: 'part-1', status: 'complete' });
  });

  it('AI-CORE-MSG-013 preserves unrelated part references during a part update', () => {
    const stable = { id: 'part-2', type: 'source' as const, sourceId: 'source-1' };
    const input = baseMessage({ parts: [textPart('part-1', 'A', 'streaming'), stable] });

    const result = appendTngAiTextDelta(input, 'part-1', 'B');

    expect(result.ok && result.value.parts[0]).toEqual(
      expect.objectContaining({ id: 'part-1', text: 'AB' }),
    );
    expect(result.ok && result.value.parts[1]).toBe(stable);
  });

  it('AI-CORE-PART-012 accumulates and parses complete tool input', () => {
    const input = toolMessage();

    const result = appendTngAiToolInput(input, 'tool-1', '{"query":"tailng"}');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.parts[0]).toMatchObject({
      toolCallId: 'call-1',
      name: 'search',
      status: 'input-streaming',
      rawInput: '{"query":"tailng"}',
      input: { query: 'tailng' },
    });
  });

  it('AI-CORE-PART-013 retains malformed tool input without throwing', () => {
    const input = toolMessage();

    const result = appendTngAiToolInput(input, 'tool-1', '{"query"');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.parts[0]).toMatchObject({ rawInput: '{"query"' });
    expect('input' in result.value.parts[0]).toBe(false);
  });

  it('AI-CORE-PART-014 finalizes valid tool input as running', () => {
    const appended = appendTngAiToolInput(toolMessage(), 'tool-1', '{}');
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;

    const result = completeTngAiToolInput(appended.value, 'tool-1');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.parts[0]).toMatchObject({
      id: 'tool-1',
      toolCallId: 'call-1',
      status: 'running',
      input: {},
    });

    const completed = transitionTngAiToolCall(result.value, 'tool-1', 'complete');
    expect(completed.ok).toBe(true);
    if (!completed.ok) return;
    expect(completed.value.parts[0]).toMatchObject({
      id: 'tool-1',
      toolCallId: 'call-1',
      status: 'complete',
    });
  });

  it('AI-CORE-PART-013 finalizes malformed tool input with a diagnostic', () => {
    const appended = appendTngAiToolInput(toolMessage(), 'tool-1', '{bad');
    expect(appended.ok).toBe(true);
    if (!appended.ok) return;

    const result = completeTngAiToolInput(appended.value, 'tool-1');

    expect(result.ok && result.value.parts[0]).toEqual(
      expect.objectContaining({ status: 'failed', rawInput: '{bad' }),
    );
    expect(result.ok && result.diagnostics?.[0]?.code).toBe('invalid-tool-arguments');
  });

  it('AI-CORE-PART-016 transitions an input-streaming tool to approval', () => {
    const approval = { interruptId: 'interrupt-1', status: 'pending' as const };
    const input = baseMessage({
      parts: [
        {
          id: 'tool-1',
          type: 'tool-call',
          toolCallId: 'call-1',
          name: 'search',
          status: 'input-streaming',
          approval,
        },
      ],
    });
    const result = transitionTngAiToolCall(input, 'tool-1', 'awaiting-approval');

    expect(result.ok && result.value.parts[0]).toEqual(
      expect.objectContaining({ status: 'awaiting-approval', approval }),
    );
  });

  it('AI-CORE-PART-015 rejects a terminal tool transitioning back to running', () => {
    const input = toolMessage('complete');

    const result = transitionTngAiToolCall(input, 'tool-1', 'running');

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatchObject({ code: 'invalid-lifecycle', partId: 'tool-1' });
  });

  it('AI-CORE-PART-030 keeps deeply frozen input unchanged', () => {
    const input = toolMessage();

    const result = appendTngAiToolInput(input, 'tool-1', '{}');

    expect(result.ok).toBe(true);
    expect(input.parts[0]).toEqual(expect.objectContaining({ status: 'input-streaming' }));
    expect('rawInput' in input.parts[0]).toBe(false);
  });
});

function baseMessage(overrides: Partial<TngAiMessage> = {}): TngAiMessage {
  return deepFreeze({
    id: 'message-1',
    threadId: 'thread-1',
    role: 'assistant',
    status: 'streaming',
    parts: [],
    ...overrides,
  });
}

function textPart(id: string, text: string, status: 'streaming' | 'complete' = 'complete') {
  return { id, type: 'text' as const, text, format: 'plain' as const, status };
}

function toolMessage(status: 'input-streaming' | 'complete' = 'input-streaming'): TngAiMessage {
  return baseMessage({
    parts: [
      {
        id: 'tool-1',
        type: 'tool-call',
        toolCallId: 'call-1',
        name: 'search',
        status,
      },
    ],
  });
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}
