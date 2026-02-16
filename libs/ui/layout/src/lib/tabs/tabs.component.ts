import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngTabsSlot } from './tabs.slots';

@Component({
  selector: 'tng-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
})
export class TngTabs {
  /* =====================
   * Inputs
   * ===================== */

  /** Controlled value */
  value = input<string | null>(null);

  /** Default value (uncontrolled init) */
  defaultValue = input<string | null>(null);

  /** Orientation */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /* =====================
   * Outputs
   * ===================== */

  valueChange = output<string>();

  /* =====================
   * Slot hooks (micro styling)
   * ===================== */

  slot = input<TngSlotMap<TngTabsSlot>>({});

  readonly containerClassFinal = computed(() =>
    this.cx('w-full', this.slotClass('container')),
  );

  readonly tabListClassFinal = computed(() =>
    this.cx('flex gap-2 border-b border-border', this.slotClass('tabList')),
  );

  readonly panelContainerClassFinal = computed(() =>
    this.cx('pt-4', this.slotClass('panelContainer')),
  );

  private slotClass(key: TngTabsSlot): TngSlotValue {
    return this.slot()?.[key];
  }

  private cx(...parts: Array<TngSlotValue>): string {
    return parts
      .flatMap((p) => (Array.isArray(p) ? p : [p]))
      .map((p) => (p ?? '').toString().trim())
      .filter(Boolean)
      .join(' ');
  }

  /* =====================
   * State
   * ===================== */

  private readonly _value = signal<string | null>(null);
  readonly activeValue = this._value.asReadonly();

  constructor() {
    effect(() => {
      const controlled = this.value();
      if (controlled !== null) {
        this._value.set(controlled);
      } else if (this._value() === null) {
        this._value.set(this.defaultValue());
      }
    });
  }

  setValue(v: string) {
    this._value.set(v);
    this.valueChange.emit(v);
  }

  isActive(v: string) {
    return this.activeValue() === v;
  }

  readonly orientationAttr = computed(() =>
    this.orientation() === 'vertical' ? 'vertical' : 'horizontal'
  );
}
