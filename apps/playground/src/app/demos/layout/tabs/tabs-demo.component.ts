import { Component, signal } from '@angular/core';
import {
  TngTabs,
  TngTab,
  TngTabPanel,
} from '@tailng-ui/ui/layout';

@Component({
  selector: 'playground-tabs-demo',
  standalone: true,
  imports: [TngTabs, TngTab, TngTabPanel],
  templateUrl: './tabs-demo.component.html',
})
export class TabsDemoComponent {
  // Controlled example
  readonly value = signal<string>('account');
}
