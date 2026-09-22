import type {
  ElementRef} from '@angular/core';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
  model,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import {
  isRangeValid,
  normalizeRangeValue,
  parseNumberInput,
  toInputValue,
  type TngNumberRangeChangeEvent,
  type TngNumberRangeSlots,
  type TngNumberRangeSource,
  type TngNumberRangeValue,
} from '@tailng-ui/primitives';

function normalizeNumberInput(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeStep(
  value: number | string | null | undefined,
): number | string | null {
  if (value === null || value === undefined) return null;
  if (value === 'any') return 'any';
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

@Component({
  selector: 'tng-number-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tng-number-range.component.html',
  styleUrl: './tng-number-range.component.css',
})
export class TngNumberRangeComponent implements FormValueControl<TngNumberRangeValue | null> {
  // ── Controlled value ──────────────────────────────────────────────────────
  public readonly value = model<TngNumberRangeValue | null>(null);
  public readonly defaultValue = input<TngNumberRangeValue | null>(null);

  // ── Native number constraints ─────────────────────────────────────────────
  public readonly minValue = input<number | null, number | string | null | undefined>(null, {
    alias: 'min',
    transform: normalizeNumberInput,
  });
  public readonly maxValue = input<number | null, number | string | null | undefined>(null, {
    alias: 'max',
    transform: normalizeNumberInput,
  });
  public readonly step = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeStep,
  });

  // ── State ─────────────────────────────────────────────────────────────────
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  // ── Placeholder ───────────────────────────────────────────────────────────
  public readonly minPlaceholder = input<string>('');
  public readonly maxPlaceholder = input<string>('');

  // ── Accessibility ─────────────────────────────────────────────────────────
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly minAriaLabel = input<string>('Minimum');
  public readonly maxAriaLabel = input<string>('Maximum');

  // ── Separator ─────────────────────────────────────────────────────────────
  public readonly separator = input<string>('—');

  // ── Slot / class customization ────────────────────────────────────────────
  public readonly slot = input<Partial<Record<TngNumberRangeSlots, string>>>({});

  // ── Outputs ───────────────────────────────────────────────────────────────
  public readonly touchedChange = output<void>();
  public readonly rangeChange = output<TngNumberRangeChangeEvent>();

  // ── Template refs ─────────────────────────────────────────────────────────
  @ViewChild('minInput') private readonly minInputRef?: ElementRef<HTMLInputElement>;

  // ── Internal state ────────────────────────────────────────────────────────
  private readonly formDisabled = signal(false);

  // ── Derived values ────────────────────────────────────────────────────────

  /**
   * The authoritative current value. `value` remains nullable for public API
   * compatibility; the rendered control always receives a normalized range.
   */
  protected readonly currentValue = computed<TngNumberRangeValue>(() => {
    const controlled = this.value();
    if (controlled !== null) {
      return normalizeRangeValue(controlled);
    }

    return normalizeRangeValue(this.defaultValue());
  });

  protected readonly minInputValue = computed(() =>
    toInputValue(this.currentValue().min),
  );

  protected readonly maxInputValue = computed(() =>
    toInputValue(this.currentValue().max),
  );

  protected readonly isValid = computed<boolean>(() => {
    if (this.invalid()) return false;
    return isRangeValid(this.currentValue(), this.minValue(), this.maxValue());
  });

  // ── HostBindings ──────────────────────────────────────────────────────────
  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.effectiveDisabled ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return !this.isValid() ? '' : null;
  }

  // ── Slot helpers ──────────────────────────────────────────────────────────
  protected slotClass(name: TngNumberRangeSlots): string | null {
    return this.slot()[name] ?? null;
  }

  // ── Computed disabled ─────────────────────────────────────────────────────
  protected get effectiveDisabled(): boolean {
    return this.formDisabled() || this.disabled();
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  /** Clicking anywhere in the group (not on an input) focuses the min input. */
  public onGroupClick(event: MouseEvent): void {
    if (this.effectiveDisabled || this.readonly()) return;
    if (!(event.target instanceof HTMLInputElement)) {
      this.minInputRef?.nativeElement.focus();
    }
  }

  public onMinInput(event: Event): void {
    if (this.effectiveDisabled || this.readonly()) return;

    const raw = this.readInputValue(event);
    if (raw === null) return;

    const parsed = parseNumberInput(raw);
    this.commitChange({ ...this.currentValue(), min: parsed }, 'min');
  }

  public onMaxInput(event: Event): void {
    if (this.effectiveDisabled || this.readonly()) return;

    const raw = this.readInputValue(event);
    if (raw === null) return;

    const parsed = parseNumberInput(raw);
    this.commitChange({ ...this.currentValue(), max: parsed }, 'max');
  }

  public onTouched(): void {
    this.touchedChange.emit();
  }

  public setFormDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private readInputValue(event: Event): string | null {
    if (!(event.target instanceof HTMLInputElement)) return null;
    return event.target.value;
  }

  private commitChange(next: TngNumberRangeValue, source: TngNumberRangeSource): void {
    this.value.set(next);

    const valid = isRangeValid(next, this.minValue(), this.maxValue()) && !this.invalid();

    // Emit outputs
    this.rangeChange.emit({ value: next, source, valid });
  }
}
