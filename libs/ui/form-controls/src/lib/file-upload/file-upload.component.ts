import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TngFileDropzone } from './file-dropzone.directive';

@Component({
  selector: 'tng-file-upload',
  standalone: true,
  imports: [TngFileDropzone],
  templateUrl: './file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngFileUpload),
      multi: true,
    },
  ],
})
export class TngFileUpload implements ControlValueAccessor {
  @ViewChild('fileInput', { static: true })
  fileInput!: ElementRef<HTMLInputElement>;

  // config
  readonly disabled = input(false);
  readonly accept = input<string>('');
  readonly multiple = input(false);

  // texts
  readonly title = input<string>('Upload files');
  readonly subtitle = input<string>('Drag & drop here or click to browse');

  // theming hooks (section-wise)
  readonly rootKlass = input<string>('w-full');
  readonly dropzoneKlass = input<string>(''); // outer box
  readonly titleKlass = input<string>('text-sm font-medium text-fg');
  readonly subtitleKlass = input<string>('text-xs text-disable');
  readonly hintKlass = input<string>('text-xs text-disable');
  readonly fileListKlass = input<string>('mt-2 space-y-1');
  readonly fileItemKlass = input<string>(
    'flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg'
  );
  readonly clearButtonKlass = input<string>(
    'text-xs text-danger hover:text-danger-hover'
  );

  // optional outputs (non-form usage)
  readonly valueChange = output<File[] | null>();

  private readonly _value = signal<File[] | null>(null);
  readonly value = computed(() => this._value());

  private readonly _formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private onChange: (value: File[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  // visual state
  readonly dragActive = signal(false);

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

  // computed classes
  readonly dropzoneClasses = computed(() => {
    const base =
      'relative w-full rounded-md border px-4 py-4 transition ' +
      'bg-bg text-fg border-border ' +
      'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background';

    const disabled = this.isDisabled() ? ' opacity-60 pointer-events-none' : ' cursor-pointer';
    const active = this.dragActive()
      ? ' border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
      : '';

    return `${base} ${disabled} ${active} ${this.dropzoneKlass()}`.trim();
  });

  openPicker() {
    if (this.isDisabled()) return;
    this.fileInput.nativeElement.click();
  }

  private setFiles(next: File[] | null) {
    this._value.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  onNativeChange(event: Event) {
    if (this.isDisabled()) return;

    const files = (event.target as HTMLInputElement).files;
    const list = files ? Array.from(files) : [];

    this.setFiles(list.length ? list : null);
  }

  onDropped(files: File[]) {
    if (this.isDisabled()) return;

    this.setFiles(files.length ? files : null);

    // reset native input so selecting same file again still triggers change
    this.fileInput.nativeElement.value = '';
  }

  clear() {
    if (this.isDisabled()) return;
    this.setFiles(null);
    this.fileInput.nativeElement.value = '';
  }

  onBlur() {
    this.onTouched();
  }

  onDragActiveChange(active: boolean) {
    this.dragActive.set(active);
  }

  trackByName = (_: number, f: File) => `${f.name}-${f.size}-${f.lastModified}`;
}
