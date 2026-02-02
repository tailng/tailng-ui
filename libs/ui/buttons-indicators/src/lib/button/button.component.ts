import { computed, input } from "@angular/core";

import { Component } from "@angular/core";
import { TngButtonSize, TngButtonVariant } from "./button.types";
import { buttonClasses } from "./button.variants";

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

  klass = input<string>('');

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly classes = computed(() =>
    `${buttonClasses(this.variant(), this.size(), {
      block: this.block(),
    })} ${this.klass()}`.trim()
  );
  
  spinnerKlass = input<string>(
    'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
  );
  
}
