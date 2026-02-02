import { Component, signal } from '@angular/core';
import {
  TngStepper,
  TngStep,
  TngStepPanel,
} from '@tociva/tailng-ui/navigation';

@Component({
  selector: 'playground-stepper-demo',
  standalone: true,
  imports: [TngStepper, TngStep, TngStepPanel],
  templateUrl: './stepper-demo.component.html',
})
export class StepperDemoComponent {
  // Controlled example
  readonly controlledIndex = signal<number>(1);

  // Linear example completion flags
  readonly s0Complete = signal<boolean>(true);
  readonly s1Complete = signal<boolean>(false);

  // Material-like demo (controlled)
  readonly materialIndex = signal<number>(0);

  toggleS0(): void {
    this.s0Complete.set(!this.s0Complete());
  }

  toggleS1(): void {
    this.s1Complete.set(!this.s1Complete());
  }
}