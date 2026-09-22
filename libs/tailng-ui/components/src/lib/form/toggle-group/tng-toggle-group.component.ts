import {
  Component,
  ElementRef,
  booleanAttribute,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { TngToggleGroup as TngToggleGroupPrimitive } from '@tailng-ui/primitives';

import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

@Component({
  selector: 'tng-toggle-group',
  templateUrl: './tng-toggle-group.component.html',
  styleUrl: './tng-toggle-group.component.css',
  host: {
    class: 'tng-toggle-group',
  },
  hostDirectives: [
    {
      directive: TngToggleGroupPrimitive,
      inputs: [
        'ariaLabel',
        'ariaLabelledby',
        'orientation',
        'selectionMode',
        'disabled',
        'value',
        'values',
        'defaultValue',
        'defaultValues',
      ],
      outputs: ['valueChange', 'valuesChange'],
    },
  ],
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngToggleGroupComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngToggleGroupComponent)],
    },
  ],
})
export class TngToggleGroupComponent {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly primitive = inject(TngToggleGroupPrimitive, { self: true });

  /**
   * Mirrors the primitive's `disabled` input solely for form-field state
   * reads. The primitive's host-directive binding still owns the actual
   * behavior; this signal input is read by the form-field adapter only.
   */
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  /**
   * Form-field integration. The group host owns labelledby/describedby; its
   * children (individual toggles) are not registered as form-field controls
   * because content projection sees only the direct projected child (the
   * group itself). The focusable element is the group host — keyboard
   * navigation moves focus among items via roving tabindex inside the group.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    controlKind: 'group',
    isDisabled: () => this.primitive.isGroupDisabled() === true,
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });
}
