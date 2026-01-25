import { Component } from '@angular/core';
import { TailngIconComponent } from '@tociva/tailng-icons';
import { TailngMenuComponent, TailngMenuItemDirective } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-menu-demo',
  standalone: true,
  imports: [TailngMenuComponent, TailngMenuItemDirective, TailngIconComponent],
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
