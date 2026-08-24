import type { OnDestroy, OnInit } from '@angular/core';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  computeOverlayPosition,
  createCssOverlayPresenceDriver,
  createOverlayOpenCloseDelayController,
  createOverlayPresenceController,
  createTngIdFactory,
  normalizeOverlayOpenCloseDelay,
  type TngOverlayRect,
  type TngOverlayPresenceState,
} from '@tailng-ui/cdk';
import type { TngOverlayDismissReason } from '@tailng-ui/cdk/overlay';
import { tngPrimitiveOverlayRuntime } from '../tng-overlay-runtime';

export type TngTooltipSide = 'bottom' | 'left' | 'right' | 'top';

type OptionalBooleanInput = boolean | null | string | undefined;

const createTooltipContentId = createTngIdFactory('tng-tooltip-content');
const createTooltipId = createTngIdFactory('tng-tooltip');
const tooltipCollisionPadding = 8;
const tooltipSideOffset = 8;
const tooltipGlobalDocument = typeof document === 'undefined' ? null : document;

type TngTooltipKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function normalizeRect(rect: DOMRect | ClientRect): TngOverlayRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function resolveTooltipViewportRect(win: Window): TngOverlayRect {
  return {
    height: win.innerHeight || 0,
    left: 0,
    top: 0,
    width: win.innerWidth || 0,
  };
}

export function resolveTngTooltipAriaDescribedBy(
  open: boolean,
  tooltipId: string | null,
): string | null {
  if (!open) {
    return null;
  }

  return tooltipId === null || tooltipId.trim().length === 0 ? null : tooltipId;
}

export function resolveTngTooltipDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

export function resolveTngTooltipHidden(open: boolean): '' | null {
  return open ? null : '';
}

export function normalizeTngTooltipDelay(value: number): number {
  return normalizeOverlayOpenCloseDelay(value);
}

export function shouldCloseTngTooltipForKey(key: string): boolean {
  return key === 'Escape';
}

@Directive({
  selector: '[tngTooltip]',
  exportAs: 'tngTooltip',
})
export class TngTooltip implements OnDestroy, OnInit {
  private readonly generatedContentId = createTooltipContentId();
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly instanceId = createTooltipId();
  public readonly closeDelay = input<number>(60);
  public readonly defaultOpen = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, OptionalBooleanInput>(false, {
    transform: booleanAttribute,
  });
  public readonly openDelay = input<number>(120);
  public readonly openInput = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    alias: 'open',
    transform: normalizeOptionalBooleanInput,
  });
  public readonly side = input<TngTooltipSide>('top');

  public readonly openChange = output<boolean>();

  private readonly win = typeof window === 'undefined' ? null : window;
  private readonly uncontrolledOpen = signal(false);

  private animationFrameId: number | null = null;
  private contentElement: HTMLElement | null = null;
  private contentId: string | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private triggerElement: HTMLElement | null = null;
  private readonly openCloseDelayController = createOverlayOpenCloseDelayController({
    onStateChange: (nextOpen) => this.setOpenState(nextOpen),
  });
  private isOverlayLayerRegistered = false;

  private initialized = false;

  private readonly positionX = signal<number | null>(null);
  private readonly positionY = signal<number | null>(null);
  private readonly positionedSide = signal<TngTooltipSide>('top');

  private readonly syncDisabledState = effect(() => {
    if (this.disabled()) {
      this.openCloseDelayController.cancelAll();
      if (this.isOpen()) {
        this.setOpenState(false);
      }
    }
  });

  private readonly syncPositioning = effect(() => {
    if (!this.initialized) {
      return;
    }

    if (!this.isOpen()) {
      this.positionedSide.set(this.side());
      this.teardownRepositionListeners();
      return;
    }

    this.setupRepositionListeners();
    this.scheduleReposition();
  });

  private readonly syncOverlayLayer = effect(() => {
    if (!this.initialized) {
      return;
    }

    if (this.isOpen()) {
      this.registerOverlayLayer();
      return;
    }

    this.unregisterOverlayLayer();
  });

  private readonly syncSide = effect(() => {
    const requestedSide = this.side();
    if (!this.initialized || !this.isOpen()) {
      this.positionedSide.set(requestedSide);
      return;
    }

    this.scheduleReposition();
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip';

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngTooltipDataState(this.isOpen());
  }

  @HostBinding('attr.data-open')
  protected get dataOpenAttr(): 'false' | 'true' {
    return this.isOpen() ? 'true' : 'false';
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  public ngOnInit(): void {
    if (!this.isControlled()) {
      this.uncontrolledOpen.set(this.defaultOpen());
    }

    this.initialized = true;
    if (this.isOpen()) {
      this.setupRepositionListeners();
      this.scheduleReposition();
    }
  }

  public ngOnDestroy(): void {
    this.syncDisabledState.destroy();
    this.syncPositioning.destroy();
    this.syncOverlayLayer.destroy();
    this.syncSide.destroy();
    this.openCloseDelayController.destroy();
    this.unregisterOverlayLayer();
    this.clearAnimationFrame();
    this.teardownRepositionListeners();
  }

  public isOpen(): boolean {
    return this.openInput() ?? this.uncontrolledOpen();
  }

  public getContentId(): string | null {
    return this.contentId;
  }

  public resolveContentId(id: string | null): string {
    const candidate = id?.trim() ?? '';
    return candidate.length > 0 ? candidate : this.generatedContentId;
  }

  public getPositionedSide(): TngTooltipSide {
    return this.positionedSide();
  }

  public getPositionX(): number | null {
    return this.positionX();
  }

  public getPositionY(): number | null {
    return this.positionY();
  }

  public completeContentExit(): void {
    this.resetPosition();
  }

  public registerContent(content: HTMLElement, id: string | null): void {
    this.contentElement = content;
    this.contentId = id;
    if (this.resizeObserver !== null) {
      this.resizeObserver.observe(content);
    }
    if (this.isOpen()) {
      this.scheduleReposition();
    }
  }

  public unregisterContent(content: HTMLElement): void {
    if (this.resizeObserver !== null) {
      this.resizeObserver.unobserve(content);
    }

    if (this.contentElement === content) {
      this.contentElement = null;
      this.contentId = null;
    }
  }

  public registerTrigger(trigger: HTMLElement): void {
    this.triggerElement = trigger;
    if (this.resizeObserver !== null) {
      this.resizeObserver.observe(trigger);
    }
    if (this.isOpen()) {
      this.scheduleReposition();
    }
  }

  public unregisterTrigger(trigger: HTMLElement): void {
    if (this.resizeObserver !== null) {
      this.resizeObserver.unobserve(trigger);
    }

    if (this.triggerElement === trigger) {
      this.triggerElement = null;
    }
  }

  public onTriggerCloseIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.openCloseDelayController.requestClose(this.closeDelay());
  }

  public onTriggerOpenIntent(): void {
    if (this.disabled()) {
      return;
    }

    this.openCloseDelayController.requestOpen(this.openDelay());
  }

  public onTriggerKeydown(event: TngTooltipKeyboardEvent): void {
    if (this.disabled() || !shouldCloseTngTooltipForKey(event.key)) {
      return;
    }

    if (tooltipGlobalDocument === null) {
      event.preventDefault();
      this.openCloseDelayController.cancelAll();
      this.setOpenState(false);
    }
  }

  private clearAnimationFrame(): void {
    if (this.animationFrameId === null || this.win === null) {
      return;
    }

    this.win.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  private isControlled(): boolean {
    return this.openInput() !== undefined;
  }

  private reposition(): void {
    if (
      !this.isOpen() ||
      this.win === null ||
      this.triggerElement === null ||
      this.contentElement === null
    ) {
      return;
    }

    const result = computeOverlayPosition({
      anchorRect: normalizeRect(this.triggerElement.getBoundingClientRect()),
      collision: {
        flip: true,
        padding: tooltipCollisionPadding,
        shift: true,
      },
      offset: {
        side: tooltipSideOffset,
      },
      overlayRect: normalizeRect(this.contentElement.getBoundingClientRect()),
      placement: {
        align: 'center',
        side: this.side(),
      },
      viewportRect: resolveTooltipViewportRect(this.win),
    });

    this.positionX.set(result.x);
    this.positionY.set(result.y);
    this.positionedSide.set(result.side as TngTooltipSide);
  }

  private resetPosition(): void {
    this.positionX.set(null);
    this.positionY.set(null);
  }

  private scheduleReposition(): void {
    if (this.win === null || this.animationFrameId !== null) {
      return;
    }

    this.animationFrameId = this.win.requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.reposition();
    });
  }

  private setOpenState(nextOpen: boolean): void {
    if (this.isOpen() === nextOpen) {
      return;
    }

    if (!this.isControlled()) {
      this.uncontrolledOpen.set(nextOpen);
    }
    if (nextOpen) {
      this.scheduleReposition();
    }

    this.openChange.emit(nextOpen);
  }

  private shouldCloseFromEscape(): boolean {
    return this.isOpen();
  }

  private shouldCloseFromOutsidePointer(): boolean {
    return this.isOpen();
  }

  private registerOverlayLayer(): void {
    const hostElement = this.hostRef.nativeElement;
    tngPrimitiveOverlayRuntime.registerLayer({
      containsTarget: (target: unknown, path: readonly unknown[]): boolean => {
        if (target instanceof Node && hostElement.contains(target)) {
          return true;
        }

        return path.includes(hostElement);
      },
      dismissOnEscape: this.shouldCloseFromEscape(),
      dismissOnOutsidePointer: this.shouldCloseFromOutsidePointer(),
      id: this.instanceId,
      onDismiss: (reason: TngOverlayDismissReason): void => {
        if (reason === 'escape-key' && !this.shouldCloseFromEscape()) {
          return;
        }

        if (reason === 'outside-pointer' && !this.shouldCloseFromOutsidePointer()) {
          return;
        }

        this.openCloseDelayController.cancelAll();
        this.setOpenState(false);
      },
    });
    this.isOverlayLayerRegistered = true;
  }

  private unregisterOverlayLayer(): void {
    if (!this.isOverlayLayerRegistered) {
      return;
    }

    tngPrimitiveOverlayRuntime.unregisterLayer(this.instanceId);
    this.isOverlayLayerRegistered = false;
  }

  private setupRepositionListeners(): void {
    if (
      this.win === null ||
      this.removeResizeListener !== null ||
      this.removeScrollListener !== null
    ) {
      return;
    }

    const onResize = (): void => {
      this.scheduleReposition();
    };
    const onScroll = (): void => {
      this.openCloseDelayController.cancelAll();
      this.setOpenState(false);
    };

    this.win.addEventListener('resize', onResize);
    this.win.addEventListener('scroll', onScroll, true);
    this.removeResizeListener = (): void => {
      this.win?.removeEventListener('resize', onResize);
    };
    this.removeScrollListener = (): void => {
      this.win?.removeEventListener('scroll', onScroll, true);
    };

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleReposition();
    });
    if (this.triggerElement !== null) {
      this.resizeObserver.observe(this.triggerElement);
    }
    if (this.contentElement !== null) {
      this.resizeObserver.observe(this.contentElement);
    }
  }

  private teardownRepositionListeners(): void {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    this.removeResizeListener = null;
    this.removeScrollListener = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }
}

@Directive({
  selector: '[tngTooltipTrigger]',
  exportAs: 'tngTooltipTrigger',
})
export class TngTooltipTrigger implements OnDestroy, OnInit {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tooltip = inject(TngTooltip, { optional: true });

  public readonly describedBy = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    if (this.tooltip !== null) {
      return resolveTngTooltipAriaDescribedBy(this.tooltip.isOpen(), this.tooltip.getContentId());
    }

    return resolveTngTooltipAriaDescribedBy(this.open(), this.describedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    if (this.tooltip !== null) {
      return this.tooltip.disabled() ? '' : null;
    }

    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-trigger' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    if (this.tooltip !== null) {
      return resolveTngTooltipDataState(this.tooltip.isOpen());
    }

    return resolveTngTooltipDataState(this.open());
  }

  public ngOnInit(): void {
    this.tooltip?.registerTrigger(this.hostRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this.tooltip?.unregisterTrigger(this.hostRef.nativeElement);
  }

  @HostListener('blur')
  protected onBlur(): void {
    this.tooltip?.onTriggerCloseIntent();
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.tooltip?.onTriggerOpenIntent();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.tooltip?.onTriggerKeydown(event);
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    this.tooltip?.onTriggerCloseIntent();
  }

  @HostListener('mouseenter')
  protected onMouseEnter(): void {
    this.tooltip?.onTriggerOpenIntent();
  }
}

@Directive({
  selector: '[tngTooltipContent]',
  exportAs: 'tngTooltipContent',
})
export class TngTooltipContent implements OnDestroy, OnInit {
  private readonly generatedId = createTooltipContentId();
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tooltip = inject(TngTooltip, { optional: true });
  private resolvedId = '';

  public readonly id = input<string | null>(null);
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly side = input<TngTooltipSide>('top');

  private readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => [this.hostRef.nativeElement],
      windowRef: this.hostRef.nativeElement.ownerDocument.defaultView,
    }),
    onDismiss: () => this.tooltip?.completeContentExit(),
    onPresent: () => this.prepareForPresence(),
    onStateChange: (state) => {
      this.presenceState.set(state);
      this.applyPresenceState(state);
    },
  });
  private readonly syncPresence = effect(() => {
    this.presence.setOpen(this.tooltip?.isOpen() ?? this.open());
  });

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngTooltipSide {
    if (this.tooltip !== null) {
      return this.tooltip.getPositionedSide();
    }

    return this.side();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-content' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    if (this.tooltip !== null) {
      return resolveTngTooltipDataState(this.tooltip.isOpen());
    }

    return resolveTngTooltipDataState(this.open());
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.presenceState() === 'closed' ? '' : null;
  }

  @HostBinding('attr.data-presence')
  protected get dataPresenceAttr(): TngOverlayPresenceState {
    return this.presenceState();
  }

  @HostBinding('attr.data-tng-overlay-motion')
  protected readonly overlayMotionAttr = '';

  @HostBinding('attr.aria-hidden')
  protected get ariaHiddenAttr(): 'true' | null {
    return this.presenceState() === 'exiting' ? 'true' : null;
  }

  @HostBinding('attr.inert')
  protected get inertAttr(): '' | null {
    return this.presenceState() === 'exiting' ? '' : null;
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'tooltip' as const;

  @HostBinding('style.position')
  protected get positionStyle(): string | null {
    return this.tooltip === null ? null : 'fixed';
  }

  @HostBinding('style.left.px')
  protected get leftStyle(): number | null {
    if (this.tooltip === null) {
      return null;
    }

    return this.tooltip.getPositionX();
  }

  @HostBinding('style.top.px')
  protected get topStyle(): number | null {
    if (this.tooltip === null) {
      return null;
    }

    return this.tooltip.getPositionY();
  }

  public ngOnInit(): void {
    this.resolvedId = this.tooltip?.resolveContentId(this.id()) ?? this.resolveContentId(this.id());
    this.tooltip?.registerContent(this.hostRef.nativeElement, this.resolvedId);
  }

  public ngOnDestroy(): void {
    this.syncPresence.destroy();
    this.presence.destroy();
    this.tooltip?.unregisterContent(this.hostRef.nativeElement);
  }

  private prepareForPresence(): void {
    const content = this.hostRef.nativeElement;
    content.removeAttribute('hidden');
    content.style.removeProperty('display');
  }

  private applyPresenceState(state: TngOverlayPresenceState): void {
    const content = this.hostRef.nativeElement;
    content.setAttribute('data-presence', state);
    content.setAttribute('data-tng-overlay-motion', '');

    if (state === 'closed') {
      content.setAttribute('hidden', '');
    } else {
      content.removeAttribute('hidden');
    }

    if (state === 'exiting') {
      content.setAttribute('aria-hidden', 'true');
      content.setAttribute('inert', '');
    } else {
      content.removeAttribute('aria-hidden');
      content.removeAttribute('inert');
    }
  }

  private resolveContentId(value: string | null): string {
    const candidate = value?.trim() ?? '';
    return candidate.length > 0 ? candidate : this.generatedId;
  }
}
