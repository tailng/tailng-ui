import { Component, HostBinding, inject, input } from '@angular/core';
import { TailngTabsComponent } from './tabs.component';

@Component({
  selector: 'tng-tab-panel',
  standalone: true,
  template: `<ng-content />`,
})
export class TailngTabPanelComponent {
  private readonly tabs = inject(TailngTabsComponent);

  value = input.required<string>();

  @HostBinding('attr.role') role = 'tabpanel';

  @HostBinding('hidden')
  get hidden() {
    return !this.tabs.isActive(this.value());
  }
}
