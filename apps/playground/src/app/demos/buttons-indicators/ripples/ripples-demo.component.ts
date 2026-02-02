import { Component } from '@angular/core';
import { TngRipple } from '@tociva/tailng-ui/buttons-indicators';
import { TngIcon } from '@tociva/tailng-icons/icon';

@Component({
  selector: 'playground-ripples-demo',
  standalone: true,
  imports: [TngIcon, TngRipple],
  templateUrl: './ripples-demo.component.html',
})
export class RipplesDemoComponent {
  disabled = false;
  centered = false;

  color = 'currentColor';
  opacity = 0.18;
  duration = 550;

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  toggleCentered() {
    this.centered = !this.centered;
  }

  setPreset(preset: 'default' | 'light' | 'success' | 'danger') {
    switch (preset) {
      case 'default':
        this.color = 'currentColor';
        this.opacity = 0.18;
        this.duration = 550;
        break;
      case 'light':
        this.color = 'white';
        this.opacity = 0.25;
        this.duration = 450;
        break;
      case 'success':
        this.color = '#22c55e';
        this.opacity = 0.22;
        this.duration = 600;
        break;
      case 'danger':
        this.color = '#ef4444';
        this.opacity = 0.22;
        this.duration = 600;
        break;
    }
  }
}
