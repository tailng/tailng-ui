import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-number-input-examples',
  templateUrl: './number-input-examples.component.html',
  imports: [
    TngNumberInput,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class NumberInputExamplesComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(10, {
      nonNullable: false,
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(0), Validators.max(1000)],
    }),
    age: new FormControl<number | null>(25, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(0), Validators.max(120)],
    }),
    readonlyValue: new FormControl<number | null>(99, { nonNullable: false }),
    prefilledValue: new FormControl<number | null>(42, { nonNullable: false }),
  });

  get quantityCtrl() {
    return this.form.controls.quantity;
  }
  get amountCtrl() {
    return this.form.controls.amount;
  }
  get ageCtrl() {
    return this.form.controls.age;
  }

  readonly basicExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Quantity"
  />
</form>
`,
  );

  readonly basicExampleTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';

@Component({
  selector: 'number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngNumberInput],
  templateUrl: './number-input.component.html',
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(10, { nonNullable: false }),
  });
}
`,
  );

  readonly reactiveFormsExampleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Quantity"
    [min]="0"
    [max]="100"
    [step]="1"
  />
  <tng-number-input
    formControlName="amount"
    placeholder="Amount (0–1000, step 0.01)"
    [min]="0"
    [max]="1000"
    [step]="0.01"
  />
</form>
`,
  );

  readonly reactiveFormsExampleTs = computed(
    () => `
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngNumberInput } from '@tailng-ui/ui/form';

@Component({
  selector: 'number-input-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngNumberInput],
  templateUrl: './number-input.component.html',
})
export class MyComponent {
  form = new FormGroup({
    quantity: new FormControl<number | null>(10, { nonNullable: false }),
    amount: new FormControl<number | null>(null, { nonNullable: false }),
  });
}
`,
  );

  readonly statesExample = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input placeholder="Disabled" [disabled]="true" />
  <tng-number-input
    formControlName="readonlyValue"
    placeholder="Readonly"
    [readonly]="true"
  />
  <tng-number-input formControlName="prefilledValue" placeholder="Pre-filled" />
</form>
`,
  );

  readonly validationExample = computed(
    () => `import { Validators } from '@angular/forms';

form = new FormGroup({
  age: new FormControl<number | null>(25, {
    validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(120),
    ],
  }),
});

<tng-number-input
  formControlName="age"
  placeholder="Age (0–120)"
  [min]="0"
  [max]="120"
  [step]="1"
/>

@if (ageCtrl.touched && ageCtrl.invalid) {
  <div class="text-sm text-red-600 mt-1">
    @if (ageCtrl.hasError('required')) {
      Age is required
    } @else if (ageCtrl.hasError('min')) {
      Age must be at least 0
    } @else if (ageCtrl.hasError('max')) {
      Age must be no more than 120
    }
  </div>
}
`,
  );

  readonly customStylingExample = computed(
    () => `
<form [formGroup]="form">
  <tng-number-input
    formControlName="quantity"
    placeholder="Custom styled"
    klass="border-2 border-purple-500 rounded-xl shadow-lg w-48 text-purple-700"
  />
</form>
`,
  );
}
