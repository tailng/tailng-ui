import { Component } from '@angular/core';
import { TngProgressSpinner } from '@tociva/tailng-ui/buttons-indicators';

@Component({
  selector: 'playground-progress-spinner-demo',
  standalone: true,
  imports: [TngProgressSpinner],
  templateUrl: './progress-spinner-demo.component.html',
})
export class ProgressSpinnerDemoComponent {
  mode: 'indeterminate' | 'determinate' = 'indeterminate';
  value = 40;
  max = 100;

  sizeKlass = 'w-10 h-10';
  trackKlass = 'text-border';
  indicatorKlass = 'text-primary';

  inc() {
    this.value = Math.min(this.max, this.value + 10);
  }

  dec() {
    this.value = Math.max(0, this.value - 10);
  }

  preset(p: 'primary' | 'success' | 'danger' | 'neutral') {
    switch (p) {
      case 'success':
        this.indicatorKlass = 'text-success';
        break;
      case 'danger':
        this.indicatorKlass = 'text-danger';
        break;
      case 'neutral':
        this.indicatorKlass = 'text-fg/40';
        break;
      default:
        this.indicatorKlass = 'text-primary';
    }
  }
}
