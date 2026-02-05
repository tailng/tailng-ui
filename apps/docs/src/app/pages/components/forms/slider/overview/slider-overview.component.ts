import { Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngSlider } from '@tailng-ui/ui/form';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-slider-overview',
  templateUrl: './slider-overview.component.html',
  imports: [
    ReactiveFormsModule,
    TngSlider,
    TngTag,
    ExampleBlockComponent,
    TngExampleDemo,
  ],
})
export class SliderOverviewComponent {
  form = new FormGroup({
    volume: new FormControl(50, { nonNullable: true }),
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
}
