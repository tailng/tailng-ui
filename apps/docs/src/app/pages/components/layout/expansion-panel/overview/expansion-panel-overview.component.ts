import { Component, computed } from '@angular/core';
import { TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-expansion-panel-overview',
  templateUrl: './expansion-panel-overview.component.html',
  imports: [TngExpansionPanel, ExampleBlockComponent, TngExampleDemo],
})
export class ExpansionPanelOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-expansion-panel>
  <div tngExpansionTitle>What is TailNG?</div>
  <div tngExpansionContent>
    TailNG is a minimal Angular + Tailwind UI kit with klass hooks for theming.
  </div>
</tng-expansion-panel>
`,
  );
  readonly basicTs = computed(
    () => `import { TngExpansionPanel } from '@tociva/tailng-ui/layout';`,
  );
}
