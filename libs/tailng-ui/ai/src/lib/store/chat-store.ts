import type { TngAiMessage, TngAiRun, TngAiThread } from '../core/message.types';

export type TngAiChatStoreSnapshot = {
  readonly threads: ReadonlyMap<string, TngAiThread>;
  readonly runs: ReadonlyMap<string, TngAiRun>;
  readonly messages: ReadonlyMap<string, TngAiMessage>;
  readonly orderedIdsByThread: ReadonlyMap<string, readonly string[]>;
}

export type TngAiStoreDiagnostic = {
  readonly code: 'duplicate-message' | 'cross-thread-message' | 'invalid-lifecycle' | 'disposed';
  readonly message: string;
  readonly id?: string;
}

export class TngAiChatStore {
  private readonly threadRecords = new Map<string, TngAiThread>();
  private readonly runRecords = new Map<string, TngAiRun>();
  private readonly messageRecords = new Map<string, TngAiMessage>();
  private readonly threadOrder = new Map<string, readonly string[]>();
  private readonly selectedMessages = new Map<string, readonly TngAiMessage[]>();
  private readonly storeDiagnostics: TngAiStoreDiagnostic[] = [];
  private disposed = false;

  public snapshot(): TngAiChatStoreSnapshot {
    return {
      threads: this.threadRecords,
      runs: this.runRecords,
      messages: this.messageRecords,
      orderedIdsByThread: this.threadOrder,
    };
  }

  public diagnostics(): readonly TngAiStoreDiagnostic[] {
    return this.storeDiagnostics;
  }

  public upsertThread(thread: TngAiThread): void {
    if (!this.ensureWritable()) {
      return;
    }
    this.threadRecords.set(thread.id, thread);
  }

  public upsertRun(run: TngAiRun): void {
    if (!this.ensureWritable()) {
      return;
    }
    this.runRecords.set(run.id, run);
  }

  public upsertMessage(message: TngAiMessage, position: 'append' | 'prepend' = 'append'): void {
    if (!this.ensureWritable()) {
      return;
    }

    const current = this.messageRecords.get(message.id);
    if (current !== undefined) {
      if (current.threadId !== message.threadId) {
        this.storeDiagnostics.push({
          code: 'cross-thread-message',
          id: message.id,
          message: `Message ${message.id} already belongs to thread ${current.threadId}.`,
        });
        return;
      }

      if (current !== message) {
        this.messageRecords.set(message.id, message);
        this.invalidateSelection(message.threadId);
      }
      return;
    }

    this.messageRecords.set(message.id, message);
    const currentOrder = this.threadOrder.get(message.threadId) ?? [];
    const nextOrder =
      position === 'prepend'
        ? [message.id, ...currentOrder]
        : [...currentOrder, message.id];
    this.threadOrder.set(message.threadId, nextOrder);
    this.invalidateSelection(message.threadId);
  }

  public updateMessage(
    messageId: string,
    update: (message: TngAiMessage) => TngAiMessage,
  ): void {
    if (!this.ensureWritable()) {
      return;
    }

    const current = this.messageRecords.get(messageId);
    if (current === undefined) {
      return;
    }
    const next = update(current);
    if (next.id !== current.id || next.threadId !== current.threadId) {
      this.storeDiagnostics.push({
        code: 'invalid-lifecycle',
        id: messageId,
        message: 'Message updates cannot change message or thread identity.',
      });
      return;
    }
    if (next !== current) {
      this.messageRecords.set(messageId, next);
      this.invalidateSelection(current.threadId);
    }
  }

  public selectMessages(threadId: string): readonly TngAiMessage[] {
    const cached = this.selectedMessages.get(threadId);
    if (cached !== undefined) {
      return cached;
    }

    const selected = (this.threadOrder.get(threadId) ?? [])
      .map((id) => this.messageRecords.get(id))
      .filter((message): message is TngAiMessage => message !== undefined);
    this.selectedMessages.set(threadId, selected);
    return selected;
  }

  public clearThread(threadId: string): void {
    if (!this.ensureWritable()) {
      return;
    }

    this.threadRecords.delete(threadId);
    for (const [runId, run] of this.runRecords) {
      if (run.threadId === threadId) {
        this.runRecords.delete(runId);
      }
    }
    for (const messageId of this.threadOrder.get(threadId) ?? []) {
      this.messageRecords.delete(messageId);
    }
    this.threadOrder.delete(threadId);
    this.invalidateSelection(threadId);
  }

  public dispose(): void {
    this.disposed = true;
    this.threadRecords.clear();
    this.runRecords.clear();
    this.messageRecords.clear();
    this.threadOrder.clear();
    this.selectedMessages.clear();
  }

  private invalidateSelection(threadId: string): void {
    this.selectedMessages.delete(threadId);
  }

  private ensureWritable(): boolean {
    if (!this.disposed) {
      return true;
    }
    this.storeDiagnostics.push({
      code: 'disposed',
      message: 'The chat store has been disposed.',
    });
    return false;
  }
}
