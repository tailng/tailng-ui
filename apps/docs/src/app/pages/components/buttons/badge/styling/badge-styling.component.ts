import { Component, computed } from '@angular/core';
import { TngBadge, TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-badge-styling',
  templateUrl: './badge-styling.component.html',
  imports: [TngBadge, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class BadgeStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-badge [value]="5" variant="danger" [slot]="{ container: 'inline-flex' }">
  <span class="rounded-md border border-border px-3 py-2 text-sm">Notifications</span>
</tng-badge>`,
  );

  readonly anchorSlotHtml = computed(
    () => `<tng-badge [value]="3" variant="primary"
  [slot]="{ anchor: 'relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border' }">
</tng-badge>`,
  );

  readonly badgeSlotHtml = computed(
    () => `<tng-badge [value]="5" variant="danger" [slot]="{ badge: 'shadow-md' }">
  <span class="rounded-md border border-border px-3 py-2 text-sm">Notifications</span>
</tng-badge>`,
  );

  readonly combinedSlotHtml = computed(
    () => `<tng-badge [value]="3" variant="primary"
  [slot]="{
    container: 'inline-flex',
    anchor: 'relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border',
    badge: 'shadow-lg ring-primary/50'
  }">
</tng-badge>`,
  );
}
