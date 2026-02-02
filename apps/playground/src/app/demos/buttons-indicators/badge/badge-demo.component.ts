import { Component } from '@angular/core';
import { TngBadge } from '@tociva/tailng-ui/buttons-indicators';

@Component({
  selector: 'playground-badge-demo',
  standalone: true,
  imports: [TngBadge],
  templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
  // dynamic examples
  count = 12;
  bigCount = 128;
  zeroCount = 0;

  hidden = false;

  // string badge
  statusText: string | null = 'NEW';

  inc() {
    this.count++;
  }

  dec() {
    this.count = Math.max(0, this.count - 1);
  }

  toggleHidden() {
    this.hidden = !this.hidden;
  }

  toggleStatus() {
    this.statusText = this.statusText ? null : 'NEW';
  }
}
