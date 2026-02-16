import { Component, computed, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngDividerSlot } from './divider.slots';

export type TngDividerOrientation = 'horizontal' | 'vertical';
export type TngDividerAlign = 'start' | 'center' | 'end';

@Component({
  selector: 'tng-divider',
  standalone: true,
  templateUrl: './divider.component.html',
})
export class TngDivider {
  orientation = input<TngDividerOrientation>('horizontal');
  label = input<string>('');
  align = input<TngDividerAlign>('center');
  dashed = input(false, { transform: booleanAttribute });

  /** Slot-based micro styling */
  slot = input<TngSlotMap<TngDividerSlot>>({});

  readonly isVertical = computed(() => this.orientation() === 'vertical');

  readonly containerClassFinal = computed(() => {
    const base = this.isVertical()
      ? 'inline-flex shrink-0 items-stretch'
      : `flex w-full items-center ${this.slotClass('gap') || 'my-4'}`;
    return this.cx(base.trim(), this.slotClass('container'));
  });

  readonly lineClassFinal = computed(() => {
    const style = this.dashed() ? 'border-dashed' : 'border-solid';
    const lineBase = this.slotClass('line') || 'border-border';

    if (this.isVertical()) {
      const vh = this.slotClass('verticalHeight') || 'h-6';
      return this.cx(
        `w-px ${vh} self-stretch shrink-0 border-l ${style}`,
        lineBase,
      );
    }

    const th = this.slotClass('thickness') || 'border-t';
    return this.cx(th, style, lineBase);
  });

  readonly leftGrow = computed(() => {
    const a = this.align();
    if (a === 'start') return 'grow-0 w-6';
    if (a === 'end') return 'grow';
    return 'grow';
  });

  readonly rightGrow = computed(() => {
    const a = this.align();
    if (a === 'start') return 'grow';
    if (a === 'end') return 'grow-0 w-6';
    return 'grow';
  });

  readonly labelClassFinal = computed(() =>
    this.cx('px-3 whitespace-nowrap', this.slotClass('label') || 'text-xs text-fg/70'),
  );

  private slotClass(key: TngDividerSlot): TngSlotValue {
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
