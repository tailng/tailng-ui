// chips.component.ts
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  effect,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  TemplateRef,
  ViewChild,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import { TailngOptionListComponent } from '../../../popups-overlays/option-list/src/public-api';
import {
  TailngOverlayRefComponent,
  TailngOverlayCloseReason,
} from '../../../popups-overlays/overlay-ref/src/public-api';

import { OptionTplContext } from '@tociva/tailng-cdk';

export type ChipsCloseReason = TailngOverlayCloseReason;
export type ChipTplContext<T> = { $implicit: T; index: number };

@Component({
  selector: 'tng-chips',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
    TailngOptionListComponent,
    TailngOverlayRefComponent,
  ],
  templateUrl: './chips.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngChipsComponent),
      multi: true,
    },
  ],
})
export class TailngChipsComponent<T> implements ControlValueAccessor {
  /* =====================
   * Projected templates
   * ===================== */
  @ContentChild('chipTpl', { read: TemplateRef })
  chipTpl?: TemplateRef<ChipTplContext<T>>;

  @ContentChild('optionTpl', { read: TemplateRef })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  // Delegate list keys to OptionList
  @ViewChild(TailngOptionListComponent)
  optionList?: TailngOptionListComponent<T>;

  /* =====================
   * Inputs / Outputs
   * ===================== */
  readonly value = input<T[]>([]);
  readonly options = input<T[]>([]);
  readonly placeholder = input<string>('Add…');
  readonly disabled = input<boolean>(false);

  readonly displayWith = input<(item: T) => string>((v) => String(v));

  readonly allowFreeText = input<boolean>(true);
  readonly parse = input<(raw: string) => T>((raw) => raw as unknown as T);
  readonly normalize = input<(raw: string) => string>((raw) => raw.trim());
  readonly preventDuplicates = input<boolean>(true);

  readonly search = output<string>();
  readonly valueChange = output<T[]>();
  readonly chipAdded = output<T>();
  readonly chipRemoved = output<T>();
  readonly closed = output<ChipsCloseReason>();

  /* =====================
   * Theming
   * ===================== */
  readonly rootKlass = input<string>('relative');

  readonly containerKlass = input<string>(
    [
      'w-full min-h-[42px] px-2 py-1 text-sm',
      'flex flex-wrap items-center gap-2',
      'border border-border rounded-md',
      'bg-bg text-fg',
      'focus-within:ring-2 focus-within:ring-primary',
    ].join(' ')
  );

  readonly chipKlass = input<string>(
    [
      'inline-flex items-center gap-1 px-2 py-1 rounded-md',
      'bg-alternate-background border border-border',
      'text-sm',
    ].join(' ')
  );

  readonly chipLabelKlass = input<string>('truncate max-w-[200px]');
  readonly removeButtonKlass = input<string>('ml-1 text-disable hover:text-fg');
  readonly inputKlass = input<string>('flex-1 min-w-[140px] px-2 py-2 outline-none bg-transparent');

  /* =====================
   * Internal State
   * ===================== */
  readonly inputValue = signal('');
  readonly isOpen = signal(false);
  readonly focusedIndex = signal(-1);

  protected readonly isDisabled = signal(false);

  private readonly chipsValue = signal<T[]>([]);
  private usingCva = false;

  private onChange: (value: T[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.isDisabled.set(this.disabled());
      if (this.isDisabled()) this.close('programmatic');
    });

    effect(() => {
      const v = this.value();
      if (this.usingCva) return;
      this.chipsValue.set(v);
    });
  }

  /* =====================
   * ControlValueAccessor
   * ===================== */
  writeValue(value: T[] | null): void {
    this.usingCva = true;
    this.chipsValue.set(value ?? []);
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.usingCva = true;
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) this.close('programmatic');
  }

  /* =====================
   * Template getters
   * ===================== */
  chips(): T[] {
    return this.chipsValue();
  }

  readonly placeholderText = computed(() => (this.chipsValue().length ? '' : this.placeholder()));

  readonly containerClasses = computed(() =>
    (this.containerKlass() + (this.isDisabled() ? ' opacity-60 pointer-events-none' : '')).trim()
  );

  /* =====================
   * Helpers
   * ===================== */
  display(item: T): string {
    return this.displayWith()(item);
  }

  private existsAlready(next: T): boolean {
    if (!this.preventDuplicates()) return false;
    const nextKey = this.display(next).toLowerCase();
    return this.chipsValue().some((v) => this.display(v).toLowerCase() === nextKey);
  }

  private emitValue(next: T[]) {
    this.chipsValue.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  /* =====================
   * Overlay open/close
   * ===================== */
  open(_reason: ChipsCloseReason) {
    if (this.isDisabled()) return;

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

  onOverlayOpenChange(open: boolean) {
    if (this.isDisabled()) {
      this.isOpen.set(false);
      return;
    }
    if (open) this.open('programmatic');
    else this.close('programmatic');
  }

  onOverlayClosed(reason: ChipsCloseReason) {
    this.close(reason);
  }

  /* =====================
   * UI events
   * ===================== */
  onInput(ev: Event) {
    if (this.isDisabled()) return;

    const raw = (ev.target as HTMLInputElement).value ?? '';
    this.inputValue.set(raw);
    this.search.emit(raw);
    this.open('programmatic');
  }

  onBlur() {
    this.onTouched();
    queueMicrotask(() => {
      if (document.activeElement === this.inputEl.nativeElement) return;
      this.close('blur');
    });
  }

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    // Escape closes
    if (ev.key === 'Escape' && this.isOpen()) {
      ev.preventDefault();
      ev.stopPropagation();
      this.close('escape');
      return;
    }

    // Backspace removes last chip when input empty
    if (ev.key === 'Backspace' && !this.inputValue()) {
      const current = this.chipsValue();
      if (current.length) {
        ev.preventDefault();
        ev.stopPropagation();
        this.removeAt(current.length - 1);
      }
      return;
    }

    // Enter
    if (ev.key === 'Enter') {
      // IMPORTANT: if open, DO NOT preventDefault here — OptionList must see a non-prevented event
      if (this.isOpen()) {
        ev.stopPropagation();
        this.optionList?.onKeydown(ev); // OptionList will preventDefault + emit requestSelectActive
        return;
      }

      ev.preventDefault();
      ev.stopPropagation();
      this.addFromInput();
      return;
    }

    // Open on arrows when closed (prevent original cursor move),
    // then delegate a *fresh* event to OptionList after mount.
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      ev.preventDefault();
      ev.stopPropagation();

      this.open('programmatic');

      requestAnimationFrame(() => {
        const replay = this.cloneKeyboardEvent(ev);
        this.optionList?.onKeydown(replay);
      });

      return;
    }

    if (!this.isOpen()) return;

    // Delegate list-navigation keys (no preventDefault here; OptionList does it)
    if (!this.isListNavigationKey(ev)) return;

    ev.stopPropagation();
    this.optionList?.onKeydown(ev);
  }

  private isListNavigationKey(ev: KeyboardEvent): boolean {
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
      case 'PageDown':
      case 'PageUp':
        return true;
      default:
        return false;
    }
  }

  // Used to replay arrow keys after opening (original event already defaultPrevented)
  private cloneKeyboardEvent(ev: KeyboardEvent): KeyboardEvent {
    return new KeyboardEvent(ev.type, {
      key: ev.key,
      code: ev.code,
      location: ev.location,
      repeat: ev.repeat,
      ctrlKey: ev.ctrlKey,
      shiftKey: ev.shiftKey,
      altKey: ev.altKey,
      metaKey: ev.metaKey,
      bubbles: true,
      cancelable: true,
    });
  }

  /* =====================
   * OptionList wiring
   * ===================== */
  requestSelectActive() {
    const i = this.focusedIndex();
    const item = this.options()[i];
    if (item !== undefined) this.selectOption(item);
  }

  /* =====================
   * Chip actions
   * ===================== */
  addFromInput() {
    if (this.isDisabled()) return;
    if (!this.allowFreeText()) return;

    const normalized = this.normalize()(this.inputValue());
    if (!normalized) return;

    const nextChip = this.parse()(normalized);

    if (this.existsAlready(nextChip)) {
      this.inputValue.set('');
      this.close('programmatic');
      return;
    }

    const next = [...this.chipsValue(), nextChip];
    this.emitValue(next);
    this.chipAdded.emit(nextChip);

    this.inputValue.set('');
    this.close('programmatic');

    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  selectOption(item: T) {
    if (this.isDisabled()) return;

    if (this.existsAlready(item)) {
      this.inputValue.set('');
      this.close('selection');
      queueMicrotask(() => this.inputEl.nativeElement.focus());
      return;
    }

    const next = [...this.chipsValue(), item];
    this.emitValue(next);
    this.chipAdded.emit(item);

    this.inputValue.set('');
    this.close('selection');

    queueMicrotask(() => this.inputEl.nativeElement.focus());
  }

  removeAt(index: number) {
    if (this.isDisabled()) return;

    const current = this.chipsValue();
    if (index < 0 || index >= current.length) return;

    const removed = current[index];
    const next = current.filter((_, i) => i !== index);

    this.emitValue(next);
    this.chipRemoved.emit(removed);
  }

  clearAll() {
    if (this.isDisabled()) return;

    const current = this.chipsValue();
    if (!current.length) return;

    for (const item of current) this.chipRemoved.emit(item);
    this.emitValue([]);
  }
}
