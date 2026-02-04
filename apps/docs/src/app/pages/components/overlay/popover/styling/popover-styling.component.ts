import { Component, computed } from '@angular/core';
import { TngPopover } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-popover-styling',
  templateUrl: './popover-styling.component.html',
  imports: [TngPopover, ExampleBlockComponent, TngExampleDemo],
})
export class PopoverStylingComponent {
  readonly themedHtml = computed(
    () => `
<tng-popover placement="bottom-start" panelKlass="p-3 rounded-lg border border-border bg-bg shadow-lg">
  <button tngPopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary">Styled trigger</button>
  <ng-template #popoverContent>...</ng-template>
</tng-popover>
`,
  );
}
