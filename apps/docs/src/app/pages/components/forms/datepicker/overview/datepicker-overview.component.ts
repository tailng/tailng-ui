import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngDatepicker } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-datepicker-overview',
  templateUrl: './datepicker-overview.component.html',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TngDatepicker,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class DatepickerOverviewComponent {
  min = new Date(new Date().getFullYear() - 1, 0, 1);
  max = new Date(new Date().getFullYear() + 10, 11, 31);

  form = new FormGroup({
    period: new FormControl<Date | null>(new Date(), { nonNullable: false }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-datepicker formControlName="period" [min]="min" [max]="max" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngDatepicker } from '@tailng-ui/ui/form';

@Component({
  selector: 'datepicker-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngDatepicker],
  template: \`<form [formGroup]="form">
    <tng-datepicker formControlName="period" [min]="min" [max]="max" />
  </form>\`,
})
export class DatepickerDemoComponent {
  min = new Date(2020, 0, 1);
  max = new Date(2030, 11, 31);
  form = new FormGroup({
    period: new FormControl<Date | null>(null, { nonNullable: false }),
  });
}
`,
  );
}
