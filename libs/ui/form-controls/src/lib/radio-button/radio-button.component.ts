import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tng-radio-button',
  standalone: true,
  templateUrl: './radio-button.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngRadioButton),
      multi: true,
    },
  ],
})
export class TngRadioButton implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');

  readonly value = input.required<string>();
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

  /** <input type="radio"> */
  readonly inputKlass = input<string>('');

  /** Label <span> */
  readonly labelKlass = input<string>('text-sm text-fg');

  private readonly _formValue = signal<string | null>(null);
  readonly isChecked = computed(() => this._formValue() === this.value());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  writeValue(value: string | null): void {
    this._formValue.set(value ?? null);
  }

  registerOnChange(fn: (value: string) => void): void {
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
      `h-4 w-4 rounded-full ` +
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

  onSelect(event: Event): void {
    if (this.isDisabled()) return;

    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this._formValue.set(this.value());
      this.onChange(this.value());
      this.onTouched();
    }
  }

  onBlur(): void {
    this.onTouched();
  }
}
