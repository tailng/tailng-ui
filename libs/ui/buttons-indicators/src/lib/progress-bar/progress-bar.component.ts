import { Component, computed, input } from '@angular/core';
import { booleanAttribute, numberAttribute } from '@angular/core';

export type TngProgressMode = 'determinate' | 'indeterminate';

@Component({
  selector: 'tng-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class TngProgressBar {
  /* =====================
   * Inputs
   * ===================== */

  /** determinate | indeterminate */
  mode = input<TngProgressMode>('determinate');

  /** Progress value (0–max) */
  value = input(0, { transform: numberAttribute });

  /** Max value (default 100) */
  max = input(100, { transform: numberAttribute });

  /** Disable animation (useful for reduced motion) */
  disableAnimation = input(false, { transform: booleanAttribute });

  /* =====================
   * Klass hooks (theming)
   * ===================== */

  /** Root wrapper */
  rootKlass = input<string>('w-full');

  /** Track (background) */
  trackKlass = input<string>('bg-border');

  /** Bar (foreground) */
  barKlass = input<string>('bg-primary');

  /** Height utility (Tailwind) */
  heightKlass = input<string>('h-1');

  /* =====================
   * Computed
   * ===================== */

  readonly percentage = computed(() => {
    const v = this.value();
    const m = this.max();
    if (m <= 0) return 0;
    return Math.min(100, Math.max(0, (v / m) * 100));
  });

  readonly barStyle = computed(() => {
    if (this.mode() === 'indeterminate') return {};
    return { width: `${this.percentage()}%` };
  });
}
