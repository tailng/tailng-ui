import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlideToggle } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slide-toggle-styling',
  templateUrl: './slide-toggle-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlideToggle,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SlideToggleStylingComponent {
  form = new FormGroup({
    on: new FormControl(false, { nonNullable: true }),
  });

  readonly containerSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Custom container"
    [slot]="{ container: 'inline-flex items-center gap-3 p-2 rounded-lg border-2 border-primary/30' }" />
</form>
`,
  );

  readonly labelSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Custom label"
    [slot]="{ label: 'text-lg font-bold text-primary' }" />
</form>
`,
  );

  readonly inputSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Custom input (sr-only + focus ring)"
    [slot]="{ input: 'sr-only focus:ring-2' }" />
</form>
`,
  );

  readonly trackSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Wide track"
    [slot]="{ track: 'h-4 w-14' }" />
</form>
`,
  );

  readonly trackCheckedUncheckedSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Themed by state"
    [slot]="{
      trackChecked: 'bg-primary border-primary',
      trackUnchecked: 'bg-bg border-primary',
      thumbChecked: 'bg-on-primary',
      thumbUnchecked: 'bg-primary'
    }" />
</form>
`,
  );

  readonly thumbSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Large thumb"
    [slot]="{ thumb: 'h-6 w-6 shadow-lg' }" />
</form>
`,
  );

  readonly combinedSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="All slots"
    [slot]="{
      container: 'inline-flex items-center gap-3 p-2 rounded-xl border border-primary/30',
      label: 'text-sm font-medium text-primary',
      track: 'h-4 w-14',
      trackChecked: 'bg-primary border-primary',
      trackUnchecked: 'bg-bg border-primary',
      thumb: 'shadow-md',
      thumbChecked: 'bg-on-primary',
      thumbUnchecked: 'bg-primary'
    }" />
</form>
`,
  );
}
