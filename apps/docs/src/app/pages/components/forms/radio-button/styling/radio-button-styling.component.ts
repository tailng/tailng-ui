import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngRadioButton } from '@tailng-ui/ui/form';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-radio-button-styling',
  templateUrl: './radio-button-styling.component.html',
  imports: [
    TngRadioButton,
    ReactiveFormsModule,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class RadioButtonStylingComponent {
  form = new FormGroup({
    choice: new FormControl<string | null>(null),
  });

  readonly rootKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-radio-button formControlName="choice" name="choice" value="a" label="Option A"
    rootKlass="inline-flex items-center gap-3 cursor-pointer p-2 rounded border-2 border-blue-500" />
</form>
`,
  );

  readonly inputKlassHtml = computed(
    () => `
<tng-radio-button formControlName="choice" name="choice" value="a" label="Custom input"
  inputKlass="h-5 w-5 accent-green-600" />
`,
  );
}
