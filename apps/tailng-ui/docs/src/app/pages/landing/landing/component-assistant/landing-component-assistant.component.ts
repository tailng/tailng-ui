import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  signal,
  viewChild,
  type AfterRenderRef,
  type AfterViewInit,
  type ElementRef,
  type OnDestroy,
} from '@angular/core';
import {
  completeTngAiTextPart,
  transitionTngAiToolCall,
  TngAiChatStore,
  TngAiHistoryController,
  type TngAiExtensionPart,
  type TngAiHistorySource,
  type TngAiMessage,
  type TngAiMessagePart,
  type TngAiTextPart,
  type TngAiToolCallPart,
} from '@tailng-ui/ai';
import { TngAgUiReducer } from '@tailng-ui/ai/ag-ui';
import { TngButtonComponent, TngTextareaComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  addComponentAssistantUnseenMessage,
  componentAssistantIsNearBottom,
  componentAssistantUnseenLabel,
} from '../../../../shared/demos/component-assistant/component-assistant-scroll';
import {
  COMPONENT_ASSISTANT_OPTIONS,
  componentAssistantOption,
  routeComponentAssistantPrompt,
  type ComponentAssistantRoute,
} from '../../../../shared/demos/component-assistant/component-assistant.catalog';
import {
  createComponentPreviewExtension,
  createPromptOptionsExtension,
  resolveComponentAssistantExtension,
  type ComponentAssistantExtensionView,
} from '../../../../shared/demos/component-assistant/component-assistant.extensions';
import { ComponentAssistantPreviewComponent } from '../../../../shared/demos/component-assistant/component-assistant.previews';

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

type ScrollRefreshReason = 'content' | 'history' | 'initial' | 'resize';

type HistoryScrollAnchor = Readonly<{
  scrollHeight: number;
  scrollTop: number;
}>;

@Component({
  selector: 'app-landing-component-assistant',
  imports: [TngButtonComponent, TngTextareaComponent, TngIcon, ComponentAssistantPreviewComponent],
  templateUrl: './landing-component-assistant.component.html',
  styleUrl: './landing-component-assistant.component.css',
})
export class LandingComponentAssistantComponent implements AfterViewInit, OnDestroy {
  protected readonly draft = signal('');
  protected readonly messages = signal<readonly TngAiMessage[]>([]);
  protected readonly running = signal(false);
  protected readonly canRetry = signal(false);
  protected readonly statusMessage = signal('Ready. Type “hi” to see component options.');
  protected readonly historyLoading = signal(false);
  protected readonly historyExhausted = signal(false);
  protected readonly following = signal(true);
  protected readonly unseenMessageIds = signal<ReadonlySet<string>>(new Set());
  protected readonly canSend = computed(() => this.draft().trim().length > 0 && !this.running());
  protected readonly showLatest = computed(
    () => !this.following() && this.unseenMessageIds().size > 0,
  );
  protected readonly latestLabel = computed(() =>
    componentAssistantUnseenLabel(this.unseenMessageIds().size),
  );

  private readonly transcriptRef = viewChild<ElementRef<HTMLOListElement>>('transcript');
  private readonly injector = inject(Injector);

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
  private scrollFrameId: number | undefined;
  private pendingRenderRef: AfterRenderRef | undefined;
  private readonly programmaticScrollTops = new Set<number>();
  private resumeScrollGuard = false;
  private resumeGuardFrameId: number | undefined;
  private historyScrollAnchor: HistoryScrollAnchor | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private observedRows = new Set<Element>();
  private destroyed = false;

  public constructor() {
    this.store.upsertThread({ id: threadId, title: 'TailNG component assistant' });
    for (const entry of initialMessages) {
      this.store.upsertMessage(entry);
    }
    this.refreshMessages();
  }

  public ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.scheduleScrollReconciliation('initial');
  }

  protected submit(): void {
    const prompt = this.draft().trim();
    if (prompt.length === 0 || this.running()) {
      return;
    }
    this.draft.set('');
    this.submitPrompt(prompt, routeComponentAssistantPrompt(prompt));
  }

  protected selectOption(optionId: string): void {
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

  protected retry(): void {
    if (!this.running()) {
      this.resumeFollowing();
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
    this.captureHistoryScrollAnchor();
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
    this.refreshMessages('history');
  }

  protected onTranscriptScroll(): void {
    const transcript = this.transcriptElement();
    if (transcript === undefined) {
      return;
    }
    if (this.resumeScrollGuard) {
      this.scheduleScrollReconciliation('resize');
      return;
    }
    const matchingProgrammaticTop = [...this.programmaticScrollTops].find(
      (top) => Math.abs(transcript.scrollTop - top) <= 1,
    );
    if (this.following() && matchingProgrammaticTop !== undefined) {
      this.programmaticScrollTops.delete(matchingProgrammaticTop);
      this.scheduleScrollReconciliation('resize');
      return;
    }
    this.programmaticScrollTops.clear();
    const nextFollowing = componentAssistantIsNearBottom(transcript);
    this.following.set(nextFollowing);
    if (nextFollowing) {
      this.clearUnseenMessages();
    }
  }

  protected jumpToLatest(): void {
    this.resumeFollowing();
    this.statusMessage.set('Latest messages visible.');
    this.scheduleScrollReconciliation('content');
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

  protected toolResultFor(part: TngAiMessagePart): string {
    if (part.type !== 'tool-result') {
      return '';
    }
    return part.text ?? (part.output === undefined ? '' : JSON.stringify(part.output, null, 2));
  }

  protected jsonFor(value: unknown): string {
    return value === undefined ? '' : JSON.stringify(value, null, 2);
  }

  protected extensionView(part: TngAiExtensionPart): ComponentAssistantExtensionView | undefined {
    return resolveComponentAssistantExtension(part);
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.cancelScrollFrame();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observedRows.clear();
    this.clearUnseenMessages();
    this.clearStreamTimers();
    this.history.dispose();
    this.store.dispose();
  }

  private submitPrompt(prompt: string, route: ComponentAssistantRoute): void {
    this.resumeFollowing();
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

  private refreshMessages(reason: ScrollRefreshReason = 'content'): void {
    const nextMessages = [...this.store.selectMessages(threadId)];
    if (reason === 'content' && !this.following()) {
      const latest = nextMessages.at(-1);
      if (latest !== undefined) {
        const currentUnseen = this.unseenMessageIds();
        const nextUnseen = addComponentAssistantUnseenMessage(currentUnseen, latest.id);
        if (nextUnseen !== currentUnseen) {
          this.unseenMessageIds.set(nextUnseen);
          const count = nextUnseen.size;
          this.statusMessage.set(`${count} new ${count === 1 ? 'message' : 'messages'} available.`);
        }
      }
    }
    this.messages.set(nextMessages);
    this.scheduleScrollReconciliation(reason);
  }

  private resumeFollowing(): void {
    this.programmaticScrollTops.clear();
    this.resumeScrollGuard = true;
    this.following.set(true);
    this.clearUnseenMessages();
  }

  private clearUnseenMessages(): void {
    if (this.unseenMessageIds().size > 0) {
      this.unseenMessageIds.set(new Set());
    }
  }

  private captureHistoryScrollAnchor(): void {
    const transcript = this.transcriptElement();
    if (transcript === undefined) {
      return;
    }
    this.historyScrollAnchor = {
      scrollHeight: transcript.scrollHeight,
      scrollTop: transcript.scrollTop,
    };
    this.programmaticScrollTops.clear();
    this.following.set(false);
  }

  private scheduleScrollReconciliation(reason: ScrollRefreshReason): void {
    if (this.destroyed) {
      return;
    }
    if (reason === 'history' && this.historyScrollAnchor === undefined) {
      this.captureHistoryScrollAnchor();
    }
    if (reason === 'resize') {
      this.scheduleScrollFrame();
      return;
    }
    if (this.pendingRenderRef !== undefined) {
      return;
    }
    this.pendingRenderRef = afterNextRender(
      () => {
        this.pendingRenderRef = undefined;
        this.scheduleScrollFrame();
      },
      { injector: this.injector },
    );
  }

  private scheduleScrollFrame(): void {
    if (this.destroyed || this.scrollFrameId !== undefined) {
      return;
    }
    const transcript = this.transcriptElement();
    const ownerWindow = transcript?.ownerDocument.defaultView;
    if (ownerWindow === null || ownerWindow === undefined) {
      return;
    }
    this.scrollFrameId = ownerWindow.requestAnimationFrame(() => {
      this.scrollFrameId = undefined;
      this.reconcileTranscriptScroll();
    });
  }

  private reconcileTranscriptScroll(): void {
    if (this.destroyed) {
      return;
    }
    const transcript = this.transcriptElement();
    if (transcript === undefined) {
      return;
    }
    this.syncObservedRows(transcript);
    const historyAnchor = this.historyScrollAnchor;
    if (historyAnchor !== undefined) {
      this.historyScrollAnchor = undefined;
      const prependedHeight = Math.max(0, transcript.scrollHeight - historyAnchor.scrollHeight);
      transcript.scrollTop = historyAnchor.scrollTop + prependedHeight;
      this.following.set(componentAssistantIsNearBottom(transcript));
      return;
    }
    if (this.following()) {
      this.scrollToEnd(transcript);
      this.clearUnseenMessages();
    }
  }

  private scrollToEnd(transcript: HTMLOListElement): void {
    const target = Math.max(0, transcript.scrollHeight - transcript.clientHeight);
    this.programmaticScrollTops.add(target);
    if (this.programmaticScrollTops.size > 8) {
      const oldestTarget = this.programmaticScrollTops.values().next().value;
      if (oldestTarget !== undefined) {
        this.programmaticScrollTops.delete(oldestTarget);
      }
    }
    if (typeof transcript.scrollTo === 'function') {
      transcript.scrollTo({ top: transcript.scrollHeight, behavior: 'auto' });
    } else {
      transcript.scrollTop = transcript.scrollHeight;
    }
    this.scheduleResumeGuardRelease(transcript.ownerDocument.defaultView);
  }

  private scheduleResumeGuardRelease(ownerWindow: Window | null): void {
    if (!this.resumeScrollGuard || ownerWindow === null || this.resumeGuardFrameId !== undefined) {
      return;
    }
    this.resumeGuardFrameId = ownerWindow.requestAnimationFrame(() => {
      this.resumeGuardFrameId = undefined;
      this.resumeScrollGuard = false;
    });
  }

  private setupResizeObserver(): void {
    const transcript = this.transcriptElement();
    const ownerWindow = transcript?.ownerDocument.defaultView;
    const resizeObserverConstructor = ownerWindow?.ResizeObserver;
    if (transcript === undefined || resizeObserverConstructor === undefined) {
      return;
    }
    this.resizeObserver = new resizeObserverConstructor(() => {
      this.scheduleScrollReconciliation('resize');
    });
    this.syncObservedRows(transcript);
  }

  private syncObservedRows(transcript: HTMLOListElement): void {
    const observer = this.resizeObserver;
    if (observer === undefined) {
      return;
    }
    const nextRows = new Set<Element>(
      Array.from(transcript.querySelectorAll('.component-assistant__message')),
    );
    for (const row of this.observedRows) {
      if (!nextRows.has(row)) {
        observer.unobserve(row);
      }
    }
    for (const row of nextRows) {
      if (!this.observedRows.has(row)) {
        observer.observe(row);
      }
    }
    this.observedRows = nextRows;
  }

  private cancelScrollFrame(): void {
    this.pendingRenderRef?.destroy();
    this.pendingRenderRef = undefined;
    const transcript = this.transcriptElement();
    const ownerWindow = transcript?.ownerDocument.defaultView;
    if (ownerWindow !== null && ownerWindow !== undefined) {
      this.cancelOwnerFrame(ownerWindow, this.scrollFrameId);
      this.cancelOwnerFrame(ownerWindow, this.resumeGuardFrameId);
    }
    this.scrollFrameId = undefined;
    this.resumeGuardFrameId = undefined;
    this.resumeScrollGuard = false;
    this.programmaticScrollTops.clear();
  }

  private cancelOwnerFrame(ownerWindow: Window, frameId: number | undefined): void {
    if (frameId !== undefined) {
      ownerWindow.cancelAnimationFrame(frameId);
    }
  }

  private transcriptElement(): HTMLOListElement | undefined {
    return this.transcriptRef()?.nativeElement;
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
