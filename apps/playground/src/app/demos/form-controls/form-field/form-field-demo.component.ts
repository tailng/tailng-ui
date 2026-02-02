import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  TngFormField,
  TngSelect,
  TngAutocomplete,
  TngChips,
  TngCheckbox,
  TngSlideToggle,
  TngSlider,
  TngFileUpload,
} from '@tociva/tailng-ui/form-controls';

type Item = { id: number; name: string };

@Component({
  selector: 'playground-form-field-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    TngFormField,
    TngSelect,
    TngAutocomplete,
    TngChips,
    TngCheckbox,
    TngSlideToggle,
    TngSlider,
    TngFileUpload,
  ],
  templateUrl: './form-field-demo.component.html',
})
export class FormFieldDemoComponent {
  readonly items: Item[] = [
    { id: 1, name: 'Kerala' },
    { id: 2, name: 'Tamil Nadu' },
    { id: 3, name: 'Karnataka' },
    { id: 4, name: 'Goa' },
  ];

  displayWith = (v: Item) => v.name;

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    state: new FormControl<Item | null>(null, {
      validators: [Validators.required],
    }),

    search: new FormControl<Item | null>(null),

    tags: new FormControl<Item[]>([], {
      nonNullable: true,
      validators: [Validators.minLength(1)],
    }),

    agree: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),

    notifications: new FormControl<boolean>(true, { nonNullable: true }),

    volume: new FormControl<number>(35, {
      nonNullable: true,
      validators: [Validators.min(10), Validators.max(90)],
    }),

    files: new FormControl<File[] | null>(null, {
      validators: [Validators.required],
    }),
  });

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    // eslint-disable-next-line no-console
    console.log('Form value', this.form.getRawValue());
  }

  reset() {
    this.form.reset(
      {
        email: '',
        state: null,
        search: null,
        tags: [],
        agree: false,
        notifications: true,
        volume: 35,
        files: null,
      },
      { emitEvent: true }
    );
  }
}
