import { Component, computed } from '@angular/core';
import { TngProgressBar } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-progress-bar-overview',
  templateUrl: './progress-bar-overview.component.html',
  imports: [TngProgressBar, ExampleBlockComponent, TngExampleDemo],
})
export class ProgressBarOverviewComponent {
  progress = 65;

  readonly basicHtml = computed(
    () => `
<tng-progress-bar [value]="65" />
<tng-progress-bar [value]="30" [slot]="{ indicator: 'bg-success' }" />
`,
  );

  readonly basicTs = computed(
    () => `
import { TngProgressBar } from '@tailng-ui/ui/primitives';

// Basic usage
<tng-progress-bar [value]="65" />
`,
  );
}
