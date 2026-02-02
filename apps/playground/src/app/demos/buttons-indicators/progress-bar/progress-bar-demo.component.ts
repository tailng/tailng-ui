import { Component } from '@angular/core';
import { TngProgressBar } from '@tociva/tailng-ui/buttons-indicators';

@Component({
  selector: 'playground-progress-bar-demo',
  standalone: true,
  imports: [TngProgressBar],
  templateUrl: './progress-bar-demo.component.html',
})
export class ProgressBarDemoComponent {
  // interactive state
  mode: 'determinate' | 'indeterminate' = 'determinate';
  value = 40;
  max = 100;

  disableAnimation = false;

  // klass hooks
  rootKlass = 'w-full';
  trackKlass = 'bg-border';
  barKlass = 'bg-primary';
  heightKlass = 'h-1';

  setMode(mode: 'determinate' | 'indeterminate') {
    this.mode = mode;
  }

  inc() {
    this.value = Math.min(this.max, this.value + 5);
  }

  dec() {
    this.value = Math.max(0, this.value - 5);
  }

  reset() {
    this.value = 40;
    this.max = 100;
    this.mode = 'determinate';
    this.disableAnimation = false;

    this.rootKlass = 'w-full';
    this.trackKlass = 'bg-border';
    this.barKlass = 'bg-primary';
    this.heightKlass = 'h-1';
  }

  // quick theming presets (klass-only, Tailng-style)
  preset(p: 'default' | 'success' | 'danger' | 'neutral' | 'thick') {
    switch (p) {
      case 'default':
        this.trackKlass = 'bg-border';
        this.barKlass = 'bg-primary';
        this.heightKlass = 'h-1';
        break;

      case 'success':
        this.trackKlass = 'bg-border';
        this.barKlass = 'bg-success';
        this.heightKlass = 'h-1';
        break;

      case 'danger':
        this.trackKlass = 'bg-border';
        this.barKlass = 'bg-danger';
        this.heightKlass = 'h-1';
        break;

      case 'neutral':
        this.trackKlass = 'bg-alternate-background';
        this.barKlass = 'bg-fg/40';
        this.heightKlass = 'h-1';
        break;

      case 'thick':
        this.trackKlass = 'bg-border';
        this.barKlass = 'bg-primary';
        this.heightKlass = 'h-2';
        break;
    }
  }
}
