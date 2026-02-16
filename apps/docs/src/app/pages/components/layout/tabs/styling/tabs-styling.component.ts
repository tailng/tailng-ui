import { Component, computed } from '@angular/core';
import { TngTab, TngTabPanel, TngTabs } from '@tailng-ui/ui/layout';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tabs-styling',
  templateUrl: './tabs-styling.component.html',
  imports: [TngTabs, TngTab, TngTabPanel, TngTag, ExampleBlockComponent, TngExampleDemo],
})
export class TabsStylingComponent {
  readonly containerSlotHtml = computed(
    () => `<tng-tabs [slot]="{ container: 'max-w-md' }">...</tng-tabs>`,
  );
  readonly tabListSlotHtml = computed(
    () => `<tng-tabs [slot]="{ tabList: 'flex gap-6 border-b border-border' }">...</tng-tabs>`,
  );
  readonly panelContainerSlotHtml = computed(
    () => `<tng-tabs [slot]="{ panelContainer: 'pt-6' }">...</tng-tabs>`,
  );
  readonly tabSlotHtml = computed(
    () => `<tng-tab [slot]="{ tab: 'px-4 py-2 font-semibold' }">Tab</tng-tab>`,
  );
  readonly activeSlotHtml = computed(
    () => `<tng-tab [slot]="{ active: 'border-primary text-primary font-bold' }">Tab</tng-tab>`,
  );
  readonly inactiveSlotHtml = computed(
    () => `<tng-tab [slot]="{ inactive: 'text-muted-foreground hover:text-foreground' }">Tab</tng-tab>`,
  );
  readonly underlineHtml = computed(
    () => `
<tng-tabs defaultValue="one" [slot]="{ tabList: 'flex gap-6 border-b border-border', panelContainer: 'pt-5' }">
  <tng-tab value="one" [slot]="{ tab: 'pb-3 ...', active: 'border-primary text-primary', inactive: '...' }">Tab One</tng-tab>
  <tng-tab value="two" ...>Tab Two</tng-tab>
  <tng-tab-panel value="one">...</tng-tab-panel>
  <tng-tab-panel value="two">...</tng-tab-panel>
</tng-tabs>
`,
  );
  readonly pillsHtml = computed(
    () => `
<tng-tabs [slot]="{ tabList: 'inline-flex gap-1 rounded-lg bg-slate-100 p-1', panelContainer: 'pt-4' }">
  <tng-tab [slot]="{ tab: 'rounded-md px-3 py-1.5 ...', active: 'bg-white text-slate-900 shadow-sm', inactive: '...' }">Alpha</tng-tab>
  ...
</tng-tabs>
`,
  );
}
