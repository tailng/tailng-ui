import { booleanAttribute, Component, forwardRef, input, signal, viewChild } from '@angular/core';
import type { ElementRef } from '@angular/core';
import {
  coerceTngPressAriaHasPopup,
  coerceTngPressNullableBoolean,
  TngPress as TngPressPrimitive,
} from '@tailng-ui/primitives';
import type { TngPressAriaHasPopup, TngPressType } from '@tailng-ui/primitives';
import {
  TNG_TRIGGER_TARGET,
  type TngTriggerTarget,
  type TngTriggerTargetAttributes,
} from '../../trigger-target';

type NullableBooleanInput = boolean | null | string | undefined;
export type TngButtonAppearance = 'ghost' | 'outline' | 'solid';
export type TngButtonSize = 'lg' | 'md' | 'sm';
export type TngButtonTone = 'danger' | 'neutral' | 'primary' | 'success';

@Component({
  selector: 'tng-button',
  imports: [TngPressPrimitive],
  providers: [{ provide: TNG_TRIGGER_TARGET, useExisting: forwardRef(() => TngButtonComponent) }],
  templateUrl: './tng-button.component.html',
  styleUrl: './tng-button.component.css',
})
export class TngButtonComponent implements TngTriggerTarget {
  public readonly appearance = input<TngButtonAppearance>('solid');
  public readonly ariaControls = input<string | null>(null);
  public readonly ariaExpanded = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly ariaHasPopup = input<
    TngPressAriaHasPopup | null,
    boolean | null | string | undefined
  >(null, {
    transform: coerceTngPressAriaHasPopup,
  });
  public readonly ariaPressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngPressNullableBoolean,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly size = input<TngButtonSize>('md');
  public readonly tone = input<TngButtonTone>('primary');
  public readonly type = input<TngPressType>('button');

  protected readonly triggerAriaControls = signal<string | null>(null);
  protected readonly triggerAriaExpanded = signal<boolean | null>(null);
  protected readonly triggerAriaHasPopup = signal<TngPressAriaHasPopup | null>(null);
  protected readonly triggerDisabled = signal<boolean | null>(null);
  protected readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonRef');

  public getTngTriggerElement(): HTMLButtonElement | null {
    return this.buttonRef()?.nativeElement ?? null;
  }

  public setTngTriggerAttributes(attributes: TngTriggerTargetAttributes): void {
    if ('ariaControls' in attributes) {
      this.triggerAriaControls.set(attributes.ariaControls ?? null);
    }

    if ('ariaExpanded' in attributes) {
      this.triggerAriaExpanded.set(attributes.ariaExpanded ?? null);
    }

    if ('ariaHasPopup' in attributes) {
      this.triggerAriaHasPopup.set(coerceTngPressAriaHasPopup(attributes.ariaHasPopup));
    }

    if ('disabled' in attributes) {
      this.triggerDisabled.set(attributes.disabled ?? null);
    }
  }
}
export { TngButtonComponent as TngButton };
