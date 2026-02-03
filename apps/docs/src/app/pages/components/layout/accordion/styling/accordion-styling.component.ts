import { Component, computed } from '@angular/core';
import { TngAccordion, TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-accordion-styling',
  templateUrl: './accordion-styling.component.html',
  imports: [TngAccordion, TngExpansionPanel, ExampleBlockComponent, TngExampleDemo],
})
export class AccordionStylingComponent {
  readonly themedHtml = computed(
    () => `
<tng-accordion rootKlass="w-full" stackKlass="space-y-3">
  <tng-expansion-panel
    rootKlass="rounded-xl border border-slate-200 bg-white shadow-sm"
    headerKlass="..."
    contentPaddingKlass="px-5 pb-5 pt-2"
    contentBodyKlass="text-sm text-slate-600"
  >
    <div tngExpansionTitle>Styled header</div>
    <div tngExpansionContent>...</div>
  </tng-expansion-panel>
</tng-accordion>
`,
  );
}
