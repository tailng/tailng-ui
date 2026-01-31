// autocomplete.component.ts
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OptionTplContext } from '@tociva/tailng-cdk';

import { TailngConnectedOverlayComponent } from '../../../popups-overlays/connected-overlay/src/public-api';
import { TailngOptionListComponent } from '../../../popups-overlays/option-list/src/public-api';
import { TailngOverlayPanelComponent } from '../../../popups-overlays/overlay-panel/src/public-api';
import {
  TailngOverlayCloseReason,
  TailngOverlayRefComponent,
} from '../../../popups-overlays/overlay-ref/src/public-api';

export type AutocompleteCloseReason = TailngOverlayCloseReason;

@Component({
  selector: 'tng-autocomplete',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    TailngConnectedOverlayComponent,
    TailngOverlayPanelComponent,
    TailngOptionListComponent,
    TailngOverlayRefComponent,
  ],
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngAutocompleteComponent),
      multi: true,
    },
  ],
})
export class TailngAutocompleteComponent<T> implements ControlValueAccessor {
  /* =====================
   * Projected templates
   * ===================== */

  // Dropdown option template (list rows)
  @ContentChild('optionTpl', { read: TemplateRef })
  optionTpl?: TemplateRef<OptionTplContext<T>>;

  // Selected value template (shown inside input area when not typing)
  @ContentChild('inputTpl', { read: TemplateRef })
  inputTpl?: TemplateRef<{ $implicit: T }>;

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef<HTMLInputElement>;

  // We call optionList.onKeydown(ev) from the INPUT keydown handler
  @ViewChild(TailngOptionListComponent)
  optionList?: TailngOptionListComponent<T>;

  
  /* =====================
  * Inputs / Outputs
  * ===================== */
  readonly inputKlass = input<string>('');
  readonly options = input<T[]>([]);
  readonly placeholder = input<string>('Start typing…');

  /** External disabled input (read-only InputSignal) */
  readonly disabled = input<boolean>(false);

  /** String representation (used for actual input.value + fallback) */
  readonly displayWith = input<(item: T) => string>((v) => String(v));

  /** Raw text for filtering / API search (not the form value) */
  readonly search = output<string>();

  /** Optional: non-form usage hook */
  readonly selected = output<T>();

  /** Emits whenever overlay closes (selection/escape/outside-click/blur/programmatic) */
  readonly closed = output<AutocompleteCloseReason>();

  /* =====================
   * Internal State
   * ===================== */
  readonly inputValue = signal('');
  readonly isOpen = signal(false);
  readonly focusedIndex = signal(-1);

  /** eslint-safe + template-safe internal disabled state */
  protected readonly isDisabled = signal(false);

  /** Selected item (for inputTpl rendering) */
  readonly selectedValue = signal<T | null>(null);

  /**
   * Whether to show rich selected template over the input.
   * Show only when:
   * - inputTpl exists
   * - we have a selected value
   * - overlay is closed (so typing/search UX stays normal)
   */
  readonly showSelectedTpl = computed(
    () => !!this.inputTpl && this.selectedValue() != null && !this.isOpen()
  );

  readonly inputKlassFinal = computed(() =>
  ['relative z-0 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-bg text-fg', this.inputKlass()].join(' ')
  );  

  /** Form value (selected item) */
  private value: T | null = null;

  /* =====================
   * ControlValueAccessor
   * ===================== */
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Sync external [disabled] -> internal state
    effect(() => {
      this.isDisabled.set(this.disabled());
      if (this.isDisabled()) this.close('programmatic');
    });
  }

  /* =====================
   * ControlValueAccessor API
   * ===================== */
  writeValue(value: T | null): void {
    this.value = value;
    this.selectedValue.set(value);

    if (value == null) {
      this.inputValue.set('');
      this.focusedIndex.set(-1);
      return;
    }

    // keep text value for fallback + accessibility
    this.inputValue.set(this.displayWith()(value));
    this.focusedIndex.set(-1);
  }

  registerOnChange(fn: (value: T | null) => void): void {
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
   * Display helper
   * ===================== */
  display(item: T): string {
    return this.displayWith()(item);
  }

  /* =====================
   * State Transitions
   * ===================== */
  open(_reason: AutocompleteCloseReason) {
    if (this.isDisabled()) return;

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

  onOverlayClosed(reason: AutocompleteCloseReason) {
    this.close(reason);
  }

  onOverlayOpenChange(open: boolean) {
    if (this.isDisabled()) {
      this.isOpen.set(false);
      return;
    }

    if (open) this.open('programmatic');
    else this.close('programmatic');
  }

  /* =====================
   * UI Events
   * ===================== */
  onInput(ev: Event) {
    if (this.isDisabled()) return;

    const text = (ev.target as HTMLInputElement).value ?? '';
    this.inputValue.set(text);

    // typing clears selection (so inputTpl disappears)
    this.value = null;
    this.selectedValue.set(null);
    this.onChange(null);

    this.search.emit(text);
    this.open('programmatic');
  }
  
  onBlur() {
    this.onTouched();
  
    queueMicrotask(() => {
      if (document.activeElement === this.inputEl.nativeElement) return;
      this.close('blur');
    });
  }

  /**
   * Key handling updated to match OptionList architecture:
   * - Escape is handled here (OptionList doesn't close overlays)
   * - Navigation/Enter are delegated to optionList.onKeydown(ev)
   * - Printable keys are NOT delegated (input typing controls filtering)
   */
  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;
  
    // Close on escape
    if (ev.key === 'Escape' && this.isOpen()) {
      ev.preventDefault();
      ev.stopPropagation();
      this.close('escape');
      return;
    }
  
    // If closed: ArrowDown/Up should open + delegate once overlay is painted
    if (!this.isOpen() && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
      ev.preventDefault();
      ev.stopPropagation();
  
      this.open('programmatic');
  
      // wait for overlay + optionList to exist
      requestAnimationFrame(() => this.optionList?.onKeydown(ev));
      return;
    }
  
    if (!this.isOpen()) return;
  
    // Delegate only list-navigation keys
    if (!this.isListNavigationKey(ev)) return;
  
    ev.stopPropagation(); // helps if parent/global handlers exist
    this.optionList?.onKeydown(ev);
  }

  private isListNavigationKey(ev: KeyboardEvent): boolean {
    // Match the keys handled by OptionList (excluding typeahead)
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
      case 'PageDown':
      case 'PageUp':
      case 'Enter':
        return true;
      default:
        return false;
    }
  }

  /* =====================
   * OptionList wiring
   * ===================== */
  onFocusedIndexChange(i: number) {
    this.focusedIndex.set(i);
  }

  requestSelectActive() {
    const i = this.focusedIndex();
    const item = this.options()[i];
    if (item !== undefined) this.select(item);
  }

  /* =====================
   * Selection
   * ===================== */
  select(item: T) {
    if (this.isDisabled()) return;

    this.value = item;
    this.selectedValue.set(item);

    // keep input value as text fallback
    this.inputValue.set(this.displayWith()(item));

    this.onChange(item);
    this.onTouched();

    this.selected.emit(item);

    this.close('selection');

    queueMicrotask(() => {
      this.inputEl.nativeElement.focus();
    });
  }
}
