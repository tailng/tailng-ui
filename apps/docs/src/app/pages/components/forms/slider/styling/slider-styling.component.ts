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

  readonly containerSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{ container: 'w-full p-4 rounded-xl border-2 border-primary/30' }" />
</form>
`,
  );

  readonly trackWrapperSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{ trackWrapper: 'relative w-full h-10' }" />
</form>
`,
  );

  readonly trackFillSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{ track: 'h-3 bg-on-primary/50', trackFill: 'bg-primary' }" />
</form>
`,
  );

  readonly thumbSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{ thumb: 'h-5 w-5 shadow-lg border-2 border-primary' }" />
</form>
`,
  );

  readonly valueTextSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{ valueText: 'mt-1 text-sm font-medium text-primary' }" />
</form>
`,
  );

  readonly combinedSlotHtml = computed(
    () => `
<form [formGroup]="form">
  <tng-slider formControlName="val"
    [slot]="{
      container: 'w-full p-4 rounded-xl border border-primary/30',
      track: 'h-3 bg-on-primary/50',
      trackFill: 'bg-primary',
      thumb: 'h-5 w-5 shadow-lg border-2 border-primary',
      valueText: 'mt-1 text-sm font-medium text-primary'
    }" />
</form>
`,
  );
}
