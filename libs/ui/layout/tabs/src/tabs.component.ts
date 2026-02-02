import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';

@Component({
  selector: 'tng-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
})
export class TailngTabsComponent {
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
   * Klass hooks
   * ===================== */

  rootKlass = input<string>('w-full');
  listKlass = input<string>('flex gap-2 border-b border-border');
  panelKlass = input<string>('pt-4');

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
