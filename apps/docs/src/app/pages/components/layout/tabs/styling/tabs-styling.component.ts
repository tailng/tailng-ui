import { Component, computed } from '@angular/core';
import { TngTab, TngTabPanel, TngTabs } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tabs-styling',
  templateUrl: './tabs-styling.component.html',
  imports: [TngTabs, TngTab, TngTabPanel, ExampleBlockComponent, TngExampleDemo],
})
export class TabsStylingComponent {
  readonly underlineHtml = computed(
    () => `
<tng-tabs defaultValue="one" listKlass="flex gap-6 border-b border-border" panelKlass="pt-5">
  <tng-tab value="one" tabKlass="pb-3 ..." activeKlass="border-primary text-primary" inactiveKlass="...">Tab One</tng-tab>
  <tng-tab value="two" ...>Tab Two</tng-tab>
  <tng-tab-panel value="one">...</tng-tab-panel>
  <tng-tab-panel value="two">...</tng-tab-panel>
</tng-tabs>
`,
  );
  readonly pillsHtml = computed(
    () => `
<tng-tabs listKlass="inline-flex gap-1 rounded-lg bg-slate-100 p-1" panelKlass="pt-4">
  <tng-tab tabKlass="rounded-md px-3 py-1.5 ..." activeKlass="bg-white text-slate-900 shadow-sm" ...>Alpha</tng-tab>
  ...
</tng-tabs>
`,
  );
}
