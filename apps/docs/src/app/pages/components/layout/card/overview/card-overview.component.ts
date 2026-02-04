import { Component, computed } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-card-overview',
  templateUrl: './card-overview.component.html',
  imports: [TngCard, TngCardHeader, TngCardFooter, ExampleBlockComponent, TngExampleDemo],
})
export class CardOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-card>
  <div tngCardHeader class="font-semibold">Card title</div>
  <p class="text-sm">Card body content goes here.</p>
  <div tngCardFooter class="text-xs text-muted">Footer</div>
</tng-card>
`,
  );

  readonly basicTs = computed(
    () => `import { TngCard, TngCardHeader, TngCardFooter } from '@tociva/tailng-ui/layout';`,
  );
}
