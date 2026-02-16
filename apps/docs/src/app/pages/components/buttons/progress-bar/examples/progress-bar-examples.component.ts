import { Component, computed } from '@angular/core';
import { TngProgressBar } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-bar-examples',
  templateUrl: './progress-bar-examples.component.html',
  imports: [TngProgressBar, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressBarExamplesComponent {
  value = 40;

  readonly determinateHtml = computed(
    () => `
<tng-progress-bar [value]="40" />
<tng-progress-bar [value]="75" />
<tng-progress-bar [value]="100" />
`,
  );

  readonly indeterminateHtml = computed(
    () => `
<tng-progress-bar mode="indeterminate" />
`,
  );

  readonly customMaxHtml = computed(
    () => `
<tng-progress-bar [value]="30" [max]="60" />
<!-- Displays 50% (30/60) -->
`,
  );

  readonly slotVariantsHtml = computed(
    () => `
<tng-progress-bar [value]="60" [slot]="{ track: 'bg-border h-2', indicator: 'bg-success' }" />
<tng-progress-bar [value]="80" [slot]="{ indicator: 'bg-danger' }" />
<tng-progress-bar [value]="50" [slot]="{ track: 'bg-alternate-background h-1', indicator: 'bg-fg/40' }" />
`,
  );

  readonly constrainedWidthHtml = computed(
    () => `
<tng-progress-bar [value]="45" [slot]="{ container: 'w-64', track: 'bg-border h-2', indicator: 'bg-warning' }" />
`,
  );

  readonly disableAnimationHtml = computed(
    () => `
<tng-progress-bar mode="indeterminate" [disableAnimation]="true" />
`,
  );
}
