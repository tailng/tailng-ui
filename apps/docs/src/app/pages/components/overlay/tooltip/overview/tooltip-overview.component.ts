import { Component, computed } from '@angular/core';
import { TngTooltip } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tooltip-overview',
  templateUrl: './tooltip-overview.component.html',
  imports: [TngTooltip, ExampleBlockComponent, TngExampleDemo],
})
export class TooltipOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-tooltip text="Copy to clipboard" placement="top-start">
  <button class="rounded-md border border-border bg-bg px-3 py-1.5 text-sm">Copy</button>
</tng-tooltip>
`,
  );
  readonly basicTs = computed(
    () => `import { TngTooltip } from '@tociva/tailng-ui/overlay';`,
  );
}
