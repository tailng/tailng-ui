import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngCheckbox } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-checkbox-styling',
  templateUrl: './checkbox-styling.component.html',
  imports: [
    TngCheckbox,
    ReactiveFormsModule,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class CheckboxStylingComponent {
  form = new FormGroup({
    opt: new FormControl(false, { nonNullable: true }),
  });

  readonly rootKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-checkbox formControlName="opt" label="Custom root"
    rootKlass="inline-flex items-center gap-3 cursor-pointer p-2 rounded-lg border-2 border-blue-500" />
</form>
`,
  );

  readonly inputKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-checkbox formControlName="opt" label="Custom input"
    inputKlass="h-5 w-5 rounded-full accent-green-600" />
</form>
`,
  );

  readonly labelKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-checkbox formControlName="opt" label="Custom label"
    labelKlass="text-lg font-bold text-purple-600" />
</form>
`,
  );
}
