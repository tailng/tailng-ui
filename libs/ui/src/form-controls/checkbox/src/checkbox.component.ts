import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tng-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngCheckboxComponent),
      multi: true,
    },
  ],
})
export class TailngCheckboxComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');

  readonly label = input<string>('');
  readonly disabled = input(false);
  readonly required = input(false);

  /* =====================
   * Theming / class hooks (section-wise)
   * ===================== */
  /** Root <label> */
  readonly rootKlass = input<string>(
    'inline-flex items-center gap-2 cursor-pointer select-none'
  );

  /** <input type="checkbox"> */
  readonly inputKlass = input<string>('');

  /** Label <span> */
  readonly labelKlass = input<string>('text-sm text-fg');

  private readonly _value = signal(false);
  readonly value = computed(() => this._value());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

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

  /** Final classes */
  readonly classes = computed(() =>
    (
      // size + shape
      `h-4 w-4 rounded ` +
      // theme tokens
      `border border-border bg-bg ` +
      `accent-primary ` +
      // focus ring
      `focus-visible:outline-none ` +
      `focus-visible:ring-2 focus-visible:ring-primary ` +
      `focus-visible:ring-offset-2 focus-visible:ring-offset-background ` +
      // disabled
      `disabled:opacity-50 disabled:pointer-events-none ` +
      // user override
      this.inputKlass()
    ).trim()
  );

  onToggle(event: Event): void {
    if (this.isDisabled()) return;

    const checked = (event.target as HTMLInputElement).checked;
    this._value.set(checked);
    this.onChange(checked);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }
}
