import { Component, computed, input } from '@angular/core';
import { numberAttribute } from '@angular/core';

export type TailngSpinnerMode = 'indeterminate' | 'determinate';

@Component({
  selector: 'tng-progress-spinner',
  standalone: true,
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css',
})
export class TailngProgressSpinnerComponent {
  /* =====================
   * Inputs
   * ===================== */

  /** indeterminate | determinate */
  mode = input<TailngSpinnerMode>('indeterminate');

  /** Progress value (0–max) for determinate mode */
  value = input(0, { transform: numberAttribute });

  /** Max value (default 100) */
  max = input(100, { transform: numberAttribute });

  /* =====================
   * Klass hooks (theming)
   * ===================== */

  /** Root wrapper */
  rootKlass = input<string>('inline-flex');

  /** SVG size (Tailwind-friendly: w-6 h-6, w-8 h-8, etc.) */
  sizeKlass = input<string>('w-6 h-6');

  /** Track (background circle) */
  trackKlass = input<string>('text-border');

  /** Indicator (foreground stroke) */
  indicatorKlass = input<string>('text-primary');

  /** Stroke width */
  strokeWidth = input(4, { transform: numberAttribute });

  /* =====================
   * Computed
   * ===================== */

  readonly radius = computed(() => 50 - this.strokeWidth() / 2);

  readonly circumference = computed(() => 2 * Math.PI * this.radius());

  readonly progressOffset = computed(() => {
    if (this.mode() === 'indeterminate') return 0;

    const v = this.value();
    const m = this.max();
    if (m <= 0) return this.circumference();

    const pct = Math.min(100, Math.max(0, (v / m) * 100));
    return this.circumference() * (1 - pct / 100);
  });
}
