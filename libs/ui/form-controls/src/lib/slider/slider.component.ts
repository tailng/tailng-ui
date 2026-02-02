import {
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tng-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngSlider),
      multi: true,
    },
  ],
})
export class TngSlider implements ControlValueAccessor {
  // ids
  readonly id = input<string>('');
  readonly name = input<string>('');

  // label / accessibility
  readonly ariaLabel = input<string>('Slider');

  // slider config
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);

  // disabled
  readonly disabled = input(false);

  /**
   * Controlled usage (Angular 21 signals):
   * <tng-slider [value]="v()" (valueChange)="v.set($event)" />
   *
   * When `value` is provided (not null), it becomes the source of truth.
   */
  readonly value = input<number | null>(null);
  readonly valueChange = output<number>();

  // theming / section-wise klass hooks
  readonly rootKlass = input<string>('w-full');
  readonly labelKlass = input<string>('text-sm text-fg');
  readonly trackKlass = input<string>(''); // base track
  readonly fillKlass = input<string>('');  // filled part
  readonly thumbKlass = input<string>(''); // thumb
  readonly rangeKlass = input<string>(''); // native input

  private readonly _value = signal(0);

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  /** effective value: controlled `value` wins when provided */
  readonly currentValue = computed(() => {
    const controlled = this.value();
    return controlled ?? this._value();
  });

  readonly clampedValue = computed(() => {
    const min = this.min();
    const max = this.max();
    const v = this.currentValue();
    return Math.min(max, Math.max(min, v));
  });

  readonly percent = computed(() => {
    const min = this.min();
    const max = this.max();
    const v = this.clampedValue();

    const span = max - min;
    if (span <= 0) return 0;

    return ((v - min) / span) * 100;
  });

  // classes (Tailng theme tokens)
  readonly trackClasses = computed(() => {
    const base =
      'relative h-2 w-full rounded-full border border-primary bg-on-primary';

    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : '';
    return `${base}${disabled} ${this.trackKlass()}`.trim();
  });

  readonly fillClasses = computed(() => {
    const base = 'absolute left-0 top-0 h-full rounded-full bg-primary';
    return `${base} ${this.fillKlass()}`.trim();
  });

  readonly thumbClasses = computed(() => {
    const base =
      'absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border border-primary ' +
      'shadow transition-transform';

    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : '';
    return `${base}${disabled} ${this.thumbKlass()}`.trim();
  });

  readonly rangeClasses = computed(() => {
    // make native range invisible but still interactive + keyboard accessible
    const base =
      'absolute inset-0 h-full w-full cursor-pointer opacity-0 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background';

    const disabled = this.isDisabled() ? ' cursor-not-allowed' : '';
    return `${base}${disabled} ${this.rangeKlass()}`.trim();
  });

  /* =====================
   * CVA
   * ===================== */
  writeValue(value: number | null): void {
    this._value.set(value ?? this.min());
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  /* =====================
   * Events
   * ===================== */
  onInput(ev: Event) {
    if (this.isDisabled()) return;

    const raw = (ev.target as HTMLInputElement).value;
    const next = Number(raw);

    // internal (CVA path)
    this._value.set(next);
    this.onChange(next);

    // controlled (signal) path
    this.valueChange.emit(next);
  }

  onBlur() {
    this.onTouched();
  }
}
