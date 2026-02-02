import { Component, signal } from '@angular/core';
import { TngSlideToggle } from '@tociva/tailng-ui/form-controls';

@Component({
  selector: 'playground-slide-toggle-demo',
  standalone: true,
  imports: [TngSlideToggle],
  templateUrl: './slide-toggle-demo.component.html',
})
export class SlideToggleDemoComponent {
  readonly darkMode = signal(false);
  readonly notifications = signal(true);
}
