import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  computeOverlayPosition,
  createTngIdFactory,
  getGlobalElementScrollLockManager,
  getGlobalScrollLockManager,
  isTngAnchorVisibleInScrollAncestors,
  resolveAnchoredYWhenOffscreen,
  resolveTngScrollableAncestors,
  type TngOverlayScrollStrategy,
} from '@tailng-ui/cdk';
import {
  clearOverlayOwnerId,
  stampOverlayOwnerId,
} from '../../overlay/_shared/tng-overlay-ownership';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

type MaybeRect = Readonly<{ left: number; top: number; width: number; height: number }>;

const PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS = [
  '--tng-multi-autocomplete-radius',
  '--tng-multi-autocomplete-padding',
  '--tng-multi-autocomplete-trigger-py',
  '--tng-multi-autocomplete-trigger-px',
  '--tng-multi-autocomplete-chip-py',
  '--tng-multi-autocomplete-chip-px',
  '--tng-multi-autocomplete-option-py',
  '--tng-multi-autocomplete-option-px',
  '--tng-multi-autocomplete-z-overlay',
  '--tng-multi-autocomplete-overlay-z-index',
  '--tng-z-overlay',
  '--tng-multi-autocomplete-border',
  '--tng-multi-autocomplete-border-strong',
  '--tng-multi-autocomplete-bg',
  '--tng-multi-autocomplete-surface',
  '--tng-multi-autocomplete-fg',
  '--tng-multi-autocomplete-muted',
  '--tng-multi-autocomplete-brand',
  '--tng-multi-autocomplete-danger',
  '--tng-multi-autocomplete-focus-ring',
  '--tng-multi-autocomplete-ease',
  '--tng-multi-autocomplete-shadow',
  '--tng-multi-autocomplete-shadow-focus',
] as const;

const createMultiAutocompleteOverlayLockId = createTngIdFactory(
  'tng-multi-autocomplete-overlay-lock',
);

function rectFromClientRect(r: DOMRect | ClientRect): MaybeRect {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function viewportRect(): MaybeRect {
  return {
    left: 0,
    top: 0,
    width: window.innerWidth || 1024,
    height: window.innerHeight || 768,
  };
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
  selector: '[tngMultiAutocompleteOverlay]',
  exportAs: 'tngMultiAutocompleteOverlay',
})
export class TngMultiAutocompleteOverlay {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly instanceId = createMultiAutocompleteOverlayLockId();
  private readonly documentRef = this.elRef.nativeElement.ownerDocument;
  private readonly bodyScrollLock = getGlobalScrollLockManager({
    documentRef: this.documentRef,
  });
  private readonly elementScrollLock = getGlobalElementScrollLockManager({
    documentRef: this.documentRef,
  });

  private removeResizeListener: (() => void) | null = null;
  private removeScrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private removeDocPointerListener: (() => void) | null = null;
  private placeholder: Comment | null = null;
  private originalParent: Node | null = null;
  private scrollAncestors: readonly HTMLElement[] = [];

  readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-overlay' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.multi.open() ? null : '';
  }

  constructor() {
    const hostEl = this.elRef.nativeElement;
    this.placeholder = document.createComment('tng-multi-autocomplete-overlay-anchor');
    this.originalParent = hostEl.parentNode;
    this.originalParent?.insertBefore(this.placeholder, hostEl);
    this.multi.setOverlayElement(hostEl);

    effect(() => {
      const open = this.multi.open();
      if (open) {
        this.mountToBodyAndPosition();
      } else {
        this.restoreToPlaceholder();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.teardownOutsidePointer();
      this.restoreToPlaceholder(true);
      this.multi.setOverlayElement(null);
      this.placeholder = null;
      this.originalParent = null;
    });
  }

  /**
   * Anchor for overlay positioning, width, and dismiss boundary.
   * Prefer the enclosing form-field (so the overlay aligns with the visible
   * field frame), else the multi-autocomplete host element itself.
   */
  private findAnchorEl(): HTMLElement {
    return findFormFieldAnchor(this.multi.hostElement) ?? this.multi.hostElement;
  }

  private reposition(closeWhenAnchorHidden = true): void {
    if (!this.multi.open()) return;

    const panel = this.elRef.nativeElement;
    const anchorEl = this.findAnchorEl();

    if (
      closeWhenAnchorHidden &&
      this.scrollStrategy() === 'reposition' &&
      !isTngAnchorVisibleInScrollAncestors(anchorEl, this.scrollAncestors)
    ) {
      this.multi.close();
      return;
    }

    const anchor = anchorRectFor(anchorEl);
    const overlay = rectFromClientRect(panel.getBoundingClientRect());
    const viewport = viewportRect();
    const result = computeOverlayPosition({
      anchorRect: anchor,
      overlayRect: overlay,
      viewportRect: viewport,
    });

    panel.style.left = `${result.x}px`;
    panel.style.top = `${resolveAnchoredYWhenOffscreen({
      anchorRect: anchor,
      overlayRect: overlay,
      side: result.side,
      viewportRect: viewport,
      y: result.y,
    })}px`;
  }

  private setupScrollStrategy(anchorEl: HTMLElement): void {
    this.teardownScrollStrategy();
    this.scrollAncestors = resolveTngScrollableAncestors(anchorEl);

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
          this.multi.close();
          return;
        }
        schedule();
      };
      window.addEventListener('scroll', onScroll, true);
      this.removeScrollListener = () => window.removeEventListener('scroll', onScroll, true);
    }

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => schedule());
      this.resizeObserver.observe(this.findAnchorEl());
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

    const onPointerDown = (event: PointerEvent) => {
      if (!this.multi.open()) return;

      const panel = this.elRef.nativeElement;
      if (isInside(event.target, panel)) return;
      if (isInside(event.target, this.findAnchorEl())) return;
      if (
        event.target &&
        (event.target as Element).closest?.('[data-slot="multi-autocomplete-option"]')
      ) {
        return;
      }

      this.multi.close();
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
    const hostStyles = getComputedStyle(this.multi.hostElement);

    for (const cssVar of PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS) {
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
      'var(--tng-multi-autocomplete-z-overlay, var(--tng-multi-autocomplete-overlay-z-index, var(--tng-z-overlay, 2)))';
  }

  private clearPortalledThemeVars(): void {
    const panel = this.elRef.nativeElement;

    for (const cssVar of PORTALLED_MULTI_AUTOCOMPLETE_THEME_VARS) {
      panel.style.removeProperty(cssVar);
    }

    panel.style.removeProperty('color-scheme');
  }

  private mountToBodyAndPosition(): void {
    const anchorEl = this.findAnchorEl();
    this.setupScrollStrategy(anchorEl);

    const panel = this.elRef.nativeElement;
    stampOverlayOwnerId(panel, this.multi.hostElement);
    if (panel.parentNode !== document.body) {
      document.body.appendChild(panel);
    }

    panel.style.position = 'fixed';
    panel.style.left = '0px';
    panel.style.top = '0px';
    this.syncPortalledThemeVars();
    this.applyPortalledStacking();

    queueMicrotask(() => {
      if (!this.multi.open()) return;

      const anchor = anchorRectFor(anchorEl);
      const viewportWidth = viewportRect().width;
      const inlineSize = Math.max(0, Math.min(anchor.width, viewportWidth - 16));
      panel.style.width = `${inlineSize}px`;
      panel.style.minWidth = `${inlineSize}px`;
      this.reposition(false);
    });

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
    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.zIndex = '';
    panel.style.width = '';
    panel.style.minWidth = '';
    clearOverlayOwnerId(panel);
    this.clearPortalledThemeVars();
    this.teardownOutsidePointer();
  }
}
