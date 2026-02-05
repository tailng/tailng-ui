import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngButtonToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-button-toggle-examples',
  templateUrl: './button-toggle-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngButtonToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class ButtonToggleExamplesComponent {
  viewOptions = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'map', label: 'Map' },
  ];

  viewOptionsWithDisabled = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid', disabled: true },
    { value: 'map', label: 'Map' },
  ];

  dayOptions = [
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
    { value: 'thu', label: 'Thu' },
    { value: 'fri', label: 'Fri' },
  ];

  form = new FormGroup({
    view: new FormControl<string | null>('list'),
    days: new FormControl<string[]>([]),
  });

  /** Safe display string for multiple selection (avoids null .join in template). */
  get daysSelectedLabel(): string {
    const v = this.form.controls.days.value;
    return v?.length ? v.join(', ') : '—';
  }

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="view" [options]="viewOptions" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];
form = new FormGroup({
  view: new FormControl<string | null>('list'),
});
`,
  );

  readonly multipleHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-button-toggle formControlName="days" [options]="dayOptions" [multiple]="true" />
</form>
`,
  );

  readonly multipleTs = computed(
    () => `
dayOptions = [ { value: 'mon', label: 'Mon' }, ... ];
form = new FormGroup({
  days: new FormControl<string[]>([]),
});
`,
  );

  readonly allowDeselectHtml = computed(
    () => `
<tng-button-toggle formControlName="view" [options]="viewOptions" [allowDeselect]="true" />
`,
  );

  readonly disabledOptionHtml = computed(
    () => `
<tng-button-toggle formControlName="view" [options]="viewOptionsWithDisabled" />
// viewOptionsWithDisabled: one option has disabled: true
`,
  );

  readonly disabledOptionTs = computed(
    () => `
viewOptionsWithDisabled = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid', disabled: true },
  { value: 'map', label: 'Map' },
];
`,
  );
}
