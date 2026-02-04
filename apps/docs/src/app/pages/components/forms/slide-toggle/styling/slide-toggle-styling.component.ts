import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlideToggle } from '@tociva/tailng-ui/form';
import { TngTag } from '@tociva/tailng-ui/primitives';
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

  readonly rootKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Custom root"
    rootKlass="inline-flex items-center gap-3 p-2 rounded-lg border-2 border-primary/30" />
</form>
`,
  );

  readonly trackKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Wide track" trackKlass="h-4 w-14" />
</form>
`,
  );

  readonly thumbKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Large thumb" thumbKlass="h-4 w-4 shadow-lg" />
</form>
`,
  );

  readonly trackThumbOnOffHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Themed by state"
    trackOffKlass="bg-bg border-primary" trackOnKlass="bg-primary border-primary"
    thumbOffKlass="bg-primary" thumbOnKlass="bg-on-primary" />
</form>
`,
  );

  readonly labelKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slide-toggle formControlName="on" label="Custom label"
    labelKlass="text-lg font-bold text-primary" />
</form>
`,
  );
}
