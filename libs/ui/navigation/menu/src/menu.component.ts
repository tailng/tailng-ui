import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  TemplateRef,
  ViewChild,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayCloseReason,
  TailngOverlayRefComponent,
} from '../../../popups-overlays/overlay-ref/src/public-api';

export type MenuCloseReason = TailngOverlayCloseReason;

export type TngMenuPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

@Component({
  selector: 'tng-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
    TailngOverlayRefComponent,
  ],
  templateUrl: './menu.component.html',
})
export class TailngMenuComponent {
  @ContentChild(TemplateRef, { descendants: true })
  menuTpl?: TemplateRef<unknown>;

  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  /** NEW: modal mode (focus trapped + backdrop semantics) */
  readonly modal = input<boolean>(false);

  readonly placement = input<TngMenuPlacement>('bottom-start');
  readonly offset = input<number>(6);
  readonly width = input<'anchor' | number>('anchor');

  readonly closeOnOutsideClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly closeOnItemClick = input<boolean>(true);

  readonly rootKlass = input<string>('relative inline-block');
  readonly triggerKlass = input<string>('inline-flex');
  readonly panelKlass = input<string>('p-1');

  /** NEW: backdrop classes for modal */
  readonly backdropKlass = input<string>('fixed inset-0 bg-black/40');

  readonly opened = output<void>();
  readonly closed = output<MenuCloseReason>();

  readonly isOpen = signal(false);

  constructor() {
    // When closed, refocus trigger (simple + customer-friendly)
    effect(() => {
      if (this.isOpen()) return;
      queueMicrotask(() => this.triggerEl?.nativeElement?.focus());
    });
  }

  open(_reason: MenuCloseReason) {
    this.isOpen.set(true);
    void _reason;
  }

  close(reason: MenuCloseReason) {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.closed.emit(reason);
  }

  onOverlayOpenChange(open: boolean) {
    if (open) this.open('programmatic');
    else this.close('programmatic');
  }

  onOverlayOpened() {
    this.opened.emit();
  }

  onOverlayClosed(reason: MenuCloseReason) {
    this.close(reason);
  }

  onTriggerClick() {
    this.isOpen() ? this.close('programmatic') : this.open('programmatic');
  }

  requestCloseOnSelection(): void {
    if (!this.closeOnItemClick()) return;
    this.close('selection');
  }

  // Back-compat
  onItemSelected(): void {
    this.requestCloseOnSelection();
  }

  /** Derived close behavior in modal mode (force predictable modal semantics) */
  readonly effectiveCloseOnOutsideClick = () =>
    this.modal() ? true : this.closeOnOutsideClick();

  readonly effectiveCloseOnEscape = () =>
    this.modal() ? true : this.closeOnEscape();

  /** Backdrop click closes only in modal mode (and if allowed) */
  onBackdropClick(): void {
    if (!this.modal()) return;
    if (!this.effectiveCloseOnOutsideClick()) return;
    this.close('outside-click');
  }
}
