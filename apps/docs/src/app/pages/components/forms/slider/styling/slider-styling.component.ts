import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlider } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slider-styling',
  templateUrl: './slider-styling.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlider,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SliderStylingComponent {
  form = new FormGroup({
    val: new FormControl(40, { nonNullable: true }),
  });

  readonly rootKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val" rootKlass="w-full p-4 rounded-xl border-2 border-primary/30" />
</form>
`,
  );

  readonly trackFillHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val" trackKlass="h-3 bg-on-primary/50" fillKlass="bg-primary" />
</form>
`,
  );

  readonly thumbKlassHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val" thumbKlass="h-5 w-5 shadow-lg border-2 border-primary" />
</form>
`,
  );
}
