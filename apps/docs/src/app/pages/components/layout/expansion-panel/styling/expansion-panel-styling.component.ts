import { Component, computed } from '@angular/core';
import { TngExpansionPanel } from '@tailng-ui/ui/layout';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-expansion-panel-styling',
  templateUrl: './expansion-panel-styling.component.html',
  imports: [TngExpansionPanel, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class ExpansionPanelStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ container: 'rounded-xl border-2 border-primary' }">...</tng-expansion-panel>`,
  );
  readonly headerSlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ header: '... font-bold text-primary' }">...</tng-expansion-panel>`,
  );
  readonly titleSlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ title: 'text-primary font-semibold' }">...</tng-expansion-panel>`,
  );
  readonly chevronSlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ chevron: 'h-5 w-5 text-primary' }">...</tng-expansion-panel>`,
  );
  readonly contentBodySlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ contentBody: 'text-slate-600' }">...</tng-expansion-panel>`,
  );
  readonly contentPaddingSlotHtml = computed(
    () => `<tng-expansion-panel [slot]="{ contentPadding: 'px-6 pb-6 pt-4' }">...</tng-expansion-panel>`,
  );
  readonly themedHtml = computed(
    () => `
<tng-expansion-panel [slot]="{
  container: 'rounded-xl border border-slate-200 bg-white shadow-sm',
  header: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-primary ...',
  contentPadding: 'px-5 pb-5 pt-2',
  contentBody: 'text-sm text-slate-600',
  chevron: 'h-4 w-4 shrink-0 transition-transform duration-200 text-primary'
}">
  <div tngExpansionTitle>Custom styled header</div>
  <div tngExpansionContent>...</div>
</tng-expansion-panel>
`,
  );
}
