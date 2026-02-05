import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngDatepicker } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-datepicker-styling',
  templateUrl: './datepicker-styling.component.html',
  imports: [
    TngDatepicker,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class DatepickerStylingComponent {
  form = new FormGroup({
    period: new FormControl<Date | null>(null, { nonNullable: false }),
  });

  readonly inputKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-datepicker formControlName="period"
    inputKlass="border-2 border-blue-500 rounded-lg font-semibold" />
</form>
`,
  );

  readonly toggleKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-datepicker formControlName="period"
    toggleKlass="bg-blue-100 hover:bg-blue-200 rounded-r-md" />
</form>
`,
  );
}
