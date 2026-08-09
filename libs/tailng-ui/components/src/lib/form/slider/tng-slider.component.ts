import {
  booleanAttribute,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
  TngSlider as TngSliderPrimitive,
} from '@tailng-ui/primitives';

import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';
import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import { tngSliderValuePercent } from './tng-slider.utils';

export function readTngSliderEventValue(event: unknown): number | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return Number(target.value);
}

@Component({
  selector: 'tng-slider',
  imports: [TngSliderPrimitive],
  templateUrl: './tng-slider.component.html',
  styleUrl: './tng-slider.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngSliderComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngSliderComponent)],
    },
  ],
})
export class TngSliderComponent implements FormValueControl<number> {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number | undefined, unknown>(100, {
    transform: (value: unknown): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number | undefined, unknown>(0, {
    transform: (value: unknown): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  public readonly ariaValueText = input<string | null>(null);
  public readonly value = model<number>(0);

  protected readonly valuePercent = computed(
    () => `${tngSliderValuePercent(this.value(), this.min() ?? 0, this.max() ?? 100)}%`,
  );

  /**
   * Form-field integration. The slider's focusable element is its inner
   * `<input type="range" tngSlider>` — label `for=` and aria-describedby are
   * routed there so screen readers announce the slider correctly.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'input[tngSlider]',
    controlKind: 'composite',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public onInput(event: unknown): void {
    const nextValue = readTngSliderEventValue(event);
    if (nextValue === null) {
      return;
    }

    this.value.set(nextValue);
  }
}
