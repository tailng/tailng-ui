import { describe, expect, it, vi } from 'vitest';
import {
  TngAiHistoryController,
  type TngAiHistoryLoadRequest,
  type TngAiHistoryPage,
  type TngAiHistorySource,
} from './history-controller';
import type { TngAiMessage } from '../core/message.types';
import { TngAiChatStore } from '../store/chat-store';

describe('TngAiHistoryController', () => {
  it('AI-HIST-001 loads the newest page and records cursor state', async () => {
    const { controller, store } = setup(() =>
      Promise.resolve(page([message('m1', 1)], 'cursor-1', true)),
    );

    await expect(controller.loadBefore('thread-1')).resolves.toMatchObject({ ok: true });
    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual(['m1']);
    expect(controller.state('thread-1')).toMatchObject({
      loading: false,
      hasMore: true,
      previousCursor: 'cursor-1',
    });
  });

  it('AI-HIST-002 passes an opaque cursor unchanged', async () => {
    const source = vi.fn<TngAiHistorySource['loadBefore']>(() =>
      Promise.resolve(page([], undefined, false)),
    );
    const { controller } = setup(source);
    const cursor = 'opaque:/?✓ value';

    await controller.loadBefore('thread-1', cursor);

    expect(source.mock.calls[0]?.[0].cursor).toBe(cursor);
  });

  it('AI-HIST-003 suppresses loading after the source is exhausted', async () => {
    const source = vi.fn<TngAiHistorySource['loadBefore']>(() =>
      Promise.resolve(page([], undefined, false)),
    );
    const { controller } = setup(source);

    await controller.loadBefore('thread-1');
    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'exhausted',
    });
    expect(source).toHaveBeenCalledTimes(1);
  });

  it('AI-HIST-004 rejects hasMore without a continuation cursor', async () => {
    const { controller, store } = setup(() =>
      Promise.resolve(page([message('m1', 1)], undefined, true)),
    );

    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'invalid-page',
    });
    expect(store.selectMessages('thread-1')).toEqual([]);
    expect(controller.diagnostics().at(-1)?.code).toBe('invalid-page');
  });

  it('AI-HIST-005 shares one in-flight request for duplicate triggers', async () => {
    const pending = deferred<TngAiHistoryPage>();
    const source = vi.fn(() => pending.promise);
    const { controller } = setup(source);

    const first = controller.loadBefore('thread-1', 'cursor-1');
    const second = controller.loadBefore('thread-1', 'cursor-1');

    expect(first).toBe(second);
    expect(source).toHaveBeenCalledTimes(1);
    pending.resolve(page([], undefined, false));
    await first;
  });

  it('AI-HIST-006 clears loading and merges a completed request once', async () => {
    const pending = deferred<TngAiHistoryPage>();
    const { controller, store } = setup(() => pending.promise);
    const result = controller.loadBefore('thread-1');
    expect(controller.state('thread-1').loading).toBe(true);

    pending.resolve(page([message('m1', 1)], undefined, false));
    await result;

    expect(controller.state('thread-1').loading).toBe(false);
    expect(store.selectMessages('thread-1')).toHaveLength(1);
  });

  it('AI-HIST-007 preserves history and exposes retry state after failure', async () => {
    const store = new TngAiChatStore();
    store.upsertMessage(message('visible', 2));
    const controller = new TngAiHistoryController(store, {
      loadBefore: () => Promise.reject(new Error('offline')),
    });

    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'failed',
    });
    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual(['visible']);
    expect(controller.state('thread-1').error).toBeInstanceOf(Error);
  });

  it('AI-HIST-008 retries the same request and clears its error', async () => {
    const source = vi
      .fn<TngAiHistorySource['loadBefore']>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(page([message('m1', 1)], undefined, false));
    const { controller, store } = setup(source);
    await controller.loadBefore('thread-1', 'cursor-1', 12);

    await expect(controller.retry('thread-1')).resolves.toMatchObject({ ok: true });

    expect(source.mock.calls[1]?.[0]).toMatchObject({ cursor: 'cursor-1', limit: 12 });
    expect(controller.state('thread-1').error).toBeUndefined();
    expect(store.selectMessages('thread-1')).toHaveLength(1);
  });

  it('AI-HIST-009 ignores a stale response after switching threads', async () => {
    const pending = deferred<TngAiHistoryPage>();
    const { controller, store } = setup(() => pending.promise);
    controller.activateThread('thread-1');
    const result = controller.loadBefore('thread-1');

    controller.activateThread('thread-2');
    pending.resolve(page([message('stale', 1)], undefined, false));

    await expect(result).resolves.toEqual({ ok: false, reason: 'cancelled' });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });

  it('AI-HIST-010 aborts an old active request without a visible error', async () => {
    let request: TngAiHistoryLoadRequest | undefined;
    const pending = deferred<TngAiHistoryPage>();
    const { controller } = setup((current) => {
      request = current;
      return pending.promise;
    });
    controller.activateThread('thread-1');
    const result = controller.loadBefore('thread-1');

    controller.activateThread('thread-2');

    expect(request?.signal?.aborted).toBe(true);
    pending.resolve(page([], undefined, false));
    await expect(result).resolves.toEqual({ ok: false, reason: 'cancelled' });
    expect(controller.state('thread-1').error).toBeUndefined();
  });

  it('AI-HIST-011 rejects messages belonging to another thread', async () => {
    const wrong = { ...message('wrong', 1), threadId: 'thread-2' };
    const { controller, store } = setup(() => Promise.resolve(page([wrong], undefined, false)));

    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'invalid-page',
    });
    expect(store.selectMessages('thread-1')).toEqual([]);
    expect(controller.diagnostics().at(-1)?.code).toBe('wrong-thread');
  });

  it('AI-HIST-012 rejects a page in reverse chronological order', async () => {
    const items = [message('newer', 2), message('older', 1)];
    const { controller } = setup(() => Promise.resolve(page(items, undefined, false)));

    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'invalid-page',
    });
    expect(controller.diagnostics().at(-1)?.code).toBe('invalid-order');
  });

  it('AI-HIST-013 deduplicates an overlapping page by message ID', async () => {
    const { controller, store } = setup(() =>
      Promise.resolve(page([message('m1', 1), message('m2', 2)], undefined, false)),
    );
    store.upsertMessage(message('m2', 2));
    store.upsertMessage(message('m3', 3));

    await controller.loadBefore('thread-1');

    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual(['m1', 'm2', 'm3']);
  });

  it('AI-HIST-014 reconciles an edited overlap without moving its ID', async () => {
    const { controller, store } = setup(() =>
      Promise.resolve(page([message('m1', 1, 'edited')], undefined, false)),
    );
    store.upsertMessage(message('m1', 1, 'old'));
    store.upsertMessage(message('m2', 2));

    await controller.loadBefore('thread-1');

    expect(store.selectMessages('thread-1').map(({ id }) => id)).toEqual(['m1', 'm2']);
    expect(store.selectMessages('thread-1')[0]?.parts[0]).toMatchObject({ text: 'edited' });
  });

  it('AI-HIST-015 clamps requested limits to the configured maximum', async () => {
    const source = vi.fn<TngAiHistorySource['loadBefore']>(() =>
      Promise.resolve(page([], undefined, false)),
    );
    const { controller } = setup(source, { pageSize: 40, maxPageSize: 80 });

    await controller.loadBefore('thread-1', undefined, 1_000);

    expect(source.mock.calls[0]?.[0].limit).toBe(80);
  });

  it('AI-HIST-016 never mutates immutable page records', async () => {
    const input = message('frozen', 1);
    const sourcePage = deepFreeze(page([input], undefined, false));
    const { controller, store } = setup(() => Promise.resolve(sourcePage));

    await controller.loadBefore('thread-1');

    expect(store.selectMessages('thread-1')[0]).toBe(input);
    expect(Object.isFrozen(input)).toBe(true);
  });

  it('AI-HIST-018 isolates concurrent loads for different threads', async () => {
    const source: TngAiHistorySource = {
      loadBefore: ({ threadId }) =>
        Promise.resolve(
          page([{ ...message(`${threadId}-message`, 1), threadId }], undefined, false),
        ),
    };
    const store = new TngAiChatStore();
    const controller = new TngAiHistoryController(store, source);

    await Promise.all([controller.loadBefore('thread-1'), controller.loadBefore('thread-2')]);

    expect(store.selectMessages('thread-1')[0]?.id).toBe('thread-1-message');
    expect(store.selectMessages('thread-2')[0]?.id).toBe('thread-2-message');
  });

  it('AI-HIST-019 remains inert when no history source is supplied', async () => {
    const store = new TngAiChatStore();
    const controller = new TngAiHistoryController(store);

    await expect(controller.loadBefore('thread-1')).resolves.toEqual({
      ok: false,
      reason: 'unavailable',
    });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });

  it('AI-HIST-020 prevents writes after disposal during a request', async () => {
    const pending = deferred<TngAiHistoryPage>();
    const { controller, store } = setup(() => pending.promise);
    const result = controller.loadBefore('thread-1');

    controller.dispose();
    pending.resolve(page([message('late', 1)], undefined, false));

    await expect(result).resolves.toEqual({ ok: false, reason: 'cancelled' });
    expect(store.selectMessages('thread-1')).toEqual([]);
  });
});

function setup(
  loadBefore: TngAiHistorySource['loadBefore'],
  options: { readonly pageSize?: number; readonly maxPageSize?: number } = {},
) {
  const store = new TngAiChatStore();
  const controller = new TngAiHistoryController(store, { loadBefore }, options);
  return { controller, store };
}

function page(
  items: readonly TngAiMessage[],
  previousCursor: string | undefined,
  hasMore: boolean,
): TngAiHistoryPage {
  return { items, previousCursor, hasMore };
}

function message(id: string, createdAt: number, text = id): TngAiMessage {
  return deepFreeze({
    id,
    threadId: 'thread-1',
    role: 'assistant',
    status: 'complete',
    createdAt,
    parts: [{ id: `${id}-text`, type: 'text', text, format: 'plain', status: 'complete' }],
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}
