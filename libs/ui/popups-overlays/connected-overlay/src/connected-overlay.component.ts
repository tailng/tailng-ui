import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

export type TngOverlayPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

export type TngOverlayCloseReason =
  | 'outside-click'
  | 'inside-click'
  | 'escape'
  | 'programmatic'
  | 'detach';

@Component({
  selector: 'tng-connected-overlay',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './connected-overlay.component.html',
})
export class TailngConnectedOverlayComponent {
  /**
   * Control
   */
  readonly open = input<boolean>(false);

  /**
   * Anchor: pass either ElementRef<HTMLElement> or HTMLElement
   * Example: [anchor]="inputEl" where inputEl is ElementRef<HTMLInputElement>
   */
  readonly anchor = input<ElementRef<HTMLElement> | HTMLElement | null>(null);

  /**
   * Position / size
   */
  readonly placement = input<TngOverlayPlacement>('bottom-start');
  readonly offset = input<number>(6);
  readonly width = input<'anchor' | number>('anchor');

  /**
   * Close behavior
   */
  readonly closeOnOutsideClick = input<boolean>(true);
  readonly closeOnInsideClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  /**
   * Backdrop (modal semantics)
   */
  readonly hasBackdrop = input<boolean>(false);
  readonly backdropClass = input<string>('fixed inset-0 bg-black/40 z-[999]');

  /**
   * Events
   */
  readonly opened = output<void>();
  readonly closed = output<TngOverlayCloseReason>();
  readonly backdropClick = output<void>();

  @ViewChild('overlayRoot', { static: false })
  private overlayRoot?: ElementRef<HTMLElement>;

  // Internal position state
  private readonly topPx = signal<number>(0);
  private readonly leftPx = signal<number>(0);
  private readonly widthPx = signal<number | null>(null);
  private readonly minWidthPx = signal<number | null>(null);

  // Cache whether we already emitted "opened" for current open cycle
  private didEmitOpened = false;

  // RAF guard for resize/scroll repositioning
  private raf = 0;

  /**
   * Resolve anchor element
   */
  readonly anchorEl = computed<HTMLElement | null>(() => {
    const a = this.anchor();
    if (!a) return null;
    return a instanceof ElementRef ? a.nativeElement : a;
  });

  /**
   * Overlay style for template
   */
  readonly overlayStyle = computed(() => {
    const top = this.topPx();
    const left = this.leftPx();
    const width = this.widthPx();
    const minWidth = this.minWidthPx();

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: width != null ? `${width}px` : undefined,
      minWidth: minWidth != null ? `${minWidth}px` : undefined,
    } as Record<string, string | undefined>;
  });

  constructor() {
    // When open/anchor changes, recompute position
    effect(() => {
      const isOpen = this.open();
      const anchorEl = this.anchorEl();

      if (!isOpen || !anchorEl) {
        this.didEmitOpened = false;
        return;
      }

      // Initial calc
      this.updatePosition();

      // Recalc after content renders so we can measure height (top placements + clamping)
      queueMicrotask(() => {
        if (this.open()) this.updatePosition();
      });

      if (!this.didEmitOpened) {
        this.didEmitOpened = true;
        this.opened.emit();
      }
    });
  }

  /**
   * Public API: parent can call close programmatically (optional)
   */
  close(reason: TngOverlayCloseReason = 'programmatic'): void {
    // Controlled component: parent must set [open]=false.
    this.closed.emit(reason);
  }

  /**
   * Recompute overlay position
   */
  updatePosition(): void {
    const anchor = this.anchorEl();
    if (!anchor) {
      this.close('detach');
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const offset = this.offset();
    const placement = this.placement();

    // Determine width setting (style)
    const w = this.width();
    if (w === 'anchor') {
      this.minWidthPx.set(rect.width);
      this.widthPx.set(rect.width);
    } else if (typeof w === 'number') {
      this.minWidthPx.set(null);
      this.widthPx.set(w);
    } else {
      this.minWidthPx.set(null);
      this.widthPx.set(null);
    }

    // Measure panel if present
    const panelEl = this.overlayRoot?.nativeElement ?? null;
    const panelRect = panelEl?.getBoundingClientRect() ?? null;

    const panelW = panelRect?.width ?? this.getOverlayWidthForPosition(rect);
    const panelH = panelRect?.height ?? 0;

    // Position calculation (viewport coords; overlay is `position: fixed`)
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'bottom-start':
        top = rect.bottom + offset;
        left = rect.left;
        break;

      case 'bottom-end':
        top = rect.bottom + offset;
        left = rect.right - panelW;
        break;

      case 'top-start':
        top = rect.top - offset - panelH;
        left = rect.left;
        break;

      case 'top-end':
        top = rect.top - offset - panelH;
        left = rect.right - panelW;
        break;
    }

    // Viewport clamping
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxLeft = Math.max(pad, vw - pad - panelW);
    const maxTop = Math.max(pad, vh - pad - panelH);

    left = Math.max(pad, Math.min(left, maxLeft));
    top = Math.max(pad, Math.min(top, maxTop));

    this.leftPx.set(left);
    this.topPx.set(top);
  }

  private getOverlayWidthForPosition(anchorRect: DOMRect): number {
    const w = this.width();
    if (w === 'anchor') return anchorRect.width;
    if (typeof w === 'number') return w;

    // fallback: use rendered width if available, else anchor width
    return this.overlayRoot?.nativeElement?.getBoundingClientRect().width ?? anchorRect.width;
  }

  private requestReposition(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (this.open()) this.updatePosition();
    });
  }

  /**
   * Backdrop pointerdown (if enabled)
   */
  onBackdropPointerDown(ev: PointerEvent): void {
    if (!this.open()) return;

    ev.preventDefault();
    this.backdropClick.emit();

    if (this.closeOnOutsideClick()) {
      this.close('outside-click');
    }
  }

  /**
   * Close on escape
   */
  @HostListener('document:keydown', ['$event'])
  onDocKeydown(ev: KeyboardEvent): void {
    if (!this.open()) return;
    if (!this.closeOnEscape()) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.close('escape');
    }
  }

  /**
   * Close on outside click (and optionally inside click)
   * Use pointerdown so it works for mouse/touch/pen and is earlier than click.
   */
  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(ev: PointerEvent): void {
    if (!this.open()) return;

    const target = ev.target as Node | null;
    if (!target) return;

    const anchor = this.anchorEl();
    const panel = this.overlayRoot?.nativeElement ?? null;

    const inAnchor = !!anchor && anchor.contains(target);
    const inPanel = !!panel && panel.contains(target);

    // Anchor should never be treated as outside.
    if (inAnchor) return;

    // If backdrop is enabled and we clicked backdrop, the backdrop handler will run.
    // Still, keep logic safe: treat it as outside.
    if (inPanel) {
      if (this.closeOnInsideClick()) this.close('inside-click');
      return;
    }

    if (this.closeOnOutsideClick()) this.close('outside-click');
  }

  /**
   * Keep position in sync on viewport changes
   */
  @HostListener('window:resize')
  onResize(): void {
    this.requestReposition();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.requestReposition();
  }
}