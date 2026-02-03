import { Component, computed } from '@angular/core';
import { TngExpansionPanel } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-expansion-panel-styling',
  templateUrl: './expansion-panel-styling.component.html',
  imports: [TngExpansionPanel, ExampleBlockComponent, TngExampleDemo],
})
export class ExpansionPanelStylingComponent {
  readonly themedHtml = computed(
    () => `
<tng-expansion-panel
  rootKlass="rounded-xl border border-slate-200 bg-white shadow-sm"
  headerKlass="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-primary ..."
  contentPaddingKlass="px-5 pb-5 pt-2"
  contentBodyKlass="text-sm text-slate-600"
  chevronKlass="h-4 w-4 shrink-0 transition-transform duration-200 text-primary"
>
  <div tngExpansionTitle>Custom styled header</div>
  <div tngExpansionContent>...</div>
</tng-expansion-panel>
`,
  );
}
