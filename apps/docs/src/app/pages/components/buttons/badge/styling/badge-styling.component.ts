import { Component, computed } from '@angular/core';
import { TngBadge } from '@tociva/tailng-ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-badge-styling',
  templateUrl: './badge-styling.component.html',
  imports: [TngBadge, ExampleBlockComponent, TngExampleDemo],
})
export class BadgeStylingComponent {
  readonly badgeKlassHtml = computed(
    () => `
<tng-badge [value]="5" variant="danger" badgeKlass="shadow-md">
  <span class="...">Notifications</span>
</tng-badge>
`,
  );

  readonly rootHostHtml = computed(
    () => `
<tng-badge [value]="3" variant="primary"
  rootKlass="inline-flex"
  hostKlass="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border">
</tng-badge>
`,
  );
}
