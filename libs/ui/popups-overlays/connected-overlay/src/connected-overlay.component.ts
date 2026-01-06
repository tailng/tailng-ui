import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
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

export type TngOverlayCloseReason = 'outside-click' | 'escape' | 'programmatic' | 'detach';

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
  open = input<boolean>(false);

  /**
   * Anchor: pass either ElementRef<HTMLElement> or HTMLElement
   * Example: [anchor]="inputEl" where inputEl is ElementRef<HTMLInputElement>
   */
  anchor = input<ElementRef<HTMLElement> | HTMLElement | null>(null);

  /**
   * Position / size
   */
  placement = input<TngOverlayPlacement>('bottom-start');
  offset = input<number>(6);
  width = input<'anchor' | number>('anchor');

  /**
   * Close behavior
   */
  closeOnOutsideClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);

  /**
   * Events
   */
  opened = output<void>();
  closed = output<TngOverlayCloseReason>();

  // Internal position state
  private readonly topPx = signal<number>(0);
  private readonly leftPx = signal<number>(0);
  private readonly widthPx = signal<number | null>(null);
  private readonly minWidthPx = signal<number | null>(null);

  // Cache whether we already emitted "opened" for current open cycle
  private didEmitOpened = false;

  /**
   * Resolve anchor element
   */
  anchorEl = computed<HTMLElement | null>(() => {
    const a = this.anchor();
    if (!a) return null;
    return a instanceof ElementRef ? a.nativeElement : a;
  });

  /**
   * Overlay style for template
   */
  overlayStyle = computed(() => {
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

      this.updatePosition();

      if (!this.didEmitOpened) {
        this.didEmitOpened = true;
        this.opened.emit();
      }
    });
  }

  /**
   * Public API: parent can call close programmatically (optional)
   */
  close(reason: TngOverlayCloseReason = 'programmatic') {
    // This component is controlled via [open],
    // so we cannot set open() here (input is readonly).
    // We just emit a close reason; parent should set open=false.
    this.closed.emit(reason);
  }

  /**
   * Recompute overlay position
   */
  updatePosition() {
    const anchor = this.anchorEl();
    if (!anchor) {
      this.close('detach');
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const offset = this.offset();

    // Determine width
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

    const placement = this.placement();

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
        left = rect.right - rect.width; // align end; if width differs you may adjust later
        break;

      case 'top-start':
        top = rect.top - offset; // panel height unknown in v1; we’ll improve later
        left = rect.left;
        break;

      case 'top-end':
        top = rect.top - offset;
        left = rect.right - rect.width;
        break;
    }

    // Basic viewport clamping (v1)
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    left = Math.max(pad, Math.min(left, vw - pad));
    top = Math.max(pad, Math.min(top, vh - pad));

    this.leftPx.set(left);
    this.topPx.set(top);
  }

  /**
   * Close on escape
   */
  @HostListener('document:keydown', ['$event'])
  onDocKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;
    if (!this.closeOnEscape()) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.close('escape');
    }
  }

  /**
   * Close on outside click
   */
  @HostListener('document:mousedown', ['$event'])
  onDocMousedown(ev: MouseEvent) {
    if (!this.open()) return;
    if (!this.closeOnOutsideClick()) return;

    const anchor = this.anchorEl();
    const target = ev.target as Node | null;
    if (!anchor || !target) return;

    // Click inside anchor should not close.
    if (anchor.contains(target)) return;

    // Click inside overlay panel should not close.
    // We don’t have a direct ref to overlay div in v1; we’ll add it later.
    // For now: if click isn't inside anchor, we close.
    this.close('outside-click');
  }

  /**
   * Keep position in sync on viewport changes
   */
  @HostListener('window:resize')
  onResize() {
    if (this.open()) this.updatePosition();
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.open()) this.updatePosition();
  }
}
