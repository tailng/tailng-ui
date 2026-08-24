import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  applyFixedPortalledOverlayBaseStyles,
  clearFixedPortalledOverlayBaseStyles,
  clearPortalledThemeVars,
  createCssOverlayPresenceDriver,
  createOverlayPresenceController,
  createTngIdFactory,
  getGlobalElementScrollLockManager,
  getGlobalScrollLockManager,
  isTngAnchorVisibleInScrollAncestors,
  positionFixedAnchoredOverlay,
  PORTALLED_OVERLAY_MOTION_VARS,
  resolveCssCustomPropertyPx,
  resolveTngScrollableAncestors,
  syncPortalledThemeVars,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
  type TngOverlayRect,
  type TngOverlayPresenceState,
  type TngOverlayScrollStrategy,
} from '@tailng-ui/cdk';
import {
  clearOverlayOwnerId,
  stampOverlayOwnerId,
} from '../../overlay/_shared/tng-overlay-ownership';
import type { TngDateRangePickerAttributeMap } from './date-range-picker.types';

type TngDateRangePickerOverlayController = Readonly<{
  close: () => void;
  suppressFocusRestoreOnClose: () => void;
  handleOverlayKeyDown: (event: KeyboardEvent) => void;
  getOutputs: () => Readonly<{
    getHostAttributes: () => TngDateRangePickerAttributeMap;
    getOverlayAttributes: () => TngDateRangePickerAttributeMap;
    open: boolean;
  }>;
  registerOverlay: (element: HTMLElement | null) => void;
  subscribe: (listener: (event: unknown) => void) => () => void;
}>;

type OverlayAnchorInput = ElementRef<HTMLElement> | HTMLElement | null | undefined;
type OverlayThemeSourceInput = OverlayAnchorInput;

const PORTALLED_DATEPICKER_THEME_VARS = [
  ...PORTALLED_OVERLAY_MOTION_VARS,
  '--tng-date-range-picker-radius',
  '--tng-date-range-picker-field-height',
  '--tng-date-range-picker-overlay-gap',
  '--tng-date-range-picker-overlay-min-width',
  '--tng-date-range-picker-overlay-max-width',
  '--tng-date-range-picker-day-cell-size',
  '--tng-date-range-picker-picker-cell-size',
  '--tng-date-range-picker-grid-gap',
  '--tng-date-range-picker-inline-gap',
  '--tng-date-range-picker-overlay-padding',
  '--tng-date-range-picker-nav-size',
  '--tng-date-range-picker-border',
  '--tng-date-range-picker-border-strong',
  '--tng-date-range-picker-bg',
  '--tng-date-range-picker-surface',
  '--tng-date-range-picker-canvas',
  '--tng-date-range-picker-fg',
  '--tng-date-range-picker-muted',
  '--tng-date-range-picker-brand',
  '--tng-date-range-picker-danger',
  '--tng-date-range-picker-focus',
  '--tng-date-range-picker-shadow',
  '--tng-date-range-picker-focus-shadow',
  '--tng-date-range-picker-ease',
  '--tng-semantic-background-base',
  '--tng-semantic-background-surface',
  '--tng-semantic-background-canvas',
  '--tng-semantic-border-subtle',
  '--tng-semantic-border-strong',
  '--tng-semantic-foreground-primary',
  '--tng-semantic-foreground-secondary',
  '--tng-semantic-accent-brand',
  '--tng-semantic-accent-danger',
  '--tng-semantic-focus-ring',
  '--tng-date-range-picker-z-overlay',
  '--tng-z-overlay',
] as const;

const OVERLAY_VIEWPORT_MARGIN = 12;
const OVERLAY_OFFSET = 9;
const OVERLAY_MIN_SIZE = 288;
const OVERLAY_MAX_SIZE = 320;
const OVERLAY_Z_INDEX = 'var(--tng-date-range-picker-z-overlay, var(--tng-z-overlay, 1000))';
const createDateRangePickerOverlayLockId = createTngIdFactory('tng-date-range-picker-overlay-lock');

function resolveAnchorElement(anchor: OverlayAnchorInput): HTMLElement | null {
  if (anchor instanceof ElementRef) {
    return anchor.nativeElement;
  }

  return anchor instanceof HTMLElement ? anchor : null;
}

function resolveThemeSourceElement(source: OverlayThemeSourceInput): HTMLElement | null {
  return resolveAnchorElement(source);
}

function normalizeOptionalSizeInput(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : undefined;
}

/**
 * When the overlay's anchor lives inside a `tng-form-field`, the form-field is
 * the visible frame the consumer sees, so the overlay should span it
 * (width + left/right edges). For the `left` label layout the form-field's
 * root spans the label column too, so anchor on the inner control-row instead.
 */
function findFormFieldAnchor(host: HTMLElement | null): HTMLElement | null {
  if (host === null) return null;
  const formField = host.closest('[data-slot="form-field"]') as HTMLElement | null;
  if (formField === null) return null;
  if (formField.getAttribute('data-label-position') === 'left') {
    const row = formField.querySelector('.tng-form-field__control-row') as HTMLElement | null;
    return row ?? formField;
  }
  return formField;
}

/**
 * Rect to use for overlay positioning. When the anchor is a form-field root,
 * the horizontal extent is taken from the form-field (so the overlay spans
 * the field frame) but the vertical extent is taken from the inner frame
 * element (the input row) so the overlay opens directly under the input
 * rather than below the messages region beneath the frame.
 */
function anchorRectFor(anchorEl: HTMLElement): TngOverlayRect {
  const widthRect = anchorEl.getBoundingClientRect();
  if (!anchorEl.matches('[data-slot="form-field"]')) {
    return {
      height: widthRect.height,
      left: widthRect.left,
      top: widthRect.top,
      width: widthRect.width,
    };
  }
  const labelPosition = anchorEl.getAttribute('data-label-position');
  const fieldset = anchorEl.querySelector(
    '[data-slot="form-field-control-row"]',
  ) as HTMLElement | null;
  const innerRow = anchorEl.querySelector('.tng-form-field__control-row') as HTMLElement | null;
  const positionEl = labelPosition === 'outline' ? (fieldset ?? innerRow) : (innerRow ?? fieldset);
  if (positionEl === null) {
    return {
      height: widthRect.height,
      left: widthRect.left,
      top: widthRect.top,
      width: widthRect.width,
    };
  }
  const positionRect = positionEl.getBoundingClientRect();
  return {
    height: positionRect.height,
    left: widthRect.left,
    top: positionRect.top,
    width: widthRect.width,
  };
}

@Directive({
  selector: '[tngDateRangePickerOverlay]',
  exportAs: 'tngDateRangePickerOverlay',
})
export class TngDateRangePickerOverlay {
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly ownerDocument = this.elRef.nativeElement.ownerDocument ?? null;
  private readonly ownerWindow = this.ownerDocument?.defaultView ?? null;
  private readonly renderVersion = signal(0);
  private readonly resolvedPlacement = signal<'bottom' | 'top'>('bottom');
  private readonly instanceId = createDateRangePickerOverlayLockId();
  private readonly scrollLock = getGlobalScrollLockManager({
    documentRef: this.ownerDocument,
  });
  private readonly elementScrollLock = getGlobalElementScrollLockManager({
    documentRef: this.ownerDocument,
  });
  private readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => [this.elRef.nativeElement],
      windowRef: this.ownerWindow,
    }),
    onDismiss: () => this.restoreToPlaceholder(),
    onPresent: () => {
      this.prepareForPresence();
      this.mountToBodyAndPosition();
    },
    onStateChange: (state) => {
      this.presenceState.set(state);
      this.applyPresenceState(state);
    },
  });

  private overlayPlaceholder: Comment | null = null;
  private overlayOriginalParent: Node | null = null;
  private overlayLayoutFrame: number | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollAncestors: readonly HTMLElement[] = [];

  public readonly controller = input.required<TngDateRangePickerOverlayController>({
    alias: 'tngDateRangePickerOverlay',
  });
  public readonly anchor = input<OverlayAnchorInput>(undefined, {
    alias: 'tngDateRangePickerOverlayAnchor',
  });
  public readonly placement = input<TngOverlayPlacement | undefined>(undefined, {
    alias: 'tngDateRangePickerOverlayPlacement',
  });
  public readonly minSize = input<number | undefined, unknown>(undefined, {
    alias: 'tngDateRangePickerOverlayMinSize',
    transform: normalizeOptionalSizeInput,
  });
  public readonly maxSize = input<number | undefined, unknown>(undefined, {
    alias: 'tngDateRangePickerOverlayMaxSize',
    transform: normalizeOptionalSizeInput,
  });
  public readonly offset = input<TngOverlayOffset | undefined>(undefined, {
    alias: 'tngDateRangePickerOverlayOffset',
  });
  public readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined, {
    alias: 'tngDateRangePickerOverlayCollision',
  });
  public readonly themeSource = input<OverlayThemeSourceInput>(undefined, {
    alias: 'tngDateRangePickerOverlayThemeSource',
  });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition', {
    alias: 'tngDateRangePickerOverlayScrollStrategy',
  });

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.presenceState() === 'closed' ? '' : null;
  }

  @HostBinding('style.display')
  protected get display(): string | null {
    return this.presenceState() === 'closed' ? 'none' : null;
  }

  @HostBinding('attr.data-presence')
  protected get dataPresence(): TngOverlayPresenceState {
    return this.presenceState();
  }

  @HostBinding('attr.data-tng-overlay-motion')
  protected readonly overlayMotion = '';

  @HostBinding('attr.aria-hidden')
  protected get ariaHidden(): 'true' | null {
    return this.presenceState() === 'exiting' ? 'true' : null;
  }

  @HostBinding('attr.inert')
  protected get inert(): '' | null {
    return this.presenceState() === 'exiting' ? '' : null;
  }

  @HostBinding('attr.data-placement')
  protected get dataPlacement(): 'bottom' | 'top' {
    this.renderVersion();
    return this.resolvedPlacement();
  }

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedby(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-describedby'] ?? null;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabel(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-label'] ?? null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledby(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-labelledby'] ?? null;
  }

  @HostBinding('attr.aria-modal')
  protected get ariaModal(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['aria-modal'] ?? null;
  }

  @HostBinding('attr.data-open')
  protected get dataOpen(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-open'] ?? null;
  }

  @HostBinding('attr.data-position')
  protected get dataPosition(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-position'] ?? null;
  }

  @HostBinding('attr.data-slot')
  protected get dataSlot(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['data-slot'] ?? null;
  }

  @HostBinding('attr.id')
  protected get id(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['id'] ?? null;
  }

  @HostBinding('attr.role')
  protected get role(): string | null {
    this.renderVersion();
    return this.controller().getOutputs().getOverlayAttributes()['role'] ?? null;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.controller().handleOverlayKeyDown(event);
  }

  public constructor() {
    this.initializeOverlayPortal();

    effect((onCleanup) => {
      const controller = this.controller();
      controller.registerOverlay(this.elRef.nativeElement);
      const unsubscribe = controller.subscribe(() => {
        this.renderVersion.update((value) => value + 1);
      });

      onCleanup(() => {
        unsubscribe();
        controller.registerOverlay(null);
      });
    });

    effect(() => {
      const open = this.controller().getOutputs().open;
      this.renderVersion();
      this.placement();
      this.minSize();
      this.maxSize();
      this.offset();
      this.collision();
      this.themeSource();
      this.anchor();
      this.scrollStrategy();

      this.presence.setOpen(open);
    });

    this.destroyRef.onDestroy(() => {
      if (this.overlayLayoutFrame !== null && this.ownerWindow !== null) {
        this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
        this.overlayLayoutFrame = null;
      }

      this.presence.destroy();
      this.teardownRepositionListeners();
      this.restoreToPlaceholder(true);
    });
  }

  private initializeOverlayPortal(): void {
    if (this.overlayPlaceholder !== null) {
      return;
    }

    const placeholderDocument = this.ownerDocument ?? document;
    const overlay = this.elRef.nativeElement;
    this.overlayPlaceholder = placeholderDocument.createComment(
      'tng-date-range-picker-overlay-anchor',
    );
    this.overlayOriginalParent = overlay.parentNode;
    const placeholder = this.overlayPlaceholder;
    if (this.overlayOriginalParent !== null && placeholder !== null) {
      this.overlayOriginalParent.insertBefore(placeholder, overlay);
    }
  }

  private prepareForPresence(): void {
    const overlay = this.elRef.nativeElement;
    overlay.removeAttribute('hidden');
    overlay.style.removeProperty('display');
  }

  private applyPresenceState(state: TngOverlayPresenceState): void {
    const overlay = this.elRef.nativeElement;
    overlay.setAttribute('data-presence', state);
    overlay.setAttribute('data-tng-overlay-motion', '');

    if (state === 'closed') {
      overlay.setAttribute('hidden', '');
      overlay.style.display = 'none';
    } else {
      overlay.removeAttribute('hidden');
      overlay.style.removeProperty('display');
    }

    if (state === 'exiting') {
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('inert', '');
      this.teardownScrollStrategy();
    } else {
      overlay.removeAttribute('aria-hidden');
      overlay.removeAttribute('inert');

      if (
        state === 'entering' &&
        overlay.parentNode === this.ownerDocument?.body &&
        this.removeResizeListener === null
      ) {
        this.setupScrollStrategy(this.findAnchorEl());
        this.positionOverlay();
      }
    }
  }

  /**
   * Resolve the explicit/date-range-picker-owned anchor (input-shell or trigger).
   * This is the element used to read date-range-picker-scoped CSS custom properties
   * (e.g. `--tng-date-range-picker-overlay-gap`) and to align the overlay vertically.
   */
  private findDateRangePickerAnchorEl(): HTMLElement | null {
    const explicitAnchor = resolveAnchorElement(this.anchor());
    if (explicitAnchor !== null) {
      return explicitAnchor;
    }

    const scope =
      this.overlayPlaceholder?.parentNode instanceof HTMLElement
        ? this.overlayPlaceholder.parentNode
        : this.overlayOriginalParent instanceof HTMLElement
          ? this.overlayOriginalParent
          : null;

    return (scope?.querySelector('[data-slot="date-range-picker-input-shell"]') ??
      scope?.querySelector('[data-slot="date-range-picker-trigger"]')) as HTMLElement | null;
  }

  /** Anchor used for scroll visibility and the wider form-field boundary. */
  private findAnchorEl(): HTMLElement | null {
    const dateRangePickerAnchor = this.findDateRangePickerAnchorEl();
    return findFormFieldAnchor(dateRangePickerAnchor) ?? dateRangePickerAnchor;
  }

  /** Anchor whose input-plus-trigger edges define popup geometry. */
  private findPositionAnchorEl(): HTMLElement | null {
    return this.findDateRangePickerAnchorEl() ?? this.findAnchorEl();
  }

  private scheduleReposition(): void {
    if (!this.controller().getOutputs().open || this.ownerWindow === null) {
      return;
    }

    if (this.overlayLayoutFrame !== null) {
      this.ownerWindow.cancelAnimationFrame(this.overlayLayoutFrame);
    }

    this.overlayLayoutFrame = this.ownerWindow.requestAnimationFrame(() => {
      this.overlayLayoutFrame = null;
      this.positionOverlay();
    });
  }

  private positionOverlay(): void {
    const overlay = this.elRef.nativeElement;
    const anchor = this.findPositionAnchorEl();
    if (anchor === null || this.ownerWindow === null) {
      return;
    }

    const inlineSize = this.resolveInlineSizeConstraints();

    const result = positionFixedAnchoredOverlay({
      anchor,
      anchorRect: anchorRectFor(anchor),
      collision: this.resolveCollision(),
      direction: this.resolveDirection(),
      maxInlineSize: inlineSize.max,
      minInlineSize: inlineSize.min,
      offset: this.resolveOffset(),
      overlay,
      placement: this.resolvePlacement(),
      viewportMargin: OVERLAY_VIEWPORT_MARGIN,
      windowRef: this.ownerWindow,
    });
    this.resolvedPlacement.set(result.side === 'top' ? 'top' : 'bottom');
    overlay.style.visibility = '';
  }

  private setupRepositionListeners(): void {
    if (this.ownerWindow === null || this.removeResizeListener !== null) {
      return;
    }

    const schedule = (): void => {
      this.scheduleReposition();
    };

    this.ownerWindow.addEventListener('resize', schedule);
    this.removeResizeListener = (): void => {
      this.ownerWindow?.removeEventListener('resize', schedule);
    };

    if (this.scrollStrategy() !== 'block') {
      const onScroll = (event: Event): void => {
        const target = event.target;
        if (target instanceof Node && this.elRef.nativeElement.contains(target)) {
          return;
        }

        if (this.scrollStrategy() === 'close') {
          this.closeFromScroll();
          return;
        }

        const anchor = this.findAnchorEl();
        if (anchor === null || !isTngAnchorVisibleInScrollAncestors(anchor, this.scrollAncestors)) {
          this.closeFromScroll();
          return;
        }

        schedule();
      };
      this.ownerWindow.addEventListener('scroll', onScroll, true);
      this.removeScrollListener = (): void => {
        this.ownerWindow?.removeEventListener('scroll', onScroll, true);
      };
    }

    if ('ResizeObserver' in this.ownerWindow) {
      const ResizeObserverCtor = this.ownerWindow.ResizeObserver;
      this.resizeObserver = new ResizeObserverCtor(() => {
        this.scheduleReposition();
      });

      const anchor = this.findAnchorEl();
      if (anchor !== null && this.resizeObserver !== null) {
        this.resizeObserver.observe(anchor);
      }

      const positionAnchor = this.findPositionAnchorEl();
      if (positionAnchor !== null && positionAnchor !== anchor && this.resizeObserver !== null) {
        this.resizeObserver.observe(positionAnchor);
      }

      this.resizeObserver?.observe(this.elRef.nativeElement);
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

  private closeFromScroll(): void {
    const controller = this.controller();
    if (!controller.getOutputs().open) {
      return;
    }

    controller.suppressFocusRestoreOnClose();
    controller.close();
  }

  private setupScrollStrategy(anchor: HTMLElement | null): void {
    this.teardownScrollStrategy();

    if (anchor !== null) {
      this.scrollAncestors = resolveTngScrollableAncestors(anchor);
    }

    if (this.scrollStrategy() === 'block') {
      this.scrollLock.acquire(this.instanceId);
      this.elementScrollLock.acquire(this.instanceId, this.scrollAncestors);
    }

    this.setupRepositionListeners();
  }

  private teardownScrollStrategy(): void {
    this.teardownRepositionListeners();
    this.scrollLock.release(this.instanceId);
    this.elementScrollLock.release(this.instanceId);
    this.scrollAncestors = [];
  }

  private syncPortalledThemeVars(): void {
    const overlay = this.elRef.nativeElement;
    const themeSource =
      resolveThemeSourceElement(this.themeSource()) ?? this.findDateRangePickerAnchorEl();
    if (themeSource === null) {
      return;
    }

    syncPortalledThemeVars({
      cssVars: PORTALLED_DATEPICKER_THEME_VARS,
      panel: overlay,
      source: themeSource,
    });
  }

  private clearPortalledThemeVars(): void {
    clearPortalledThemeVars(this.elRef.nativeElement, PORTALLED_DATEPICKER_THEME_VARS);
  }

  private mountToBodyAndPosition(): void {
    const overlay = this.elRef.nativeElement;
    if (this.ownerDocument === null) {
      return;
    }

    const anchor = this.findAnchorEl();
    this.setupScrollStrategy(anchor);

    stampOverlayOwnerId(overlay, this.findDateRangePickerAnchorEl() ?? overlay);

    if (overlay.parentNode !== this.ownerDocument.body) {
      this.ownerDocument.body.appendChild(overlay);
    }

    applyFixedPortalledOverlayBaseStyles(overlay, OVERLAY_Z_INDEX);
    this.syncPortalledThemeVars();

    this.positionOverlay();
  }

  private restoreToPlaceholder(force = false): void {
    const overlay = this.elRef.nativeElement;
    if (!force && overlay.parentNode !== this.ownerDocument?.body) {
      return;
    }

    const placeholder = this.overlayPlaceholder;
    if (placeholder?.parentNode !== null && placeholder !== null) {
      placeholder.parentNode.insertBefore(overlay, placeholder);
    } else if (this.overlayOriginalParent !== null) {
      this.overlayOriginalParent.appendChild(overlay);
    }

    this.teardownScrollStrategy();
    this.resolvedPlacement.set(this.resolvePlacement().side === 'top' ? 'top' : 'bottom');
    this.clearPortalledThemeVars();
    clearOverlayOwnerId(overlay);
    clearFixedPortalledOverlayBaseStyles(overlay);
    overlay.style.maxHeight = '';
    overlay.style.maxWidth = '';
    overlay.style.minWidth = '';
    overlay.style.width = '';
  }

  private resolvePlacement(): TngOverlayPlacement {
    return this.placement() ?? { align: 'end', side: 'bottom' };
  }

  private resolveInlineSizeConstraints(): Readonly<{ max: number; min: number }> {
    const source =
      resolveThemeSourceElement(this.themeSource()) ?? this.findDateRangePickerAnchorEl();
    return {
      max:
        this.maxSize() ??
        (source === null
          ? OVERLAY_MAX_SIZE
          : resolveCssCustomPropertyPx(
              source,
              '--tng-date-range-picker-overlay-max-width',
              OVERLAY_MAX_SIZE,
            )),
      min:
        this.minSize() ??
        (source === null
          ? OVERLAY_MIN_SIZE
          : resolveCssCustomPropertyPx(
              source,
              '--tng-date-range-picker-overlay-min-width',
              OVERLAY_MIN_SIZE,
            )),
    };
  }

  private resolveOffset(): TngOverlayOffset {
    const explicitOffset = this.offset();
    if (explicitOffset !== undefined) {
      return explicitOffset;
    }

    const themeSource = this.findDateRangePickerAnchorEl();
    return {
      side:
        themeSource === null
          ? OVERLAY_OFFSET
          : resolveCssCustomPropertyPx(
              themeSource,
              '--tng-date-range-picker-overlay-gap',
              OVERLAY_OFFSET,
            ),
    };
  }

  private resolveCollision(): TngOverlayCollisionOptions {
    return (
      this.collision() ?? {
        flip: true,
        padding: OVERLAY_VIEWPORT_MARGIN,
        shift: true,
      }
    );
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    return this.controller().getOutputs().getHostAttributes()['dir'] === 'rtl' ? 'rtl' : 'ltr';
  }
}
