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
  id = input<string>('');
  name = input<string>('');

  label = input<string>('');
  disabled = input(false);
  required = input(false);

  klass = input<string>('');

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

  classes = computed(() =>
    (
      `h-4 w-4 rounded ` +
      `border border-border bg-background ` +
      `accent-primary ` +
      `focus-visible:outline-none ` +
      `focus-visible:ring-2 focus-visible:ring-primary ` +
      `focus-visible:ring-offset-2 focus-visible:ring-offset-background ` +
      `disabled:opacity-50 disabled:pointer-events-none ` +
      this.klass()
    ).trim(),
  );
  

  onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._value.set(checked);
    this.onChange(checked);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }
}
