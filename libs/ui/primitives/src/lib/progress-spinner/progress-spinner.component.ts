import { Component, computed, input } from '@angular/core';
import { numberAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngProgressSpinnerSlot } from './progress-spinner.slots';

export type TngSpinnerMode = 'indeterminate' | 'determinate';

@Component({
  selector: 'tng-progress-spinner',
  standalone: true,
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css',
})
export class TngProgressSpinner {
  /* =====================
   * Inputs
   * ===================== */

  /** indeterminate | determinate */
  mode = input<TngSpinnerMode>('indeterminate');

  /** Progress value (0–max) for determinate mode */
  value = input(0, { transform: numberAttribute });

  /** Max value (default 100) */
  max = input(100, { transform: numberAttribute });

  /** Stroke width */
  strokeWidth = input(4, { transform: numberAttribute });

  /* Slot hooks (micro styling) */
  slot = input<TngSlotMap<TngProgressSpinnerSlot>>({});

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

  readonly containerClassFinal = computed(() =>
    this.cx('inline-flex', this.slotClass('container')),
  );

  readonly svgClassFinal = computed(() =>
    this.cx('block', 'w-6', 'h-6', this.slotClass('svg')),
  );

  readonly trackClassFinal = computed(() =>
    this.cx('opacity-30', 'text-border', this.slotClass('track')),
  );

  readonly indicatorClassFinal = computed(() =>
    this.cx(
      'text-primary',
      this.slotClass('indicator'),
      this.mode() === 'indeterminate' ? 'tng-spinner-indeterminate' : '',
    ),
  );

  private slotClass(key: TngProgressSpinnerSlot): TngSlotValue {
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
