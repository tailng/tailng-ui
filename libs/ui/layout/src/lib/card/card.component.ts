import { Component, computed, contentChild, input } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngCardSlot } from './card.slots';
import { TngCardFooter, TngCardHeader } from './card-slots.directive';

@Component({
  selector: 'tng-card',
  standalone: true,
  templateUrl: './card.component.html',
})
export class TngCard {
  /* =====================
   * Slot hooks (micro styling)
   * ===================== */
  slot = input<TngSlotMap<TngCardSlot>>({});

  private headerMarker = contentChild(TngCardHeader);
  private footerMarker = contentChild(TngCardFooter);

  readonly hasHeader = computed(() => !!this.headerMarker());
  readonly hasFooter = computed(() => !!this.footerMarker());

  readonly containerClassFinal = computed(() =>
    this.cx(
      'block rounded-lg border border-border bg-bg text-fg shadow-sm',
      this.slotClass('container'),
    ),
  );
  readonly headerClassFinal = computed(() =>
    this.cx('border-b border-border px-4 py-3', this.slotClass('header')),
  );
  readonly bodyClassFinal = computed(() =>
    this.cx('px-4 py-4', this.slotClass('body')),
  );
  readonly footerClassFinal = computed(() =>
    this.cx('border-t border-border px-4 py-3', this.slotClass('footer')),
  );

  private slotClass(key: TngCardSlot): TngSlotValue {
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
