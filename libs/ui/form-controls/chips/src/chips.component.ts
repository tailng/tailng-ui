import {
  Component,
  ElementRef,
  ViewChild,
  input,
  output,
  signal,
} from '@angular/core';
import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import { handleListKeyboardEvent } from 'libs/cdk/keyboard/keyboard-navigation';

export type ChipsCloseReason =
  | 'selection'
  | 'escape'
  | 'outside-click'
  | 'blur'
  | 'programmatic';

@Component({
  selector: 'tng-chips',
  standalone: true,
  imports: [TailngConnectedOverlayComponent, TailngOverlayPanelComponent],
  templateUrl: './chips.component.html',
})
export class TailngChipsComponent<T> {
  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  @ViewChild('listbox', { static: false })
  listbox?: ElementRef<HTMLElement>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  // current selected chips (controlled)
  value = input<T[]>([]);

  // suggestions
  options = input<T[]>([]);

  placeholder = input<string>('Add…');
  disabled = input<boolean>(false);

  // how to render any chip / option
  displayWith = input<(item: T) => string>((v) => String(v));

  // whether user can add arbitrary text as chip
  allowFreeText = input<boolean>(true);

  // convert typed string -> T (only used when allowFreeText is true)
  // default casts as unknown T (works for string chips)
  parse = input<(raw: string) => T>((raw) => raw as unknown as T);

  // optional: normalize typed text (trim, collapse spaces, etc.)
  normalize = input<(raw: string) => string>((raw) => raw.trim());

  // optional: prevent duplicates (by display text)
  preventDuplicates = input<boolean>(true);

  readonly search = output<string>();
  readonly valueChange = output<T[]>();
  readonly chipAdded = output<T>();
  readonly chipRemoved = output<T>();
  readonly closed = output<ChipsCloseReason>();

  /* =====================
   * Internal State
   * ===================== */
  inputValue = signal('');
  isOpen = signal(false);
  focusedIndex = signal(-1);

  /* =====================
   * Helpers
   * ===================== */
  display(item: T): string {
    return this.displayWith()(item);
  }

  private existsAlready(next: T): boolean {
    if (!this.preventDuplicates()) return false;

    const nextKey = this.display(next).toLowerCase();
    return this.value().some((v) => this.display(v).toLowerCase() === nextKey);
  }

  private emitValue(next: T[]) {
    this.valueChange.emit(next);
  }

  /* =====================
   * Overlay open/close
   * ===================== */
  open(_reason: ChipsCloseReason) {
    if (this.disabled()) return;

    this.isOpen.set(true);

    if (this.options().length) {
      const current = this.focusedIndex();
      if (current < 0) this.focusedIndex.set(0);
    } else {
      this.focusedIndex.set(-1);
    }
  }

  close(reason: ChipsCloseReason) {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.closed.emit(reason);
  }

  onOverlayClosed(reason: ChipsCloseReason) {
    this.close(reason);
  }

  /* =====================
   * UI events
   * ===================== */
  onInput(ev: Event) {
    const raw = (ev.target as HTMLInputElement).value ?? '';
    this.inputValue.set(raw);
    this.search.emit(raw);
    this.open('programmatic');
  }

  onKeydown(ev: KeyboardEvent) {
    // Backspace removes last chip when input empty
    if (ev.key === 'Backspace' && !this.inputValue()) {
      const current = this.value();
      if (current.length) {
        ev.preventDefault();
        this.removeAt(current.length - 1);
      }
      return;
    }

    // Enter adds a chip
    if (ev.key === 'Enter') {
      ev.preventDefault();

      // If an option is focused and overlay open => select it
      if (this.isOpen() && this.focusedIndex() >= 0) {
        const item = this.options()[this.focusedIndex()];
        if (item !== undefined) this.selectOption(item);
        return;
      }

      // otherwise try free-text
      this.addFromInput();
      return;
    }

    // open on arrow
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      this.open('programmatic');
      return;
    }

    // list keyboard nav (when open)
    if (this.isOpen()) {
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
          if (item !== undefined) this.selectOption(item);
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
  }

  /* =====================
   * Chip actions
   * ===================== */
  addFromInput() {
    if (this.disabled()) return;
    if (!this.allowFreeText()) return;

    const normalized = this.normalize()(this.inputValue());
    if (!normalized) return;

    const nextChip = this.parse()(normalized);
    if (this.existsAlready(nextChip)) {
      this.inputValue.set('');
      this.close('programmatic');
      return;
    }

    const next = [...this.value(), nextChip];
    this.emitValue(next);
    this.chipAdded.emit(nextChip);

    this.inputValue.set('');
    this.close('programmatic');

    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  selectOption(item: T) {
    if (this.disabled()) return;
    if (this.existsAlready(item)) {
      this.inputValue.set('');
      this.close('selection');
      queueMicrotask(() => this.inputEl.nativeElement.focus());
      return;
    }

    const next = [...this.value(), item];
    this.emitValue(next);
    this.chipAdded.emit(item);

    this.inputValue.set('');
    this.close('selection');

    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  removeAt(index: number) {
    if (this.disabled()) return;

    const current = this.value();
    if (index < 0 || index >= current.length) return;

    const removed = current[index];
    const next = current.filter((_, i) => i !== index);

    this.emitValue(next);
    this.chipRemoved.emit(removed);
  }

  clearAll() {
    if (this.disabled()) return;
    const current = this.value();
    if (!current.length) return;

    // emit removals individually (optional behavior)
    for (const item of current) this.chipRemoved.emit(item);

    this.emitValue([]);
  }

  /* =====================
   * Scroll helper
   * ===================== */
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
