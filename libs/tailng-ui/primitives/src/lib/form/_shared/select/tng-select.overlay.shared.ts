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
  resolveTngScrollableAncestors,
  type TngOverlayCollisionOptions,
  type TngOverlayOffset,
  type TngOverlayPlacement,
  type TngOverlayPresenceState,
  type TngOverlayScrollStrategy,
} from '@tailng-ui/cdk';

import type { TngSelectHostApi } from './tng-select.host-api';
import { TNG_SELECT_HOST } from './tng-select.tokens.shared';
import {
  clearOverlayOwnerId,
  stampOverlayOwnerId,
} from '../../../overlay/_shared/tng-overlay-ownership';

type MaybeRect = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

const PORTALLED_SELECT_THEME_VARS = [
  ...PORTALLED_OVERLAY_MOTION_VARS,
  '--tng-select-radius',
  '--tng-select-trigger-width',
  '--tng-select-trigger-min-height',
  '--tng-select-trigger-py',
  '--tng-select-trigger-px',
  '--tng-select-trigger-gap',
  '--tng-select-icon-size',
  '--tng-select-icon-opacity',
  '--tng-select-icon-margin-inline-start',
  '--tng-select-overlay-padding',
  '--tng-select-overlay-radius',
  '--tng-select-overlay-shadow',
  '--tng-select-overlay-max-width',
  '--tng-select-z-overlay',
  '--tng-select-overlay-z-index',
  '--tng-z-overlay',
  '--tng-select-overlay-border',
  '--tng-select-overlay-bg',
  '--tng-select-overlay-max-height',
  '--tng-select-listbox-gap',
  '--tng-select-option-min-height',
  '--tng-select-option-py',
  '--tng-select-option-px',
  '--tng-select-option-radius',
  '--tng-select-option-bg-active',
  '--tng-select-option-border-active',
  '--tng-select-option-bg-selected',
  '--tng-select-option-border-selected',
  '--tng-select-option-fg-selected',
  '--tng-select-option-bg-selected-active',
  '--tng-select-option-border-selected-active',
  '--tng-select-option-shadow-selected-active',
  '--tng-select-option-disabled-opacity',
  '--tng-select-option-font-weight',
  '--tng-select-value-font-size',
  '--tng-select-value-font-weight',
  '--tng-select-value-color',
  '--tng-select-icon-margin-inline-end',
  '--tng-select-border',
  '--tng-select-border-strong',
  '--tng-select-border-hover',
  '--tng-select-bg',
  '--tng-select-surface',
  '--tng-select-fg',
  '--tng-select-muted',
  '--tng-select-brand',
  '--tng-select-danger',
  '--tng-select-focus-ring',
  '--tng-select-ease',
  '--tng-select-shadow',
  '--tng-select-shadow-focus',
  '--tng-semantic-background-base',
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

const createSelectOverlayLockId = createTngIdFactory('tng-select-overlay-lock');

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
  selector: '[tngSelectOverlay]',
  exportAs: 'tngSelectOverlay',
})
export class TngSelectOverlay {
  private readonly host = inject<TngSelectHostApi>(TNG_SELECT_HOST);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly instanceId = createSelectOverlayLockId();
  private readonly scrollLock = getGlobalScrollLockManager({
    documentRef: this.elRef.nativeElement.ownerDocument,
  });
  private readonly elementScrollLock = getGlobalElementScrollLockManager({
    documentRef: this.elRef.nativeElement.ownerDocument,
  });
  private readonly resolvedSide = signal<'bottom' | 'left' | 'right' | 'top'>('bottom');
  private readonly presenceState = signal<TngOverlayPresenceState>('closed');
  private readonly presence = createOverlayPresenceController({
    driver: createCssOverlayPresenceDriver({
      elements: () => [this.elRef.nativeElement],
      windowRef: this.elRef.nativeElement.ownerDocument.defaultView,
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
  private scrollAncestors: readonly HTMLElement[] = [];

  public readonly placement = input<TngOverlayPlacement | undefined>(undefined);
  public readonly offset = input<TngOverlayOffset | undefined>(undefined);
  public readonly collision = input<TngOverlayCollisionOptions | undefined>(undefined);
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'select-overlay' as const;

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

  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;
  private removeDocPointerListener: (() => void) | null = null;

  public constructor() {
    this.placeholder = document.createComment('tng-select-overlay-anchor');
    const hostEl = this.elRef.nativeElement;
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);

    effect(() => {
      const open = this.host.open();
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

  private reposition(): void {
    if (!this.host.open()) return;
    const panel = this.elRef.nativeElement;
    const anchorEl = this.findAnchorEl();
    if (!anchorEl) return;

    if (
      this.scrollStrategy() === 'reposition' &&
      !isTngAnchorVisibleInScrollAncestors(anchorEl, this.scrollAncestors)
    ) {
      this.host.close();
      return;
    }

    const anchor = anchorRectFor(anchorEl);
    const overlay = rectFromClientRect(panel.getBoundingClientRect());
    const viewport = viewportRect();

    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
      placement: this.placement(),
      offset: this.offset(),
      collision: this.collision(),
    });

    this.setResolvedSide(result.side);
    panel.style.left = `${result.x}px`;
    panel.style.top = `${result.y}px`;
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
      this.scrollLock.acquire(this.instanceId);
      this.elementScrollLock.acquire(this.instanceId, this.scrollAncestors);
    }

    this.setupRepositionListeners();
  }

  private setupRepositionListeners(): void {
    let rafId: number | null = null;
    const schedule = (): void => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        this.reposition();
      });
    };

    const onResize = (): void => schedule();
    window.addEventListener('resize', onResize);
    this.removeResizeListener = (): void => window.removeEventListener('resize', onResize);

    if (this.scrollStrategy() !== 'block') {
      const onScroll = (event: Event): void => {
        if (isInside(event.target, this.elRef.nativeElement)) return;
        if (this.scrollStrategy() === 'close') {
          this.host.close();
          return;
        }
        schedule();
      };
      window.addEventListener('scroll', onScroll, true);
      this.removeScrollListener = (): void => window.removeEventListener('scroll', onScroll, true);
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
    this.scrollLock.release(this.instanceId);
    this.elementScrollLock.release(this.instanceId);
    this.scrollAncestors = [];
  }

  private findTriggerEl(): HTMLElement | null {
    const root = this.host.hostElement;
    return root.querySelector('[data-slot="select-trigger"]') as HTMLElement | null;
  }

  /**
   * Anchor for overlay positioning, width, and dismiss boundary.
   * Prefer the enclosing form-field (so the overlay aligns with the visible
   * field frame), else the select trigger itself.
   */
  private findAnchorEl(): HTMLElement | null {
    return findFormFieldAnchor(this.host.hostElement) ?? this.findTriggerEl();
  }

  private syncPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;
    const hostStyles = getComputedStyle(this.host.hostElement);

    for (const cssVar of PORTALLED_SELECT_THEME_VARS) {
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
    this.elRef.nativeElement.style.zIndex =
      'var(--tng-select-z-overlay, var(--tng-select-overlay-z-index, var(--tng-z-overlay, 2)))';
  }

  private clearPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;

    for (const cssVar of PORTALLED_SELECT_THEME_VARS) {
      panel.style.removeProperty(cssVar);
    }

    panel.style.removeProperty('color-scheme');
  }

  private mountToBodyAndPosition(): void {
    this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
    const anchorEl = this.findAnchorEl();
    this.setupScrollStrategy(anchorEl);
    const panel = this.elRef.nativeElement;
    stampOverlayOwnerId(panel, this.host.hostElement);

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
      const viewportWidth = viewportRect().width;
      const inlineSize = Math.max(0, Math.min(anchor.width, viewportWidth - 16));
      panel.style.width = `${inlineSize}px`;
      panel.style.minWidth = `${inlineSize}px`;
      if (findFormFieldAnchor(this.host.hostElement)) {
        panel.style.maxWidth = 'none';
      }

      const overlay = rectFromClientRect(panel.getBoundingClientRect());
      const viewport = viewportRect();
      const result = computeOverlayPosition({
        anchorRect: anchor,
        overlayRect: overlay,
        viewportRect: viewport,
        placement: this.placement(),
        offset: this.offset(),
        collision: this.collision(),
      });

      this.setResolvedSide(result.side);
      panel.style.left = `${result.x}px`;
      panel.style.top = `${result.y}px`;
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
    panel.style.width = '';
    panel.style.minWidth = '';
    panel.style.maxWidth = '';
    clearOverlayOwnerId(panel);
    this.clearPortalledThemeVars();
    this.teardownOutsidePointer();
  }

  private setupOutsidePointer(): void {
    if (this.removeDocPointerListener) return;

    const onPointerDown = (ev: PointerEvent): void => {
      if (!this.host.open()) return;
      const panel = this.elRef.nativeElement;
      const anchorEl = this.findAnchorEl();
      if (isInside(ev.target, panel)) return;
      if (anchorEl && isInside(ev.target, anchorEl)) return;
      if (
        this.host.multiple() &&
        ev.target &&
        (ev.target as Element).closest?.(
          '[data-slot="select-option"], [data-slot="multi-select-option"]',
        )
      )
        return;
      this.host.close();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeDocPointerListener = (): void => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }

  private teardownOutsidePointer(): void {
    this.removeDocPointerListener?.();
    this.removeDocPointerListener = null;
  }

  private restoreFocusAfterClose(): void {
    const panel = this.elRef.nativeElement;
    if (this.lastFocusedBeforeOpen && document.contains(this.lastFocusedBeforeOpen)) {
      const active = document.activeElement as HTMLElement | null;
      if (!active || panel.contains(active)) {
        this.lastFocusedBeforeOpen.focus();
      }
    }

    this.restoreFocusOnClose();
  }

  private restoreFocusOnClose(): void {
    const panel = this.elRef.nativeElement;
    const active = document.activeElement as HTMLElement | null;
    if (active && panel.contains(active)) {
      const trigger = this.findTriggerEl();
      trigger?.focus();
      return;
    }
    if (document.activeElement === document.body) {
      const trigger = this.findTriggerEl();
      trigger?.focus();
    }
  }
}
