import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngFormField, TngTextInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-form-field-overview',
  templateUrl: './form-field-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngFormField,
    TngTextInput,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FormFieldOverviewComponent {
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-form-field label="Email" hint="We'll never share your email.">
    <tng-text-input formControlName="email" placeholder="you@example.com" />
  </tng-form-field>
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  email: new FormControl('', { validators: [Validators.required, Validators.email] }),
});
`,
  );
}
