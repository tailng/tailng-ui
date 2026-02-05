import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TngDatepicker } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-datepicker-examples',
  templateUrl: './datepicker-examples.component.html',
  imports: [
    DatePipe,
    TngDatepicker,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
    TngTag,
  ],
})
export class DatepickerExamplesComponent {
  min = new Date(new Date().getFullYear() - 1, 0, 1);
  max = new Date(new Date().getFullYear() + 10, 11, 31);

  form = new FormGroup({
    period: new FormControl<Date | null>(null, {
      nonNullable: false,
      validators: [Validators.required],
    }),
  });

  get periodCtrl() {
    return this.form.controls.period;
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-datepicker formControlName="period" [min]="min" [max]="max" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
min = new Date(2024, 0, 1);
max = new Date(2030, 11, 31);
form = new FormGroup({
  period: new FormControl<Date | null>(null, { nonNullable: false }),
});
`,
  );

  readonly validationHtml = computed(
    () => `
form = new FormGroup({
  period: new FormControl<Date | null>(null, {
    validators: [Validators.required],
  }),
});

<tng-datepicker formControlName="period" [min]="min" [max]="max" />

@if (periodCtrl.touched && periodCtrl.invalid) {
  <p class="text-sm text-red-600">Please select a date.</p>
}
`,
  );

  readonly formatHtml = computed(
    () => `
<tng-datepicker formControlName="period"
  displayFormat="DD-MM-YYYY"
  previewFormat="DD MMMM YYYY" />
`,
  );
}
