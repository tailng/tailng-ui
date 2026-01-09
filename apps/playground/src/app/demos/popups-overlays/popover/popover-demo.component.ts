import { Component, signal } from '@angular/core';
import { TailngPopoverComponent } from '@tailng/ui';

@Component({
  selector: 'playground-popover-demo',
  standalone: true,
  imports: [TailngPopoverComponent],
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent {
  readonly controlledOpen = signal(false);
}
