import { Component, computed, signal } from '@angular/core';
import { TngTab, TngTabPanel, TngTabs } from '@tailng-ui/ui/layout';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

@Component({
  standalone: true,
  selector: 'docs-tabs-examples',
  templateUrl: './tabs-examples.component.html',
  imports: [TngTabs, TngTab, TngTabPanel, ExampleBlockComponent, TngExampleDemo],
})
export class TabsExamplesComponent {
  readonly tabValue = signal<string>('account');

  readonly uncontrolledHtml = computed(
    () => `
<tng-tabs defaultValue="overview">
  <tng-tab value="overview">Overview</tng-tab>
  <tng-tab value="activity">Activity</tng-tab>
  <tng-tab value="settings">Settings</tng-tab>
  <tng-tab-panel value="overview">...</tng-tab-panel>
  ...
</tng-tabs>
`,
  );
  readonly disabledHtml = computed(
    () => `<tng-tab value="billing" [disabled]="true">Billing (disabled)</tng-tab>`,
  );
  readonly controlledHtml = computed(
    () => `
<tng-tabs [value]="tabValue()" (valueChange)="tabValue.set($event)" defaultValue="account">
  <tng-tab value="account">Account</tng-tab>
  <tng-tab value="security">Security</tng-tab>
  ...
</tng-tabs>
`,
  );
  readonly controlledTs = computed(
    () => `readonly tabValue = signal<string>('account');`,
  );
  readonly verticalHtml = computed(
    () => `
<tng-tabs orientation="vertical" defaultValue="profile"
  [slot]="{ container: 'grid gap-6 md:grid-cols-[180px_1fr]', tabList: 'flex flex-col gap-1 rounded-lg border border-border bg-bg p-2', panelContainer: 'pt-0' }">
  <tng-tab value="profile" [slot]="{ tab: '...', active: '...', inactive: '...' }">Profile</tng-tab>
  ...
</tng-tabs>
`,
  );
}
