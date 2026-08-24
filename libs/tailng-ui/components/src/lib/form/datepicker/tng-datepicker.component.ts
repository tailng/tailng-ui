import {
  Component,
  ElementRef,
  HostBinding,
  LOCALE_ID,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import {
  type TngOverlayRuntime,
  type TngOverlayCollisionOptions,
  type TngOverlayPlacement,
  type TngOverlayScrollStrategy,
} from '@tailng-ui/cdk';
import {
  createDatepickerController,
  TngDatepickerOverlay,
  type TngCalendarView,
  type TngDateCell,
  type TngDateAdapter,
  type TngDateInputValue,
  type TngDateSelectionInput,
  type TngDatepickerCloseReason,
  type TngDatepickerDirection,
  type TngDatepickerOutputs,
  type TngDatepickerSelectionMode,
  type TngMonthOption,
  type TngWeekdayIndex,
  type TngYearOption,
} from '@tailng-ui/primitives';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';
import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';

type OptionalBooleanInput = boolean | null | string | undefined;
type TngDatepickerPlacement = 'auto' | 'bottom' | 'top';

const OVERLAY_VIEWPORT_MARGIN = 12;

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function normalizeNumberInput(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeWeekdayInput(value: TngWeekdayIndex | number | string): TngWeekdayIndex {
  const normalized = Math.max(0, Math.min(6, Math.trunc(normalizeNumberInput(value))));
  return normalized as TngWeekdayIndex;
}

function isKeyboardEventTarget(value: EventTarget | null): value is HTMLElement {
  return value instanceof HTMLElement;
}

let nextDatepickerInputId = 0;

function createDatepickerInputId(): string {
  nextDatepickerInputId += 1;
  return `tng-datepicker-input-${nextDatepickerInputId}`;
}

@Component({
  selector: 'tng-datepicker',
  imports: [TngDatepickerOverlay],
  templateUrl: './tng-datepicker.component.html',
  styleUrl: './tng-datepicker.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngDatepickerComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngDatepickerComponent)],
    },
  ],
})
export class TngDatepickerComponent<TDate = Date>
  implements FormValueControl<TngDateSelectionInput<TDate> | undefined>, OnDestroy
{
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly defaultLocale = inject(LOCALE_ID);
  private readonly fallbackInputId = createDatepickerInputId();
  private readonly ownerDocument = this.hostElement.nativeElement.ownerDocument ?? null;
  private readonly renderVersion = signal(0);
  private readonly anchorRef = viewChild<ElementRef<HTMLElement>>('anchorShell');
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private appliedInitialState = false;
  private suppressNextOverlayFocusSync = false;
  protected readonly controller = createDatepickerController<TDate>({
    allowManualInput: true,
    autoCommitView: false,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    closeOnSelect: true,
    locale: this.defaultLocale,
    ownerDocument: this.ownerDocument,
    restoreFocus: true,
    showOutsideDays: true,
    trapFocus: true,
    value: null,
  });
  private readonly unsubscribe = this.controller.subscribe((event) => {
    this.renderVersion.update((value) => value + 1);

    switch (event.type) {
      case 'activeChange':
        this.activeDateChange.emit(event.activeDate);
        break;
      case 'closed':
        this.openChange.emit(false);
        this.closed.emit(event.reason);
        break;
      case 'monthChange':
        this.monthChange.emit(event.visibleMonth);
        break;
      case 'opened':
        this.openChange.emit(true);
        if (!this.suppressNextOverlayFocusSync) {
          this.queueOverlayFocusSync();
        }
        this.suppressNextOverlayFocusSync = false;
        break;
      case 'valueChange':
        this.value.set(event.value);
        break;
      case 'viewChange':
        this.viewChange.emit(event.view);
        break;
      case 'yearChange':
        this.yearChange.emit(event.year);
        break;
    }
  });

  public readonly adapter = input<TngDateAdapter<TDate> | undefined>(undefined);
  public readonly allowDeselect = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly allowManualInput = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledBy = input<string | null>(null);
  public readonly autoCommitView = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly closeOnEscape = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnOutsideClick = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOnSelect = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly closeOthersOnOpen = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly defaultOpen = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly defaultValue = input<TngDateSelectionInput<TDate> | undefined>(undefined);
  public readonly direction = input<TngDatepickerDirection>('ltr');
  public readonly disableDate = input<((date: TDate) => boolean) | null>(null);
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly fullWidth = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly id = input<string | null>(null);
  public readonly inputAriaLabel = input<string>('Date input');
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly locale = input<string>(this.defaultLocale);
  public readonly maxDate = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly minDate = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly open = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  public readonly overlayRuntime = input<TngOverlayRuntime | null | undefined>(undefined);
  public readonly overlayMinSize = input<number, number | string>(288, {
    transform: normalizeNumberInput,
  });
  public readonly overlaySize = input<number, number | string>(320, {
    transform: normalizeNumberInput,
  });
  public readonly placement = input<TngDatepickerPlacement>('auto');
  public readonly placeholder = input<string>('MM-DD-YYYY');
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');
  public readonly selectionMode = input<TngDatepickerSelectionMode>('single');
  public readonly showOutsideDays = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly today = input<TngDateInputValue<TDate> | undefined>(undefined);
  public readonly trapFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly value = model<TngDateSelectionInput<TDate> | undefined>(undefined);
  public readonly weekStartsOn = input<TngWeekdayIndex, TngWeekdayIndex | number | string>(0, {
    transform: normalizeWeekdayInput,
  });
  public readonly yearPageSize = input<number, number | string>(24, {
    transform: normalizeNumberInput,
  });

  public readonly activeDateChange = output<TDate>();
  public readonly closed = output<TngDatepickerCloseReason>();
  public readonly monthChange = output<TDate>();
  public readonly openChange = output<boolean>();
  public readonly viewChange = output<TngCalendarView>();
  public readonly yearChange = output<number>();

  protected readonly outputs = computed(() => {
    this.renderVersion();
    return this.controller.getOutputs();
  });

  protected readonly invalidState = computed(
    () => this.invalid() || this.outputs().validationError !== null,
  );
  protected readonly overlayCollision = computed(() =>
    this.resolveOverlayCollision(this.placement()),
  );
  protected readonly overlayPlacement = computed(() =>
    this.resolveOverlayPlacement(this.placement()),
  );
  protected readonly overlayThemeSource = this.hostElement.nativeElement;

  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostElement.nativeElement,
    focusableSelector: 'input[data-slot="datepicker-input"]',
    controlKind: 'text',
    isDisabled: () => this.disabled(),
    isFocused: () => this.isFocusWithinHost(),
    isInvalid: () => this.invalidState(),
    isRequired: () => this.required(),
  });

  protected readonly materialPeriodLabel = computed(() => {
    const outputs = this.outputs();
    if (outputs.view === 'year') {
      const startYear = outputs.yearOptions[0]?.year;
      const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
      if (startYear !== undefined && endYear !== undefined) {
        return `${startYear} - ${endYear}`;
      }
    }

    if (outputs.view === 'month') {
      return this.controller.formatDate(outputs.visibleMonth, 'year-label');
    }

    return outputs.labelMonthYear;
  });

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }

  public constructor() {
    effect(() => {
      const anchor = this.anchorRef()?.nativeElement ?? null;
      this.controller.registerAnchor(anchor);
    });

    effect(() => {
      const trigger = this.triggerRef()?.nativeElement ?? null;
      this.controller.registerTrigger(trigger);
    });

    effect(() => {
      this.controller.setConfig({
        adapter: this.adapter(),
        allowDeselect: this.allowDeselect(),
        allowManualInput: this.allowManualInput(),
        ariaDescribedBy: this.ariaDescribedBy(),
        ariaLabel: this.ariaLabel(),
        ariaLabelledBy: this.ariaLabelledBy(),
        autoCommitView: this.autoCommitView(),
        closeOnEscape: this.closeOnEscape(),
        closeOnOutsideClick: this.closeOnOutsideClick(),
        closeOnSelect: this.closeOnSelect(),
        closeOthersOnOpen: this.closeOthersOnOpen(),
        direction: this.direction(),
        disableDate: this.disableDate() ?? undefined,
        disabled: this.disabled(),
        id: this.id() ?? undefined,
        locale: this.locale(),
        maxDate: this.maxDate(),
        minDate: this.minDate(),
        overlaySize: this.overlaySize(),
        overlayRuntime: this.overlayRuntime(),
        ownerDocument: this.ownerDocument,
        restoreFocus: this.restoreFocus(),
        selectionMode: this.selectionMode(),
        showOutsideDays: this.showOutsideDays(),
        today: this.today(),
        trapFocus: this.trapFocus(),
        weekStartsOn: this.weekStartsOn(),
        yearPageSize: this.yearPageSize(),
      });

      const controlledValue = this.value();
      if (controlledValue !== undefined) {
        this.controller.setValue(controlledValue);
      }

      const controlledOpen = this.open();
      if (controlledOpen !== undefined) {
        this.controller.setOpen(controlledOpen);
      }

      if (!this.appliedInitialState) {
        if (controlledValue === undefined && this.defaultValue() !== undefined) {
          this.controller.setValue(this.defaultValue() as TngDateSelectionInput<TDate>);
        }

        if (controlledOpen === undefined && this.defaultOpen()) {
          this.controller.setOpen(true);
        }

        this.appliedInitialState = true;
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
    this.controller.destroy();
  }

  public clear(): void {
    this.controller.clear();
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  public close(reason: TngDatepickerCloseReason = 'programmatic'): void {
    this.controller.close(reason);
  }

  public openDatepicker(): void {
    this.controller.open();
  }

  public focus(): void {
    this.hostElement.nativeElement
      .querySelector<HTMLInputElement>('input[data-slot="datepicker-input"]')
      ?.focus();
  }

  public showDaysPanel(): void {
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  public showMonthsPanel(): void {
    this.controller.showMonthsPanel();
    this.queueOverlayFocusSync();
  }

  public showYearsPanel(): void {
    this.controller.showYearsPanel();
    this.queueOverlayFocusSync();
  }

  public toggleOpen(): void {
    this.controller.toggleOpen();
  }

  protected resolveInputId(): string {
    const id = this.id()?.trim();
    if (id !== undefined && id !== '') {
      return `${id}-input`;
    }

    return this.fallbackInputId;
  }

  protected isDayView(): boolean {
    return this.outputs().view === 'day';
  }

  protected isMonthView(): boolean {
    return this.outputs().view === 'month';
  }

  protected isYearView(): boolean {
    return this.outputs().view === 'year';
  }

  private isFocusWithinHost(): boolean {
    const activeElement = this.ownerDocument?.activeElement;
    return activeElement !== null && activeElement !== undefined
      ? this.hostElement.nativeElement.contains(activeElement)
      : false;
  }

  protected onDayCellClick(cell: Readonly<TngDateCell<TDate>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.handleCellClick(cell.date);
  }

  protected onInputBlur(): void {
    if (!this.allowManualInput()) {
      return;
    }

    this.controller.commitInputText();
    this.renderVersion.update((value) => value + 1);
  }

  protected onInputChange(event: Event): void {
    if (!this.allowManualInput()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.controller.setInputText(target.value);
    this.renderVersion.update((value) => value + 1);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && this.outputs().open) {
      this.controller.suppressFocusRestoreOnClose();
      this.controller.close('programmatic');
      return;
    }

    if (event.key === 'Enter' && this.allowManualInput()) {
      event.preventDefault();
      if (!this.outputs().open) {
        this.suppressNextOverlayFocusSync = true;
        this.controller.open();
        const target = event.target;
        if (target instanceof HTMLInputElement) {
          target.focus();
        }
        this.renderVersion.update((value) => value + 1);
        return;
      }

      this.controller.commitInputText();
      this.renderVersion.update((value) => value + 1);
      return;
    }

    if (
      this.outputs().open &&
      this.isDayView() &&
      (event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      this.controller.handleGridKeyDown(event);
      this.queueOverlayFocusSync();
      this.renderVersion.update((value) => value + 1);
      return;
    }

    if (event.key === 'ArrowDown' && !this.outputs().open) {
      event.preventDefault();
      this.controller.open();
    }
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.controller.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthKeydown(event: KeyboardEvent): void {
    this.controller.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.controller.showDaysPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthOptionClick(option: Readonly<TngMonthOption<TDate>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectMonth(option.index);
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  protected onTriggerClick(): void {
    if (this.disabled()) {
      return;
    }

    this.controller.toggleOpen();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    this.controller.handleTriggerKeyDown(event);
  }

  protected onPeriodButtonClick(): void {
    if (this.isYearView()) {
      return;
    }

    this.controller.showYearsPanel();
    this.queueOverlayFocusSync();
  }

  protected onYearKeydown(event: KeyboardEvent): void {
    this.controller.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.controller.showMonthsPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onYearOptionClick(option: Readonly<TngYearOption<TDate>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectYear(option.year);
    this.controller.showMonthsPanel();
    this.queueOverlayFocusSync();
  }

  protected pageBackward(): void {
    if (this.isDayView()) {
      this.controller.prevMonth();
      this.queueOverlayFocusSync();
      return;
    }

    if (this.isMonthView() || this.isYearView()) {
      this.controller.prevYear();
      this.queueOverlayFocusSync();
      return;
    }
  }

  protected pageForward(): void {
    if (this.isDayView()) {
      this.controller.nextMonth();
      this.queueOverlayFocusSync();
      return;
    }

    if (this.isMonthView() || this.isYearView()) {
      this.controller.nextYear();
      this.queueOverlayFocusSync();
      return;
    }
  }

  private queueOverlayFocusSync(): void {
    queueMicrotask(() => {
      const focusActiveTarget = (): void => {
        const outputs = this.outputs();
        if (!outputs.open || this.ownerDocument === null) {
          return;
        }

        const targetId = this.resolveCurrentFocusTargetId(outputs);
        if (targetId === null) {
          return;
        }

        const target = this.ownerDocument.getElementById(targetId);
        if (!isKeyboardEventTarget(target)) {
          return;
        }

        target.focus();
      };

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          focusActiveTarget();
        });
        return;
      }

      setTimeout(() => {
        focusActiveTarget();
      }, 0);
    });
  }

  private resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<TDate>): string | null {
    if (outputs.view === 'day') {
      return outputs.cells.find((cell) => cell.active)?.id ?? null;
    }

    if (outputs.view === 'month') {
      return outputs.monthOptions.find((option) => option.active)?.id ?? null;
    }

    if (outputs.view === 'year') {
      return outputs.yearOptions.find((option) => option.active)?.id ?? null;
    }

    return null;
  }

  private shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
    return (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'PageUp' ||
      key === 'PageDown' ||
      key === 'Enter' ||
      key === ' ' ||
      key === 'Escape'
    );
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }

  private resolveOverlayCollision(placement: TngDatepickerPlacement): TngOverlayCollisionOptions {
    return {
      flip: placement === 'auto',
      padding: OVERLAY_VIEWPORT_MARGIN,
      shift: true,
    };
  }

  private resolveOverlayPlacement(placement: TngDatepickerPlacement): TngOverlayPlacement {
    return {
      align: 'end',
      side: placement === 'top' ? 'top' : 'bottom',
    };
  }
}
