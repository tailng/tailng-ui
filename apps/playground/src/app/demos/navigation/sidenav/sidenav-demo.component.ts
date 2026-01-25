import { Component, signal } from '@angular/core';
import { TailngSidenavComponent, TailngSidenavFooterSlotDirective, TailngSidenavHeaderSlotDirective } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-sidenav-demo',
  standalone: true,
  imports: [TailngSidenavComponent, TailngSidenavHeaderSlotDirective, TailngSidenavFooterSlotDirective],
  templateUrl: './sidenav-demo.component.html',
})
export class SidenavDemoComponent {
  readonly collapsed = signal(false);

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
