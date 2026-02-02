import { Component, signal } from '@angular/core';
import { TngSidenav, TngSidenavFooterSlot, 
  TngSidenavHeaderSlot } from '@tociva/tailng-ui/navigation';

@Component({
  selector: 'playground-sidenav-demo',
  standalone: true,
  imports: [TngSidenav, TngSidenavHeaderSlot, TngSidenavFooterSlot],
  templateUrl: './sidenav-demo.component.html',
})
export class SidenavDemoComponent {
  readonly collapsed = signal(false);

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
