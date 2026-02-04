import { Component, computed } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-card-examples',
  templateUrl: './card-examples.component.html',
  imports: [TngCard, TngCardHeader, TngCardFooter, ExampleBlockComponent, TngExampleDemo],
})
export class CardExamplesComponent {
  readonly basicHtml = computed(
    () => `
<tng-card>
  <div tngCardHeader class="font-semibold">Title</div>
  <p class="text-sm">Body content.</p>
  <div tngCardFooter class="text-xs text-muted">Footer</div>
</tng-card>
`,
  );

  readonly contentOnlyHtml = computed(
    () => `
<tng-card>
  <p class="text-sm">Just body content, no header or footer.</p>
</tng-card>
`,
  );
}
