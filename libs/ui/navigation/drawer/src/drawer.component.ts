import {
  Component,
  ContentChild,
  ElementRef,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';


import { TailngOverlayCloseReason } from '../../../popups-overlays/overlay-ref/src/public-api';
import { TailngFocusTrapDirective } from '@tociva/tailng-cdk';

export type TngDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerCloseReason = TailngOverlayCloseReason;

@Component({
  selector: 'tng-drawer',
  standalone: true,
  imports: [TailngFocusTrapDirective],
  templateUrl: './drawer.component.html',
})
export class TailngDrawerComponent {
  /* =====================
   * Projected content
   * ===================== */
  @ContentChild(TemplateRef, { descendants: true })
  drawerTpl?: TemplateRef<unknown>;

  @ViewChild('anchorEl', { static: true })
  anchorEl!: ElementRef<HTMLElement>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  readonly open = input<boolean>(false);
  readonly placement = input<TngDrawerPlacement>('left');

  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  /** Focus trap (a11y) */
  readonly trapFocus = input<boolean>(true);
  readonly restoreFocus = input<boolean>(true);
  readonly autoCapture = input<boolean>(true);
  readonly deferCaptureElements = input<boolean>(false);

  readonly opened = output<void>();
  readonly closed = output<DrawerCloseReason>();

  /* =====================
   * Styling (klass-first)
   * ===================== */
  readonly backdropKlass = input<string>('fixed inset-0 bg-black/40 backdrop-blur-[1px]');
  readonly panelKlass = input<string>('bg-bg shadow-xl outline-none');

  readonly sizeKlass = input<string>('w-80'); // for left/right
  readonly heightKlass = input<string>('h-80'); // for top/bottom

  /* =====================
   * Internal
   * ===================== */
  readonly isOpen = signal(false);

  readonly overlayPlacement = computed(() => {
    switch (this.placement()) {
      case 'left':
        return 'bottom-start';
      case 'right':
        return 'bottom-end';
      case 'top':
        return 'top-start';
      case 'bottom':
        return 'bottom-start';
    }
  });

  readonly slideClasses = computed(() => {
    const base = 'fixed transition-transform duration-200 ease-in-out will-change-transform';

    switch (this.placement()) {
      case 'left':
        return `${base} left-0 top-0 h-full ${
          this.isOpen() ? 'translate-x-0' : '-translate-x-full'
        }`;
      case 'right':
        return `${base} right-0 top-0 h-full ${
          this.isOpen() ? 'translate-x-0' : 'translate-x-full'
        }`;
      case 'top':
        return `${base} top-0 left-0 w-full ${
          this.isOpen() ? 'translate-y-0' : '-translate-y-full'
        }`;
      case 'bottom':
        return `${base} bottom-0 left-0 w-full ${
          this.isOpen() ? 'translate-y-0' : 'translate-y-full'
        }`;
    }
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.isOpen.set(true);
        this.opened.emit();
      } else {
        this.isOpen.set(false);
      }
    });
  }

  onOverlayClosed(reason: DrawerCloseReason) {
    this.closed.emit(reason);
  }

  onBackdropClick() {
    if (!this.closeOnBackdropClick()) return;
    this.closed.emit('outside-click');
  }

  /** Keep escape handling scoped to drawer (instead of document listener) */
  onPanelKeydown(ev: KeyboardEvent): void {
    if (!this.open()) return;
    if (!this.closeOnEscape()) return;
    if (ev.defaultPrevented) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.closed.emit('escape');
    }
  }
}
