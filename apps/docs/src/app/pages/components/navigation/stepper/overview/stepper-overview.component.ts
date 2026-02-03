import { Component, computed } from '@angular/core';
import { TngStepper, TngStep, TngStepPanel } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-stepper-overview',
  templateUrl: './stepper-overview.component.html',
  imports: [TngStepper, TngStep, TngStepPanel, ExampleBlockComponent, TngExampleDemo],
})
export class StepperOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-stepper defaultIndex="0">
  <tng-step>One</tng-step>
  <tng-step>Two</tng-step>
  <tng-step>Three</tng-step>
  <tng-step-panel [index]="0">Step 1 content</tng-step-panel>
  <tng-step-panel [index]="1">Step 2 content</tng-step-panel>
  <tng-step-panel [index]="2">Step 3 content</tng-step-panel>
</tng-stepper>
`,
  );
  readonly basicTs = computed(
    () => `import { TngStepper, TngStep, TngStepPanel } from '@tociva/tailng-ui/navigation';`,
  );
}
