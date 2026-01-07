import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tng-text-input',
  standalone: true,
  templateUrl: './text-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngTextInputComponent),
      multi: true,
    },
  ],
})
export class TailngTextInputComponent implements ControlValueAccessor {
  /* ─────────────────────────
   * Inputs (public API)
   * ───────────────────────── */

  id = input<string>('');
  name = input<string>('');

  placeholder = input<string>('');
  klass = input<string>('');

  type = input<
    'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  >('text');

  disabled = input(false);
  readonly = input(false);

  autocomplete = input<string>('off');
  inputmode = input<string>('text');

  minlength = input<number | null>(null);
  maxlength = input<number | null>(null);
  pattern = input<string | null>(null);

  /* ─────────────────────────
   * Internal value handling
   * ───────────────────────── */

  private readonly _value = signal<string>('');
  readonly value = computed(() => this._value());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /* ─────────────────────────
   * Disabled state (forms + input)
   * ───────────────────────── */

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(
    () => this.disabled() || this._formDisabled(),
  );

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  /* ─────────────────────────
   * ControlValueAccessor
   * ───────────────────────── */

  writeValue(value: string | null): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /* ─────────────────────────
   * Styling
   * ───────────────────────── */

  classes = computed(() =>
    (
      `h-10 w-full rounded-md px-3 text-sm ` +
      `border border-border bg-background text-foreground ` +
      `placeholder:text-muted ` +
      `focus-visible:outline-none ` +
      `focus-visible:ring-2 focus-visible:ring-primary ` +
      `focus-visible:ring-offset-2 focus-visible:ring-offset-background ` +
      `disabled:opacity-50 disabled:pointer-events-none ` +
      `read-only:bg-muted/30 read-only:text-muted ` +
      this.klass()
    ).trim(),
  );
  

  /* ─────────────────────────
   * IME-safe input handling
   * ───────────────────────── */

  private composing = false;

  onCompositionStart(): void {
    this.composing = true;
  }

  onCompositionEnd(event: Event): void {
    this.composing = false;
    this.commitValue(event);
  }

  onInput(event: Event): void {
    if (this.composing) return;
    this.commitValue(event);
  }

  private commitValue(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this._value.set(next);
    this.onChange(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}
