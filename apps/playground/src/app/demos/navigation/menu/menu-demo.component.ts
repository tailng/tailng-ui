
import { Component } from '@angular/core';
import { TailngIconComponent } from '@tociva/tailng-icons';
import { TailngMenuComponent, TailngMenuItemDirective, TailngMenuTemplateDirective } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-menu-demo',
  standalone: true,
  imports: [TailngMenuComponent, TailngMenuItemDirective, TailngIconComponent, TailngMenuTemplateDirective],
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