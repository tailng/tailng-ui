import { Component, computed } from '@angular/core';
import { TngBadge } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-badge-examples',
  templateUrl: './badge-examples.component.html',
  imports: [TngBadge, ExampleBlockComponent, TngExampleDemo],
})
export class BadgeExamplesComponent {
  count = 12;

  readonly numericHtml = computed(
    () => `
<tng-badge [value]="count" variant="danger">...</tng-badge>
<tng-badge [value]="128" [max]="99" variant="danger">...</tng-badge>
`,
  );

  readonly dotHtml = computed(
    () => `
<tng-badge dot variant="primary">
  <button type="button" class="...">Inbox</button>
</tng-badge>
`,
  );

  readonly variantsHtml = computed(
    () => `
<tng-badge [value]="1" variant="primary">...</tng-badge>
<tng-badge [value]="3" position="top-left" variant="danger">...</tng-badge>
`,
  );

  readonly showZeroHtml = computed(
    () => `
<tng-badge [value]="0" variant="neutral">...</tng-badge>
<tng-badge [value]="0" showZero variant="neutral">...</tng-badge>
`,
  );
}
