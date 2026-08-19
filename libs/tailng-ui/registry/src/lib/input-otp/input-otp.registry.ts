import type { RegistryItem } from '../registry.types';

const inputOtpPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function normalizeTngOtpLength(value: number): number {
  if (!Number.isFinite(value)) {
    return 6;
  }

  const rounded = Math.trunc(value);
  if (rounded < 1) {
    return 1;
  }

  return rounded > 12 ? 12 : rounded;
}

export type TngOtpCompletionState = 'complete' | 'empty' | 'partial';

export function normalizeTngOtpValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value;
}

export function clampTngOtpValue(value: string, length: number): string {
  return Array.from(value).slice(0, length).join('');
}

export function resolveTngOtpState(length: number, value: string): TngOtpCompletionState {
  const normalizedLength = normalizeTngOtpLength(length);
  const clampedValue = clampTngOtpValue(normalizeTngOtpValue(value), normalizedLength);

  if (clampedValue.length === 0) {
    return 'empty';
  }

  return clampedValue.length >= normalizedLength ? 'complete' : 'partial';
}

@Directive({
  selector: '[tngInputOtp]',
  exportAs: 'tngInputOtp',
})
export class TngInputOtpPrimitive {
  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string>('');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly focused = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly focusVisible = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly activeIndex = input<number | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-otp' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;

  @HostBinding('attr.data-empty')
  protected get dataEmptyAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'empty' ? '' : null;
  }

  @HostBinding('attr.data-partial')
  protected get dataPartialAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'partial' ? '' : null;
  }

  @HostBinding('attr.data-complete')
  protected get dataCompleteAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.value()) === 'complete' ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.invalid() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused() ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.focusVisible() ? '' : null;
  }

  @HostBinding('attr.data-active')
  protected get dataActiveAttr(): string | null {
    const index = this.activeIndex();
    if (typeof index !== 'number' || !Number.isFinite(index)) {
      return null;
    }

    if (index < 0 || index >= this.length()) {
      return null;
    }

    return String(index);
  }
}
`;

const inputOtpComponentTsTemplate = `import { Component, computed, input, output } from '@angular/core';
import { normalizeTngOtpLength, TngInputOtpPrimitive } from './tng-input-otp-primitive';

function toOtpSlots(length: number, value: string): string[] {
  const slots = Array.from({ length }, () => '');

  for (const [index, char] of Array.from(value).entries()) {
    if (index >= length) {
      break;
    }

    slots[index] = char;
  }

  return slots;
}

function joinOtpSlots(slots: readonly string[]): string {
  return slots.join('');
}

export function sanitizeTngOtpValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

export function applyTngOtpSlotValue(
  slots: readonly string[],
  index: number,
  nextValue: string,
): readonly string[] {
  if (index < 0 || index >= slots.length) {
    return slots;
  }

  const nextSlots = [...slots];
  nextSlots[index] = sanitizeTngOtpValue(nextValue).slice(0, 1);
  return nextSlots;
}

function isFilledOtp(slots: readonly string[]): boolean {
  return slots.every((slot) => slot.length === 1);
}

function focusOtpInput(index: number): void {
  const target = document.querySelector<HTMLInputElement>(\`[data-tng-otp-slot='\${index}']\`);
  target?.focus();
  target?.select();
}

function readInputValue(event: unknown): string | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.value;
}

function readClipboardText(event: unknown): string | null {
  if (!(event instanceof ClipboardEvent)) {
    return null;
  }

  return event.clipboardData?.getData('text') ?? null;
}

function handleOtpArrowNavigation(index: number, key: string, total: number): boolean {
  if (key === 'ArrowLeft' && index > 0) {
    focusOtpInput(index - 1);
    return true;
  }

  if (key === 'ArrowRight' && index < total - 1) {
    focusOtpInput(index + 1);
    return true;
  }

  return false;
}

function shouldMoveBackForDelete(slots: readonly string[], index: number, key: string): boolean {
  if (key !== 'Backspace') {
    return false;
  }

  if (index === 0) {
    return false;
  }

  return slots[index] === '';
}

@Component({
  selector: 'tng-input-otp',
  imports: [TngInputOtpPrimitive],
  templateUrl: './tng-input-otp.html',
  styleUrl: './tng-input-otp.css',
})
export class TngInputOtp {
  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string>('');

  public readonly valueChange = output<string>();
  public readonly complete = output<string>();

  protected readonly slots = computed<readonly string[]>(() =>
    toOtpSlots(this.length(), sanitizeTngOtpValue(this.value())),
  );

  protected onSlotInput(index: number, event: unknown): void {
    const value = readInputValue(event);
    if (value === null) {
      return;
    }

    const nextSlots = applyTngOtpSlotValue(this.slots(), index, value);
    const nextValue = joinOtpSlots(nextSlots);
    this.valueChange.emit(nextValue);

    if (nextSlots[index] !== '' && index < nextSlots.length - 1) {
      focusOtpInput(index + 1);
    }

    if (isFilledOtp(nextSlots)) {
      this.complete.emit(nextValue);
    }
  }

  protected onSlotKeydown(index: number, event: unknown): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (handleOtpArrowNavigation(index, event.key, this.slots().length)) {
      event.preventDefault();
      return;
    }

    if (!shouldMoveBackForDelete(this.slots(), index, event.key)) {
      return;
    }

    event.preventDefault();
    const nextSlots = applyTngOtpSlotValue(this.slots(), index - 1, '');
    this.valueChange.emit(joinOtpSlots(nextSlots));
    focusOtpInput(index - 1);
  }

  protected onSlotsPaste(event: unknown): void {
    const clipboardValue = readClipboardText(event);
    if (clipboardValue === null) {
      return;
    }

    const cleanedValue = sanitizeTngOtpValue(clipboardValue).slice(0, this.length());
    if (cleanedValue.length === 0) {
      return;
    }

    if (event instanceof ClipboardEvent) {
      event.preventDefault();
    }

    this.valueChange.emit(cleanedValue);

    if (cleanedValue.length >= this.length()) {
      this.complete.emit(cleanedValue);
    }
  }
}
`;

const inputOtpTemplateHtml = `<div tngInputOtp class="tng-input-otp-root" [length]="length()" (paste)="onSlotsPaste($event)">
  @for (slot of slots(); track $index) {
    <input
      class="tng-input-otp-slot"
      [attr.data-tng-otp-slot]="$index"
      [value]="slot"
      [attr.aria-label]="'OTP character ' + ($index + 1)"
      inputmode="numeric"
      maxlength="1"
      type="text"
      (input)="onSlotInput($index, $event)"
      (keydown)="onSlotKeydown($index, $event)"
    />
  }
</div>
`;

const inputOtpTemplateCss = `:host {
  display: inline-flex;
}

.tng-input-otp-root {
  column-gap: 0.45rem;
  display: inline-flex;
}

.tng-input-otp-slot {
  background: var(--tng-semantic-background-surface, #fff);
  border: 1px solid var(--tng-semantic-border-default, #cbd5e1);
  border-radius: 0.5rem;
  color: var(--tng-semantic-text-primary, #0f172a);
  font-size: 1rem;
  height: 2.4rem;
  text-align: center;
  width: 2.1rem;
}

.tng-input-otp-slot:focus-visible {
  border-color: var(--tng-semantic-accent-brand, #2563eb);
  outline: 2px solid var(--tng-semantic-accent-brand, #2563eb);
  outline-offset: 1px;
}
`;

const inputOtpIndexTsTemplate = `export * from './tng-input-otp';
export * from './tng-input-otp-primitive';
`;

export const inputOtpRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for input-otp primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/input-otp',
    importSymbols: ['TngInputOtp', 'TngInputOtpPrimitive'],
  },
  files: [
    {
      content: inputOtpPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/input-otp/tng-input-otp-primitive.ts',
    },
    {
      content: inputOtpComponentTsTemplate,
      path: 'src/app/tailng-ui/input-otp/tng-input-otp.ts',
    },
    {
      content: inputOtpTemplateHtml,
      path: 'src/app/tailng-ui/input-otp/tng-input-otp.html',
    },
    {
      content: inputOtpTemplateCss,
      path: 'src/app/tailng-ui/input-otp/tng-input-otp.css',
    },
    {
      content: inputOtpIndexTsTemplate,
      path: 'src/app/tailng-ui/input-otp/index.ts',
    },
  ],
  name: 'input-otp',
} satisfies RegistryItem;
