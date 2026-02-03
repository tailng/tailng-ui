import { Component, computed } from '@angular/core';
import { TngBadge } from '@tociva/tailng-ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-badge-overview',
  templateUrl: './badge-overview.component.html',
  imports: [TngBadge, ExampleBlockComponent, TngExampleDemo],
})
export class BadgeOverviewComponent {
  count = 12;

  readonly basicHtml = computed(
    () => `
<tng-badge [value]="count" variant="danger">
  <button type="button" class="...">Notifications</button>
</tng-badge>
<tng-badge dot variant="primary">
  <button type="button" class="...">Inbox</button>
</tng-badge>
`,
  );

  readonly basicTs = computed(
    () => `
import { TngBadge } from '@tociva/tailng-ui/primitives';
count = 12;
`,
  );
}
