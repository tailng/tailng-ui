import { Component, signal } from '@angular/core';
import { TngPopover } from '@tociva/tailng-ui/popups-overlays';

@Component({
  selector: 'playground-popover-demo',
  standalone: true,
  imports: [TngPopover],
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent {
  readonly controlledOpen = signal(false);
}
