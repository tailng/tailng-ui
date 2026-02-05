import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngRadioButton } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-radio-button-overview',
  templateUrl: './radio-button-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngRadioButton,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class RadioButtonOverviewComponent {
  form = new FormGroup({
    choice: new FormControl<string | null>(null),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-radio-button formControlName="choice" name="choice" value="a" label="Option A" />
  <tng-radio-button formControlName="choice" name="choice" value="b" label="Option B" />
  <tng-radio-button formControlName="choice" name="choice" value="c" label="Option C" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  choice: new FormControl<string | null>(null),
});
`,
  );
}
