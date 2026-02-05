import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'tng-logo',
  standalone: true,
  templateUrl: './tng-logo.component.html',
})
export class TngLogoComponent {
  /** Size in pixels for width and height. Default 128 (matches Tailwind w-32/h-32). */
  size = input<number>(16);

  readonly svgClass = computed(() => {
    const n = this.size();
    return `text-fg w-${this.size()} h-${this.size()}`;
  });
}
