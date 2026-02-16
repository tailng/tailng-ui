import { Component, computed, input } from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngIconSlot } from './icon.slots';

type TngIconSize = number | string;

@Component({
  selector: 'tng-icon',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './icon.component.html',
})
export class TngIcon {
  /** Icon name from @ng-icons registry */
  name = input.required<string>();

  /**
   * Size:
   * - number => px
   * - string => passed as-is (e.g. '1em', '20px', '1.25rem')
   */
  size = input<TngIconSize>('1em');

  /* Slot hooks (micro styling) */
  slot = input<TngSlotMap<TngIconSlot>>({});

  /**
   * Accessibility:
   * - decorative=true => aria-hidden (default)
   * - decorative=false => aria-label is recommended
   */
  decorative = input(true, { transform: booleanAttribute });
  ariaLabel = input<string>('');

  readonly normalizedSize = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : s;
  });

  readonly iconClassFinal = computed(() =>
    this.cx('inline-flex', 'align-middle', this.slotClass('icon')),
  );

  private slotClass(key: TngIconSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }

  readonly ariaHidden = computed(() => (this.decorative() ? 'true' : null));

  readonly computedAriaLabel = computed(() => {
    if (this.decorative()) return null;
    const label = this.ariaLabel().trim();
    return label || null;
  });
}
