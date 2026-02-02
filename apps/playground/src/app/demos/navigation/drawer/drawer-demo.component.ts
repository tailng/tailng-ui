import { TitleCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TngDrawer } from '@tociva/tailng-ui/navigation';

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'playground-drawer-demo',
  standalone: true,
  imports: [TngDrawer, TitleCasePipe],
  templateUrl: './drawer-demo.component.html',
})
export class DrawerDemoComponent {
  readonly open = signal(false);
  readonly placement = signal<DrawerPlacement>('left');

  readonly lastCloseReason = signal<string>('—');

  openDrawer(p: DrawerPlacement) {
    this.placement.set(p);
    this.open.set(true);
  }

  closeDrawer() {
    this.open.set(false);
  }

  onClosed(reason: unknown) {
    this.lastCloseReason.set(String(reason));
    this.open.set(false);
  }
}
