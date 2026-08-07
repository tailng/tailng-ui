import { booleanAttribute, Component, input, output, viewChild } from '@angular/core';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import {
  TngPopover as TngPopoverPrimitive,
  TngPopoverPanel,
  TngPopoverTrigger,
  type TngPopoverAlign,
  type TngPopoverAriaHasPopup,
  type TngPopoverAutoFocus,
  type TngPopoverCloseReason,
  type TngPopoverPanelRole,
  type TngPopoverSide,
} from '@tailng-ui/primitives';
export type {
  TngPopoverAlign,
  TngPopoverAriaHasPopup,
  TngPopoverAutoFocus,
  TngPopoverCloseReason,
  TngPopoverPanelRole,
  TngPopoverSide,
} from '@tailng-ui/primitives';

type OptionalBooleanInput = boolean | null | string | undefined;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

@Component({
  selector: 'tng-popover',
  imports: [TngPopoverPrimitive, TngPopoverTrigger, TngPopoverPanel],
  templateUrl: './tng-popover.component.html',
  styleUrl: './tng-popover.component.css',
})
export class TngPopoverComponent {
  public readonly ariaLabel = input<string>('Popover');
  public readonly ariaHasPopup = input<TngPopoverAriaHasPopup>('dialog');
  public readonly autoFocus = input<TngPopoverAutoFocus>('first-focusable');
  public readonly align = input<TngPopoverAlign>('start');
  public readonly closeOnEscape = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsidePointer = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly defaultOpen = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  public readonly panelRole = input<TngPopoverPanelRole>('dialog');
  public readonly restoreFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('close');
  public readonly side = input<TngPopoverSide>('bottom');
  public readonly triggerLabel = input<string>('Toggle Popover');

  public readonly closed = output<TngPopoverCloseReason>();
  public readonly openChange = output<boolean>();

  protected readonly popoverRef = viewChild.required<TngPopoverPrimitive>('popoverRef');

  public close(): void {
    this.popoverRef().closePopover('programmatic');
  }
}
export { TngPopoverComponent as TngPopover };
