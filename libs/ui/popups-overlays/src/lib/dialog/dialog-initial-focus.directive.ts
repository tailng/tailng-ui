import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngDialogInitialFocus]',
  standalone: true,
})
export class TngDialogInitialFocus {
  // Attribute CDK FocusTrap looks for
  @HostBinding('attr.cdk-focus-initial')
  readonly cdkFocusInitialAttr = '';

  // Optional camelCase alias (harmless, future-proof)
  @HostBinding('attr.cdkFocusInitial')
  readonly cdkFocusInitialCamelAttr = '';
}
