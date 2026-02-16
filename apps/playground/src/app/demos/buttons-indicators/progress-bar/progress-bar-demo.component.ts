import { JsonPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { TngProgressBar } from '@tailng-ui/ui/primitives';

@Component({
  selector: 'playground-progress-bar-demo',
  standalone: true,
  imports: [JsonPipe, TngProgressBar],
  templateUrl: './progress-bar-demo.component.html',
})
export class ProgressBarDemoComponent {
  // interactive state
  mode: 'determinate' | 'indeterminate' = 'determinate';
  value = 40;
  max = 100;

  disableAnimation = false;

  // slot overrides (micro styling)
  slotContainer = 'w-full';
  slotTrack = 'bg-border h-1';
  slotIndicator = 'bg-primary';

  readonly slot = computed(() => {
    const s: Record<string, string> = {};
    if (this.slotContainer) s['container'] = this.slotContainer;
    if (this.slotTrack) s['track'] = this.slotTrack;
    if (this.slotIndicator) s['indicator'] = this.slotIndicator;
    return s;
  });

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

    this.slotContainer = 'w-full';
    this.slotTrack = 'bg-border h-1';
    this.slotIndicator = 'bg-primary';
  }

  // quick theming presets (slot-based)
  preset(p: 'default' | 'success' | 'danger' | 'neutral' | 'thick') {
    switch (p) {
      case 'default':
        this.slotTrack = 'bg-border h-1';
        this.slotIndicator = 'bg-primary';
        break;

      case 'success':
        this.slotTrack = 'bg-border h-1';
        this.slotIndicator = 'bg-success';
        break;

      case 'danger':
        this.slotTrack = 'bg-border h-1';
        this.slotIndicator = 'bg-danger';
        break;

      case 'neutral':
        this.slotTrack = 'bg-alternate-background h-1';
        this.slotIndicator = 'bg-fg/40';
        break;

      case 'thick':
        this.slotTrack = 'bg-border h-2';
        this.slotIndicator = 'bg-primary';
        break;
    }
  }
}
