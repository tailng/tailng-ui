import { Component, signal } from '@angular/core';
import { TngSlideToggle, TngSlideToggleOffSlot, TngSlideToggleOnSlot } from '@tailng-ui/ui/form';
import { TngIcon } from '@tailng-ui/icons/icon';

@Component({
  selector: 'playground-slide-toggle-demo',
  standalone: true,
  imports: [TngSlideToggle, TngIcon, TngSlideToggleOnSlot, TngSlideToggleOffSlot],
  templateUrl: './slide-toggle-demo.component.html',
})
export class SlideToggleDemoComponent {
  readonly darkMode = signal(false);
  readonly notifications = signal(true);
}
