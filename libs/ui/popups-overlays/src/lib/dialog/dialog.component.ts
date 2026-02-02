import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { TngFocusTrap } from '@tociva/tailng-cdk/a11y';

export type TngDialogCloseReason =
  | 'confirm'
  | 'cancel'
  | 'escape'
  | 'outside-click'
  | 'programmatic';

@Component({
  selector: 'tng-dialog',
  standalone: true,
  imports: [TngFocusTrap],
  templateUrl: './dialog.component.html',
})
export class TngDialog {
  /** Controlled open state */
  readonly open = input<boolean>(false);

  /** Close behavior */
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  /** a11y */
  readonly ariaLabel = input<string>('Dialog');

  /** Focus trap (a11y) */
  readonly trapFocus = input<boolean>(true);
  readonly restoreFocus = input<boolean>(true);
  readonly autoCapture = input<boolean>(true);
  readonly deferCaptureElements = input<boolean>(false);

  /** When no tabbables exist, focus the panel */
  readonly autoFocusPanelWhenEmpty = input<boolean>(true);

  /** Klass inputs */
  readonly backdropKlass = input<string>('fixed inset-0 bg-black/40');
  readonly panelKlass = input<string>(
    [
      'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      'w-[min(32rem,calc(100vw-2rem))]',
      'max-h-[calc(100vh-2rem)] overflow-auto',
      'rounded-lg border border-border bg-bg shadow-xl outline-none',
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

  /** Panel ref */
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private readonly injector = inject(Injector);

  private didEmitOpened = false;

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;

      // afterNextRender must be called inside injection context
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => this.focusPanelIfNoTabbable());
      });
    });
  }

  ngDoCheck(): void {
    if (this.isOpen() && !this.didEmitOpened) {
      this.didEmitOpened = true;
      this.opened.emit();

      // Optional extra attempt
      queueMicrotask(() => this.focusPanelIfNoTabbable());
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

  onPanelKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;
    if (!this.closeOnEscape()) return;
    if (ev.defaultPrevented) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.requestClose('escape');
    }
  }

  private focusPanelIfNoTabbable(): void {
    if (!this.isOpen()) return;
    if (!this.trapFocus()) return;
    if (!this.autoFocusPanelWhenEmpty()) return;

    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    const active = document.activeElement as HTMLElement | null;
    if (active && panel.contains(active)) return;

    if (this.hasTabbable(panel)) return;

    panel.focus();
  }

  private hasTabbable(root: HTMLElement): boolean {
    const candidates = root.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        '[tabindex]',
        '[contenteditable="true"]',
      ].join(',')
    );

    for (const el of Array.from(candidates)) {
      if (el === root) continue;
      if (el.hasAttribute('disabled')) continue;
      if ((el as HTMLInputElement).type === 'hidden') continue;

      const tabindexAttr = el.getAttribute('tabindex');
      const tabindex = tabindexAttr == null ? 0 : Number(tabindexAttr);
      if (Number.isNaN(tabindex) || tabindex < 0) continue;

      if (el.getClientRects().length === 0) continue;

      return true;
    }
    return false;
  }
}
