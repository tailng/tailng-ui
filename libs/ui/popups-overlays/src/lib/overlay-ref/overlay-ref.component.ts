import { Component, computed, input, output } from '@angular/core';

export type TngOverlayCloseReason =
  | 'selection'
  | 'escape'
  | 'outside-click'
  | 'blur'
  | 'programmatic';

@Component({
  selector: 'tng-overlay-ref',
  standalone: true,
  templateUrl: './overlay-ref.component.html',
  exportAs: 'tngOverlayRef',
})
export class TngOverlayRef<R = TngOverlayCloseReason> {
  /**
   * Controlled open state (parent owns state).
   * Use [(open)]="signal()" style with openChange.
   */
  readonly open = input<boolean>(false);
  readonly openChange = output<boolean>();

  /** Lifecycle outputs */
  readonly opened = output<void>();
  readonly closed = output<R>();

  /** Read-only computed */
  readonly isOpen = computed(() => this.open());

  /** Request open (controlled) */
  requestOpen() {
    if (this.open()) return;
    this.openChange.emit(true);
    this.opened.emit();
  }

  /** Request close (controlled) */
  requestClose(reason: R) {
    if (!this.open()) return;
    this.openChange.emit(false);
    this.closed.emit(reason);
  }

  /** Convenience aliases */
  openOverlay() {
    this.requestOpen();
  }

  close(reason: R) {
    this.requestClose(reason);
  }

  toggle() {
    this.open() ? this.requestClose('programmatic' as R) : this.requestOpen();
  }
}
