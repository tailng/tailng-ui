import { Component, computed } from '@angular/core';
import { TngProgressSpinner, TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-spinner-styling',
  templateUrl: './progress-spinner-styling.component.html',
  imports: [TngProgressSpinner, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressSpinnerStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-progress-spinner [slot]="{ container: 'inline-flex items-center justify-center p-4' }" />`,
  );

  readonly svgSlotHtml = computed(
    () => `<tng-progress-spinner [slot]="{ svg: 'w-10 h-10' }" />`,
  );

  readonly trackSlotHtml = computed(
    () => `<tng-progress-spinner [slot]="{ track: 'opacity-20 text-fg/50' }" />`,
  );

  readonly indicatorSlotHtml = computed(
    () => `<tng-progress-spinner [value]="60" mode="determinate" [slot]="{ indicator: 'text-success' }" />`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-progress-spinner mode="determinate" [value]="70"
  [slot]="{
    container: 'p-6',
    svg: 'w-14 h-14',
    track: 'opacity-20 text-border',
    indicator: 'text-info'
  }" />`,
  );
}
