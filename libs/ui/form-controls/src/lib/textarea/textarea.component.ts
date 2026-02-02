import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'tng-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngTextarea),
      multi: true,
    },
  ],
})
export class TngTextarea implements ControlValueAccessor {
  placeholder = input<string>('');
  disabled = input(false);
  rows = input<number>(4);
  klass = input<string>('');

  private readonly _value = signal<string>('');
  readonly value = computed(() => this._value());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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
    this._formDisabled.set(isDisabled);
  }

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  classes = computed(() =>
    (
      `w-full rounded-md border border-gray-300 px-3 py-2 text-sm ` +
      `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ` +
      `disabled:opacity-50 disabled:pointer-events-none ${this.klass()}`
    ).trim(),
  );

  onInput(event: Event) {
    const next = (event.target as HTMLTextAreaElement).value;
    this._value.set(next);
    this.onChange(next);
  }

  onBlur() {
    this.onTouched();
  }
}

