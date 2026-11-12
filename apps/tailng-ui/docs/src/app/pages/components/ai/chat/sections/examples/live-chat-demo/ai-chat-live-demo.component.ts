import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  completeTngAiTextPart,
  transitionTngAiToolCall,
  TNG_AI_MESSAGE_PART_CONTEXT,
  TngAiChatComponent,
  TngAiChatStore,
  TngAiHistoryController,
  type TngAiChatPartActionEvent,
  type TngAiChatSubmitEvent,
  type TngAiHistorySource,
  type TngAiMessage,
  type TngAiMessagePart,
  type TngAiMessagePartRenderer,
  type TngAiTextPart,
  type TngAiToolCallPart,
} from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';
import {
  COMPONENT_ASSISTANT_OPTIONS,
  componentAssistantOption,
  routeComponentAssistantPrompt,
  type ComponentAssistantRoute,
} from '../../../../../../../shared/demos/component-assistant/component-assistant.catalog';
import {
  createComponentPreviewExtension,
  createPromptOptionsExtension,
  resolveComponentAssistantExtension,
} from '../../../../../../../shared/demos/component-assistant/component-assistant.extensions';
import { ComponentAssistantPreviewComponent } from '../../../../../../../shared/demos/component-assistant/component-assistant.previews';

const threadId = 'tailng-component-assistant';
const streamStepMs = 180;

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
  message(
    'welcome-1',
    'assistant',
    'Type “hi” to choose a TailNG component for me to render.',
    300,
  ),
];

const historyMessages: readonly TngAiMessage[] = [
  message('history-1', 'user', 'Can this chat render interactive Angular UI?', 100),
  message(
    'history-2',
    'assistant',
    'Yes. The application validates an allowlisted extension before rendering a TailNG component.',
    200,
  ),
];

function createHistorySource(): TngAiHistorySource {
  return {
    loadBefore: ({ signal: abortSignal }) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve({ items: historyMessages, hasMore: false }), 240);
        abortSignal?.addEventListener(
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
  selector: 'app-ai-chat-live-demo-part',
  imports: [ComponentAssistantPreviewComponent],
  template: `
    @if (view(); as resolvedView) {
      @switch (resolvedView.kind) {
        @case ('prompt-options') {
          <div class="demo-options">
            @for (group of resolvedView.groups; track group.category.id) {
              <section class="demo-option-group" [attr.data-prompt-category-id]="group.category.id">
                <h4 class="component-assistant__option-category-title">
                  {{ group.category.label }}
                </h4>
                <div class="demo-option-list">
                  @for (option of group.options; track option.id) {
                    <button
                      type="button"
                      [attr.data-prompt-option-id]="option.id"
                      (click)="selectOption(option.id)"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              </section>
            }
          </div>
        }
        @case ('component-preview') {
          <div class="demo-preview" [attr.data-component-preview-id]="resolvedView.previewId">
            <app-component-assistant-preview [previewId]="resolvedView.previewId" />
          </div>
        }
      }
    } @else {
      <span>Unsupported component content.</span>
    }
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .demo-options {
      display: grid;
      gap: 0.85rem;
      margin-top: 0.65rem;
    }
    .demo-option-group {
      display: grid;
      gap: 0.4rem;
    }
    .demo-option-group h4 {
      color: var(--tng-semantic-foreground-secondary);
      font-size: 0.72rem;
      margin: 0;
    }
    .demo-option-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }
    .demo-option-list button {
      background: var(--tng-semantic-background-base);
      border: 1px solid var(--tng-semantic-border-subtle);
      border-radius: 0.65rem;
      color: inherit;
      cursor: pointer;
      font: inherit;
      padding: 0.45rem 0.65rem;
      text-align: left;
    }
    .demo-option-list button:hover {
      border-color: var(--tng-semantic-accent-brand);
    }
    .demo-option-list button:focus-visible {
      outline: 2px solid var(--tng-semantic-accent-brand);
      outline-offset: 2px;
    }
    .demo-preview {
      border-top: 1px solid var(--tng-semantic-border-subtle);
      margin-top: 0.75rem;
      min-width: 0;
      padding-top: 0.75rem;
    }
  `,
})
class AiChatLiveDemoPartComponent {
  protected readonly context = inject(TNG_AI_MESSAGE_PART_CONTEXT);
  protected readonly view = computed(() => {
    const part = this.context.part();
    return part.type === 'extension' ? resolveComponentAssistantExtension(part) : undefined;
  });

  protected selectOption(optionId: string): void {
    this.context.emitAction({ name: 'select-option', value: optionId });
  }
}

@Component({
  selector: 'app-ai-chat-live-demo',
  imports: [TngAiChatComponent],
  templateUrl: './ai-chat-live-demo.component.html',
  styleUrl: './ai-chat-live-demo.component.css',
})
export class AiChatLiveDemoComponent implements OnDestroy {
  protected readonly messages = signal<readonly TngAiMessage[]>([]);
  protected readonly running = signal(false);
  protected readonly canRetry = signal(false);
  protected readonly statusMessage = signal('Ready. Type “hi” to see component options.');
  protected readonly historyLoading = signal(false);
  protected readonly historyExhausted = signal(false);
  protected readonly partRenderers: readonly TngAiMessagePartRenderer[] = [
    {
      match: { type: 'extension', name: 'tailng.dev/prompt-options' },
      component: AiChatLiveDemoPartComponent,
    },
    {
      match: { type: 'extension', name: 'tailng.dev/component-preview' },
      component: AiChatLiveDemoPartComponent,
    },
  ];

  private readonly store = new TngAiChatStore();
  private readonly reducer = new TngAgUiReducer(this.store, { profile: 'required-chat' });
  private readonly history = new TngAiHistoryController(this.store, createHistorySource(), {
    pageSize: 2,
    maxPageSize: 2,
  });
  private readonly streamTimers = new Set<ReturnType<typeof setTimeout>>();
  private runSequence = 0;
  private messageSequence = 0;
  private currentRunId: string | undefined;
  private currentAssistantId: string | undefined;
  private lastRoute: ComponentAssistantRoute = { kind: 'fallback' };
  private destroyed = false;

  public constructor() {
    this.store.upsertThread({ id: threadId, title: 'TailNG component assistant' });
    for (const entry of initialMessages) {
      this.store.upsertMessage(entry);
    }
    this.refreshMessages();
  }

  protected onMessageSubmit(event: TngAiChatSubmitEvent): void {
    if (!this.running()) {
      this.submitPrompt(event.text, routeComponentAssistantPrompt(event.text));
    }
  }

  protected onPartAction(event: TngAiChatPartActionEvent): void {
    if (event.action.name !== 'select-option' || typeof event.action.value !== 'string') {
      return;
    }
    this.selectOption(event.action.value);
  }

  protected retry(): void {
    if (!this.running()) {
      this.startRun(this.lastRoute);
    }
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

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.clearStreamTimers();
    this.history.dispose();
    this.store.dispose();
  }

  private selectOption(optionId: string): void {
    if (this.running()) {
      return;
    }
    const option = componentAssistantOption(optionId);
    if (option === undefined) {
      this.statusMessage.set('That component option is unavailable.');
      return;
    }
    this.submitPrompt(option.prompt, { kind: 'preview', option });
  }

  private submitPrompt(prompt: string, route: ComponentAssistantRoute): void {
    this.messageSequence += 1;
    this.store.upsertMessage(
      message(`user-${this.messageSequence}`, 'user', prompt, 1000 + this.messageSequence),
    );
    this.lastRoute = route;
    this.refreshMessages();
    this.startRun(route);
  }

  private startRun(route: ComponentAssistantRoute): void {
    this.clearStreamTimers();
    this.runSequence += 1;
    const runId = `component-run-${this.runSequence}`;
    const assistantId = `component-assistant-${this.runSequence}`;
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
      name: 'TailNG component assistant',
    });

    if (route.kind === 'options') {
      this.scheduleOptions(runId, assistantId);
    } else if (route.kind === 'preview') {
      this.schedulePreview(runId, assistantId, route);
    } else {
      this.scheduleFallback(runId, assistantId);
    }
  }

  private scheduleOptions(runId: string, assistantId: string): void {
    this.schedule(1, () => this.appendText(assistantId, 'Hello! '));
    this.schedule(streamStepMs, () =>
      this.appendText(assistantId, 'Choose a TailNG component to render.'),
    );
    this.schedule(streamStepMs * 2, () => {
      this.appendPart(assistantId, createPromptOptionsExtension(`options-${this.runSequence}`));
      this.statusMessage.set(`${COMPONENT_ASSISTANT_OPTIONS.length} component options available.`);
    });
    this.schedule(streamStepMs * 3, () => this.finishRun(runId, assistantId));
  }

  private scheduleFallback(runId: string, assistantId: string): void {
    this.schedule(1, () => this.appendText(assistantId, 'I can render a curated TailNG demo. '));
    this.schedule(streamStepMs, () =>
      this.appendText(assistantId, 'Type “hi” to see the supported component prompts.'),
    );
    this.schedule(streamStepMs * 2, () => this.finishRun(runId, assistantId));
  }

  private schedulePreview(
    runId: string,
    assistantId: string,
    route: Extract<ComponentAssistantRoute, { kind: 'preview' }>,
  ): void {
    const callId = `render-component-${this.runSequence}`;
    this.schedule(1, () => this.appendText(assistantId, route.option.assistantIntroduction));
    this.schedule(streamStepMs, () => this.startTool(assistantId, callId, route.option.previewId));
    this.schedule(streamStepMs * 2, () => this.runTool(callId));
    this.schedule(streamStepMs * 3, () =>
      this.completeTool(assistantId, callId, route.option.previewId),
    );
    this.schedule(streamStepMs * 4, () => this.finishRun(runId, assistantId));
  }

  private appendText(assistantId: string, delta: string): void {
    this.applyEvent({ type: 'TEXT_MESSAGE_CONTENT', messageId: assistantId, delta });
  }

  private appendPart(assistantId: string, part: TngAiMessagePart): void {
    this.store.updateMessage(assistantId, (current) =>
      current.parts.some((candidate) => candidate.id === part.id)
        ? current
        : { ...current, parts: [...current.parts, part] },
    );
    this.refreshMessages();
  }

  private startTool(assistantId: string, callId: string, previewId: string): void {
    this.applyEvent({
      type: 'TOOL_CALL_START',
      toolCallId: callId,
      toolCallName: 'render_component',
      parentMessageId: assistantId,
    });
    this.applyEvent({
      type: 'TOOL_CALL_ARGS',
      toolCallId: callId,
      delta: JSON.stringify({ previewId }),
    });
  }

  private runTool(callId: string): void {
    this.applyEvent({ type: 'TOOL_CALL_END', toolCallId: callId });
    this.statusMessage.set('Component renderer is validating the request.');
  }

  private completeTool(
    assistantId: string,
    callId: string,
    previewId: Extract<ComponentAssistantRoute, { kind: 'preview' }>['option']['previewId'],
  ): void {
    this.applyEvent({
      type: 'TOOL_CALL_RESULT',
      messageId: `tool-result-${this.runSequence}`,
      toolCallId: callId,
      content: JSON.stringify({ rendered: previewId }),
    });
    const assistant = this.store.snapshot().messages.get(assistantId);
    const tool = assistant?.parts.find(
      (part): part is TngAiToolCallPart => part.type === 'tool-call' && part.toolCallId === callId,
    );
    if (assistant !== undefined && tool !== undefined) {
      const completed = transitionTngAiToolCall(assistant, tool.id, 'complete');
      if (completed.ok) {
        this.store.upsertMessage({
          ...completed.value,
          parts: [
            ...completed.value.parts,
            createComponentPreviewExtension(`preview-${this.runSequence}`, previewId),
          ],
        });
      }
    }
    this.statusMessage.set(
      `${componentAssistantOption(previewId)?.label ?? 'Component'} rendered.`,
    );
    this.refreshMessages();
  }

  private finishRun(runId: string, assistantId: string): void {
    this.applyEvent({ type: 'TEXT_MESSAGE_END', messageId: assistantId });
    this.applyEvent({ type: 'RUN_FINISHED', threadId, runId });
    this.running.set(false);
    this.canRetry.set(false);
    if (!this.statusMessage().includes('rendered') && !this.statusMessage().includes('options')) {
      this.statusMessage.set('Response complete.');
    }
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
