import { Component, computed } from '@angular/core';
import { TngTooltip } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tooltip-styling',
  templateUrl: './tooltip-styling.component.html',
  imports: [TngTooltip, ExampleBlockComponent, TngExampleDemo],
})
export class TooltipStylingComponent {
  readonly themedHtml = computed(
    () => `
<tng-tooltip
  text="Delete item (irreversible)"
  placement="top-start"
  surfaceKlass="rounded-md border border-border bg-bg shadow-md"
  panelKlass="px-3 py-2 text-xs text-foreground"
>
  <button>Delete</button>
</tng-tooltip>
`,
  );
}
