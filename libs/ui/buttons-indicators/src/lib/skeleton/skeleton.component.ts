import { Component, computed, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';

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
   * Prefer widthKlass/heightKlass for Tailwind-first usage.
   * width/height are optional escape hatches for exact CSS values.
   */
  widthKlass = input<string>('w-full');
  heightKlass = input<string>('h-4');

  width = input<string>('');  // e.g. '240px', '60%', '12rem'
  height = input<string>(''); // e.g. '16px'

  /** shimmer=true => shimmer animation, else pulse */
  shimmer = input(false, { transform: booleanAttribute });

  /** class hook */
  klass = input<string>('');

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
    // prefer shimmer if enabled, else pulse
    return this.shimmer() ? 'tng-skeleton-shimmer' : 'animate-pulse';
  });

  /**
   * Tailng theming: no hardcoded colors.
   * Default uses border-ish token; consumers override via klass.
   */
  readonly classes = computed(() => {
    const base = 'relative overflow-hidden bg-slate-200/70 dark:bg-slate-700/40';

    return [
      base,
      this.animationClasses(),
      this.shapeClasses(),
      this.widthKlass(),
      this.heightKlass(),
      this.klass(),
    ]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ');
  });

  readonly styleWidth = computed(() => (this.width().trim() ? this.width().trim() : null));
  readonly styleHeight = computed(() => (this.height().trim() ? this.height().trim() : null));
}
