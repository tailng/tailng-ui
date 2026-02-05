import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngFormField, TngTextInput, TngTextarea } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-form-field-examples',
  templateUrl: './form-field-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngFormField,
    TngTextInput,
    TngTextarea,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FormFieldExamplesComponent {
  form = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    code: new FormControl('', { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-form-field label="Username" hint="Choose a unique username.">
    <tng-text-input formControlName="username" placeholder="johndoe" />
  </tng-form-field>
  <tng-form-field label="Bio" hint="Optional.">
    <tng-textarea formControlName="bio" placeholder="Tell us about yourself" [rows]="3" />
  </tng-form-field>
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  username: new FormControl('', { nonNullable: true }),
  bio: new FormControl('', { nonNullable: true }),
});
`,
  );

  readonly requiredErrorHtml = computed(
    () => `
<tng-form-field label="Email" [required]="true">
  <tng-text-input formControlName="email" placeholder="you@example.com" />
</tng-form-field>
`,
  );

  readonly requiredErrorTs = computed(
    () => `
form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
});
`,
  );

  readonly manualErrorHtml = computed(
    () => `
<tng-form-field label="Code" error="This code has already been used.">
  <tng-text-input formControlName="code" placeholder="Enter code" />
</tng-form-field>
`,
  );
}
