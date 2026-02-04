import { Component, computed } from '@angular/core';
import { TngCard, TngCardFooter, TngCardHeader } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-card-styling',
  templateUrl: './card-styling.component.html',
  imports: [TngCard, TngCardHeader, TngCardFooter, ExampleBlockComponent, TngExampleDemo],
})
export class CardStylingComponent {
  readonly rootHtml = computed(
    () => `
<tng-card rootKlass="border-2 border-primary">
  <div tngCardHeader>Header</div>
  <p class="text-sm">Content</p>
</tng-card>
`,
  );

  readonly headerFooterHtml = computed(
    () => `
<tng-card headerKlass="bg-primary/10 font-bold" footerKlass="text-xs text-muted">
  <div tngCardHeader>Styled header</div>
  <p class="text-sm">Content</p>
  <div tngCardFooter>Styled footer</div>
</tng-card>
`,
  );
}
