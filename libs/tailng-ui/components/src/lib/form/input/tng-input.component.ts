import {
  Component,
  forwardRef,
  HostBinding,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { ElementRef, InputSignalWithTransform } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  coerceTngInputNullableBoolean,
  TngInput,
  TngInputFieldSuffix,
  type TngInputType,
} from '@tailng-ui/primitives';

import {
  TngInputFieldComponent,
  type TngInputFieldAppearance,
  type TngInputFieldSize,
  type TngInputFieldTone,
} from '../input-field/tng-input-field.component';

type NullableBooleanInput = boolean | null | string | undefined;
type PatternInput = string | RegExp | readonly RegExp[] | null | undefined;

function normalizeAttr(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') return null;

  const v = String(value).trim();
  return v.length > 0 ? v : null;
}

function readInputValue(event: unknown): string | null {
  if (!(event instanceof Event)) return null;
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  return target.value;
}

function normalizeNumberAttr(value: number | string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeOptionalNumberInput(value: number | string | null | undefined): number | string | null {
  return value ?? null;
}

function normalizePatternInput(value: PatternInput): readonly RegExp[] {
  if (value === undefined || value === null) return [];

  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? [new RegExp(normalized)] : [];
  }

  if (value instanceof RegExp) return [value];

  return value;
}

function formatPatternAttr(patterns: readonly Readonly<RegExp>[]): string | null {
  return patterns[0]?.source ?? null;
}

function formatNullableBooleanAttr(value: boolean | null): 'false' | 'true' | null {
  if (value === null) return null;
  return value ? 'true' : 'false';
}

function readFiniteNumber(value: number | string | null | undefined): number | null {
  if (value === undefined || value === null || value === '') return null;
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatNumberValue(value: number): string {
  return Number.parseFloat(value.toPrecision(12)).toString();
}

function stringifyControlValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return null;
}

function createInputEvent(inputElement: HTMLInputElement): Event {
  const event = new Event('input', { bubbles: true });
  Object.defineProperty(event, 'target', {
    configurable: true,
    value: inputElement,
  });
  return event;
}

@Component({
  selector: 'tng-input',
  standalone: true,
  imports: [TngInputFieldComponent, TngInput, TngInputFieldSuffix],
  templateUrl: './tng-input.component.html',
  styleUrl: './tng-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngInputComponent),
      multi: true,
    },
  ],
})
export class TngInputComponent implements ControlValueAccessor {
  // ---- Wrapper (input-field) appearance knobs ----
  public readonly appearance = input<TngInputFieldAppearance>('outline');
  public readonly size = input<TngInputFieldSize>('md');
  public readonly tone = input<TngInputFieldTone>('neutral');
  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  // ---- Input API passthrough ----
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaErrormessage = input<string | null>(null);
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });

  public readonly autocapitalize = input<string | null>(null);
  public readonly autocomplete = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly enterkeyhint = input<string | null>(null);
  public readonly formAttr = input<string | null>(null, { alias: 'form' });
  public readonly id = input<string | null>(null);
  public readonly inputmode = input<string | null>(null);
  public readonly list = input<string | null>(null);
  public readonly name = input<string | null>(null);
  public readonly pattern: InputSignalWithTransform<readonly RegExp[], PatternInput> = input<
    readonly RegExp[],
    PatternInput
  >([], {
    transform: normalizePatternInput,
  });
  public readonly placeholder = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeOptionalNumberInput,
  });
  public readonly maxlength = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeOptionalNumberInput,
  });
  public readonly min = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeOptionalNumberInput,
  });
  public readonly minlength = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeOptionalNumberInput,
  });
  public readonly spellcheck = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly step = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeOptionalNumberInput,
  });
  public readonly type = input<TngInputType>('text');

  /**
   * Controlled value input (only used when NOT using CVA).
   * If you bind [value], you should also listen to (valueChange) (or use signals).
   */
  public readonly value = input<string | null>(null);

  // ---- Outputs ----
  public readonly valueChange = output<string>();
  public readonly inputEvent = output<Event>({ alias: 'input' });
  public readonly changeEvent = output<Event>({ alias: 'change' });
  public readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  public readonly blurEvent = output<FocusEvent>({ alias: 'blur' });
  public readonly keydownEvent = output<KeyboardEvent>({ alias: 'keydown' });
  public readonly keyupEvent = output<KeyboardEvent>({ alias: 'keyup' });

  // ---- CVA state ----
  @ViewChild('inputControl')
  private readonly inputControl: ElementRef<HTMLInputElement> | undefined;

  private usingCva = false;
  private cvaValue: string | null = null;
  private cvaDisabled = false;

  private onCvaChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  // ---- Host attrs (optional, useful for styling/debug) ----
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-component' as const;

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): TngInputFieldAppearance {
    return this.appearance();
  }

  @HostBinding('attr.data-size')
  protected get dataSize(): TngInputFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-tone')
  protected get dataTone(): TngInputFieldTone {
    return this.tone();
  }

  @HostBinding('attr.data-type')
  protected get dataType(): TngInputType {
    return this.type();
  }

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }

  // ---- Derived values for template ----
  protected get effectiveValue(): string {
    const v = this.usingCva ? this.cvaValue : this.value();
    return v ?? '';
  }

  protected get effectiveDisabled(): boolean {
    return this.cvaDisabled || this.disabled();
  }

  protected get isNumberInput(): boolean {
    return this.type() === 'number';
  }

  // ---- CVA ----
  public writeValue(value: unknown): void {
    this.usingCva = true;
    this.cvaValue = stringifyControlValue(value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onCvaChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled = isDisabled;
  }

  // ---- DOM handlers ----
  public onInput(event: unknown): void {
    if (event instanceof Event) {
      event.stopPropagation();
    }

    const next = readInputValue(event);
    if (next === null) return;

    // If disabled, ignore (optional safety)
    if (this.effectiveDisabled) return;

    this.commitValue(next, event);
  }

  public onKeydown(event: unknown): void {
    if (!(event instanceof KeyboardEvent)) return;

    event.stopPropagation();
    this.keydownEvent.emit(event);

    if (!this.isNumberInput || this.effectiveDisabled) return;

    this.handleNumberKeydown(event);
  }

  private handleNumberKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.stepNumberFromKey(event, 1);
        break;
      case 'ArrowDown':
        this.stepNumberFromKey(event, -1);
        break;
      case 'PageUp':
        this.stepNumberFromKey(event, 1, 10);
        break;
      case 'PageDown':
        this.stepNumberFromKey(event, -1, 10);
        break;
      case 'Home':
        this.setNumberBoundaryFromKey(event, 'min');
        break;
      case 'End':
        this.setNumberBoundaryFromKey(event, 'max');
        break;
    }
  }

  public onKeyup(event: unknown): void {
    if (!(event instanceof KeyboardEvent)) return;

    event.stopPropagation();
    this.keyupEvent.emit(event);
  }

  public stepNumber(delta: -1 | 1, stepCount = 1): void {
    if (!this.isNumberInput || this.effectiveDisabled || this.readonly()) return;

    const inputElement = this.inputControl?.nativeElement;
    if (inputElement === undefined) return;

    inputElement.focus();
    this.executeDomStep(inputElement, delta, stepCount);

    this.commitValue(inputElement.value, createInputEvent(inputElement));
  }

  private executeDomStep(inputElement: HTMLInputElement, delta: -1 | 1, stepCount: number): void {
    try {
      if (delta > 0) {
        inputElement.stepUp(stepCount);
      } else {
        inputElement.stepDown(stepCount);
      }
    } catch {
      inputElement.value = this.nextSteppedValue(inputElement.value, delta, stepCount);
    }

  }

  private stepNumberFromKey(event: KeyboardEvent, delta: -1 | 1, stepCount = 1): void {
    event.preventDefault();
    this.stepNumber(delta, stepCount);
  }

  private setNumberBoundaryFromKey(event: KeyboardEvent, boundary: 'max' | 'min'): void {
    const boundaryValue = readFiniteNumber(boundary === 'min' ? this.min() : this.max());
    if (boundaryValue === null) return;

    event.preventDefault();
    if (this.readonly()) return;

    const inputElement = this.inputControl?.nativeElement;
    if (inputElement === undefined) return;

    inputElement.value = formatNumberValue(boundaryValue);
    this.commitValue(inputElement.value, createInputEvent(inputElement));
  }

  private commitValue(next: string, event: unknown): void {
    // Keep CVA in sync when used
    if (this.usingCva) {
      if (this.cvaValue === next) {
        // Still forward the raw event output if you want:
        if (event instanceof Event) this.inputEvent.emit(event);
        return;
      }
      this.cvaValue = next;
      this.onCvaChange(next);
    }

    // For controlled-input usage, emit valueChange always
    this.valueChange.emit(next);

    if (event instanceof Event) {
      this.inputEvent.emit(event);
    }
  }

  private nextSteppedValue(currentValue: string, delta: -1 | 1, stepCount: number): string {
    const min = readFiniteNumber(this.min());
    const max = readFiniteNumber(this.max());
    const step = readFiniteNumber(this.step()) ?? 1;
    const current = readFiniteNumber(currentValue) ?? min ?? 0;
    const nextStep = step > 0 ? step : 1;
    let next = current + delta * nextStep * stepCount;

    if (min !== null) next = Math.max(min, next);
    if (max !== null) next = Math.min(max, next);

    return formatNumberValue(next);
  }

  public onBlur(event: unknown): void {
    if (event instanceof Event) {
      event.stopPropagation();
    }

    this.onTouched();
    if (event instanceof FocusEvent) {
      this.blurEvent.emit(event);
    }
  }

  public onFocus(event: unknown): void {
    if (!(event instanceof FocusEvent)) return;

    event.stopPropagation();
    this.focusEvent.emit(event);
  }

  public onChangeEvent(event: unknown): void {
    if (!(event instanceof Event)) return;

    event.stopPropagation();
    this.changeEvent.emit(event);
  }

  protected normalizeAttrValue(value: unknown): string | null {
    return normalizeAttr(value);
  }

  protected normalizeNumberAttrValue(value: number | string | null | undefined): string | null {
    return normalizeNumberAttr(value);
  }

  protected formatPatternAttrValue(value: readonly Readonly<RegExp>[]): string | null {
    return formatPatternAttr(value);
  }

  protected formatNullableBooleanAttrValue(value: boolean | null): 'false' | 'true' | null {
    return formatNullableBooleanAttr(value);
  }
}
