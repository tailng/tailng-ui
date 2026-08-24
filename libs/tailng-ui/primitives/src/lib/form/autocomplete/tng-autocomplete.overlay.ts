import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  effect,
  signal,
} from '@angular/core';
import {
  computeOverlayPosition,
  createCssOverlayPresenceDriver,
  createOverlayPresenceController,
  createTngIdFactory,
  getGlobalElementScrollLockManager,
  getGlobalScrollLockManager,
  isTngAnchorVisibleInScrollAncestors,
  PORTALLED_OVERLAY_MOTION_VARS,
  resolveAnchoredYWhenOffscreen,
  resolveTngScrollableAncestors,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
  type TngOverlayPresenceState,
  type TngOverlayScrollStrategy,
} from '@tailng-ui/cdk';
import type { TngAutocomplete } from './tng-autocomplete';
import { TNG_AUTOCOMPLETE } from './tng-autocomplete.tokens';
import {
  clearOverlayOwnerId,
  stampOverlayOwnerId,
} from '../../overlay/_shared/tng-overlay-ownership';

type MaybeRect = Readonly<{ left: number; top: number; width: number; height: number }>;

const PORTALLED_AUTOCOMPLETE_THEME_VARS = [
  ...PORTALLED_OVERLAY_MOTION_VARS,
  '--tng-autocomplete-radius',
  '--tng-autocomplete-trigger-width',
  '--tng-autocomplete-trigger-min-height',
  '--tng-autocomplete-trigger-container-min-height',
  '--tng-autocomplete-trigger-container-gap',
  '--tng-autocomplete-trigger-container-px',
  '--tng-autocomplete-trigger-py',
  '--tng-autocomplete-trigger-px',
  '--tng-autocomplete-icon-size',
  '--tng-autocomplete-icon-box-size',
  '--tng-autocomplete-icon-opacity',
  '--tng-autocomplete-icon-margin-inline-end',
  '--tng-autocomplete-overlay-padding',
  '--tng-autocomplete-overlay-radius',
  '--tng-autocomplete-overlay-shadow',
  '--tng-autocomplete-overlay-max-width',
  '--tng-autocomplete-z-overlay',
  '--tng-autocomplete-overlay-z-index',
  '--tng-z-overlay',
  '--tng-autocomplete-overlay-border',
  '--tng-autocomplete-overlay-bg',
  '--tng-autocomplete-listbox-gap',
  '--tng-autocomplete-option-min-height',
  '--tng-autocomplete-option-py',
  '--tng-autocomplete-option-px',
  '--tng-autocomplete-option-radius',
  '--tng-autocomplete-option-bg-active',
  '--tng-autocomplete-option-border-active',
  '--tng-autocomplete-option-bg-selected',
  '--tng-autocomplete-option-border-selected',
  '--tng-autocomplete-option-fg-selected',
  '--tng-autocomplete-option-bg-selected-active',
  '--tng-autocomplete-option-border-selected-active',
  '--tng-autocomplete-option-shadow-selected-active',
  '--tng-autocomplete-option-disabled-opacity',
  '--tng-autocomplete-border',
  '--tng-autocomplete-border-strong',
  '--tng-autocomplete-border-hover',
  '--tng-autocomplete-bg',
  '--tng-autocomplete-canvas',
  '--tng-autocomplete-surface',
  '--tng-autocomplete-fg',
  '--tng-autocomplete-muted',
  '--tng-autocomplete-brand',
  '--tng-autocomplete-danger',
  '--tng-autocomplete-focus-ring',
  '--tng-autocomplete-ease',
  '--tng-autocomplete-shadow',
  '--tng-autocomplete-shadow-focus',
  '--tng-semantic-background-base',
  '--tng-semantic-background-canvas',
  '--tng-semantic-background-surface',
  '--tng-semantic-border-subtle',
  '--tng-semantic-border-strong',
  '--tng-semantic-foreground-primary',
  '--tng-semantic-foreground-secondary',
  '--tng-semantic-foreground-muted',
  '--tng-semantic-accent-brand',
  '--tng-semantic-accent-danger',
  '--tng-semantic-focus-ring',
] as const;

const createAutocompleteOverlayLockId = createTngIdFactory('tng-autocomplete-overlay-lock');

function rectFromClientRect(r: DOMRect | ClientRect): MaybeRect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): MaybeRect {
  return { left: 0, top: 0, width: window.innerWidth || 1024, height: window.innerHeight || 768 };
}

function isInside(target: EventTarget | null, container: HTMLElement): boolean {
  return !!target && target instanceof Node && container.contains(target);
}

/**
 * When the overlay's host element lives inside a `tng-form-field`, the form-field
 * is the visible frame the consumer sees, so the overlay should align with it
 * (width + left/right edges). For the `left` label layout the form-field's root
 * spans the label column too, so anchor on the inner control-row instead.
 */
function findFormFieldAnchor(host: HTMLElement): HTMLElement | null {
  const formField = host.closest('[data-slot="form-field"]') as HTMLElement | null;
  if (!formField) return null;
  if (formField.getAttribute('data-label-position') === 'left') {
    const row = formField.querySelector('.tng-form-field__control-row') as HTMLElement | null;
    return row ?? formField;
  }
  return formField;
}

/**
 * Rect to use for overlay positioning. When the anchor is a form-field root, the
 * horizontal extent is taken from the form-field (so the overlay spans the field
 * frame) but the vertical extent is taken from the inner fieldset (the input row)
 * so the overlay opens directly under the input rather than below the messages
 * region beneath the frame.
 */
function anchorRectFor(anchorEl: HTMLElement): MaybeRect {
  const widthRect = anchorEl.getBoundingClientRect();
  if (!anchorEl.matches('[data-slot="form-field"]')) {
    return rectFromClientRect(widthRect);
  }
  const labelPosition = anchorEl.getAttribute('data-label-position');
  const fieldset = anchorEl.querySelector(
    '[data-slot="form-field-control-row"]',
  ) as HTMLElement | null;
  const innerRow = anchorEl.querySelector('.tng-form-field__control-row') as HTMLElement | null;
  const positionEl = labelPosition === 'outline' ? (fieldset ?? innerRow) : (innerRow ?? fieldset);
  if (!positionEl) return rectFromClientRect(widthRect);
  const positionRect = positionEl.getBoundingClientRect();
  return {
    left: widthRect.left,
    width: widthRect.width,
    top: positionRect.top,
    height: positionRect.height,
  };
}

@Directive({
  selector: '[tngAutocompleteOverlay]',
  exportAs: 'tngAutocompleteOverlay',
})
export class TngAutocompleteOverlay {
  private readonly autocomplete = inject<TngAutocomplete>(TNG_AUTOCOMPLETE);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly instanceId = createAutocompleteOverlayLockId();
  private readonly documentRef = this.elRef.nativeElement.ownerDocument;
  private readonly bodyScrollLock = getGlobalScrollLockManager({
    documentRef: this.documentRef,
  });
  private readonly elementScrollLock = getGlobalElementScrollLockManager({
    documentRef: this.documentRef,
  });
  private readonly resolvedSide = signal<'bottom' | 'left' | 'right' | 'top'>('bottom');
  private readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => [this.elRef.nativeElement],
      windowRef: this.documentRef.defaultView,
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

  private lastFocusedBeforeOpen: HTMLElement | null = null;
  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private removeDocPointerListener: (() => void) | null = null;
  private scrollAncestors: readonly HTMLElement[] = [];

  readonly placement = input<TngOverlayPlacement | undefined>(undefined);
  readonly offset = input<TngOverlayOffset | undefined>(undefined);
  readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined);
  readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');

  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete-overlay' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.presenceState() === 'closed' ? '' : null;
  }

  @HostBinding('attr.data-presence')
  protected get dataPresence(): TngOverlayPresenceState {
    return this.presenceState();
  }

  @HostBinding('attr.data-side')
  protected get dataSide(): 'bottom' | 'left' | 'right' | 'top' {
    return this.resolvedSide();
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

  constructor() {
    this.placeholder = document.createComment('tng-autocomplete-overlay-anchor');
    const hostEl = this.elRef.nativeElement;
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);

    effect(() => {
      const open = this.autocomplete.open();
      this.placement();
      this.offset();
      this.collision();
      this.scrollStrategy();
      this.presence.setOpen(open);
    });

    this.destroyRef.onDestroy(() => {
      this.teardownOutsidePointer();
      this.presence.destroy();
      this.restoreToPlaceholder(true);
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  /**
   * Anchor for overlay positioning, width, and dismiss boundary.
   * Prefer the enclosing form-field (so the overlay aligns with the visible
   * field frame), else the trigger container (trigger + icon), else the input
   * trigger itself.
   */
  private findAnchorEl(): HTMLElement | null {
    const root = this.autocomplete.hostElement;
    const formFieldAnchor = findFormFieldAnchor(root);
    if (formFieldAnchor) return formFieldAnchor;
    const container = root.querySelector(
      '[data-slot="autocomplete-trigger-container"]',
    ) as HTMLElement | null;
    if (container) return container;
    return root.querySelector('[data-slot="autocomplete-trigger"]') as HTMLElement | null;
  }

  private findTriggerEl(): HTMLElement | null {
    const root = this.autocomplete.hostElement;
    return root.querySelector('[data-slot="autocomplete-trigger"]') as HTMLElement | null;
  }

  private reposition(): void {
    if (!this.autocomplete.open()) return;
    const panel = this.elRef.nativeElement;
    const anchorEl = this.findAnchorEl();
    if (!anchorEl) return;

    if (
      this.scrollStrategy() === 'reposition' &&
      !isTngAnchorVisibleInScrollAncestors(anchorEl, this.scrollAncestors)
    ) {
      this.autocomplete.close();
      return;
    }

    const anchor = anchorRectFor(anchorEl);
    const overlay = rectFromClientRect(panel.getBoundingClientRect());
    const viewport = viewportRect();
    const offset = this.offset();
    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
      placement: this.placement(),
      offset,
      collision: this.collision(),
    });
    this.setResolvedSide(result.side);
    panel.style.left = `${result.x}px`;
    panel.style.top = `${resolveAnchoredYWhenOffscreen({
      anchorRect: anchor,
      overlayRect: overlay,
      side: result.side,
      sideOffset: offset?.side,
      viewportRect: viewport,
      y: result.y,
    })}px`;
  }

  private prepareForPresence(): void {
    const panel = this.elRef.nativeElement;
    panel.removeAttribute('hidden');
    panel.style.removeProperty('display');
  }

  private applyPresenceState(state: TngOverlayPresenceState): void {
    const panel = this.elRef.nativeElement;
    panel.setAttribute('data-presence', state);
    panel.setAttribute('data-tng-overlay-motion', '');

    if (state === 'closed') {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
    }

    if (state === 'exiting') {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('inert', '');
      this.teardownOutsidePointer();
      this.teardownScrollStrategy();
      this.restoreFocusAfterClose();
    } else {
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('inert');

      if (
        state === 'entering' &&
        panel.parentNode === document.body &&
        this.removeResizeListener === null
      ) {
        this.setupScrollStrategy(this.findAnchorEl());
        this.reposition();
        this.setupOutsidePointer();
      }
    }
  }

  private setResolvedSide(side: 'bottom' | 'left' | 'right' | 'top'): void {
    this.resolvedSide.set(side);
    this.elRef.nativeElement.setAttribute('data-side', side);
  }

  private setupScrollStrategy(anchorEl: HTMLElement | null): void {
    this.teardownScrollStrategy();

    if (anchorEl !== null) {
      this.scrollAncestors = resolveTngScrollableAncestors(anchorEl);
    }

    if (this.scrollStrategy() === 'block') {
      this.bodyScrollLock.acquire(this.instanceId);
      this.elementScrollLock.acquire(this.instanceId, this.scrollAncestors);
    }

    this.setupRepositionListeners();
  }

  private setupRepositionListeners(): void {
    let rafId: number | null = null;
    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        this.reposition();
      });
    };
    const onResize = () => schedule();
    window.addEventListener('resize', onResize);
    this.removeResizeListener = () => window.removeEventListener('resize', onResize);

    if (this.scrollStrategy() !== 'block') {
      const onScroll = (event: Event) => {
        if (isInside(event.target, this.elRef.nativeElement)) return;
        if (this.scrollStrategy() === 'close') {
          this.autocomplete.close();
          return;
        }
        schedule();
      };
      window.addEventListener('scroll', onScroll, true);
      this.removeScrollListener = () => window.removeEventListener('scroll', onScroll, true);
    }

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => schedule());
      const anchorEl = this.findAnchorEl();
      if (anchorEl) this.resizeObserver.observe(anchorEl);
      this.resizeObserver.observe(this.elRef.nativeElement);
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

  private teardownScrollStrategy(): void {
    this.teardownRepositionListeners();
    this.bodyScrollLock.release(this.instanceId);
    this.elementScrollLock.release(this.instanceId);
    this.scrollAncestors = [];
  }

  private setupOutsidePointer(): void {
    if (this.removeDocPointerListener) return;
    const onPointerDown = (ev: PointerEvent) => {
      if (!this.autocomplete.open()) return;
      const panel = this.elRef.nativeElement;
      const anchorEl = this.findAnchorEl();
      if (isInside(ev.target, panel)) return;
      if (anchorEl && isInside(ev.target, anchorEl)) return;
      if (ev.target && (ev.target as Element).closest?.('[data-slot="autocomplete-option"]'))
        return;
      this.autocomplete.close();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeDocPointerListener = () =>
      document.removeEventListener('pointerdown', onPointerDown, true);
  }

  private teardownOutsidePointer(): void {
    this.removeDocPointerListener?.();
    this.removeDocPointerListener = null;
  }

  private syncPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;
    const hostStyles = getComputedStyle(this.autocomplete.hostElement);

    for (const cssVar of PORTALLED_AUTOCOMPLETE_THEME_VARS) {
      const value = hostStyles.getPropertyValue(cssVar).trim();
      if (value) {
        panel.style.setProperty(cssVar, value);
      } else {
        panel.style.removeProperty(cssVar);
      }
    }

    const colorScheme = hostStyles.colorScheme?.trim();
    if (colorScheme && colorScheme !== 'normal') {
      panel.style.colorScheme = colorScheme;
    } else {
      panel.style.removeProperty('color-scheme');
    }
  }

  private applyPortalledStacking(): void {
    const panel = this.elRef.nativeElement;

    panel.style.zIndex =
      'var(--tng-autocomplete-z-overlay, var(--tng-autocomplete-overlay-z-index, var(--tng-z-overlay, 2)))';
  }

  private clearPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;

    for (const cssVar of PORTALLED_AUTOCOMPLETE_THEME_VARS) {
      panel.style.removeProperty(cssVar);
    }

    panel.style.removeProperty('color-scheme');
  }

  private mountToBodyAndPosition(): void {
    this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
    const anchorEl = this.findAnchorEl();
    this.setupScrollStrategy(anchorEl);
    const panel = this.elRef.nativeElement;
    stampOverlayOwnerId(panel, this.autocomplete.hostElement);
    if (panel.parentNode !== document.body) {
      document.body.appendChild(panel);
    }
    panel.style.position = 'fixed';
    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.visibility = 'hidden';
    this.syncPortalledThemeVars();
    this.applyPortalledStacking();

    if (anchorEl) {
      const anchor = anchorRectFor(anchorEl);
      panel.style.minWidth = `${anchor.width}px`;
      if (findFormFieldAnchor(this.autocomplete.hostElement)) {
        panel.style.width = `${anchor.width}px`;
        panel.style.maxWidth = 'none';
      }
      const overlay = rectFromClientRect(panel.getBoundingClientRect());
      const viewport = viewportRect();
      const offset = this.offset();
      const result = computeOverlayPosition({
        anchorRect: anchor,
        overlayRect: overlay,
        viewportRect: viewport,
        placement: this.placement(),
        offset,
        collision: this.collision(),
      });
      this.setResolvedSide(result.side);
      panel.style.left = `${result.x}px`;
      panel.style.top = `${resolveAnchoredYWhenOffscreen({
        anchorRect: anchor,
        overlayRect: overlay,
        side: result.side,
        sideOffset: offset?.side,
        viewportRect: viewport,
        y: result.y,
      })}px`;
    }
    panel.style.visibility = '';

    this.setupOutsidePointer();
  }

  private restoreToPlaceholder(force = false): void {
    const panel = this.elRef.nativeElement;
    if (!force && panel.parentNode !== document.body) {
      this.teardownOutsidePointer();
      return;
    }
    if (this.placeholder?.parentNode) {
      this.placeholder.parentNode.insertBefore(panel, this.placeholder);
    } else if (this.originalParent) {
      this.originalParent.appendChild(panel);
    }
    this.teardownScrollStrategy();

    this.restoreFocusAfterClose();

    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.visibility = '';
    panel.style.zIndex = '';
    panel.style.minWidth = '';
    panel.style.width = '';
    panel.style.maxWidth = '';
    clearOverlayOwnerId(panel);
    this.clearPortalledThemeVars();
    this.teardownOutsidePointer();
  }

  private restoreFocusAfterClose(): void {
    const panel = this.elRef.nativeElement;
    if (this.lastFocusedBeforeOpen && document.contains(this.lastFocusedBeforeOpen)) {
      const active = document.activeElement as HTMLElement | null;
      if (!active || panel.contains(active)) {
        this.autocomplete._restoringFocus = true;
        this.lastFocusedBeforeOpen.focus();
        queueMicrotask(() => {
          this.autocomplete._restoringFocus = false;
        });
      }
    }
    this.restoreFocusOnClose();
  }

  private restoreFocusOnClose(): void {
    const panel = this.elRef.nativeElement;
    const active = document.activeElement as HTMLElement | null;
    const trigger = this.findTriggerEl();
    if (!trigger) return;

    if (active && panel.contains(active)) {
      this.autocomplete._restoringFocus = true;
      trigger.focus();
      queueMicrotask(() => {
        this.autocomplete._restoringFocus = false;
      });
      return;
    }
    if (document.activeElement === document.body) {
      this.autocomplete._restoringFocus = true;
      trigger.focus();
      queueMicrotask(() => {
        this.autocomplete._restoringFocus = false;
      });
    }
  }
}
