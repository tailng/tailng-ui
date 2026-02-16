import { Component, computed } from '@angular/core';
import { TngProgressBar, TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-bar-styling',
  templateUrl: './progress-bar-styling.component.html',
  imports: [TngProgressBar, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressBarStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-progress-bar [value]="50" [slot]="{ container: 'w-64' }" />`,
  );

  readonly trackSlotHtml = computed(
    () => `<tng-progress-bar [value]="60" [slot]="{ track: 'bg-border h-2' }" />`,
  );

  readonly indicatorSlotHtml = computed(
    () => `<tng-progress-bar [value]="75" [slot]="{ indicator: 'bg-success' }" />`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-progress-bar [value]="45"
  [slot]="{
    container: 'w-80',
    track: 'bg-alternate-background h-2',
    indicator: 'bg-info'
  }" />`,
  );
}
