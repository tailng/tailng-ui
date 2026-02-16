import { Component, computed, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngSkeletonSlot } from './skeleton.slots';

export type TngSkeletonVariant = 'text' | 'circular' | 'rectangular';

@Component({
  selector: 'tng-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class TngSkeleton {
  /* =====================
   * Inputs
   * ===================== */

  variant = input<TngSkeletonVariant>('text');

  /**
   * Prefer widthClass/heightClass for Tailwind-first usage.
   * width/height are optional escape hatches for exact CSS values.
   */
  widthClass = input<string>('w-full');
  heightClass = input<string>('h-4');

  width = input<string>('');  // e.g. '240px', '60%', '12rem'
  height = input<string>(''); // e.g. '16px'

  /** shimmer=true => shimmer animation, else pulse */
  shimmer = input(false, { transform: booleanAttribute });

  /* Slot hooks (micro styling) */
  slot = input<TngSlotMap<TngSkeletonSlot>>({});

  /* =====================
   * Computed
   * ===================== */

  readonly shapeClasses = computed(() => {
    switch (this.variant()) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      case 'text':
      default:
        return 'rounded'; // looks like a text line
    }
  });

  readonly animationClasses = computed(() => {
    return this.shimmer() ? 'tng-skeleton-shimmer' : 'animate-pulse';
  });

  /**
   * Tailng theming: no hardcoded colors.
   * Default uses border-ish token; consumers override via slot.container.
   */
  readonly classes = computed(() =>
    this.cx(
      'relative overflow-hidden bg-slate-200/70 dark:bg-slate-700/40',
      this.animationClasses(),
      this.shapeClasses(),
      this.widthClass(),
      this.heightClass(),
      this.slotClass('container'),
    ),
  );

  readonly styleWidth = computed(() => (this.width().trim() ? this.width().trim() : null));
  readonly styleHeight = computed(() => (this.height().trim() ? this.height().trim() : null));

  private slotClass(key: TngSkeletonSlot): TngSlotValue {
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
