import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngFormField, TngTextInput } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-form-field-styling',
  templateUrl: './form-field-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngFormField,
    TngTextInput,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class FormFieldStylingComponent {
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
  });

  readonly labelKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-form-field label="Custom label" labelKlass="text-base font-bold text-primary" [required]="true">
    <tng-text-input formControlName="name" placeholder="Your name" />
  </tng-form-field>
</form>
`,
  );

  readonly hintErrorKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-form-field label="Email" hint="We'll never share it." error="Invalid email"
    hintKlass="text-xs text-primary/80" errorKlass="text-sm font-semibold text-red-600">
    <tng-text-input formControlName="email" placeholder="Email" />
  </tng-form-field>
</form>
`,
  );
}
