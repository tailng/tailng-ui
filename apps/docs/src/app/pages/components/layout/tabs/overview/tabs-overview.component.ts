import { Component, computed } from '@angular/core';
import { TngTab, TngTabPanel, TngTabs } from '@tociva/tailng-ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tabs-overview',
  templateUrl: './tabs-overview.component.html',
  imports: [TngTabs, TngTab, TngTabPanel, ExampleBlockComponent, TngExampleDemo],
})
export class TabsOverviewComponent {
  readonly basicHtml = computed(
    () => `
<tng-tabs defaultValue="overview">
  <tng-tab value="overview">Overview</tng-tab>
  <tng-tab value="activity">Activity</tng-tab>
  <tng-tab value="settings">Settings</tng-tab>
  <tng-tab-panel value="overview">...</tng-tab-panel>
  <tng-tab-panel value="activity">...</tng-tab-panel>
  <tng-tab-panel value="settings">...</tng-tab-panel>
</tng-tabs>
`,
  );
  readonly basicTs = computed(
    () => `import { TngTabs, TngTab, TngTabPanel } from '@tociva/tailng-ui/layout';`,
  );
}
