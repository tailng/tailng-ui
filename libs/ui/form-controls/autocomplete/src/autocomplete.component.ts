import {
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { TailngConnectedOverlayComponent, TailngOverlayPanelComponent } from '@tailng/ui';
import { handleListKeyboardEvent } from 'libs/cdk/keyboard/keyboard-navigation';

// ✅ Fix import path (use your barrel export ideally)
// Example: import { handleListKeyboardEvent } from '@tailng/cdk';

export type AutocompleteCloseReason =
  | 'selection'
  | 'escape'
  | 'outside-click'
  | 'blur'
  | 'programmatic';

@Component({
  selector: 'tng-autocomplete',
  standalone: true,
  imports: [TailngConnectedOverlayComponent, TailngOverlayPanelComponent],
  templateUrl: './autocomplete.component.html',
})
export class TailngAutocompleteComponent<T> {
  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  @ViewChild('listbox', { static: false })
  listbox?: ElementRef<HTMLElement>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  options = input<T[]>([]);
  placeholder = input<string>('Start typing…');
  disabled = input<boolean>(false);
  displayWith = input<(item: T) => string>((v) => String(v));

  readonly search = output<string>();
  readonly selected = output<T>();
  readonly closed = output<AutocompleteCloseReason>();

  /* =====================
   * Internal State
   * ===================== */
  inputValue = signal('');
  isOpen = signal(false);
  focusedIndex = signal(-1);

  /* =====================
   * Display helper
   * ===================== */
  display(item: T): string {
    return this.displayWith()(item);
  }

  /* =====================
   * State Transitions
   * ===================== */
  open(_reason: AutocompleteCloseReason) {
    if (this.disabled()) return;

    // Don’t early return: focus should be able to "re-open" and reset index if needed
    this.isOpen.set(true);

    if (this.options().length) {
      const current = this.focusedIndex();
      if (current < 0) this.focusedIndex.set(0);
    } else {
      this.focusedIndex.set(-1);
    }
  }

  close(reason: AutocompleteCloseReason) {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.closed.emit(reason);
  }

  /* =====================
   * Overlay callbacks
   * ===================== */
  onOverlayClosed(reason: AutocompleteCloseReason) {
    // Overlay can emit 'outside-click' or 'escape'
    this.close(reason);
  }

  /* =====================
   * UI Events
   * ===================== */
  onInput(ev: Event) {
    const value = (ev.target as HTMLInputElement).value ?? '';
    this.inputValue.set(value);
    this.search.emit(value);
    this.open('programmatic');
  }

  onKeydown(ev: KeyboardEvent) {
    // If closed, allow ArrowDown/ArrowUp to open
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      this.open('programmatic');
      return;
    }

    const action = handleListKeyboardEvent(ev, {
      activeIndex: this.focusedIndex(),
      itemCount: this.options().length,
      loop: false,
    });

    switch (action.type) {
      case 'move':
        this.focusedIndex.set(action.index);
        this.scrollActiveIntoView(action.index);
        break;

      case 'select': {
        const item = this.options()[action.index];
        if (item !== undefined) {
          this.select(item, action.index);
        }
        break;
      }

      case 'close':
        this.close('escape');
        break;

      case 'noop':
      default:
        break;
    }
  }

  select(item: T, _index: number) {
    this.inputValue.set(this.displayWith()(item));
    this.selected.emit(item);
    this.close('selection');

    queueMicrotask(() => {
      this.inputEl.nativeElement.focus();
    });
  }

  private scrollActiveIntoView(index: number) {
    const listbox = this.listbox?.nativeElement;
    if (!listbox) return;
    if (index < 0) return;

    queueMicrotask(() => {
      const el = listbox.querySelector<HTMLElement>(`[data-index="${index}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    });
  }
}
