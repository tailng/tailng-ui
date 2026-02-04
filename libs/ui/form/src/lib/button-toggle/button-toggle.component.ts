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

export type TngButtonToggleOption<T extends TngButtonToggleValue = TngButtonToggleValue> = {
  value: T;
  label: string;
  disabled?: boolean;
};

/**
 * Value type:
 * - single mode: T | null
 * - multiple mode: T[]
 */
export type TngButtonToggleSelection<T extends TngButtonToggleValue> = T | null | T[];

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
export class TngButtonToggle<T extends TngButtonToggleValue> implements ControlValueAccessor {
  /* =====================
   * Inputs / Outputs
   * ===================== */

  options = input<TngButtonToggleOption<T>[]>([]);

  value = input<TngButtonToggleSelection<T>>(null);
  readonly valueChange = output<TngButtonToggleSelection<T>>();

  disabled = input(false);
  multiple = input(false);
  allowDeselect = input(false);

  /* =====================
   * Theming / class hooks
   * ===================== */

  /** Root container (the role="group" element) */
  groupKlass = input<string>('block w-full');

  /** Button base */
  buttonKlass = input<string>('');
  activeButtonKlass = input<string>('');
  inactiveButtonKlass = input<string>('');
  disabledButtonKlass = input<string>('');

  /* =====================
   * Internal state
   * ===================== */

  protected isDisabled = signal(false);

  /** Authoritative selected value inside component */
  private selectedValue = signal<TngButtonToggleSelection<T>>(null);

  /** When true, CVA owns the value (forms mode) */
  private usingCva = false;

  /** For keyboard navigation (Option 2) */
  private focusIndex = signal<number>(-1);

  /* =====================
   * CVA
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
      }
    });

    // keep focus index in sync with selection (good UX)
    effect(() => {
      const opts = this.options();
      if (!opts.length) {
        this.focusIndex.set(-1);
        return;
      }

      const cur = this.selectedValue();
      const idx = Array.isArray(cur)
        ? opts.findIndex((o) => cur.includes(o.value))
        : opts.findIndex((o) => o.value === cur);

      if (idx >= 0) this.focusIndex.set(idx);
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
   * Selection helpers
   * ===================== */

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
      next = !this.allowDeselect() && toggled.length === 0 ? currArr : toggled;
    } else {
      const currSingle = this.toSingle(cur);
      next = this.allowDeselect() && currSingle === opt.value ? null : opt.value;
    }

    this.selectedValue.set(next);

    // CVA
    this.onChange(next);
    this.onTouched();

    // direct mode output
    this.valueChange.emit(next);
  }

  /* =====================
   * Keyboard
   * ===================== */

  onKeydown(ev: KeyboardEvent) {
    if (this.isDisabled()) return;

    const opts = this.options();
    const len = opts.length;
    if (!len) return;

    const isEnabled = (i: number) => !this.isOptionDisabled(opts[i]);

    const firstEnabled = (() => {
      for (let i = 0; i < len; i++) if (isEnabled(i)) return i;
      return -1;
    })();
    if (firstEnabled < 0) return;

    const move = (dir: -1 | 1) => {
      ev.preventDefault();

      let idx = this.focusIndex();
      if (idx < 0) idx = firstEnabled;

      for (let step = 0; step < len; step++) {
        idx = (idx + dir + len) % len;
        if (isEnabled(idx)) {
          this.focusIndex.set(idx);
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
        {
          const idx = this.focusIndex();
          if (idx >= 0 && isEnabled(idx)) this.select(opts[idx]);
        }
        break;

      default:
        break;
    }
  }

  /* =====================
   * Classes
   * ===================== */

  readonly groupClasses = computed(() =>
    (
      'flex w-full overflow-hidden rounded-md border border-border bg-bg ' +
      (this.isDisabled() ? 'opacity-60 pointer-events-none ' : '') +
      this.groupKlass()
    ).trim(),
  );

  private readonly baseBtn = computed(() =>
    (
      'flex-1 px-3 py-2 text-sm font-medium text-center transition-colors select-none ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
      'border-r border-border last:border-r-0 ' +
      this.buttonKlass()
    ).trim(),
  );

  buttonClasses(opt: TngButtonToggleOption<T>): string {
    const active = this.isSelected(opt);
    const disabled = this.isOptionDisabled(opt);

    const state = disabled
      ? 'text-disable bg-bg ' + this.disabledButtonKlass()
      : active
        ? 'bg-fg text-bg ' + this.activeButtonKlass()
        : 'bg-bg text-fg hover:bg-alternate-background ' + this.inactiveButtonKlass();

    return `${this.baseBtn()} ${state}`.trim();
  }

  /* =====================
   * Normalization
   * ===================== */

  private normalizeIncoming(value: TngButtonToggleSelection<T>): TngButtonToggleSelection<T> {
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

  private shallowEqual(a: TngButtonToggleSelection<T>, b: TngButtonToggleSelection<T>): boolean {
    if (a === b) return true;
    const aArr = Array.isArray(a);
    const bArr = Array.isArray(b);
    if (aArr !== bArr) return false;
    if (!aArr || !bArr) return false;

    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
}