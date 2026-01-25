import { Component, signal } from '@angular/core';
import {
  TailngTabsComponent,
  TailngTabComponent,
  TailngTabPanelComponent,
} from '@tociva/tailng-ui';

@Component({
  selector: 'playground-tabs-demo',
  standalone: true,
  imports: [TailngTabsComponent, TailngTabComponent, TailngTabPanelComponent],
  templateUrl: './tabs-demo.component.html',
})
export class TabsDemoComponent {
  // Controlled example
  readonly value = signal<string>('account');
}
