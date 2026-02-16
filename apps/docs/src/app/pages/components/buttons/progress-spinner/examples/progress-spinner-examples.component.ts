import { Component, computed } from '@angular/core';
import { TngProgressSpinner } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-spinner-examples',
  templateUrl: './progress-spinner-examples.component.html',
  imports: [TngProgressSpinner, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressSpinnerExamplesComponent {
  value = 40;

  readonly determinateHtml = computed(
    () => `
<tng-progress-spinner mode="determinate" [value]="40" />
<tng-progress-spinner mode="determinate" [value]="75" />
<tng-progress-spinner mode="determinate" [value]="100" />
`,
  );

  readonly indeterminateHtml = computed(
    () => `
<tng-progress-spinner />
<!-- or explicitly: mode="indeterminate" -->
`,
  );

  readonly customMaxHtml = computed(
    () => `
<tng-progress-spinner mode="determinate" [value]="30" [max]="60" />
<!-- Displays 50% (30/60) -->
`,
  );

  readonly slotSizesHtml = computed(
    () => `
<tng-progress-spinner [slot]="{ svg: 'w-6 h-6' }" />
<tng-progress-spinner [slot]="{ svg: 'w-10 h-10', indicator: 'text-success' }" />
<tng-progress-spinner [slot]="{ svg: 'w-14 h-14', indicator: 'text-danger' }" />
`,
  );

  readonly slotVariantsHtml = computed(
    () => `
<tng-progress-spinner [value]="75" [slot]="{ indicator: 'text-success' }" />
<tng-progress-spinner [value]="60" [slot]="{ indicator: 'text-danger' }" />
<tng-progress-spinner [value]="50" [slot]="{ indicator: 'text-fg/40' }" />
`,
  );
}
