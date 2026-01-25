import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TailngConnectedOverlayComponent } from '@tociva/tailng-ui';
import { TailngOverlayPanelComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-connected-overlay-demo',
  standalone: true,
  imports: [TailngConnectedOverlayComponent, TailngOverlayPanelComponent],
  templateUrl: './connected-overlay-demo.component.html',
})
export class ConnectedOverlayDemoComponent {
  @ViewChild('anchorBtn', { static: true })
  anchorBtn!: ElementRef<HTMLElement>;

  open = signal(false);

  toggle() {
    this.open.update(v => !v);
  }

  close() {
    this.open.set(false);
  }
}
