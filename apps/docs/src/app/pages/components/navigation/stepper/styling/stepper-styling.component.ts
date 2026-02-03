import { Component, computed } from '@angular/core';
import { TngStepper, TngStep, TngStepPanel } from '@tociva/tailng-ui/navigation';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-stepper-styling',
  templateUrl: './stepper-styling.component.html',
  imports: [TngStepper, TngStep, TngStepPanel, ExampleBlockComponent, TngExampleDemo],
})
export class StepperStylingComponent {
  readonly pillsHtml = computed(
    () => `
<tng-stepper headerKlass="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
  <tng-step stepKlass="rounded-md px-3 py-2 ..." activeKlass="bg-white ..." inactiveKlass="text-slate-600 ...">One</tng-step>
  ...
</tng-stepper>
`,
  );
}
