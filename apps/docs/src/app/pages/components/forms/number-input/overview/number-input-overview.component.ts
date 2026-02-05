import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngTag } from '@tailng-ui/ui/primitives';
import { TngNumberInput } from '@tailng-ui/ui/form';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-number-input-overview',
  templateUrl: './number-input-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngNumberInput,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class NumberInputOverviewComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(10, { nonNullable: false }),
    amount: new FormControl<number | null>(null, { nonNullable: false }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Quantity"
    [min]="0"
    [max]="100"
    [step]="1"
  />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';

@Component({
  selector: 'number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngNumberInput],
  template: \`<form [formGroup]="form">
    <tng-number-input formControlName="quantity" placeholder="Quantity"
      [min]="0" [max]="100" [step]="1" />
  </form>\`,
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(10, { nonNullable: false }),
  });
}
`,
  );

  readonly minMaxStepHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="amount"
    placeholder="Amount (0–1000, step 0.01)"
    [min]="0"
    [max]="1000"
    [step]="0.01"
    klass="border-2 border-primary rounded-lg"
  />
</form>
`,
  );

  readonly minMaxStepTs = computed(
    () => `
form = new FormGroup({
  amount: new FormControl<number | null>(null, { nonNullable: false }),
});
// min/max clamp on blur; step affects browser stepper and validation.
`,
  );
}
