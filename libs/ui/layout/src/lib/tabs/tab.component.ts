import {
  Component,
  HostBinding,
  HostListener,
  inject,
  input,
  computed,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngTabs } from './tabs.component';
import { TngTabSlot } from './tab.slots';

@Component({
  selector: 'tng-tab',
  standalone: true,
  template: `<ng-content />`,
})
export class TngTab {
  private readonly tabs = inject(TngTabs);

  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  /** Slot-based micro styling */
  slot = input<TngSlotMap<TngTabSlot>>({});

  readonly tabClassFinal = computed(() => {
    const base =
      this.slotClass('tab') || 'px-3 py-2 text-sm font-medium border-b-2 border-transparent';
    if (this.disabled()) {
      return this.cx(
        base,
        this.slotClass('disabled') || 'opacity-50 cursor-not-allowed',
      );
    }
    return this.tabs.isActive(this.value())
      ? this.cx(base, this.slotClass('active') || 'border-primary text-primary')
      : this.cx(base, this.slotClass('inactive') || 'text-muted-foreground');
  });

  @HostBinding('attr.role') role = 'tab';

  @HostBinding('attr.aria-selected')
  get selected() {
    return this.tabs.isActive(this.value());
  }

  @HostBinding('attr.tabindex')
  get tabindex() {
    return this.tabs.isActive(this.value()) ? 0 : -1;
  }

  @HostBinding('class')
  get hostClass() {
    return this.tabClassFinal();
  }

  @HostListener('click')
  onClick() {
    if (!this.disabled()) {
      this.tabs.setValue(this.value());
    }
  }

  private slotClass(key: TngTabSlot): TngSlotValue {
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
