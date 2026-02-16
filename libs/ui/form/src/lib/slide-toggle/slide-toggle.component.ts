import {
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  contentChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';
import { TngSlideToggleOnSlot, TngSlideToggleOffSlot } from './slide-toggle-slots.directive';
import { TngSlideToggleSlot } from './slide-toggle.slots';

@Component({
  selector: 'tng-slide-toggle',
  standalone: true,
  templateUrl: './slide-toggle.component.html',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngSlideToggle),
      multi: true,
    },
  ],
})
export class TngSlideToggle implements ControlValueAccessor {
  // ids
  readonly id = input<string>('');
  readonly name = input<string>('');

  // texts
  readonly label = input<string>('');
  readonly disabled = input(false);
  readonly required = input(false);

  // allow controlled usage (signals) in addition to CVA
  readonly checked = input<boolean | null>(null);
  readonly checkedChange = output<boolean>();

  /* ─────────────────────────
   * Slot hooks (micro styling)
   * ───────────────────────── */
  slot = input<TngSlotMap<TngSlideToggleSlot>>({});

  // slot presence (consumer-provided content)
  private readonly onSlot = contentChild(TngSlideToggleOnSlot, { descendants: false });
  private readonly offSlot = contentChild(TngSlideToggleOffSlot, { descendants: false });

  readonly hasOnSlot = computed(() => !!this.onSlot());
  readonly hasOffSlot = computed(() => !!this.offSlot());

  private readonly _value = signal(false);
  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  /** effective value: controlled `checked` wins when provided */
  readonly value = computed(() => (this.checked() ?? this._value()));

  writeValue(value: boolean | null): void {
    this._value.set(value ?? false);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  /* ─────────────────────────
   * Computed slot classes
   * ───────────────────────── */
  readonly containerClassFinal = computed(() =>
    this.cx(
      'inline-flex items-center gap-2 select-none',
      this.slotClass('container'),
    ),
  );

  readonly labelClassFinal = computed(() =>
    this.cx('text-sm text-fg', this.slotClass('label')),
  );

  readonly inputClassFinal = computed(() =>
    this.cx('sr-only', this.slotClass('input')),
  );

  readonly trackClassFinal = computed(() => {
    const base = this.cx(
      'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      this.slotClass('track'),
    );
    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : '';
    const state = this.value()
      ? this.cx('bg-fg border-primary', this.slotClass('trackChecked'))
      : this.cx('bg-bg border-primary', this.slotClass('trackUnchecked'));
    return this.cx(base, state, disabled);
  });

  readonly thumbClassFinal = computed(() => {
    const base = this.cx(
      'inline-flex h-5 w-5 items-center justify-center rounded-full shadow transition-transform duration-200',
      this.slotClass('thumb'),
    );
    const pos = this.value() ? 'translate-x-5' : 'translate-x-1';
    const state = this.value()
      ? this.cx('bg-bg', this.slotClass('thumbChecked'))
      : this.cx('bg-fg', this.slotClass('thumbUnchecked'));
    return this.cx(base, pos, state);
  });

  /* ─────────────────────────
   * Helpers
   * ───────────────────────── */
  private slotClass(key: TngSlideToggleSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }

  // -------------------------
  // events
  // -------------------------
  onToggle(ev: Event): void {
    if (this.isDisabled()) return;

    const next = (ev.target as HTMLInputElement).checked;

    this._value.set(next);
    this.onChange(next);
    this.onTouched();
    this.checkedChange.emit(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}