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
  selector: 'tng-slide-toggle',
  standalone: true,
  templateUrl: './slide-toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngSlideToggleComponent),
      multi: true,
    },
  ],
})
export class TailngSlideToggleComponent implements ControlValueAccessor {
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

  // theming / class hooks (section-wise)
  readonly rootKlass = input<string>('inline-flex items-center gap-2 select-none');
  readonly trackKlass = input<string>('');
  readonly thumbKlass = input<string>('');
  readonly labelKlass = input<string>('text-sm text-fg');
  readonly inputKlass = input<string>('sr-only');

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

  readonly trackClasses = computed(() => {
    const base =
      'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-200 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  
    const stateOn = 'bg-primary border-primary';
    const stateOff = 'bg-on-primary border-primary';
  
    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : '';
    const state = this.value() ? stateOn : stateOff;
  
    return `${base} ${state}${disabled} ${this.trackKlass()}`.trim();
  });

  readonly thumbClasses = computed(() => {
    const base =
      'inline-block h-5 w-5 rounded-full shadow transition-transform duration-200';
  
    const posOn = 'translate-x-5';
    const posOff = 'translate-x-1';
  
    const colorOn = 'bg-on-primary';
    const colorOff = 'bg-primary';
  
    const pos = this.value() ? posOn : posOff;
    const color = this.value() ? colorOn : colorOff;
  
    return `${base} ${pos} ${color} ${this.thumbKlass()}`.trim();
  });
  
  onToggle(ev: Event): void {
    if (this.isDisabled()) return;

    const next = (ev.target as HTMLInputElement).checked;

    // internal (CVA path)
    this._value.set(next);
    this.onChange(next);
    this.onTouched();

    // controlled usage (signal binding path)
    this.checkedChange.emit(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}
