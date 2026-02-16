import { Component, computed, input } from '@angular/core';
import { booleanAttribute, numberAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngProgressBarSlot } from './progress-bar.slots';

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

  /* Slot hooks (micro styling) */
  slot = input<TngSlotMap<TngProgressBarSlot>>({});

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

  readonly containerClassFinal = computed(() =>
    this.cx('w-full', this.slotClass('container')),
  );

  readonly trackClassFinal = computed(() =>
    this.cx(
      'relative w-full overflow-hidden rounded-full bg-border h-1',
      this.slotClass('track'),
    ),
  );

  readonly indicatorClassFinal = computed(() =>
    this.cx(
      'h-full rounded-full transition-[width] duration-300 ease-out bg-primary',
      this.slotClass('indicator'),
    ),
  );

  readonly indeterminateIndicatorClass = computed(() =>
    this.cx(
      'absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary',
      this.slotClass('indicator'),
      this.disableAnimation() ? '' : 'tng-progress-indeterminate',
    ),
  );

  private slotClass(key: TngProgressBarSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }
}
