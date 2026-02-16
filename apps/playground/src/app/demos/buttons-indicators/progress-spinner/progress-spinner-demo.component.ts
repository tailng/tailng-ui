import { Component, computed } from '@angular/core';
import { TngProgressSpinner } from '@tailng-ui/ui/primitives';

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

  slotSvg = 'w-10 h-10';
  slotTrack = 'text-border';
  slotIndicator = 'text-primary';

  readonly slot = computed(() => {
    const s: Record<string, string> = {};
    if (this.slotSvg) s['svg'] = this.slotSvg;
    if (this.slotTrack) s['track'] = this.slotTrack;
    if (this.slotIndicator) s['indicator'] = this.slotIndicator;
    return s;
  });

  inc() {
    this.value = Math.min(this.max, this.value + 10);
  }

  dec() {
    this.value = Math.max(0, this.value - 10);
  }

  preset(p: 'primary' | 'success' | 'danger' | 'neutral') {
    switch (p) {
      case 'success':
        this.slotIndicator = 'text-success';
        break;
      case 'danger':
        this.slotIndicator = 'text-danger';
        break;
      case 'neutral':
        this.slotIndicator = 'text-fg/40';
        break;
      default:
        this.slotIndicator = 'text-primary';
    }
  }
}
