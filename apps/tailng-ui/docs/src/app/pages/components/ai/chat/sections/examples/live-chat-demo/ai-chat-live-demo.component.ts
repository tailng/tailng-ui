import { Component, computed, signal, type OnDestroy } from '@angular/core';
import {
  completeTngAiTextPart,
  transitionTngAiToolCall,
  TngAiChatStore,
  TngAiHistoryController,
  type TngAiHistorySource,
  type TngAiMessage,
  type TngAiMessagePart,
  type TngAiTextPart,
  type TngAiToolCallPart,
} from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';
import { TngButtonComponent, TngTextareaComponent } from '@tailng-ui/components';

const threadId = 'release-review';
const streamStepMs = 300;

function textPart(id: string, text: string): TngAiTextPart {
  return { id: `${id}:text`, type: 'text', format: 'plain', text, status: 'complete' };
}

function message(
  id: string,
  role: TngAiMessage['role'],
  text: string,
  createdAt: number,
): TngAiMessage {
  return {
    id,
    threadId,
    role,
    status: 'complete',
    createdAt,
    parts: [textPart(id, text)],
  };
}

const initialMessages: readonly TngAiMessage[] = [
  message('recent-1', 'assistant', 'Release assistant is ready for the final review.', 400),
  message('recent-2', 'user', 'What changed since the release candidate?', 500),
  message(
    'recent-3',
    'assistant',
    'Payments and accessibility fixes landed. Ask me to inspect the release checks.',
    600,
  ),
];

const historyMessages: readonly TngAiMessage[] = [
  message('history-1', 'user', 'Start a release review for TailNG 1.0.', 100),
  message('history-2', 'assistant', 'Review created with twelve required checks.', 200),
  message('history-3', 'user', 'Keep the protocol boundary on AG-UI 1.0.', 300),
];

function createHistorySource(): TngAiHistorySource {
  return {
    loadBefore: ({ signal }) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve({ items: historyMessages, hasMore: false }), 240);
        signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new DOMException('History request cancelled.', 'AbortError'));
          },
          { once: true },
        );
      }),
  };
}

@Component({
  selector: 'app-ai-chat-live-demo',
  imports: [TngButtonComponent, TngTextareaComponent],
  templateUrl: './ai-chat-live-demo.component.html',
  styleUrl: './ai-chat-live-demo.component.css',
})
export class AiChatLiveDemoComponent implements OnDestroy {
  protected readonly draft = signal('');
  protected readonly messages = signal<readonly TngAiMessage[]>([]);
  protected readonly running = signal(false);
  protected readonly canRetry = signal(false);
  protected readonly statusMessage = signal('Ready for a release question.');
  protected readonly historyLoading = signal(false);
  protected readonly historyExhausted = signal(false);
  protected readonly canSend = computed(() => this.draft().trim().length > 0 && !this.running());

  private readonly store = new TngAiChatStore();
  private readonly reducer = new TngAgUiReducer(this.store, { profile: 'required-chat' });
  private readonly history = new TngAiHistoryController(this.store, createHistorySource(), {
    pageSize: 3,
    maxPageSize: 3,
  });
  private readonly streamTimers = new Set<ReturnType<typeof setTimeout>>();
  private runSequence = 0;
  private currentRunId: string | undefined;
  private currentAssistantId: string | undefined;
  private lastPrompt = 'Inspect the release checks';
  private destroyed = false;

  public constructor() {
    this.store.upsertThread({ id: threadId, title: 'TailNG 1.0 release review' });
    for (const entry of initialMessages) {
      this.store.upsertMessage(entry);
    }
    this.refreshMessages();
  }

  protected submit(): void {
    const prompt = this.draft().trim();
    if (prompt.length === 0 || this.running()) {
      return;
    }
    this.lastPrompt = prompt;
    this.store.upsertMessage(message(`user-${this.runSequence + 1}`, 'user', prompt, Date.now()));
    this.draft.set('');
    this.startRun();
  }

  protected retry(): void {
    if (this.running()) {
      return;
    }
    this.startRun();
  }

  protected stop(): void {
    const runId = this.currentRunId;
    const assistantId = this.currentAssistantId;
    if (!this.running() || runId === undefined || assistantId === undefined) {
      return;
    }
    this.clearStreamTimers();
    this.applyEvent({
      type: 'RUN_FINISHED',
      threadId,
      runId,
      outcome: { type: 'cancelled' },
    });
    this.store.updateMessage(assistantId, (current) => this.stopMessage(current));
    this.running.set(false);
    this.canRetry.set(true);
    this.statusMessage.set('Response stopped. Partial content remains available.');
    this.refreshMessages();
  }

  protected async loadEarlier(): Promise<void> {
    if (this.historyLoading() || this.historyExhausted()) {
      return;
    }
    this.historyLoading.set(true);
    this.statusMessage.set('Loading earlier messages.');
    const result = await this.history.loadBefore(threadId);
    if (this.destroyed) {
      return;
    }
    this.historyLoading.set(false);
    this.historyExhausted.set(this.history.state(threadId).hasMore === false);
    this.statusMessage.set(
      result.ok ? 'Earlier messages loaded.' : 'Earlier messages unavailable.',
    );
    this.refreshMessages();
  }

  protected onComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
      return;
    }
    event.preventDefault();
    this.submit();
  }

  protected textFor(part: TngAiMessagePart): string {
    return part.type === 'text' || part.type === 'reasoning' ? (part.text ?? '') : '';
  }

  protected jsonFor(value: unknown): string {
    return value === undefined ? '' : JSON.stringify(value, null, 2);
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.clearStreamTimers();
    this.history.dispose();
    this.store.dispose();
  }

  private startRun(): void {
    this.clearStreamTimers();
    this.runSequence += 1;
    const runId = `demo-run-${this.runSequence}`;
    const assistantId = `demo-assistant-${this.runSequence}`;
    this.currentRunId = runId;
    this.currentAssistantId = assistantId;
    this.running.set(true);
    this.canRetry.set(false);
    this.statusMessage.set('Assistant response started.');
    this.applyEvent({ type: 'RUN_STARTED', threadId, runId });
    this.applyEvent({
      type: 'TEXT_MESSAGE_START',
      messageId: assistantId,
      role: 'assistant',
      name: 'Release assistant',
    });
    this.scheduleStream(runId, assistantId);
  }

  private scheduleStream(runId: string, assistantId: string): void {
    const callId = `release-check-${this.runSequence}`;
    this.schedule(1, () => this.appendText(assistantId, 'I’ll inspect '));
    this.schedule(streamStepMs, () => this.appendText(assistantId, 'the release checks '));
    this.schedule(streamStepMs * 2, () => this.appendText(assistantId, 'and deployment health.'));
    this.schedule(streamStepMs * 3, () => this.startTool(assistantId, callId));
    this.schedule(streamStepMs * 4, () => this.runTool(callId));
    this.schedule(streamStepMs * 5, () => this.completeTool(assistantId, callId));
    this.schedule(streamStepMs * 6, () => this.finishRun(runId, assistantId));
  }

  private appendText(assistantId: string, delta: string): void {
    this.applyEvent({ type: 'TEXT_MESSAGE_CONTENT', messageId: assistantId, delta });
  }

  private startTool(assistantId: string, callId: string): void {
    this.applyEvent({
      type: 'TOOL_CALL_START',
      toolCallId: callId,
      toolCallName: 'check_release',
      parentMessageId: assistantId,
    });
    this.applyEvent({
      type: 'TOOL_CALL_ARGS',
      toolCallId: callId,
      delta: `{"release":"${this.lastPrompt.slice(0, 48)}"}`,
    });
  }

  private runTool(callId: string): void {
    this.applyEvent({ type: 'TOOL_CALL_END', toolCallId: callId });
    this.statusMessage.set('Release check tool is running.');
  }

  private completeTool(assistantId: string, callId: string): void {
    this.applyEvent({
      type: 'TOOL_CALL_RESULT',
      messageId: `tool-result-${this.runSequence}`,
      toolCallId: callId,
      content: '12 checks passed; deployment health is green.',
    });
    const assistant = this.store.snapshot().messages.get(assistantId);
    const tool = assistant?.parts.find(
      (part): part is TngAiToolCallPart => part.type === 'tool-call' && part.toolCallId === callId,
    );
    if (assistant !== undefined && tool !== undefined) {
      const completed = transitionTngAiToolCall(assistant, tool.id, 'complete');
      if (completed.ok) {
        this.store.upsertMessage(completed.value);
      }
    }
    this.statusMessage.set('Release check tool completed.');
    this.refreshMessages();
  }

  private finishRun(runId: string, assistantId: string): void {
    this.appendText(assistantId, ' All 12 checks passed. The release is ready.');
    this.applyEvent({ type: 'TEXT_MESSAGE_END', messageId: assistantId });
    this.applyEvent({ type: 'RUN_FINISHED', threadId, runId });
    this.running.set(false);
    this.canRetry.set(false);
    this.statusMessage.set('Response complete.');
  }

  private stopMessage(current: TngAiMessage): TngAiMessage {
    const text = current.parts.find((part) => part.type === 'text');
    if (text?.type !== 'text') {
      return { ...current, status: 'stopped' };
    }
    const completed = completeTngAiTextPart(current, text.id);
    return { ...(completed.ok ? completed.value : current), status: 'stopped' };
  }

  private applyEvent(event: unknown): void {
    this.reducer.reduce(event);
    this.refreshMessages();
  }

  private refreshMessages(): void {
    this.messages.set([...this.store.selectMessages(threadId)]);
  }

  private schedule(delay: number, task: () => void): void {
    const timer = setTimeout(() => {
      this.streamTimers.delete(timer);
      if (!this.destroyed && this.running()) {
        task();
      }
    }, delay);
    this.streamTimers.add(timer);
  }

  private clearStreamTimers(): void {
    for (const timer of this.streamTimers) {
      clearTimeout(timer);
    }
    this.streamTimers.clear();
  }
}
