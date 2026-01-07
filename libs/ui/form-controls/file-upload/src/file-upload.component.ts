import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'tng-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailngFileUploadComponent),
      multi: true,
    },
  ],
})
export class TailngFileUploadComponent implements ControlValueAccessor {
  disabled = input(false);
  accept = input<string>('');
  multiple = input(false);
  klass = input<string>('');

  private readonly _value = signal<File[] | null>(null);
  readonly value = computed(() => this._value());

  private onChange: (value: File[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: File[] | null): void {
    this._value.set(value ?? null);
  }

  registerOnChange(fn: (value: File[] | null) => void): void {
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const fileArray = Array.from(files);
      this._value.set(fileArray);
      this.onChange(fileArray);
    }
  }

  onBlur() {
    this.onTouched();
  }
}

