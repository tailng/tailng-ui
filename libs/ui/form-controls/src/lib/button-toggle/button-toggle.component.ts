import {
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TngButtonToggleValue = string | number;

export type TngButtonToggleOption<
  T extends TngButtonToggleValue = TngButtonToggleValue,
> = {
  value: T;
  label: string;
  disabled?: boolean;
};

/**
 * Value type:
 * - single mode: T | null
 * - multiple mode: T[]
 */
export type TngButtonToggleSelection<T extends TngButtonToggleValue> =
  | T
  | null
  | T[];

@Component({
  selector: 'tng-button-toggle',
  standalone: true,
  templateUrl: './button-toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngButtonToggle),
      multi: true,
    },
  ],
})
export class TngButtonToggle<T extends TngButtonToggleValue>
  implements ControlValueAccessor
{
  /* =====================
   * Inputs / Outputs
   * ===================== */

  /** Options for the segmented control */
  options = input<TngButtonToggleOption<T>[]>([]);

  /**
   * Direct mode value (optional).
   * In forms mode, CVA is source of truth.
   */
  value = input<TngButtonToggleSelection<T>>(null);
  readonly valueChange = output<TngButtonToggleSelection<T>>();

  /** External disabled input (read-only) */
  disabled = input(false);

  /** Material-like: single (default) or multiple selection */
  multiple = input(false);

  /**
   * Whether selection can be cleared:
   * - single: clicking active option -> null
   * - multiple: allows empty array
   */
  allowDeselect = input(false);

  /* =====================
   * Theming / class hooks (section-wise)
   * ===================== */

  /** Root wrapper */
  rootKlass = input<string>('block w-full');

  /** Group container */
  groupKlass = input<string>('');

  /** Button base */
  buttonKlass = input<string>('');

  /** Active option button */
  activeButtonKlass = input<string>('');

  /** Inactive option button */
  inactiveButtonKlass = input<string>('');

  /** Disabled option button */
  disabledButtonKlass = input<string>('');

  /* =====================
   * Internal state
   * ===================== */

  protected isDisabled = signal(false);

  /** Authoritative selected value inside component */
  private selectedValue = signal<TngButtonToggleSelection<T>>(null);

  /** When true, CVA owns the value (forms mode) */
  private usingCva = false;

  /* =====================
   * ControlValueAccessor
   * ===================== */
  private onChange: (value: TngButtonToggleSelection<T>) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // sync external disabled -> internal
    effect(() => {
      this.isDisabled.set(this.disabled());
    });

    // sync external [value] -> internal only when NOT using CVA
    effect(() => {
      const v = this.value();
      if (this.usingCva) return;
      this.selectedValue.set(this.normalizeIncoming(v));
    });

    // ensure internal value shape matches mode when `multiple` changes
    effect(() => {
      const isMulti = this.multiple();
      const cur = this.selectedValue();
      const normalized = isMulti ? this.toArray(cur) : this.toSingle(cur);
      if (!this.shallowEqual(cur, normalized)) {
        this.selectedValue.set(normalized);
        // NOTE: we DO NOT emit onChange here; mode switch is a "configuration change"
      }
    });
  }

  writeValue(value: TngButtonToggleSelection<T>): void {
    this.usingCva = true;
    this.selectedValue.set(this.normalizeIncoming(value));
  }

  registerOnChange(fn: (value: TngButtonToggleSelection<T>) => void): void {
    this.usingCva = true;
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /* =====================
   * Helpers
   * ===================== */

  currentValue = computed(() => this.selectedValue());

  isOptionDisabled(opt: TngButtonToggleOption<T>): boolean {
    return this.isDisabled() || !!opt.disabled;
  }

  isSelected(opt: TngButtonToggleOption<T>): boolean {
    const v = this.selectedValue();
    if (Array.isArray(v)) return v.includes(opt.value);
    return v === opt.value;
  }

  select(opt: TngButtonToggleOption<T>) {
    if (this.isOptionDisabled(opt)) return;

    const cur = this.selectedValue();
    let next: TngButtonToggleSelection<T>;

    if (this.multiple()) {
      const currArr = this.toArray(cur);
      const toggled = this.toggleInArray(currArr, opt.value);

      // if deselect not allowed, prevent empty
      if (!this.allowDeselect() && toggled.length === 0) {
        next = currArr;
      } else {
        next = toggled;
      }
    } else {
      const currSingle = this.toSingle(cur);

      next =
        this.allowDeselect() && currSingle === opt.value
          ? null
          : opt.value;
    }

    this.selectedValue.set(next);

    // CVA
    this.onChange(next);
    this.onTouched();

    // direct mode output
    this.valueChange.emit(next);
  }

  /* =====================
   * Keyboard support
   * ===================== */

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    const opts = this.options();
    if (!opts.length) return;

    const enabledIndexes = opts
      .map((o, i) => ({ o, i }))
      .filter(({ o }) => !this.isOptionDisabled(o))
      .map(({ i }) => i);

    if (!enabledIndexes.length) return;

    // for keyboard navigation we keep a "current index" concept:
    // - single: selected option index
    // - multi: first selected index, otherwise first enabled
    const cur = this.selectedValue();
    const currentIndex = (() => {
      if (Array.isArray(cur)) {
        const first = opts.findIndex((o) => cur.includes(o.value));
        return first;
      }
      return opts.findIndex((o) => o.value === cur);
    })();

    const move = (dir: -1 | 1) => {
      ev.preventDefault();

      const start = currentIndex >= 0 ? currentIndex : enabledIndexes[0];

      let idx = start;
      for (let step = 0; step < opts.length; step++) {
        idx = (idx + dir + opts.length) % opts.length;
        if (enabledIndexes.includes(idx)) {
          this.select(opts[idx]);
          break;
        }
      }
    };

    switch (ev.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        move(1);
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        move(-1);
        break;

      case 'Enter':
      case ' ':
        ev.preventDefault();
        if (currentIndex >= 0) this.select(opts[currentIndex]);
        break;

      default:
        break;
    }
  }

  /* =====================
   * Classes
   * ===================== */

  /** Group container classes */
  readonly groupClasses = computed(() =>
    (
      'flex w-full overflow-hidden rounded-md border border-border ' +
      'bg-bg ' +
      (this.isDisabled() ? 'opacity-60 pointer-events-none ' : '') +
      this.groupKlass()
    ).trim()
  );

  /** Button base classes */
  private readonly baseBtn = computed(() =>
    (
      'flex-1 px-3 py-2 text-sm font-medium text-center ' +
      'transition-colors select-none ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
      'border-r border-border last:border-r-0 ' +
      this.buttonKlass()
    ).trim()
  );

  buttonClasses(opt: TngButtonToggleOption<T>): string {
    const active = this.isSelected(opt);
    const disabled = this.isOptionDisabled(opt);

    const state =
      disabled
        ? 'text-disable bg-bg ' + this.disabledButtonKlass()
        : active
          ? 'bg-primary text-on-primary ' + this.activeButtonKlass()
          : 'bg-on-primary text-fg hover:bg-alternate-background ' +
            this.inactiveButtonKlass();

    return `${this.baseBtn()} ${state}`.trim();
  }

  /* =====================
   * Normalization utilities
   * ===================== */

  private normalizeIncoming(
    value: TngButtonToggleSelection<T>,
  ): TngButtonToggleSelection<T> {
    return this.multiple() ? this.toArray(value) : this.toSingle(value);
  }

  private toArray(value: TngButtonToggleSelection<T>): T[] {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
  }

  private toSingle(value: TngButtonToggleSelection<T>): T | null {
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }

  private toggleInArray(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
  }

  private shallowEqual(
    a: TngButtonToggleSelection<T>,
    b: TngButtonToggleSelection<T>,
  ): boolean {
    if (a === b) return true;
    const aArr = Array.isArray(a);
    const bArr = Array.isArray(b);
    if (aArr !== bArr) return false;
    if (!aArr || !bArr) return false;

    // array shallow equality (order-sensitive)
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
