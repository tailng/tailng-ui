import { Component, computed } from '@angular/core';
import { TngDivider } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-divider-overview',
  templateUrl: './divider-overview.component.html',
  imports: [TngDivider, ExampleBlockComponent, TngExampleDemo],
})
export class DividerOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-divider />
<tng-divider label="OR" />
`,
  );
  readonly basicTs = computed(
    () => `import { TngDivider } from '@tociva/tailng-ui/layout';`,
  );
}
