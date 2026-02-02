import { Component, computed, input } from '@angular/core';
import { booleanAttribute, numberAttribute } from '@angular/core';

export type TngBadgePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type TngBadgeVariant =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type TngBadgeSize = 'sm' | 'md';

@Component({
  selector: 'tng-badge',
  standalone: true,
  templateUrl: './badge.component.html',
})
export class TngBadge {
  /* =====================
   * Inputs
   * ===================== */

  /** Badge content (number or short text). If null/undefined -> hidden (unless dot=true). */
  value = input<number | string | null>(null);

  /** Dot mode (ignores value display) */
  dot = input(false, { transform: booleanAttribute });

  /** Hide badge forcefully */
  hide = input(false, { transform: booleanAttribute });

  /** Show when value is 0 (only for numeric values) */
  showZero = input(false, { transform: booleanAttribute });

  /** Max number shown before overflow (e.g., 99+) */
  max = input(99, { transform: numberAttribute });

  /** Position relative to host */
  position = input<TngBadgePosition>('top-right');

  /** Overlap host (Material-ish). When false, badge sits outside edge a bit. */
  overlap = input(true, { transform: booleanAttribute });

  /** Visual variant */
  variant = input<TngBadgeVariant>('danger');

  /** Size */
  size = input<TngBadgeSize>('md');

  /** Accessible label override (recommended when badge is meaningful) */
  ariaLabel = input<string>('');

  /* =====================
   * Class hooks
   * ===================== */

  /** Outer wrapper (layout of projected content + badge) */
  rootKlass = input<string>('inline-flex');

  /** The element that becomes positioning anchor */
  hostKlass = input<string>('relative inline-flex');

  /** Badge element */
  badgeKlass = input<string>('');

  /* =====================
   * Derived values
   * ===================== */

  private readonly isNumericValue = computed(() => {
    const v = this.value();
    return typeof v === 'number' && Number.isFinite(v);
  });

  readonly displayValue = computed((): string => {
    const v = this.value();

    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v.trim();

    // number
    const n = v;
    const m = this.max();

    if (!Number.isFinite(n)) return '';
    if (n > m) return `${m}+`;
    return String(n);
  });

  readonly shouldShow = computed(() => {
    if (this.hide()) return false;

    if (this.dot()) return true;

    const v = this.value();
    if (v === null || v === undefined) return false;

    if (typeof v === 'string') return v.trim().length > 0;

    // number
    if (!Number.isFinite(v)) return false;
    if (v === 0) return this.showZero();
    return true;
  });

  /** If user didn't provide ariaLabel, generate a basic one */
  readonly computedAriaLabel = computed(() => {
    const custom = this.ariaLabel().trim();
    if (custom) return custom;

    if (!this.shouldShow()) return '';

    if (this.dot()) return 'New notification';

    const v = this.displayValue();
    if (!v) return '';

    // Simple default. Consumers can override with ariaLabel input.
    return `Badge: ${v}`;
  });

  /* =====================
   * Classes
   * ===================== */

  private readonly variantClasses = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'bg-primary text-on-primary';
      case 'neutral':
        return 'bg-alternate-background text-fg border border-border';
      case 'success':
        return 'bg-success text-on-primary';
      case 'warning':
        return 'bg-warning text-on-primary';
      case 'danger':
        return 'bg-danger text-on-primary';
      case 'info':
        return 'bg-info text-on-primary';
      default:
        return 'bg-danger text-on-primary';
    }
  });

  private readonly sizeClasses = computed(() => {
    // Material-ish: small dot, compact numbers.
    if (this.dot()) {
      return this.size() === 'sm'
        ? 'h-2 w-2'
        : 'h-2.5 w-2.5';
    }

    return this.size() === 'sm'
      ? 'min-w-[1.1rem] h-[1.1rem] px-1 text-[0.65rem] leading-[1.1rem]'
      : 'min-w-[1.25rem] h-[1.25rem] px-1.5 text-[0.7rem] leading-[1.25rem]';
  });

  private readonly positionClasses = computed(() => {
    const overlap = this.overlap();

    // when overlap=true, sit closer to corner (on top of host)
    // when overlap=false, sit slightly outside
    const inset = overlap ? '-translate-y-1/2' : '-translate-y-3/4';
    const insetBottom = overlap ? 'translate-y-1/2' : 'translate-y-3/4';
    const insetX = overlap ? 'translate-x-1/2' : 'translate-x-3/4';
    const insetXLeft = overlap ? '-translate-x-1/2' : '-translate-x-3/4';

    switch (this.position()) {
      case 'top-right':
        return `top-0 right-0 ${inset} ${insetX}`;
      case 'top-left':
        return `top-0 left-0 ${inset} ${insetXLeft}`;
      case 'bottom-right':
        return `bottom-0 right-0 ${insetBottom} ${insetX}`;
      case 'bottom-left':
        return `bottom-0 left-0 ${insetBottom} ${insetXLeft}`;
      default:
        return `top-0 right-0 ${inset} ${insetX}`;
    }
  });

  readonly badgeClasses = computed(() => {
    const base =
      'absolute z-10 inline-flex items-center justify-center ' +
      'rounded-full font-semibold select-none ' +
      'ring-2 ring-background ' + // Material-ish separation from host
      'pointer-events-none '; // badge shouldn't block clicks

    const dotShape = this.dot() ? 'p-0' : '';
    const cls =
      base +
      this.variantClasses() +
      ' ' +
      this.sizeClasses() +
      ' ' +
      this.positionClasses() +
      ' ' +
      dotShape +
      ' ' +
      this.badgeKlass();

    return cls.trim();
  });
}
