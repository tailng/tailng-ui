import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'tng-input',
  standalone: true,
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngInputComponent),
      multi: true,
    },
  ],
})
export class TailngInputComponent implements ControlValueAccessor {
  // Inputs (like your current API)
  placeholder = input<string>('');
  disabled = input(false);
  type = input<string>('text');
  klass = input<string>('');

  // Form value (comes from Angular forms)
  private readonly _value = signal<string>('');
  readonly value = computed(() => this._value());

  // CVA callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Angular forms will call this
  writeValue(value: string | null): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // You can’t "set" an input() signal from inside.
    // So we rely on the parent binding [disabled]="..." OR form control disabled state in template.
    // We'll expose a computed flag in template by combining both.
    this._formDisabled.set(isDisabled);
  }

  // track disabled state from forms
  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  classes = computed(() =>
    (
      `h-10 w-full rounded-md border border-gray-300 px-3 text-sm ` +
      `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ` +
      `disabled:opacity-50 disabled:pointer-events-none ${this.klass()}`
    ).trim(),
  );

  onInput(event: Event) {
    const next = (event.target as HTMLInputElement).value;
    this._value.set(next);
    this.onChange(next);
  }

  onBlur() {
    this.onTouched();
  }
}
