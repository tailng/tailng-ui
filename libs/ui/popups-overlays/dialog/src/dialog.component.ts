import { Component, HostListener, computed, input, output } from '@angular/core';

export type TngDialogCloseReason =
  | 'confirm'
  | 'cancel'
  | 'escape'
  | 'outside-click'
  | 'programmatic';

@Component({
  selector: 'tng-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
})
export class TailngDialogComponent {
  /** Controlled open state */
  readonly open = input<boolean>(false);

  /** Close behavior */
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  /** a11y */
  readonly ariaLabel = input<string>('Dialog');

  /** Klass inputs (Tailng style) */
  readonly backdropKlass = input<string>('fixed inset-0 bg-black/40');
  readonly panelKlass = input<string>(
    [
      'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      'w-[min(32rem,calc(100vw-2rem))]',
      'max-h-[calc(100vh-2rem)] overflow-auto',
      'rounded-lg border border-border bg-background shadow-xl outline-none',
    ].join(' ')
  );

  readonly headerWrapKlass = input<string>('border-b border-border px-4 py-3');
  readonly bodyWrapKlass = input<string>('px-4 py-4');
  readonly footerWrapKlass = input<string>('border-t border-border px-4 py-3');

  /** Outputs */
  readonly closed = output<TngDialogCloseReason>();
  readonly opened = output<void>();

  /** Derived */
  readonly isOpen = computed(() => this.open());

  // Fire "opened" once per open cycle (simple, no stateful overlay ref needed)
  private didEmitOpened = false;

  constructor() {
    // no-op
  }

  ngDoCheck(): void {
    // tiny lifecycle hook to emit opened when open becomes true
    if (this.isOpen() && !this.didEmitOpened) {
      this.didEmitOpened = true;
      this.opened.emit();
    }
    if (!this.isOpen() && this.didEmitOpened) {
      this.didEmitOpened = false;
    }
  }

  requestClose(reason: TngDialogCloseReason) {
    if (!this.open()) return;
    this.closed.emit(reason);
  }

  onBackdropClick() {
    if (!this.closeOnBackdropClick()) return;
    this.requestClose('outside-click');
  }

  @HostListener('document:keydown', ['$event'])
  onDocKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;
    if (!this.closeOnEscape()) return;
    if (ev.defaultPrevented) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.requestClose('escape');
    }
  }
}
