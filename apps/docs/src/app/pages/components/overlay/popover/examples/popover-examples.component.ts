import { Component, computed, signal } from '@angular/core';
import { TngPopover } from '@tociva/tailng-ui/overlay';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-popover-examples',
  templateUrl: './popover-examples.component.html',
  imports: [TngPopover, ExampleBlockComponent, TngExampleDemo],
})
export class PopoverExamplesComponent {
  readonly popoverOpen = signal(false);

  readonly uncontrolledHtml = computed(
    () => `
<tng-popover>
  <button tngPopoverTrigger>Open popover</button>
  <ng-template #popoverContent>
    <div class="min-w-56 space-y-3">...</div>
  </ng-template>
</tng-popover>
`,
  );
  readonly controlledHtml = computed(
    () => `
<tng-popover [open]="popoverOpen()" (openChange)="popoverOpen.set($event)" placement="bottom-start" panelKlass="p-3">
  <button tngPopoverTrigger>Controlled trigger</button>
  <div tngPopoverContent>...</div>
</tng-popover>
`,
  );
  readonly controlledTs = computed(
    () => `readonly popoverOpen = signal(false);`,
  );
  readonly projectedHtml = computed(
    () => `
<tng-popover placement="bottom-end">
  <button tngPopoverTrigger>Open</button>
  <div tngPopoverContent class="min-w-48 ...">Projected content...</div>
</tng-popover>
`,
  );
}
