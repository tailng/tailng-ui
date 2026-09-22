import type { AfterViewInit, InputSignalWithTransform, OnDestroy } from '@angular/core';
import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import {
  applyTngOtpCharacters,
  clampTngOtpValue,
  normalizeTngOtpLength,
  removeTngOtpCharacter,
  resolveTngOtpBackspaceResult,
  resolveTngOtpEndIndex,
  resolveTngOtpEntryIndex,
  resolveTngOtpState,
  sanitizeTngOtpCharacters,
  TngInputOtp as TngInputOtpPrimitive,
} from '@tailng-ui/primitives';

import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

export type TngInputOtpType = 'numeric' | 'alphanumeric' | 'custom';
export type TngInputOtpInputMode = 'numeric' | 'text' | 'tel' | 'decimal';

export {
  applyTngOtpCharacters,
  removeTngOtpCharacter,
  resolveTngOtpEndIndex,
  resolveTngOtpEntryIndex,
  sanitizeTngOtpCharacters,
};

let tngInputOtpInstanceCounter = 0;

export function toTngOtpSlots(length: number, value: string): readonly string[] {
  const safeLength = normalizeTngOtpLength(length);
  const slots = Array.from({ length: safeLength }, () => '');
  const chars = Array.from(clampTngOtpValue(value, safeLength));

  for (const [index, char] of chars.entries()) {
    if (index >= safeLength) {
      break;
    }

    slots[index] = char;
  }

  return slots;
}

function clampOtpIndex(index: number, length: number): number {
  const safeLength = normalizeTngOtpLength(length);
  if (!Number.isFinite(index)) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= safeLength) {
    return safeLength - 1;
  }

  return Math.trunc(index);
}

function normalizeOtpPatternInput(value: unknown): readonly RegExp[] {
  if (value === undefined || value === null) return [];

  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? [new RegExp(normalized)] : [];
  }

  if (value instanceof RegExp) return [value];

  if (Array.isArray(value) && value.every((item) => item instanceof RegExp)) {
    return value;
  }

  return [];
}

@Component({
  selector: 'tng-input-otp',
  imports: [TngInputOtpPrimitive],
  templateUrl: './tng-input-otp.component.html',
  styleUrl: './tng-input-otp.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngInputOtpComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngInputOtpComponent)],
    },
  ],
})
export class TngInputOtpComponent implements AfterViewInit, FormValueControl<string>, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly hostEl: HTMLElement = this.hostRef.nativeElement;

  private readonly generatedId = `tng-input-otp-${++tngInputOtpInstanceCounter}`;
  private resetUnlisten: (() => void) | null = null;
  private hasInitializedUncontrolled = false;

  private readonly formsDisabled = signal(false);
  private readonly focusedState = signal(false);
  private readonly focusVisibleState = signal(false);
  private readonly keyboardInteraction = signal(false);
  private readonly activeIndexState = signal(0);

  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = model<string>('');
  public readonly defaultValue = input<string>('');
  public readonly type = input<TngInputOtpType>('numeric');
  public readonly pattern: InputSignalWithTransform<readonly RegExp[], unknown> = input<
    readonly RegExp[],
    unknown
  >([], {
    transform: normalizeOtpPatternInput,
  });

  public readonly mask = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly disabledInput = input<boolean, unknown>(false, {
    alias: 'disabled',
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
  public readonly autoFocus = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly selectOnFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  public readonly placeholderChar = input<string>('');
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly id = input<string | null>(null);
  public readonly form = input<string | null>(null);
  public readonly autocomplete = input<string>('one-time-code');
  public readonly inputMode = input<TngInputOtpInputMode | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedby = input<string | null>(null);

  public readonly touchedChange = output<void>();
  public readonly complete = output<string>();

  /**
   * Form-field integration. The OTP root carries aria-labelledby/describedby
   * (already bound in the template), so the form-field's adapter writes to
   * the host element. The focusable element returned is the host root — the
   * OTP itself manages which slot input takes focus.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: '[tngInputOtp]',
    controlKind: 'composite',
    isDisabled: () => this.disabledInput() || this.formsDisabled(),
    isFocused: () => this.focusedState(),
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  protected readonly resolvedDisabled = computed(() => this.disabledInput() || this.formsDisabled());
  protected readonly focused = computed(() => this.focusedState());
  protected readonly focusVisible = computed(() => this.focusVisibleState());
  protected readonly activeIndex = computed(() => clampOtpIndex(this.activeIndexState(), this.length()));
  protected readonly rootId = computed(() => this.id() ?? this.generatedId);

  protected readonly currentValue = computed(() => {
    return this.normalizeAndClamp(this.value());
  });

  protected readonly slots = computed(() => toTngOtpSlots(this.length(), this.currentValue()));
  protected readonly completionState = computed(() => resolveTngOtpState(this.length(), this.currentValue()));

  protected readonly resolvedInputMode = computed<TngInputOtpInputMode>(() => {
    const explicit = this.inputMode();
    if (explicit !== null) {
      return explicit;
    }

    return this.type() === 'numeric' ? 'numeric' : 'text';
  });

  protected readonly slotInputType = computed<'password' | 'text'>(() =>
    this.mask() ? 'password' : 'text',
  );

  private readonly syncUncontrolledState = effect(
    () => {
      const current = this.value();
      const length = this.length();
      this.type();
      this.pattern();

      const normalizedDefault = this.normalizeAndClamp(this.defaultValue());
      if (!this.hasInitializedUncontrolled) {
        this.hasInitializedUncontrolled = true;
        if (current === '' && normalizedDefault !== '') {
          this.value.set(normalizedDefault);
          this.activeIndexState.set(resolveTngOtpEntryIndex(normalizedDefault, length));
          return;
        }
      }

      const normalizedCurrent = this.normalizeAndClamp(current);
      if (normalizedCurrent !== current) {
        this.value.set(normalizedCurrent);
      }

      if (!this.focusedState()) {
        this.activeIndexState.set(resolveTngOtpEntryIndex(normalizedCurrent, length));
      } else {
        this.activeIndexState.update((index) => clampOtpIndex(index, length));
      }
    },
  );

  public ngAfterViewInit(): void {
    this.attachFormResetListener();

    if (!this.autoFocus() || this.resolvedDisabled()) {
      return;
    }

    queueMicrotask(() => {
      if (this.resolvedDisabled()) {
        return;
      }

      this.focusSlot(resolveTngOtpEntryIndex(this.currentValue(), this.length()), this.selectOnFocus());
    });
  }

  public ngOnDestroy(): void {
    this.resetUnlisten?.();
    this.resetUnlisten = null;
  }

  public setFormDisabledState(isDisabled: boolean): void {
    this.formsDisabled.set(isDisabled);
  }

  protected onSlotPointerDown(): void {
    this.keyboardInteraction.set(false);
  }

  protected onSlotFocus(index: number, event: FocusEvent): void {
    const target = event.target;
    const nextIndex = this.resolveEditableIndex(index);
    this.activeIndexState.set(nextIndex);
    this.focusedState.set(true);

    if (target instanceof HTMLElement && target.matches(':focus-visible')) {
      this.focusVisibleState.set(true);
    } else {
      this.focusVisibleState.set(this.keyboardInteraction());
    }

    if (this.selectOnFocus() && target instanceof HTMLInputElement) {
      target.select();
    }
  }

  protected onSlotBlur(event: FocusEvent): void {
    const host = this.hostRef.nativeElement;
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && host.contains(relatedTarget)) {
      return;
    }

    queueMicrotask(() => {
      if (this.isFocusWithinHost()) {
        return;
      }

      this.focusedState.set(false);
      this.focusVisibleState.set(false);
      this.touchedChange.emit();
    });
  }

  protected onSlotKeydown(index: number, event: KeyboardEvent): void {
    this.keyboardInteraction.set(true);

    const editableIndex = this.resolveEditableIndex(index);
    const total = this.length();

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusSlot(Math.max(0, editableIndex - 1), true);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusSlot(Math.min(total - 1, editableIndex + 1), true);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusSlot(0, true);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusSlot(resolveTngOtpEndIndex(this.currentValue(), total), true);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace(editableIndex);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      this.handleDelete(editableIndex);
      return;
    }

    if ((this.resolvedDisabled() || this.readonly()) && event.key.length === 1) {
      event.preventDefault();
    }
  }

  protected onSlotInput(index: number, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (this.resolvedDisabled() || this.readonly()) {
      target.value = this.slotValue(this.resolveEditableIndex(index));
      return;
    }

    const chars = sanitizeTngOtpCharacters(target.value, this.type(), this.currentPattern());
    if (chars.length === 0) {
      const nextValue = removeTngOtpCharacter(this.currentValue(), this.resolveEditableIndex(index));
      this.commitValue(nextValue, this.resolveEditableIndex(index));
      return;
    }

    const previousValue = this.currentValue();
    const totalLength = this.length();
    const editableIndex = this.resolveEditableIndex(index);
    const wasCompleteBeforeInput = previousValue.length >= totalLength;
    const wasReplacingExistingCharacter = editableIndex < previousValue.length;
    const nextValue = applyTngOtpCharacters(previousValue, editableIndex, chars, totalLength);
    const nextFocus =
      wasCompleteBeforeInput || wasReplacingExistingCharacter
        ? Math.min(totalLength - 1, editableIndex + chars.length)
        : nextValue.length >= totalLength
          ? totalLength - 1
          : Math.min(totalLength - 1, Math.max(editableIndex + chars.length, nextValue.length));

    this.commitValue(nextValue, nextFocus);
  }

  protected onSlotPaste(index: number, event: ClipboardEvent): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    const clipboardValue = event.clipboardData?.getData('text') ?? '';
    const chars = sanitizeTngOtpCharacters(clipboardValue, this.type(), this.currentPattern());
    if (chars.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const editableIndex = this.resolveEditableIndex(index);
    const nextValue = applyTngOtpCharacters(this.currentValue(), editableIndex, chars, this.length());
    const nextFocus =
      nextValue.length >= this.length()
        ? this.length() - 1
        : Math.min(this.length() - 1, nextValue.length);

    this.commitValue(nextValue, nextFocus);
  }

  protected slotValue(index: number): string {
    const slot = this.slots()[index];
    return slot ?? '';
  }

  protected slotPlaceholder(index: number): string | null {
    if (this.placeholderChar().length === 0) {
      return null;
    }

    return this.slotValue(index) === '' ? this.placeholderChar() : null;
  }

  protected slotAriaLabel(index: number): string {
    const prefix = this.ariaLabel();
    const base = prefix?.trim() ? `${prefix.trim()} - ` : '';
    return `${base}Character ${index + 1} of ${this.length()}`;
  }

  protected isSlotTabbable(index: number): boolean {
    return this.activeIndex() === index;
  }

  private handleBackspace(index: number): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    const nextState = resolveTngOtpBackspaceResult(this.currentValue(), index, this.length());
    if (nextState === null) {
      return;
    }

    this.commitValue(nextState.value, nextState.focusIndex);
  }

  private handleDelete(index: number): void {
    if (this.resolvedDisabled() || this.readonly()) {
      return;
    }

    if (index >= this.currentValue().length) {
      return;
    }

    const nextValue = removeTngOtpCharacter(this.currentValue(), index);
    this.commitValue(nextValue, index);
  }

  private commitValue(nextValue: string, nextFocusIndex: number): void {
    const previousValue = this.currentValue();
    const normalized = this.normalizeAndClamp(nextValue);
    const didChange = normalized !== previousValue;

    this.value.set(normalized);

    this.activeIndexState.set(clampOtpIndex(nextFocusIndex, this.length()));

    if (didChange) {
      if (resolveTngOtpState(this.length(), normalized) === 'complete') {
        this.complete.emit(normalized);
      }
    }

    queueMicrotask(() => {
      this.syncSlotInputValues();
      if (!this.focusedState() && !this.isFocusWithinHost()) {
        return;
      }

      this.focusSlot(this.activeIndex(), this.selectOnFocus());
    });
  }

  private resolveEditableIndex(index: number): number {
    const safeIndex = clampOtpIndex(index, this.length());
    const currentValueLength = this.currentValue().length;

    if (currentValueLength >= this.length()) {
      return safeIndex;
    }

    return Math.min(safeIndex, currentValueLength);
  }

  private focusSlot(index: number, select: boolean): void {
    const safeIndex = clampOtpIndex(index, this.length());
    const slot = this.hostRef.nativeElement.querySelector<HTMLInputElement>(
      `[data-tng-otp-slot='${safeIndex}']`,
    );

    if (!(slot instanceof HTMLInputElement)) {
      return;
    }

    slot.focus();
    if (select) {
      slot.select();
    }

    this.activeIndexState.set(safeIndex);
  }

  private syncSlotInputValues(): void {
    const slotValues = this.slots();
    const slotInputs = this.hostRef.nativeElement.querySelectorAll<HTMLInputElement>('.tng-input-otp-slot');
    slotInputs.forEach((slotInput, index) => {
      slotInput.value = slotValues[index] ?? '';
    });
  }

  private isFocusWithinHost(): boolean {
    const ownerDocument = this.hostRef.nativeElement.ownerDocument;
    const activeElement = ownerDocument?.activeElement;
    return activeElement instanceof Node && this.hostRef.nativeElement.contains(activeElement);
  }

  private normalizeAndClamp(value: string): string {
    const chars = sanitizeTngOtpCharacters(value, this.type(), this.currentPattern());
    const safeLength = this.length();
    return chars.slice(0, safeLength).join('');
  }

  private currentPattern(): RegExp | null {
    return this.pattern()[0] ?? null;
  }

  private attachFormResetListener(): void {
    const formId = this.form();
    const ownerForm =
      formId !== null
        ? this.hostRef.nativeElement.ownerDocument?.getElementById(formId)
        : this.hostRef.nativeElement.closest('form');

    if (!(ownerForm instanceof HTMLFormElement)) {
      return;
    }

    this.resetUnlisten?.();
    this.resetUnlisten = this.renderer.listen(ownerForm, 'reset', () => {
      const resetValue = this.normalizeAndClamp(this.defaultValue());
      this.value.set(resetValue);
      this.activeIndexState.set(resolveTngOtpEntryIndex(resetValue, this.length()));
    });
  }
}
