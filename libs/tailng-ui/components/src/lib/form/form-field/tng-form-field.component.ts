import type {
  AfterContentChecked,
  QueryList} from '@angular/core';
import {
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { TngUniqueIdService } from '@tailng-ui/primitives';

import { TngError, TngHint } from './tng-form-field-message';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
  type TngFormFieldControlKind,
} from './tng-form-field.control';

type NullableBooleanInput = boolean | null | string | undefined;

export type TngFormFieldLabelPosition = 'outline' | 'above' | 'left';
export type TngFormFieldSize = 'sm' | 'md' | 'lg';
export type TngFormFieldAppearance = 'auto' | 'outlined' | 'plain' | 'none';
export type TngFormFieldControlType = 'auto' | 'text' | 'inline' | 'group' | 'composite';
export type TngFormFieldSlot =
  | 'root'
  | 'label'
  | 'controlRow'
  | 'control'
  | 'messages'
  | 'hint'
  | 'error'
  | 'requiredMarker'
  | 'prefix'
  | 'suffix';
export type TngFormFieldSlotMap = Partial<Record<TngFormFieldSlot, string>>;

type NativeControlElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Element tags that should behave like text/date inputs inside the form-field.
 * Even if the projected component registers as a custom control, these controls
 * use the normal outlined field chrome so their background matches datepicker
 * and input-like controls.
 */
const TEXT_CONTROL_TAGS: readonly string[] = [
  'tng-datepicker',
  'tng-date-range-picker',
  'tng-month-daypicker',
  'tng-yearpicker',
];

/**
 * Element tags whose presence in the control slot triggers `appearance="plain"`
 * defaults. These controls draw their own visual chrome, so the form-field
 * shouldn't paint a second outlined frame around them.
 */
const PLAIN_APPEARANCE_TAGS: readonly string[] = [
  'tng-switch',
  'tng-toggle',
  'tng-toggle-group',
  'tng-button-toggle-group',
  'tng-checkbox',
  'tng-radio',
  'tng-slider',
  'tng-range-slider',
  'tng-listbox',
  'tng-input-otp',
];

/**
 * Element tags whose presence in the control slot triggers `controlType="inline"`
 * defaults — the label sits to the right of the control on the same row.
 */
const INLINE_CONTROL_TAGS: readonly string[] = [
  'tng-switch',
  'tng-toggle',
  'tng-checkbox',
];

/**
 * Element tags whose presence in the control slot triggers `controlType="group"`
 * defaults — the group host owns labelledby/describedby; no per-item wiring.
 */
const GROUP_CONTROL_TAGS: readonly string[] = ['tng-toggle-group', 'tng-button-toggle-group'];

/**
 * Element tags whose presence in the control slot triggers `controlType="composite"`
 * defaults — the control has its own internal layout and chrome.
 */
const COMPOSITE_CONTROL_TAGS: readonly string[] = [
  'tng-slider',
  'tng-range-slider',
  'tng-listbox',
  'tng-input-otp',
];

const INTERACTIVE_CLICK_TARGET_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function coerceNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) return null;
  if (value === '' || value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return null;
}

function normalizeLabelPosition(value: string | null | undefined): TngFormFieldLabelPosition {
  if (value === 'outline' || value === 'left') return value;
  return 'above';
}

function normalizeSize(value: string | null | undefined): TngFormFieldSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function normalizeAppearance(value: string | null | undefined): TngFormFieldAppearance {
  if (value === 'outlined' || value === 'plain' || value === 'none') return value;
  return 'auto';
}

function normalizeControlType(value: string | null | undefined): TngFormFieldControlType {
  if (value === 'text' || value === 'inline' || value === 'group' || value === 'composite') {
    return value;
  }
  return 'auto';
}

function normalizeId(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function uniqueIds(ids: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const id of ids) {
    const normalized = normalizeId(id);
    if (normalized === null || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function isLabelableElement(el: HTMLElement | null): boolean {
  if (el === null) return false;
  return (
    el instanceof HTMLButtonElement ||
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLMeterElement ||
    el instanceof HTMLOutputElement ||
    el instanceof HTMLProgressElement
  );
}

function tagOf(el: Element): string {
  return el.tagName.toLowerCase();
}

@Component({
  selector: 'tng-form-field',
  templateUrl: './tng-form-field.component.html',
  styleUrl: './tng-form-field.component.css',
})
export class TngFormFieldComponent implements AfterContentChecked {
  private readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly idService = inject(TngUniqueIdService);
  private readonly generatedControlId = this.idService.nextId('tng-form-field-control');
  private readonly generatedLabelId = this.idService.nextId('tng-form-field-label');
  private readonly nativeDescribedBy = new WeakMap<NativeControlElement, readonly string[]>();
  private lastWarnedControlCount = 0;
  private fieldFocused = false;
  private syncQueued = false;

  public readonly labelPosition = input<TngFormFieldLabelPosition, string | null | undefined>(
    'above',
    {
      transform: normalizeLabelPosition,
    },
  );
  public readonly size = input<TngFormFieldSize, string | null | undefined>('md', {
    transform: normalizeSize,
  });
  /**
   * Visual chrome around the control. `outlined` paints the standard
   * text-field border (default for `<input>`-like controls). `plain` strips
   * the border / padding / min-height — appropriate for controls that draw
   * their own chrome (switch, slider, listbox, …). `none` strips the message
   * container chrome as well.
   *
   * Default `auto` auto-detects from the projected control: text-like controls
   * resolve to `outlined`, others fall back to `plain`. An explicit value
   * always wins — set `appearance="outlined"` to force the bordered frame
   * even on controls that would default to `plain`.
   */
  public readonly appearance = input<TngFormFieldAppearance, string | null | undefined>(
    'auto',
    {
      transform: normalizeAppearance,
    },
  );
  /**
   * Layout hint for the form-field. `text` is the default vertical stack with
   * label above. `inline` puts the label to the right of the control on the
   * same row — the default for switch/toggle/single-checkbox. `group` and
   * `composite` are routed to plain appearance but otherwise behave like
   * `text` for layout.
   *
   * Default `auto` derives the value from the projected control's tag.
   */
  public readonly controlType = input<TngFormFieldControlType, string | null | undefined>(
    'auto',
    {
      transform: normalizeControlType,
    },
  );
  public readonly requiredMarker = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly hideHintWhenError = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  /** When true, the field no longer stretches to the full width of its container (default is full width). */
  public readonly inlineWidth = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceNullableBoolean,
  });
  public readonly invalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceNullableBoolean,
  });
  public readonly slot = input<TngFormFieldSlotMap | null>(null);

  @ContentChildren(TNG_FORM_FIELD_CONTROL, { descendants: true })
  protected customControls!: QueryList<TngFormFieldControl>;

  @ContentChildren(TngHint, { descendants: true })
  protected hints!: QueryList<TngHint>;

  @ContentChildren(TngError, { descendants: true })
  protected errors!: QueryList<TngError>;

  public ngAfterContentChecked(): void {
    this.syncField();
    this.queuePostCheckSync();
  }

  @HostBinding('class')
  protected get hostClass(): string {
    return this.classList('tng-form-field', this.slotClass('root'));
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field' as const;

  @HostBinding('attr.data-size')
  protected get dataSize(): TngFormFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-label-position')
  protected get dataLabelPosition(): TngFormFieldLabelPosition {
    return this.labelPosition();
  }

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): Exclude<TngFormFieldAppearance, 'auto'> {
    return this.resolvedAppearance();
  }

  @HostBinding('attr.data-control-type')
  protected get dataControlType(): TngFormFieldControlType {
    return this.resolvedControlType();
  }

  /**
   * Reflects the *auto-detected* control kind (independent of any explicit
   * `controlType` override). Lets CSS react to "what kind of control is
   * actually projected" — for example, drop the outlined frame's surface
   * background when an author forces `appearance="outlined"` on a control
   * that would otherwise be plain-by-default (switch, slider, listbox, …),
   * so the control sits inside a bordered container rather than on top of
   * a second filled surface.
   */
  @HostBinding('attr.data-control-kind')
  protected get dataControlKind(): TngFormFieldControlKind | null {
    return this.detectControlKind();
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): '' | null {
    return this.isFocused() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequired(): '' | null {
    return this.isRequired() ? '' : null;
  }

  @HostBinding('attr.data-inline-width')
  protected get dataInlineWidth(): '' | null {
    return this.inlineWidth() ? '' : null;
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.fieldFocused = true;
  }

  @HostListener('focusout', ['$event.relatedTarget'])
  protected onFocusOut(nextTarget: Readonly<EventTarget> | null): void {
    if (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) return;
    this.fieldFocused = false;
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (event.defaultPrevented || this.isDisabled()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (this.isSelfHandledInteractiveTarget(target)) return;

    this.focusableControlElement()?.focus();
  }

  protected classList(...classes: readonly (string | null | undefined)[]): string {
    return classes
      .flatMap((className) => (className ?? '').split(/\s+/u))
      .filter((className) => className.length > 0)
      .join(' ');
  }

  protected slotClass(slotName: TngFormFieldSlot): string {
    return this.slot()?.[slotName] ?? '';
  }

  protected showRequiredMarker(): boolean {
    return this.requiredMarker() && this.isRequired();
  }

  /**
   * Resolves the actual appearance applied to the field.
   * - Explicit author input always wins.
   * - Otherwise (`auto`), when the projected control hints `controlKind`
   *   (or its tag matches one of the known plain-frame tags), default to `plain`.
   * - Otherwise default to `outlined`.
   */
  private resolvedAppearance(): Exclude<TngFormFieldAppearance, 'auto'> {
    const explicit = this.appearance();
    if (explicit !== 'auto') return explicit;

    const kind = this.detectControlKind();
    if (kind !== null && kind !== 'text') return 'plain';
    return 'outlined';
  }

  /**
   * Resolves the actual control type applied to the field. Default `auto`
   * resolves to `text`/`inline`/`group`/`composite` based on the projected
   * control. An explicit value always wins.
   */
  private resolvedControlType(): Exclude<TngFormFieldControlType, 'auto'> {
    const explicit = this.controlType();
    if (explicit !== 'auto') return explicit;

    const kind = this.detectControlKind();
    return kind ?? 'text';
  }

  private detectControlKind(): TngFormFieldControlKind | null {
    const projected = this.projectedControlElement();
    const tag = projected === null ? null : tagOf(projected);

    if (tag !== null && TEXT_CONTROL_TAGS.includes(tag)) return 'text';

    const custom = this.customControl();
    if (custom?.controlKind !== undefined) return custom.controlKind;

    if (tag === null) return null;

    if (INLINE_CONTROL_TAGS.includes(tag)) return 'inline';
    if (GROUP_CONTROL_TAGS.includes(tag)) return 'group';
    if (COMPOSITE_CONTROL_TAGS.includes(tag)) return 'composite';
    if (PLAIN_APPEARANCE_TAGS.includes(tag)) return 'composite';
    return null;
  }

  private projectedControlElement(): HTMLElement | null {
    return this.projectedControlElements()[0] ?? null;
  }

  private projectedControlElements(): readonly HTMLElement[] {
    const controlSlot = this.hostElement.querySelector<HTMLElement>(
      '[data-slot="form-field-control"]',
    );
    if (controlSlot === null) return [];

    // Only direct projected children are logical form-field controls.
    // Nested children can provide TNG_FORM_FIELD_CONTROL too, but they are
    // internal items/options of a group or composite control and should not
    // be counted as additional form-field controls.
    return Array.from(controlSlot.children).filter((child): child is HTMLElement => {
      return child instanceof HTMLElement;
    });
  }

  private syncField(): void {
    const nativeControl = this.nativeControlElement();
    const customControl = this.customControl();
    const controlCount = this.compatibleControlCount();
    this.warnForControlCount(controlCount);

    this.syncLabel(nativeControl, customControl);
    const describedByIds = this.describedByIds();

    if (nativeControl !== null) {
      this.syncNativeControl(nativeControl, describedByIds);
    }

    if (customControl !== null) {
      customControl.setDescribedByIds(describedByIds);
      customControl.setAriaInvalid?.(this.isInvalid());
      customControl.setAriaRequired?.(this.isRequired());
    }
  }

  private queuePostCheckSync(): void {
    if (this.syncQueued) return;

    this.syncQueued = true;
    queueMicrotask(() => {
      this.syncQueued = false;
      this.syncField();
    });
  }

  private syncLabel(
    nativeControl: NativeControlElement | null,
    customControl: TngFormFieldControl | null,
  ): void {
    const label = this.labelElement();
    if (label === null) return;

    if (normalizeId(label.id) === null) {
      label.id = this.generatedLabelId;
    }

    // 1. Custom control with a labelable focusable element → use `for=` (the
    //    most expressive native association, lets click-on-label focus the
    //    control). We still call `setLabelledById` so the control can
    //    optionally mirror it on `aria-labelledby` if its host is what AT reads.
    const focusable = customControl?.focusableElement ?? null;
    if (focusable !== null) {
      const focusableId = this.ensureFocusableId(focusable);
      const currentFor = normalizeId(label.getAttribute('for'));
      if (
        isLabelableElement(focusable) &&
        (currentFor === null || currentFor === this.generatedControlId)
      ) {
        label.setAttribute('for', focusableId);
      }
      customControl?.setLabelledById?.(label.id);
      return;
    }

    // 2. Plain native control (input/textarea[tngInput|tngTextarea]).
    if (nativeControl !== null) {
      const controlId = this.ensureNativeControlId(nativeControl);
      if (normalizeId(label.getAttribute('for')) === null) {
        label.setAttribute('for', controlId);
      }
      return;
    }

    // 3. Custom control without a focusable element → labelledby only.
    customControl?.setLabelledById?.(label.id);
  }

  private syncNativeControl(control: NativeControlElement, describedByIds: readonly string[]): void {
    this.ensureNativeControlId(control);
    const baseIds = this.initialDescribedByIds(control);
    const mergedIds = uniqueIds([...baseIds, ...describedByIds]);

    if (mergedIds.length > 0) {
      control.setAttribute('aria-describedby', mergedIds.join(' '));
    } else {
      control.removeAttribute('aria-describedby');
    }

    if (this.isInvalid()) {
      control.setAttribute('aria-invalid', 'true');
    } else if (control.getAttribute('aria-invalid') === 'true') {
      control.removeAttribute('aria-invalid');
    }

    if (this.isRequired()) {
      control.setAttribute('aria-required', 'true');
    } else if (!control.hasAttribute('required')) {
      control.removeAttribute('aria-required');
    }
  }

  private describedByIds(): readonly string[] {
    const visibleErrors = this.visibleErrors();
    const shouldHideHints = this.hideHintWhenError() && visibleErrors.length > 0;
    const visibleHints = this.visibleHints(shouldHideHints);

    return uniqueIds([
      ...visibleHints.map((hint) => hint.resolvedId),
      ...visibleErrors.map((error) => error.resolvedId),
    ]);
  }

  private visibleHints(hiddenByField: boolean): readonly TngHint[] {
    const hints = this.hints?.toArray() ?? [];
    for (const hint of hints) {
      hint.setHiddenByField(hiddenByField);
    }

    return hiddenByField ? [] : hints.filter((hint) => hint.isVisible());
  }

  private visibleErrors(): readonly TngError[] {
    return (this.errors?.toArray() ?? []).filter((error) => error.isVisible());
  }

  private ensureNativeControlId(control: NativeControlElement): string {
    const existingId = normalizeId(control.id);
    if (existingId !== null) return existingId;

    control.id = this.generatedControlId;
    return control.id;
  }

  private ensureFocusableId(control: HTMLElement): string {
    const existingId = normalizeId(control.id);
    if (existingId !== null) return existingId;

    control.id = this.generatedControlId;
    return control.id;
  }

  private initialDescribedByIds(control: NativeControlElement): readonly string[] {
    const existing = this.nativeDescribedBy.get(control);
    if (existing !== undefined) return existing;

    const ids = uniqueIds((control.getAttribute('aria-describedby') ?? '').split(/\s+/u));
    this.nativeDescribedBy.set(control, ids);
    return ids;
  }

  private isFocused(): boolean {
    return this.fieldFocused || this.customControl()?.focused === true;
  }

  private isDisabled(): boolean {
    const forced = this.disabled();
    if (forced !== null) return forced;

    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) return nativeControl.disabled || nativeControl.hasAttribute('disabled');

    return this.customControl()?.disabled === true;
  }

  private isInvalid(): boolean {
    const forced = this.invalid();
    if (forced !== null) return forced;

    if (this.visibleErrors().length > 0) return true;

    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) {
      if (nativeControl.getAttribute('aria-invalid') === 'true') return true;
      return nativeControl.matches(':invalid');
    }

    return this.customControl()?.invalid === true;
  }

  private isRequired(): boolean {
    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) return nativeControl.required || nativeControl.hasAttribute('required');

    return this.customControl()?.required === true;
  }

  private labelElement(): HTMLLabelElement | null {
    const element = this.hostElement.querySelector('label[tngLabel], tng-label label');
    return element instanceof HTMLLabelElement ? element : null;
  }

  private focusableControlElement(): HTMLElement | null {
    const customFocusable = this.customControl()?.focusableElement ?? null;
    const customFocusTarget = this.focusTargetFrom(customFocusable);
    if (customFocusTarget !== null) return customFocusTarget;

    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) return nativeControl;

    const controlSlot = this.hostElement.querySelector<HTMLElement>(
      '[data-slot="form-field-control"]',
    );
    return this.focusTargetFrom(controlSlot);
  }

  private focusTargetFrom(container: HTMLElement | null): HTMLElement | null {
    if (container === null) return null;
    if (container.matches(INTERACTIVE_CLICK_TARGET_SELECTOR)) return container;
    return container.querySelector<HTMLElement>(INTERACTIVE_CLICK_TARGET_SELECTOR);
  }

  private isSelfHandledInteractiveTarget(target: Element): boolean {
    const interactive = target.closest(INTERACTIVE_CLICK_TARGET_SELECTOR);
    return interactive !== null && this.hostElement.contains(interactive);
  }

  private nativeControlElement(): NativeControlElement | null {
    return this.nativeControlElements()[0] ?? null;
  }

  private nativeControlElements(): readonly NativeControlElement[] {
    return Array.from(
      this.hostElement.querySelectorAll(
        'input[tngInput], textarea[tngInput], textarea[tngTextarea]',
      ),
    ).filter((element): element is NativeControlElement => {
      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
    });
  }

  private customControl(): TngFormFieldControl | null {
    return this.customControls?.first ?? null;
  }

  /**
   * Counts logical controls projected into the field for dev-mode warning.
   * Direct children of the control slot are treated as the public controls.
   * Descendant controls are ignored because grouped/composite controls can
   * contain internal items that also provide TNG_FORM_FIELD_CONTROL.
   */
  private compatibleControlCount(): number {
    const directProjectedControls = this.projectedControlElements();
    if (directProjectedControls.length > 0) return directProjectedControls.length;

    const native = this.nativeControlElements().length;
    const custom = this.customControls?.length ?? 0;
    return Math.max(native, custom);
  }

  private warnForControlCount(controlCount: number): void {
    if (!isDevMode()) return;
    if (controlCount <= 1 || controlCount === this.lastWarnedControlCount) return;

    this.lastWarnedControlCount = controlCount;
    globalThis.console.warn(
      `[tng-form-field] Expected at most 1 compatible control, but found ${controlCount}.`,
      this.hostElement,
    );
  }
}
