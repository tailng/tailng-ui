import {
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { TailngConnectedOverlayComponent, TailngOptionListComponent, TailngOverlayPanelComponent } from '@tailng/ui';

import { handleListKeyboardEvent } from 'libs/cdk/keyboard/keyboard-navigation';


export type SelectCloseReason =
  | 'selection'
  | 'escape'
  | 'outside-click'
  | 'programmatic';

@Component({
  selector: 'tng-select',
  standalone: true,
  imports: [
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
    TailngOptionListComponent,
  ],
  templateUrl: './select.component.html',
})
export class TailngSelectComponent<T> {
  @ViewChild('triggerEl', { static: true })
  triggerEl!: ElementRef<HTMLElement>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  options = input<T[]>([]);
  value = input<T | null>(null);
  placeholder = input<string>('Select…');
  disabled = input<boolean>(false);
  displayWith = input<(item: T) => string>((v) => String(v));

  readonly selected = output<T>();
  readonly closed = output<SelectCloseReason>();

  /* =====================
   * State
   * ===================== */
  isOpen = signal(false);
  activeIndex = signal<number>(-1);

  /* =====================
   * Helpers
   * ===================== */
  display(item: T | null): string {
    return item == null ? '' : this.displayWith()(item);
  }

  /* =====================
   * State transitions
   * ===================== */
  open(reason: SelectCloseReason) {
    if (this.disabled()) return;

    this.isOpen.set(true);

    const current = this.value();
    if (current != null) {
      const idx = this.options().indexOf(current);
      this.activeIndex.set(idx >= 0 ? idx : 0);
    } else {
      this.activeIndex.set(this.options().length ? 0 : -1);
    }
  }

  close(reason: SelectCloseReason) {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.closed.emit(reason);

    queueMicrotask(() => {
      this.triggerEl.nativeElement.focus();
    });
  }

  /* =====================
   * Overlay callback
   * ===================== */
  onOverlayClosed(reason: SelectCloseReason) {
    this.close(reason);
  }

  /* =====================
   * UI Events
   * ===================== */
  onTriggerClick() {
    this.isOpen() ? this.close('programmatic') : this.open('programmatic');
  }

  onKeydown(ev: KeyboardEvent) {
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      ev.preventDefault();
      this.open('programmatic');
      return;
    }

    const action = handleListKeyboardEvent(ev, {
      activeIndex: this.activeIndex(),
      itemCount: this.options().length,
      loop: false,
    });

    switch (action.type) {
      case 'move':
        this.activeIndex.set(action.index);
        break;

      case 'select': {
        const item = this.options()[action.index];
        if (item !== undefined) {
          this.select(item);
        }
        break;
      }

      case 'close':
        this.close('escape');
        break;
    }
  }

  select(item: T) {
    this.selected.emit(item);
    this.close('selection');
  }
}
