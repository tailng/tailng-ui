import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlider } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slider-examples',
  templateUrl: './slider-examples.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlider,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SliderExamplesComponent {
  form = new FormGroup({
    volume: new FormControl(50, { nonNullable: true }),
    rating: new FormControl(5, { nonNullable: true }),
  });

  readonly basicHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="volume" [min]="0" [max]="100" [step]="1" />
</form>
`,
  );

  readonly basicTs = computed(
    () => `
form = new FormGroup({
  volume: new FormControl(50, { nonNullable: true }),
});
`,
  );

  readonly rangeHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="rating" [min]="0" [max]="10" [step]="0.5" />
</form>
`,
  );

  readonly disabledHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="volume" [min]="0" [max]="100" [disabled]="true" />
</form>
`,
  );
}
