import { Component, computed, signal } from '@angular/core';
import { TngStepper, TngStep, TngStepPanel } from '@tailng-ui/ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-stepper-examples',
  templateUrl: './stepper-examples.component.html',
  imports: [TngStepper, TngStep, TngStepPanel, ExampleBlockComponent, TngExampleDemo],
})
export class StepperExamplesComponent {
  readonly index = signal(0);
  readonly maxStep = 1;

  prev() {
    this.index.update((i) => Math.max(0, i - 1));
  }
  next() {
    this.index.update((i) => Math.min(this.maxStep, i + 1));
  }

  readonly basicHtml = computed(
    () => `
<tng-stepper defaultIndex="0">
  <tng-step>Account</tng-step>
  <tng-step>Profile</tng-step>
  <tng-step>Confirm</tng-step>
  <tng-step-panel [index]="0">...</tng-step-panel>
  <tng-step-panel [index]="1">...</tng-step-panel>
  <tng-step-panel [index]="2">...</tng-step-panel>
</tng-stepper>
`,
  );
  readonly controlledHtml = computed(
    () => `
<tng-stepper [activeIndex]="index()" (activeIndexChange)="index.set($event)" #stepper>
  ...
</tng-stepper>
<button (click)="stepper.prev()">Prev</button>
<button (click)="stepper.next()">Next</button>
`,
  );
}
