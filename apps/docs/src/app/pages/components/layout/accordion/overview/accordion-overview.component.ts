import { Component, computed } from '@angular/core';
import { TngAccordion, TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-accordion-overview',
  templateUrl: './accordion-overview.component.html',
  imports: [TngAccordion, TngExpansionPanel, ExampleBlockComponent, TngExampleDemo],
})
export class AccordionOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-accordion>
  <tng-expansion-panel>
    <div tngExpansionTitle>Panel A</div>
    <div tngExpansionContent>...</div>
  </tng-expansion-panel>
  <tng-expansion-panel>
    <div tngExpansionTitle>Panel B</div>
    <div tngExpansionContent>...</div>
  </tng-expansion-panel>
</tng-accordion>
`,
  );
  readonly basicTs = computed(
    () => `import { TngAccordion, TngExpansionPanel } from '@tociva/tailng-ui/layout';`,
  );
}
