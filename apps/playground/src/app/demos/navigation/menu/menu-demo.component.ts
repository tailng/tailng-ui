
import { Component } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons/icon';
import { TngMenu, TngMenuItem, TngMenuTemplate } from '@tociva/tailng-ui/navigation';

@Component({
  selector: 'playground-menu-demo',
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngIcon, TngMenuTemplate],
  templateUrl: './menu-demo.component.html',
})
export class MenuDemoComponent {
  onMenuClosed(reason: unknown): void {
    console.log('Menu closed:', reason);
  }

  onAction(action: string): void {
    console.log('Action:', action);
  }
}