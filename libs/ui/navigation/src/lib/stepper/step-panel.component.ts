import { Component, HostBinding, inject, input, computed } from '@angular/core';
import { TngStepper } from './stepper.component';

@Component({
  selector: 'tng-step-panel',
  standalone: true,
  template: `<ng-content />`,
})
export class TngStepPanel {
  private readonly stepper = inject(TngStepper);

  /** Panel index this content belongs to */
  index = input.required<number>();

  @HostBinding('attr.role') role = 'tabpanel';

  @HostBinding('hidden')
  get hidden() {
    return !this.stepper.isActive(this.index());
  }

  // Optional: you can use this for debugging or conditional content
  readonly isActive = computed(() => this.stepper.isActive(this.index()));
}
