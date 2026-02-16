import { Component, computed } from '@angular/core';
import { TngAccordion, TngExpansionPanel } from '@tailng-ui/ui/layout';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-accordion-styling',
  templateUrl: './accordion-styling.component.html',
  imports: [TngAccordion, TngExpansionPanel, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class AccordionStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-accordion [slot]="{ container: 'max-w-2xl py-4' }">...</tng-accordion>`,
  );
  readonly stackSlotHtml = computed(
    () => `<tng-accordion [slot]="{ stack: 'space-y-6' }">...</tng-accordion>`,
  );
  readonly themedHtml = computed(
    () => `
<tng-accordion [slot]="{ container: 'w-full', stack: 'space-y-3' }">
  <tng-expansion-panel [slot]="{
    container: 'rounded-xl border border-slate-200 bg-white shadow-sm',
    header: '...',
    contentPadding: 'px-5 pb-5 pt-2',
    contentBody: 'text-sm text-slate-600'
  }">
    <div tngExpansionTitle>Styled header</div>
    <div tngExpansionContent>...</div>
  </tng-expansion-panel>
</tng-accordion>
`,
  );
}
