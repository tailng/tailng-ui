import { NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  viewChild,
  type AfterRenderRef,
  type AfterViewInit,
  type DoCheck,
  type ElementRef,
  type OnDestroy,
} from '@angular/core';
import { TngAiChatPartOutletComponent } from './tng-ai-chat-part-outlet.component';
import type {
  TngAiChatHeaderComponent,
  TngAiChatLoadEarlierRequest,
  TngAiChatPartActionEvent,
  TngAiChatRetryRequest,
  TngAiChatScrollState,
  TngAiChatSubmitEvent,
  TngAiMessagePartRenderer,
} from './tng-ai-chat.types';
import {
  TNG_AI_CHAT_HEADER_CONTEXT,
  TNG_AI_MESSAGE_PART_RENDERERS,
  type TngAiChatHeaderContext,
} from './tng-ai-chat.types';
import type { TngAiMessagePart } from '../core/message-part.types';
import type { TngAiMessage } from '../core/message.types';

@Component({
  selector: 'tng-ai-chat',
  imports: [NgComponentOutlet, TngAiChatPartOutletComponent],
  templateUrl: './tng-ai-chat.component.html',
  styleUrl: './tng-ai-chat.component.css',
})
export class TngAiChatComponent implements AfterViewInit, DoCheck, OnDestroy {
  private readonly injectedPartRenderers =
    inject(TNG_AI_MESSAGE_PART_RENDERERS, { optional: true }) ?? [];
  private readonly transcriptRef = viewChild<ElementRef<HTMLOListElement>>('transcript');
  private readonly injector = inject(Injector);

  public readonly messages = input.required<readonly TngAiMessage[]>();
  public readonly title = input<string>('AI Assistant');
  public readonly subtitle = input<string | null>(null);
  public readonly assistantLabel = input<string>('Assistant');
  public readonly protocolLabel = input<string | null>(null);
  public readonly status = input<string>('Ready');
  public readonly busy = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly canStop = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly canRetry = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly hasEarlierMessages = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly loadingEarlierMessages = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly headerComponent = input<TngAiChatHeaderComponent | null>(null);
  public readonly partRenderers = input<readonly TngAiMessagePartRenderer[]>([]);
  public readonly renderedMessageLimit = input<number>(200);
  public readonly nearBottomThreshold = input<number>(48);
  public readonly draft = model<string>('');

  public readonly messageSubmit = output<TngAiChatSubmitEvent>();
  public readonly stopRequest = output<void>();
  public readonly retryRequest = output<TngAiChatRetryRequest>();
  public readonly loadEarlierRequest = output<TngAiChatLoadEarlierRequest>();
  public readonly partAction = output<TngAiChatPartActionEvent>();
  public readonly scrollStateChange = output<TngAiChatScrollState>();

  protected readonly headerContext: TngAiChatHeaderContext = {
    assistantLabel: this.assistantLabel,
    busy: this.busy,
    protocolLabel: this.protocolLabel,
    status: this.status,
    subtitle: this.subtitle,
    title: this.title,
  };
  protected readonly headerInjector = Injector.create({
    providers: [{ provide: TNG_AI_CHAT_HEADER_CONTEXT, useValue: this.headerContext }],
    parent: inject(Injector),
  });
  protected readonly canSubmit = computed(
    () => this.draft().trim().length > 0 && !this.busy() && !this.disabled() && !this.readonly(),
  );
  protected readonly following = signal(true);
  protected readonly unseenMessageIds = signal<ReadonlySet<string>>(new Set());
  protected readonly visibleMessages = computed(() => {
    const messages = this.messages();
    const limit = Math.max(1, Math.floor(this.renderedMessageLimit()));
    return messages.length <= limit ? messages : messages.slice(-limit);
  });
  protected readonly showLatest = computed(
    () => !this.following() && this.unseenMessageIds().size > 0,
  );
  protected readonly latestLabel = computed(() => {
    const count = this.unseenMessageIds().size;
    return `${count} new ${count === 1 ? 'message' : 'messages'} · Jump to latest`;
  });

  private previousMessages: readonly TngAiMessage[] | undefined;
  private previousFirstMessageId: string | undefined;
  private previousLastMessage: TngAiMessage | undefined;
  private historyAnchor: { scrollHeight: number; scrollTop: number } | undefined;
  private renderRef: AfterRenderRef | undefined;
  private scrollFrameId: number | undefined;
  private resumeGuardFrameId: number | undefined;
  private resizeObserver: ResizeObserver | undefined;
  private observedRows = new Set<Element>();
  private resumeScrollGuard = false;
  private destroyed = false;

  public ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.scheduleScrollReconciliation();
  }

  public ngDoCheck(): void {
    const messages = this.messages();
    if (messages === this.previousMessages) {
      return;
    }
    const firstMessageId = messages.at(0)?.id;
    const lastMessage = messages.at(-1);
    this.reconcileMessageChange(firstMessageId, lastMessage);

    this.previousMessages = messages;
    this.previousFirstMessageId = firstMessageId;
    this.previousLastMessage = lastMessage;
  }

  protected authorLabel(message: TngAiMessage): string {
    if (message.author?.name !== undefined) {
      return message.author.name;
    }
    if (message.role === 'user') {
      return 'You';
    }
    if (message.role === 'assistant') {
      return this.assistantLabel();
    }
    return message.role.charAt(0).toUpperCase() + message.role.slice(1);
  }

  protected rendererFor(part: TngAiMessagePart): TngAiMessagePartRenderer | undefined {
    return (
      this.partRenderers().find((renderer) => this.rendererMatches(renderer, part)) ??
      this.injectedPartRenderers.find((renderer) => this.rendererMatches(renderer, part))
    );
  }

  protected emitPartAction(event: TngAiChatPartActionEvent): void {
    this.resumeFollowingForIntent();
    this.partAction.emit(event);
  }

  protected updateDraft(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLTextAreaElement) {
      this.draft.set(target.value);
    }
  }

  protected onComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
      return;
    }
    event.preventDefault();
    this.submitDraft();
  }

  protected submitDraft(): void {
    if (!this.canSubmit()) {
      return;
    }
    const text = this.draft().trim();
    this.resumeFollowingForIntent();
    this.messageSubmit.emit({ text });
    this.draft.set('');
  }

  protected requestStop(): void {
    if (this.busy() && this.canStop() && !this.disabled()) {
      this.stopRequest.emit();
    }
  }

  protected requestRetry(): void {
    if (!this.canRetry() || this.disabled() || this.readonly()) {
      return;
    }
    this.resumeFollowingForIntent();
    this.retryRequest.emit({ messageId: this.messages().at(-1)?.id });
  }

  protected requestEarlierMessages(): void {
    if (
      !this.hasEarlierMessages() ||
      this.loadingEarlierMessages() ||
      this.disabled() ||
      this.readonly()
    ) {
      return;
    }
    const transcript = this.transcriptElement();
    if (transcript !== undefined) {
      this.historyAnchor = {
        scrollHeight: transcript.scrollHeight,
        scrollTop: transcript.scrollTop,
      };
      this.following.set(false);
    }
    this.loadEarlierRequest.emit({ beforeMessageId: this.messages().at(0)?.id });
  }

  protected onTranscriptScroll(): void {
    const transcript = this.transcriptElement();
    if (transcript === undefined) {
      return;
    }
    if (this.resumeScrollGuard) {
      this.scheduleScrollReconciliation();
      return;
    }
    const nearBottom = this.isNearBottom(transcript);
    this.following.set(nearBottom);
    if (nearBottom) {
      this.unseenMessageIds.set(new Set());
    }
    this.emitScrollState(nearBottom);
  }

  protected jumpToLatest(): void {
    this.following.set(true);
    this.unseenMessageIds.set(new Set());
    const transcript = this.transcriptElement();
    if (transcript !== undefined) {
      this.scrollToEnd(transcript);
    }
    this.emitScrollState(true);
  }

  protected resultText(part: Extract<TngAiMessagePart, { type: 'tool-result' }>): string {
    if (part.text !== undefined) {
      return part.text;
    }
    return part.output === undefined ? '' : JSON.stringify(part.output, null, 2);
  }

  private rendererMatches(renderer: TngAiMessagePartRenderer, part: TngAiMessagePart): boolean {
    if (renderer.match.type !== part.type) {
      return false;
    }
    if (renderer.match.name === undefined) {
      return true;
    }
    return this.partName(part) === renderer.match.name;
  }

  private partName(part: TngAiMessagePart): string | undefined {
    if (
      part.type === 'activity' ||
      part.type === 'data' ||
      part.type === 'extension' ||
      part.type === 'tool-call'
    ) {
      return part.name;
    }
    return undefined;
  }

  private reconcileMessageChange(
    firstMessageId: string | undefined,
    lastMessage: TngAiMessage | undefined,
  ): void {
    if (this.restoreHistoryAnchor(firstMessageId)) {
      return;
    }
    if (this.recordUnseenMessage(lastMessage)) {
      return;
    }
    if (this.following()) {
      this.scheduleScrollReconciliation();
    }
  }

  private restoreHistoryAnchor(firstMessageId: string | undefined): boolean {
    const anchor = this.historyAnchor;
    const transcript = this.transcriptElement();
    if (
      anchor === undefined ||
      firstMessageId === undefined ||
      firstMessageId === this.previousFirstMessageId ||
      transcript === undefined
    ) {
      return false;
    }
    this.historyAnchor = undefined;
    transcript.scrollTop =
      anchor.scrollTop + Math.max(0, transcript.scrollHeight - anchor.scrollHeight);
    this.following.set(this.isNearBottom(transcript));
    this.emitScrollState(this.following());
    return true;
  }

  private recordUnseenMessage(lastMessage: TngAiMessage | undefined): boolean {
    if (
      this.following() ||
      this.previousLastMessage === undefined ||
      lastMessage === undefined ||
      lastMessage === this.previousLastMessage
    ) {
      return false;
    }
    const next = new Set(this.unseenMessageIds());
    next.add(lastMessage.id);
    this.unseenMessageIds.set(next);
    this.emitScrollState(false);
    return true;
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.renderRef?.destroy();
    this.renderRef = undefined;
    const transcript = this.transcriptElement();
    const ownerWindow = transcript?.ownerDocument.defaultView;
    if (ownerWindow !== null && ownerWindow !== undefined) {
      this.cancelOwnerFrame(ownerWindow, this.scrollFrameId);
      this.cancelOwnerFrame(ownerWindow, this.resumeGuardFrameId);
    }
    this.scrollFrameId = undefined;
    this.resumeGuardFrameId = undefined;
    this.resumeScrollGuard = false;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.observedRows.clear();
  }

  private cancelOwnerFrame(ownerWindow: Window, frameId: number | undefined): void {
    if (frameId !== undefined) {
      ownerWindow.cancelAnimationFrame(frameId);
    }
  }

  private scheduleScrollReconciliation(): void {
    if (this.destroyed || this.renderRef !== undefined) {
      return;
    }
    this.renderRef = afterNextRender(
      () => {
        this.renderRef = undefined;
        const transcript = this.transcriptElement();
        const ownerWindow = transcript?.ownerDocument.defaultView;
        if (transcript === undefined || ownerWindow === null || ownerWindow === undefined) {
          return;
        }
        this.scheduleScrollFrame(transcript, ownerWindow);
      },
      { injector: this.injector },
    );
  }

  private setupResizeObserver(): void {
    const transcript = this.transcriptElement();
    const ownerWindow = transcript?.ownerDocument.defaultView;
    const observerType = ownerWindow?.ResizeObserver;
    if (
      transcript === undefined ||
      ownerWindow === null ||
      ownerWindow === undefined ||
      observerType === undefined
    ) {
      return;
    }
    const resizeOwnerWindow: Window = ownerWindow;
    this.resizeObserver = new observerType(() =>
      this.scheduleScrollFrame(transcript, resizeOwnerWindow),
    );
    this.syncObservedRows(transcript);
  }

  private scheduleScrollFrame(transcript: HTMLOListElement, ownerWindow: Window): void {
    if (this.destroyed || this.scrollFrameId !== undefined) {
      return;
    }
    this.scrollFrameId = ownerWindow.requestAnimationFrame(() => {
      this.scrollFrameId = undefined;
      this.syncObservedRows(transcript);
      if (this.following()) {
        this.scrollToEnd(transcript);
        this.unseenMessageIds.set(new Set());
        this.emitScrollState(true);
      }
    });
  }

  private syncObservedRows(transcript: HTMLOListElement): void {
    const observer = this.resizeObserver;
    if (observer === undefined) {
      return;
    }
    const nextRows = new Set<Element>(
      Array.from(transcript.querySelectorAll('[data-slot="ai-chat-message"]')),
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

  private scrollToEnd(transcript: HTMLOListElement): void {
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

  private isNearBottom(transcript: HTMLOListElement): boolean {
    const remaining = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight;
    return remaining <= Math.max(0, this.nearBottomThreshold());
  }

  private emitScrollState(nearBottom: boolean): void {
    this.scrollStateChange.emit({
      following: this.following(),
      nearBottom,
      unseenCount: this.unseenMessageIds().size,
    });
  }

  private resumeFollowingForIntent(): void {
    this.resumeScrollGuard = true;
    this.following.set(true);
    this.unseenMessageIds.set(new Set());
    this.scheduleScrollReconciliation();
  }

  private transcriptElement(): HTMLOListElement | undefined {
    return this.transcriptRef()?.nativeElement;
  }
}
