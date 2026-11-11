import { describe, expect, it } from 'vitest';
import { TngAiChatStore } from './chat-store';
import type { TngAiMessage, TngAiRun, TngAiThread } from '../core/message.types';

describe('TngAiChatStore', () => {
  it('AI-STORE-001 initializes empty normalized state', () => {
    const store = new TngAiChatStore();

    expect(store.snapshot()).toEqual({
      threads: new Map(),
      runs: new Map(),
      messages: new Map(),
      orderedIdsByThread: new Map(),
    });
    expect(store.diagnostics()).toEqual([]);
  });

  it('AI-CORE-RUN-001 and AI-CORE-RUN-003 store a thread and its run', () => {
    const store = new TngAiChatStore();
    const thread = deepFreeze<TngAiThread>({ id: 'thread-1', title: 'Support' });
    const run = deepFreeze<TngAiRun>({
      id: 'run-1',
      threadId: thread.id,
      status: 'running',
      startedAt: 100,
    });

    store.upsertThread(thread);
    store.upsertRun(run);

    expect(store.snapshot().threads.get(thread.id)).toBe(thread);
    expect(store.snapshot().runs.get(run.id)).toBe(run);
  });

  it('AI-STORE-002 stores messages in append order', () => {
    const store = new TngAiChatStore();
    const first = message('message-1', 'First');
    const second = message('message-2', 'Second');

    store.upsertMessage(first);
    store.upsertMessage(second);

    expect(store.snapshot().orderedIdsByThread.get('thread-1')).toEqual([
      'message-1',
      'message-2',
    ]);
    expect(store.selectMessages('thread-1')).toEqual([first, second]);
  });

  it('AI-STORE-003 prepends older messages without reversing the page', () => {
    const store = new TngAiChatStore();
    const newest = message('message-3', 'Newest');
    const olderFirst = message('message-1', 'Older first');
    const olderSecond = message('message-2', 'Older second');

    store.upsertMessage(newest);
    store.upsertMessage(olderSecond, 'prepend');
    store.upsertMessage(olderFirst, 'prepend');

    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual([
      'message-1',
      'message-2',
      'message-3',
    ]);
  });

  it('AI-CORE-MSG-002 and AI-STORE-004 deduplicate identical message IDs', () => {
    const store = new TngAiChatStore();
    const item = message('message-1', 'Same');

    store.upsertMessage(item);
    store.upsertMessage(item);

    expect(store.selectMessages('thread-1')).toEqual([item]);
    expect(store.diagnostics()).toEqual([]);
  });

  it('AI-CORE-MSG-003 and AI-STORE-005 reconcile an updated record without moving it', () => {
    const store = new TngAiChatStore();
    const first = message('message-1', 'Streaming', 'streaming');
    const second = message('message-2', 'After');
    const completed = message('message-1', 'Streaming complete', 'complete');

    store.upsertMessage(first);
    store.upsertMessage(second);
    store.upsertMessage(completed);

    expect(store.selectMessages('thread-1')).toEqual([completed, second]);
  });

  it('AI-CORE-MSG-004 rejects a cross-thread collision', () => {
    const store = new TngAiChatStore();

    store.upsertMessage(message('message-1', 'First thread'));
    store.upsertMessage({ ...message('message-1', 'Other thread'), threadId: 'thread-2' });

    expect(store.selectMessages('thread-1')).toHaveLength(1);
    expect(store.selectMessages('thread-2')).toEqual([]);
    expect(store.diagnostics().at(-1)?.code).toBe('cross-thread-message');
  });

  it('AI-CORE-MSG-005 updates only the selected message and preserves order', () => {
    const store = new TngAiChatStore();
    const first = message('message-1', 'Streaming', 'streaming');
    const second = message('message-2', 'Stable');
    store.upsertMessage(first);
    store.upsertMessage(second);
    const orderBefore = store.snapshot().orderedIdsByThread.get('thread-1');

    store.updateMessage('message-1', (current) => ({ ...current, status: 'complete' }));

    const selected = store.selectMessages('thread-1');
    expect(selected[0]?.status).toBe('complete');
    expect(selected[1]).toBe(second);
    expect(store.snapshot().orderedIdsByThread.get('thread-1')).toBe(orderBefore);
  });

  it('AI-STORE-007 returns the same selector reference when state is unchanged', () => {
    const store = new TngAiChatStore();
    store.upsertMessage(message('message-1', 'Stable'));

    expect(store.selectMessages('thread-1')).toBe(store.selectMessages('thread-1'));
  });

  it('AI-STORE-009 preserves active-thread selector when another thread changes', () => {
    const store = new TngAiChatStore();
    store.upsertMessage(message('message-1', 'Stable'));
    const selected = store.selectMessages('thread-1');

    store.upsertMessage({ ...message('message-2', 'Other'), threadId: 'thread-2' });

    expect(store.selectMessages('thread-1')).toBe(selected);
  });

  it('AI-CORE-MSG-020 does not mutate deeply frozen input', () => {
    const store = new TngAiChatStore();
    const input = message('message-1', 'Frozen');

    store.upsertMessage(input);
    store.updateMessage(input.id, (current) => ({ ...current, status: 'stopped' }));

    expect(input.status).toBe('complete');
    expect(store.selectMessages('thread-1')[0]?.status).toBe('stopped');
  });

  it('AI-STORE-020 clears only the selected thread', () => {
    const store = new TngAiChatStore();
    store.upsertThread({ id: 'thread-1' });
    store.upsertThread({ id: 'thread-2' });
    store.upsertRun({ id: 'run-1', threadId: 'thread-1', status: 'complete' });
    store.upsertRun({ id: 'run-2', threadId: 'thread-2', status: 'complete' });
    store.upsertMessage(message('message-1', 'First'));
    store.upsertMessage({ ...message('message-2', 'Second'), threadId: 'thread-2' });

    store.clearThread('thread-1');

    expect(store.snapshot().threads.has('thread-1')).toBe(false);
    expect(store.snapshot().runs.has('run-1')).toBe(false);
    expect(store.selectMessages('thread-1')).toEqual([]);
    expect(store.snapshot().threads.has('thread-2')).toBe(true);
    expect(store.snapshot().runs.has('run-2')).toBe(true);
    expect(store.selectMessages('thread-2')).toHaveLength(1);
  });

  it('AI-STORE-025 rejects writes after disposal', () => {
    const store = new TngAiChatStore();
    store.dispose();

    store.upsertMessage(message('message-1', 'Ignored'));

    expect(store.selectMessages('thread-1')).toEqual([]);
    expect(store.diagnostics().at(-1)?.code).toBe('disposed');
  });
});

function message(
  id: string,
  text: string,
  status: TngAiMessage['status'] = 'complete',
): TngAiMessage {
  return deepFreeze({
    id,
    threadId: 'thread-1',
    role: 'assistant',
    status,
    parts: [
      {
        id: `${id}-text`,
        type: 'text',
        text,
        format: 'plain',
        status: status === 'streaming' ? 'streaming' : 'complete',
      },
    ],
  });
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const nested of Object.values(value)) {
    deepFreeze(nested);
  }
  return value;
}
