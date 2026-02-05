import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngCheckbox } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-checkbox-examples',
  templateUrl: './checkbox-examples.component.html',
  imports: [
    TngCheckbox,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class CheckboxExamplesComponent {
  form = new FormGroup({
    terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    newsletter: new FormControl(false, { nonNullable: true }),
    notifications: new FormControl(true, { nonNullable: true }),
  });

  get termsCtrl() {
    return this.form.controls.terms;
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-checkbox formControlName="terms" label="I agree to the terms" />
  <tng-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  terms: new FormControl(false, { nonNullable: true }),
  newsletter: new FormControl(false, { nonNullable: true }),
});
`,
  );

  readonly validationHtml = computed(
    () => `
form = new FormGroup({
  terms: new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  }),
});

<tng-checkbox formControlName="terms" label="I agree to the terms" [required]="true" />

@if (termsCtrl.touched && termsCtrl.invalid) {
  <p class="text-sm text-red-600">You must agree to the terms.</p>
}
`,
  );

  readonly statesHtml = computed(
    () => `
<tng-checkbox formControlName="newsletter" label="Subscribe" />
<tng-checkbox formControlName="notifications" label="Notifications" [disabled]="true" />
`,
  );
}
