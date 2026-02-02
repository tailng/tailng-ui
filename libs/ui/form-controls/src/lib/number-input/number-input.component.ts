import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tng-number-input',
  standalone: true,
  templateUrl: './number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngNumberInput),
      multi: true,
    },
  ],
})
export class TngNumberInput implements ControlValueAccessor {
  id = input<string>('');
  name = input<string>('');

  placeholder = input<string>('');
  klass = input<string>('');

  disabled = input(false);
  readonly = input(false);

  // For mobile keypad experience
  inputmode = input<'numeric' | 'decimal'>('decimal');
  autocomplete = input<string>('off');

  // numeric constraints
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | 'any' | null>(null); // e.g. 1, 0.01, 'any'

  private readonly _value = signal<number | null>(null);
  readonly value = computed(() => this._value());

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  writeValue(value: number | null): void {
    this._value.set(value ?? null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
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
      `h-10 w-full rounded-md px-3 text-sm ` +
      `border border-border bg-bg text-foreground ` +
      `placeholder:text-muted ` +
      `focus-visible:outline-none ` +
      `focus-visible:ring-2 focus-visible:ring-primary ` +
      `focus-visible:ring-offset-2 focus-visible:ring-offset-background ` +
      `disabled:opacity-50 disabled:pointer-events-none ` +
      `read-only:bg-muted/30 read-only:text-muted ` +
      this.klass()
    ).trim(),
  );
  

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;

    // empty means null
    if (raw === '') {
      this._value.set(null);
      this.onChange(null);
      return;
    }

    const next = Number(raw);

    // protect forms from NaN
    if (Number.isNaN(next)) {
      this._value.set(null);
      this.onChange(null);
      return;
    }

    this._value.set(next);
    this.onChange(next);
  }

  onBlur(): void {
    // optional clamp on blur (Material doesn't clamp automatically, but it's often nice)
    const v = this._value();
    if (v !== null) {
      const min = this.min();
      const max = this.max();

      let clamped = v;
      if (min !== null) clamped = Math.max(min, clamped);
      if (max !== null) clamped = Math.min(max, clamped);

      if (clamped !== v) {
        this._value.set(clamped);
        this.onChange(clamped);
      }
    }

    this.onTouched();
  }
}
