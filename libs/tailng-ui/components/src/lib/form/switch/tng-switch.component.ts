import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

type TngSwitchKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

export function toggleTngSwitchState(checked: boolean): boolean {
  return !checked;
}

export function resolveTngSwitchArrowKey(key: string): boolean | null {
  if (key === 'ArrowLeft') {
    return false;
  }

  if (key === 'ArrowRight') {
    return true;
  }

  return null;
}

@Component({
  selector: 'tng-switch',
  imports: [TngSwitchPrimitive],
  templateUrl: './tng-switch.component.html',
  styleUrl: './tng-switch.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngSwitchComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngSwitchComponent)],
    },
  ],
})
export class TngSwitchComponent implements FormCheckboxControl {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly ariaLabel = input<string | null>(null);
  public readonly checked = model<boolean>(false);
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly inputValue = input<string>('on', { alias: 'value' });

  protected readonly resolvedChecked = computed(() => this.checked() === true);

  /**
   * Form-field integration. Exposed via `TNG_FORM_FIELD_CONTROL` so wrapping
   * the switch in `<tng-form-field>` automatically routes label and ARIA
   * wiring to the inner `<button tngSwitch>` (the actual focusable element).
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'button[tngSwitch]',
    controlKind: 'inline',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public onKeydown(event: TngSwitchKeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const nextValue = resolveTngSwitchArrowKey(event.key);
    if (nextValue === null || nextValue === this.resolvedChecked()) {
      return;
    }

    event.preventDefault();
    this.checked.set(nextValue);
  }

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checked.set(toggleTngSwitchState(this.resolvedChecked()));
  }
}
