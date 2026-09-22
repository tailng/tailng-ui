import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';

import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

export function readTngRadioChecked(event: unknown): boolean | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.checked;
}

export function shouldEmitTngRadioCheckedChange(disabled: boolean, readonly: boolean): boolean {
  return !disabled && !readonly;
}

@Component({
  selector: 'tng-radio',
  imports: [TngRadioPrimitive],
  templateUrl: './tng-radio.component.html',
  styleUrl: './tng-radio.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngRadioComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngRadioComponent)],
    },
  ],
})
export class TngRadioComponent implements FormCheckboxControl {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly checked = model<boolean>(false);
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly inputValue = input<string>('on', { alias: 'value' });

  /**
   * Form-field integration. Standalone radios are focusable via the inner
   * `<input tngRadio>` — label `for=` and aria-describedby route there.
   * Inside a radio-group, the group typically owns labelling; using
   * `<tng-form-field>` per individual radio is supported but uncommon.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'input[tngRadio]',
    controlKind: 'inline',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public onChange(event: unknown): void {
    const checked = readTngRadioChecked(event);
    if (checked === null) {
      return;
    }

    if (!shouldEmitTngRadioCheckedChange(this.disabled(), this.readonly())) {
      return;
    }

    this.checked.set(checked);
  }
}
