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
import { TngSlideToggleOnSlot, TngSlideToggleOffSlot } from './slide-toggle-slots.directive';

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

  // -------------------------
  // class hooks
  // -------------------------
  readonly rootKlass = input<string>('inline-flex items-center gap-2 select-none');
  readonly labelKlass = input<string>('text-sm text-fg');
  readonly inputKlass = input<string>('sr-only');

  /** base (applies in both states) */
  readonly trackKlass = input<string>('');
  readonly thumbKlass = input<string>('');

  /** per-state overrides */
  readonly trackOnKlass = input<string>('');  // e.g. 'bg-primary border-primary'
  readonly trackOffKlass = input<string>(''); // e.g. 'bg-on-primary border-primary'
  readonly thumbOnKlass = input<string>('');  // e.g. 'bg-on-primary'
  readonly thumbOffKlass = input<string>(''); // e.g. 'bg-primary'

  // slot presence (consumer-provided)
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

  // -------------------------
  // computed classes
  // -------------------------
  private join(...parts: Array<string | null | undefined>): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' ');
  }

  readonly trackClasses = computed(() => {
    const base =
      'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

    const disabled = this.isDisabled() ? 'opacity-60 pointer-events-none' : '';

    const state = this.value()
      ? this.join('bg-primary border-primary', this.trackOnKlass())
      : this.join('bg-on-primary border-primary', this.trackOffKlass());

    return this.join(base, state, disabled, this.trackKlass());
  });

  readonly thumbClasses = computed(() => {
    // use inline-flex so icons inside are centered
    const base =
      'inline-flex h-5 w-5 items-center justify-center rounded-full shadow ' +
      'transition-transform duration-200';

    const pos = this.value() ? 'translate-x-5' : 'translate-x-1';

    const state = this.value()
      ? this.join('bg-on-primary', this.thumbOnKlass())
      : this.join('bg-primary', this.thumbOffKlass());

    return this.join(base, pos, state, this.thumbKlass());
  });

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