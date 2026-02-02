import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TngConnectedOverlay, TngOverlayPanel } from '@tociva/tailng-ui/popups-overlays';

@Component({
  selector: 'playground-connected-overlay-demo',
  standalone: true,
  imports: [TngConnectedOverlay, TngOverlayPanel],
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
