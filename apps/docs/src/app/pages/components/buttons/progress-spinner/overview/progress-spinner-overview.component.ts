import { Component, computed } from '@angular/core';
import { TngProgressSpinner } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-spinner-overview',
  templateUrl: './progress-spinner-overview.component.html',
  imports: [TngProgressSpinner, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressSpinnerOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-progress-spinner />
<tng-progress-spinner [value]="75" [slot]="{ indicator: 'text-success' }" />
`,
  );

  readonly basicTs = computed(
    () => `
import { TngProgressSpinner } from '@tailng-ui/ui/primitives';

// Indeterminate (default)
<tng-progress-spinner />

// Determinate with slot
<tng-progress-spinner [value]="75" [slot]="{ indicator: 'text-success' }" />
`,
  );
}
