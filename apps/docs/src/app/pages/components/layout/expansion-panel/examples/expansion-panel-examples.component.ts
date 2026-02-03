import { Component, computed } from '@angular/core';
import { TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-expansion-panel-examples',
  templateUrl: './expansion-panel-examples.component.html',
  imports: [TngExpansionPanel, ExampleBlockComponent, TngExampleDemo],
})
export class ExpansionPanelExamplesComponent {
  readonly basicHtml = computed(
    () => `
<tng-expansion-panel>
  <div tngExpansionTitle>What is TailNG?</div>
  <div tngExpansionContent>TailNG is a minimal Angular + Tailwind UI kit...</div>
</tng-expansion-panel>
`,
  );
  readonly openByDefaultHtml = computed(
    () => `<tng-expansion-panel [open]="true">...</tng-expansion-panel>`,
  );
  readonly disabledHtml = computed(
    () => `<tng-expansion-panel [disabled]="true" [open]="true">...</tng-expansion-panel>`,
  );
  readonly noPaddingHtml = computed(
    () => `
<tng-expansion-panel [padded]="false" contentBodyKlass="overflow-hidden text-sm text-muted-foreground">
  <div tngExpansionTitle>Custom layout inside</div>
  <div tngExpansionContent>...</div>
</tng-expansion-panel>
`,
  );
  readonly stackedHtml = computed(
    () => `
<div class="space-y-2">
  <tng-expansion-panel><div tngExpansionTitle>Panel A</div><div tngExpansionContent>...</div></tng-expansion-panel>
  <tng-expansion-panel><div tngExpansionTitle>Panel B</div><div tngExpansionContent>...</div></tng-expansion-panel>
  <tng-expansion-panel><div tngExpansionTitle>Panel C</div><div tngExpansionContent>...</div></tng-expansion-panel>
</div>
`,
  );
}
