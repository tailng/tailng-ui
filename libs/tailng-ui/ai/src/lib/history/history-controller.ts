/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- Store and abort controllers are intentionally stateful. */
import type { TngAiMessage } from '../core/message.types';
import type { TngAiChatStore } from '../store/chat-store';

export type TngAiHistoryPage = {
  readonly items: readonly TngAiMessage[];
  readonly previousCursor?: string;
  readonly hasMore: boolean;
};

export type TngAiHistoryLoadRequest = {
  readonly threadId: string;
  readonly cursor?: string;
  readonly limit: number;
  readonly signal?: AbortSignal;
};

export type TngAiHistorySource = {
  loadBefore(request: TngAiHistoryLoadRequest): Promise<TngAiHistoryPage>;
};

export type TngAiHistoryOptions = {
  readonly pageSize?: number;
  readonly maxPageSize?: number;
};

export type TngAiHistoryState = {
  readonly loading: boolean;
  readonly hasMore?: boolean;
  readonly previousCursor?: string;
  readonly error?: unknown;
};

export type TngAiHistoryDiagnostic = {
  readonly code: 'invalid-page' | 'wrong-thread' | 'invalid-order';
  readonly threadId: string;
  readonly message: string;
};

export type TngAiHistoryLoadResult =
  | { readonly ok: true; readonly page: TngAiHistoryPage }
  | {
      readonly ok: false;
      readonly reason: 'unavailable' | 'exhausted' | 'cancelled' | 'failed' | 'invalid-page';
    };

type MutableHistoryState = {
  loading: number;
  hasMore?: boolean;
  previousCursor?: string;
  error?: unknown;
  lastRequest?: { readonly cursor?: string; readonly limit: number };
};

type ActiveRequest = {
  readonly threadId: string;
  readonly abortController: AbortController;
  readonly promise: Promise<TngAiHistoryLoadResult>;
};

type StartRequest = {
  readonly key: string;
  readonly threadId: string;
  readonly cursor?: string;
  readonly limit: number;
};

type PageValidation =
  | { readonly valid: true }
  | { readonly valid: false; readonly code: TngAiHistoryDiagnostic['code']; readonly message: string };

const DEFAULT_PAGE_SIZE = 40;
const DEFAULT_MAX_PAGE_SIZE = 100;
const MAX_DIAGNOSTICS = 100;

export class TngAiHistoryController {
  private readonly historyStates = new Map<string, MutableHistoryState>();
  private readonly activeRequests = new Map<string, ActiveRequest>();
  private readonly historyDiagnostics: TngAiHistoryDiagnostic[] = [];
  private disposed = false;

  public constructor(
    private readonly store: TngAiChatStore,
    private readonly source?: TngAiHistorySource,
    private readonly options: TngAiHistoryOptions = {},
  ) {}

  public state(threadId: string): TngAiHistoryState {
    const state = this.historyStates.get(threadId);
    return {
      loading: (state?.loading ?? 0) > 0,
      hasMore: state?.hasMore,
      previousCursor: state?.previousCursor,
      error: state?.error,
    };
  }

  public diagnostics(): readonly TngAiHistoryDiagnostic[] {
    return this.historyDiagnostics;
  }

  public loadBefore(
    threadId: string,
    cursor?: string,
    limit?: number,
  ): Promise<TngAiHistoryLoadResult> {
    if (this.disposed) {
      return Promise.resolve({ ok: false, reason: 'cancelled' });
    }
    if (this.source === undefined) {
      return Promise.resolve({ ok: false, reason: 'unavailable' });
    }
    if (this.mutableState(threadId).hasMore === false) {
      return Promise.resolve({ ok: false, reason: 'exhausted' });
    }

    const requestLimit = this.clampLimit(limit);
    const key = requestKey(threadId, cursor);
    const active = this.activeRequests.get(key);
    if (active !== undefined) {
      return active.promise;
    }
    return this.startRequest({ key, threadId, cursor, limit: requestLimit });
  }

  public retry(threadId: string): Promise<TngAiHistoryLoadResult> {
    const lastRequest = this.mutableState(threadId).lastRequest;
    return lastRequest === undefined
      ? Promise.resolve({ ok: false, reason: 'unavailable' })
      : this.loadBefore(threadId, lastRequest.cursor, lastRequest.limit);
  }

  public activateThread(threadId: string): void {
    for (const request of this.activeRequests.values()) {
      if (request.threadId !== threadId) {
        request.abortController.abort();
      }
    }
  }

  public dispose(): void {
    this.disposed = true;
    for (const request of this.activeRequests.values()) {
      request.abortController.abort();
    }
  }

  private startRequest(request: StartRequest): Promise<TngAiHistoryLoadResult> {
    const { key, threadId, cursor, limit } = request;
    const state = this.mutableState(threadId);
    state.loading += 1;
    state.error = undefined;
    state.lastRequest = { cursor, limit };
    const abortController = new AbortController();
    const sourcePromise = this.invokeSource({ threadId, cursor, limit, signal: abortController.signal });
    const promise = sourcePromise
      .then((page) => this.acceptPage(threadId, abortController, page))
      .catch((error: unknown) => this.handleFailure(threadId, abortController, error))
      .finally(() => this.finishRequest(key, threadId));
    this.activeRequests.set(key, { threadId, abortController, promise });
    return promise;
  }

  private invokeSource(request: TngAiHistoryLoadRequest): Promise<TngAiHistoryPage> {
    const source = this.source;
    if (source === undefined) {
      return Promise.reject(new Error('History source is unavailable.'));
    }
    try {
      return source.loadBefore(request);
    } catch (error: unknown) {
      return Promise.reject(error instanceof Error ? error : new Error('History source failed.'));
    }
  }

  private acceptPage(
    threadId: string,
    abortController: AbortController,
    page: TngAiHistoryPage,
  ): TngAiHistoryLoadResult {
    if (this.shouldIgnore(abortController)) {
      return { ok: false, reason: 'cancelled' };
    }
    const validation = validatePage(threadId, page);
    if (!validation.valid) {
      this.recordDiagnostic(threadId, validation.code, validation.message);
      return { ok: false, reason: 'invalid-page' };
    }

    this.mergePage(page);
    const state = this.mutableState(threadId);
    state.hasMore = page.hasMore;
    state.previousCursor = page.previousCursor;
    state.error = undefined;
    return { ok: true, page };
  }

  private handleFailure(
    threadId: string,
    abortController: AbortController,
    error: unknown,
  ): TngAiHistoryLoadResult {
    if (this.shouldIgnore(abortController)) {
      return { ok: false, reason: 'cancelled' };
    }
    this.mutableState(threadId).error = error;
    return { ok: false, reason: 'failed' };
  }

  private shouldIgnore(abortController: AbortController): boolean {
    return this.disposed || abortController.signal.aborted;
  }

  private mergePage(page: TngAiHistoryPage): void {
    for (const message of [...page.items].reverse()) {
      this.store.upsertMessage(message, 'prepend');
    }
  }

  private finishRequest(key: string, threadId: string): void {
    this.activeRequests.delete(key);
    const state = this.mutableState(threadId);
    state.loading = Math.max(0, state.loading - 1);
  }

  private mutableState(threadId: string): MutableHistoryState {
    let state = this.historyStates.get(threadId);
    if (state === undefined) {
      state = { loading: 0 };
      this.historyStates.set(threadId, state);
    }
    return state;
  }

  private clampLimit(limit: number | undefined): number {
    const maximum = Math.max(1, this.options.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE);
    const requested = limit ?? this.options.pageSize ?? DEFAULT_PAGE_SIZE;
    return Math.max(1, Math.min(requested, maximum));
  }

  private recordDiagnostic(
    threadId: string,
    code: TngAiHistoryDiagnostic['code'],
    message: string,
  ): void {
    this.historyDiagnostics.push({ threadId, code, message });
    if (this.historyDiagnostics.length > MAX_DIAGNOSTICS) {
      this.historyDiagnostics.shift();
    }
  }
}

function validatePage(threadId: string, page: TngAiHistoryPage): PageValidation {
  if (page.hasMore && page.previousCursor === undefined) {
    return { valid: false, code: 'invalid-page', message: 'A continuing page requires a cursor.' };
  }
  if (page.items.some((message) => message.threadId !== threadId)) {
    return { valid: false, code: 'wrong-thread', message: 'History page contains another thread.' };
  }
  if (!isChronological(page.items)) {
    return { valid: false, code: 'invalid-order', message: 'History page order is not chronological.' };
  }
  return { valid: true };
}

function isChronological(items: readonly TngAiMessage[]): boolean {
  for (let index = 1; index < items.length; index += 1) {
    const previous = items[index - 1]?.createdAt;
    const current = items[index]?.createdAt;
    if (previous !== undefined && current !== undefined && previous > current) {
      return false;
    }
  }
  return true;
}

function requestKey(threadId: string, cursor: string | undefined): string {
  return JSON.stringify([threadId, cursor]);
}
