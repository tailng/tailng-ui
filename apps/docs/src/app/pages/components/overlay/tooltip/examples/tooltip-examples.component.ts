import { Component, computed } from '@angular/core';
import { TngTooltip } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tooltip-examples',
  templateUrl: './tooltip-examples.component.html',
  imports: [TngTooltip, ExampleBlockComponent, TngExampleDemo],
})
export class TooltipExamplesComponent {
  readonly textHtml = computed(
    () => `
<tng-tooltip text="Copy to clipboard" placement="top-start">
  <button>Copy</button>
</tng-tooltip>
`,
  );
  readonly templateHtml = computed(
    () => `
<tng-tooltip placement="top-start">
  <ng-template #tooltipContent>
    <div class="max-w-56 text-xs whitespace-normal">Longer tooltip...</div>
  </ng-template>
  <button>Template tooltip</button>
</tng-tooltip>
`,
  );
  readonly placementHtml = computed(
    () => `
<tng-tooltip text="Top start" placement="top-start"><button>top-start</button></tng-tooltip>
<tng-tooltip text="Top end" placement="top-end"><button>top-end</button></tng-tooltip>
<tng-tooltip text="Bottom start" placement="bottom-start"><button>bottom-start</button></tng-tooltip>
<tng-tooltip text="Bottom end" placement="bottom-end"><button>bottom-end</button></tng-tooltip>
`,
  );
}
