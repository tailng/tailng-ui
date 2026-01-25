import { Component, signal } from '@angular/core';
import { TailngSlideToggleComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-slide-toggle-demo',
  standalone: true,
  imports: [TailngSlideToggleComponent],
  templateUrl: './slide-toggle-demo.component.html',
})
export class SlideToggleDemoComponent {
  readonly darkMode = signal(false);
  readonly notifications = signal(true);
}
