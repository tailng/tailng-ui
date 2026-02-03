import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TngAccordion, TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-accordion-examples',
  templateUrl: './accordion-examples.component.html',
  imports: [TngAccordion, TngExpansionPanel, ExampleBlockComponent, TngExampleDemo, JsonPipe],
})
export class AccordionExamplesComponent {
  readonly openIndexes = signal<number[]>([]);

  readonly singleHtml = computed(
    () => `
<tng-accordion>
  <tng-expansion-panel><div tngExpansionTitle>Panel A</div><div tngExpansionContent>...</div></tng-expansion-panel>
  <tng-expansion-panel><div tngExpansionTitle>Panel B</div><div tngExpansionContent>...</div></tng-expansion-panel>
</tng-accordion>
`,
  );
  readonly multipleHtml = computed(
    () => `<tng-accordion [multiple]="true">...</tng-accordion>`,
  );
  readonly nonCollapsibleHtml = computed(
    () => `<tng-accordion [collapsible]="false" [autoOpenFirst]="true">...</tng-accordion>`,
  );
  readonly trackHtml = computed(
    () => `<tng-accordion (openIndexesChange)="openIndexes.set($event)">...</tng-accordion>`,
  );
  readonly trackTs = computed(
    () => `readonly openIndexes = signal<number[]>([]);`,
  );
}
