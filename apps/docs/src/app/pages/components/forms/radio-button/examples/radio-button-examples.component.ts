import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngRadioButton } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-radio-button-examples',
  templateUrl: './radio-button-examples.component.html',
  imports: [
    TngRadioButton,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class RadioButtonExamplesComponent {
  form = new FormGroup({
    gender: new FormControl<string | null>(null, { validators: [Validators.required] }),
    size: new FormControl<string | null>('m'),
  });

  get genderCtrl() {
    return this.form.controls.gender;
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-radio-button formControlName="gender" name="gender" value="male" label="Male" />
  <tng-radio-button formControlName="gender" name="gender" value="female" label="Female" />
  <tng-radio-button formControlName="gender" name="gender" value="other" label="Other" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  gender: new FormControl<string | null>(null),
});
`,
  );

  readonly validationHtml = computed(
    () => `
form = new FormGroup({
  gender: new FormControl<string | null>(null, { validators: [Validators.required] }),
});
// In template: @if (genderCtrl.touched && genderCtrl.invalid) { ... }
`,
  );
}
