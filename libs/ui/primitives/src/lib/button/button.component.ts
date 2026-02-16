import { computed, input } from "@angular/core";
import { Component } from "@angular/core";
import { TngSlotMap, TngSlotValue } from '@tailng-ui/ui';

import { TngButtonSize, TngButtonVariant } from "./button.types";
import { buttonClasses } from "./button.variants";
import { TngButtonSlot } from "./button.slots";

@Component({
  selector: 'tng-button',
  standalone: true,
  templateUrl: './button.component.html',
})
export class TngButton {
  variant = input<TngButtonVariant>('solid');
  size = input<TngButtonSize>('md');
  disabled = input(false);
  loading = input(false);
  block = input(false);

  type = input<'button' | 'submit' | 'reset'>('button');
  ariaLabel = input<string>('');
  pressed = input<boolean | null>(null);

  /* Slot hooks (micro styling) */
  slot = input<TngSlotMap<TngButtonSlot>>({});

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly classes = computed(() =>
    this.cx(
      buttonClasses(this.variant(), this.size(), { block: this.block() }),
      this.slotClass('button'),
    )
  );

  readonly spinnerClasses = computed(() =>
    this.cx(
      'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
      this.slotClass('spinner'),
    )
  );

  private slotClass(key: TngButtonSlot): TngSlotValue {
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
