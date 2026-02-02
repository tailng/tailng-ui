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
      useExisting: forwardRef(() => TngTextInput),
      multi: true,
    },
  ],
})
export class TngTextInput implements ControlValueAccessor {
  /* ─────────────────────────
   * Inputs (public API)
   * ───────────────────────── */
  id = input<string>('');
  name = input<string>('');

  placeholder = input<string>('');

  type = input<'text' | 'email' | 'password' | 'search' | 'tel' | 'url'>('text');

  disabled = input(false);
  readonly = input(false);

  autocomplete = input<string>('off');
  inputmode = input<string>('text');

  minlength = input<number | null>(null);
  maxlength = input<number | null>(null);
  pattern = input<string | null>(null);

  /**
   * Prefix: non-clickable by default (safer UX).
   * If you want clickable prefix, set prefixClickable=true and use a <button tngPrefix>.
   */
  prefixClickable = input<boolean>(false);

  /* ─────────────────────────
   * Klass hooks (theming)
   * ───────────────────────── */
  rootKlass = input<string>('');
  inputKlass = input<string>('');
  prefixKlass = input<string>('');
  suffixKlass = input<string>('');

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
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

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
   * Klass finals (defaults + overrides)
   * ───────────────────────── */
  readonly rootKlassFinal = computed(() =>
    this.join(
      'flex h-10 w-full items-center rounded-md border border-border bg-bg text-foreground',
      'focus-within:border-transparent',
      'focus-within:ring-2 focus-within:ring-primary',
      'focus-within:ring-offset-1 focus-within:ring-offset-background',
      this.isDisabled() ? 'pointer-events-none opacity-50' : '',
      this.readonly() ? 'bg-muted/30 text-muted' : '',
      this.rootKlass(),
    ),
  );

  readonly inputKlassFinal = computed(() =>
    this.join(
      'h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted',
      this.inputKlass(),
    ),
  );

  readonly prefixKlassFinal = computed(() =>
    this.join(
      // spacing is provided by projected element classes; wrapper stays minimal
      this.prefixClickable() ? '' : 'pointer-events-none',
      this.prefixKlass(),
    ),
  );

  readonly suffixKlassFinal = computed(() =>
    this.join(
      this.suffixKlass(),
    ),
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

  private join(...parts: Array<string | null | undefined>): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' ');
  }
}