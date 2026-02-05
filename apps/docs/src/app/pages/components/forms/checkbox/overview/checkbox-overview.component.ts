import { JsonPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngCheckbox } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-checkbox-overview',
  templateUrl: './checkbox-overview.component.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    TngCheckbox,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class CheckboxOverviewComponent {
  form = new FormGroup({
    terms: new FormControl(false, { nonNullable: true }),
    newsletter: new FormControl(false, { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-checkbox formControlName="terms" label="I agree to the terms" />
  <tng-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngCheckbox } from '@tailng-ui/ui/form';

@Component({
  selector: 'checkbox-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngCheckbox],
  template: \`<form [formGroup]="form">
    <tng-checkbox formControlName="terms" label="I agree to the terms" />
  </form>\`,
})
export class CheckboxDemoComponent {
  form = new FormGroup({
    terms: new FormControl(false, { nonNullable: true }),
  });
}
`,
  );
}
