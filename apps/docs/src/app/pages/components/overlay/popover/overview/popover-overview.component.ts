import { Component, computed } from '@angular/core';
import { TngPopover } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-popover-overview',
  templateUrl: './popover-overview.component.html',
  imports: [TngPopover, ExampleBlockComponent, TngExampleDemo],
})
export class PopoverOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-popover>
  <button tngPopoverTrigger>Open popover</button>
  <ng-template #popoverContent>
    <div class="min-w-56 space-y-2 text-sm">
      <div class="font-medium">Quick settings</div>
      <p class="text-muted-foreground">Click outside or Escape to close.</p>
    </div>
  </ng-template>
</tng-popover>
`,
  );
  readonly basicTs = computed(
    () => `import { TngPopover } from '@tociva/tailng-ui/overlay';`,
  );
}
