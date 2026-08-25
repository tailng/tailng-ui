import {
  Component,
  ElementRef,
  HostBinding,
  LOCALE_ID,
  computed,
  effect,
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
  createDateRangePickerController,
  TngDateRangePickerOverlay,
  type TngCalendarView,
  type TngDateCell,
  type TngDateAdapter,
  type TngDateRangePickerCalendarLayout,
  type TngDateRangePickerConfig,
  type TngDateRangePickerCloseReason,
  type TngDateRangePickerDirection,
  type TngDateRangePickerEvent,
  type TngDateRangePickerOutputs,
  type TngMonthOption,
  type TngWeekdayIndex,
  type TngYearOption,
} from '@tailng-ui/primitives';

type OptionalBooleanInput = boolean | null | string | undefined;
type TngDateRangePickerPlacement = 'auto' | 'bottom' | 'top';
export type TngDateRangePickerComponentCalendarLayout =
  | TngDateRangePickerCalendarLayout
  | 'responsive';
export type TngDateRangePickerDateInputValue<TDate> = Date | TDate | string | null | undefined;
export type TngDateRangePickerSelectionInput<TDate> =
  | TngDateRangePickerDateInputValue<TDate>
  | Readonly<{
      end: TngDateRangePickerDateInputValue<TDate>;
      start: TngDateRangePickerDateInputValue<TDate>;
    }>;
export type TngDateRangePickerValue<TDate> = Readonly<{
  end: TDate | null;
  start: TDate | null;
}> | null;

const OVERLAY_VIEWPORT_MARGIN = 12;
const RESPONSIVE_CALENDAR_QUERY = '(max-width: 40rem)';
const SINGLE_OVERLAY_MIN_SIZE = 288;
const SINGLE_OVERLAY_MAX_SIZE = 320;
const DUAL_OVERLAY_MIN_SIZE = 592;
const DUAL_OVERLAY_MAX_SIZE = 656;
const OVERLAY_FOCUS_SYNC_KEYS: ReadonlySet<string> = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Enter',
  ' ',
  'Escape',
]);

function normalizeOptionalBooleanInput(value: OptionalBooleanInput): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return booleanAttribute(value);
}

function normalizeNumberInput(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeOptionalNumberInput(
  value: number | string | null | undefined,
): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const normalized = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(normalized) ? normalized : undefined;
}

function normalizeWeekdayInput(value: number | string): TngWeekdayIndex {
  const normalized = Math.max(0, Math.min(6, Math.trunc(normalizeNumberInput(value))));
  return normalized as TngWeekdayIndex;
}

function isKeyboardEventTarget(value: EventTarget | null): value is HTMLElement {
  return value instanceof HTMLElement;
}

let nextDateRangePickerInputId = 0;

function createDateRangePickerInputId(): string {
  nextDateRangePickerInputId += 1;
  return `tng-date-range-picker-input-${nextDateRangePickerInputId}`;
}

@Component({
  selector: 'tng-date-range-picker',
  imports: [TngDateRangePickerOverlay],
  templateUrl: './tng-date-range-picker.component.html',
  styleUrl: './tng-date-range-picker.component.css',
})
export class TngDateRangePickerComponent<TDate = Date>
  implements FormValueControl<TngDateRangePickerSelectionInput<TDate> | undefined>, OnDestroy
{
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly defaultLocale = inject(LOCALE_ID);
  private readonly fallbackInputId = createDateRangePickerInputId();
  private readonly ownerDocument = this.hostElement.nativeElement.ownerDocument ?? null;
  private readonly ownerWindow = this.ownerDocument?.defaultView ?? null;
  private readonly responsiveCalendarMedia =
    this.ownerWindow?.matchMedia?.(RESPONSIVE_CALENDAR_QUERY) ?? null;
  private readonly responsiveCalendarIsSingle = signal(
    this.responsiveCalendarMedia?.matches ??
      (this.ownerWindow === null || this.ownerWindow.innerWidth <= 640),
  );
  private readonly renderVersion = signal(0);
  private readonly anchorRef = viewChild<ElementRef<HTMLElement>>('anchorShell');
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private appliedInitialState = false;
  private readonly pickerCalendarIndex = signal(0);
  private readonly onResponsiveCalendarChange = (event: MediaQueryListEvent): void => {
    this.responsiveCalendarIsSingle.set(event.matches);
  };
  private readonly onResponsiveWindowResize = (): void => {
    if (this.responsiveCalendarMedia === null && this.ownerWindow !== null) {
      this.responsiveCalendarIsSingle.set(this.ownerWindow.innerWidth <= 640);
    }
  };
  protected readonly controller = createDateRangePickerController<TDate>({
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
  private readonly unsubscribe = this.controller.subscribe((event) =>
    this.handleControllerEvent(event),
  );

  public readonly adapter = input<TngDateAdapter<TDate> | undefined>(undefined);
  public readonly allowManualInput = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledBy = input<string | null>(null);
  public readonly autoCommitView = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly calendarLayout = input<TngDateRangePickerComponentCalendarLayout>('single');
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
  public readonly defaultValue = input<TngDateRangePickerSelectionInput<TDate> | undefined>(
    undefined,
  );
  public readonly direction = input<TngDateRangePickerDirection>('ltr');
  public readonly disableDate = input<((date: TDate) => boolean) | null>(null);
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly enableRangeSelection = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly enableTypeahead = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly fixedWeeks = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly fullWidth = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly id = input<string | null>(null);
  public readonly inputAriaLabel = input<string>('Date range input');
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly locale = input<string>(this.defaultLocale);
  public readonly maxDate = input<TngDateRangePickerDateInputValue<TDate> | undefined>(undefined);
  public readonly minDate = input<TngDateRangePickerDateInputValue<TDate> | undefined>(undefined);
  public readonly open = input<boolean | undefined, OptionalBooleanInput>(undefined, {
    transform: normalizeOptionalBooleanInput,
  });
  public readonly overlayRuntime = input<TngOverlayRuntime | null | undefined>(undefined);
  public readonly overlayMinSize = input<number | undefined, number | string | null | undefined>(
    undefined,
    {
      transform: normalizeOptionalNumberInput,
    },
  );
  public readonly overlaySize = input<number | undefined, number | string | null | undefined>(
    undefined,
    { transform: normalizeOptionalNumberInput },
  );
  public readonly onPartialInputCommit = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly placement = input<TngDateRangePickerPlacement>('auto');
  public readonly placeholder = input<string>('MM-DD-YYYY - MM-DD-YYYY');
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly restoreFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');
  public readonly showOutsideDays = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly skipDisabled = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly today = input<TngDateRangePickerDateInputValue<TDate> | undefined>(undefined);
  public readonly trapFocus = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly value = model<TngDateRangePickerSelectionInput<TDate> | undefined>(undefined);
  public readonly weekStartsOn = input<TngWeekdayIndex, number | string>(0, {
    transform: normalizeWeekdayInput,
  });
  public readonly yearPageSize = input<number, number | string>(24, {
    transform: normalizeNumberInput,
  });

  public readonly activeDateChange = output<TDate>();
  public readonly closed = output<TngDateRangePickerCloseReason>();
  public readonly monthChange = output<TDate>();
  public readonly openChange = output<boolean>();
  public readonly previewEndDateChange = output<TDate>();
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
  protected readonly resolvedCalendarLayout = computed<TngDateRangePickerCalendarLayout>(() => {
    const layout = this.calendarLayout();
    if (layout !== 'responsive') {
      return layout;
    }

    return this.responsiveCalendarIsSingle() ? 'single' : 'dual';
  });
  protected readonly resolvedOverlayMinSize = computed(
    () =>
      this.overlayMinSize() ??
      (this.resolvedCalendarLayout() === 'dual' ? DUAL_OVERLAY_MIN_SIZE : SINGLE_OVERLAY_MIN_SIZE),
  );
  protected readonly resolvedOverlaySize = computed(
    () =>
      this.overlaySize() ??
      (this.resolvedCalendarLayout() === 'dual' ? DUAL_OVERLAY_MAX_SIZE : SINGLE_OVERLAY_MAX_SIZE),
  );
  protected readonly overlayThemeSource = this.hostElement.nativeElement;

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
    this.responsiveCalendarMedia?.addEventListener('change', this.onResponsiveCalendarChange);
    if (this.responsiveCalendarMedia === null) {
      this.ownerWindow?.addEventListener('resize', this.onResponsiveWindowResize);
    }

    effect(() => {
      const anchor = this.anchorRef()?.nativeElement ?? null;
      this.controller.registerAnchor(anchor);
    });

    effect(() => {
      this.syncTrigger();
    });

    effect(() => {
      this.syncControllerInputs();
    });
  }

  // eslint-disable-next-line complexity -- Event fan-out mirrors the primitive controller event union.
  private handleControllerEvent(event: TngDateRangePickerEvent<TDate>): void {
    this.renderVersion.update((value) => value + 1);

    switch (event.type) {
      case 'activeChange':
        this.activeDateChange.emit(event.activeDate);
        break;
      case 'closeStart':
      case 'openStart':
        break;
      case 'closed':
        this.restorePickerCalendarPosition();
        this.openChange.emit(false);
        this.closed.emit(event.reason);
        break;
      case 'monthChange':
        this.monthChange.emit(event.visibleMonth);
        break;
      case 'opened':
        this.openChange.emit(true);
        this.queueOverlayFocusSync();
        break;
      case 'previewChange':
        this.previewEndDateChange.emit(event.previewEndDate);
        break;
      case 'valueChange':
        this.value.set(event.value);
        break;
      case 'validationChange':
        break;
      case 'viewChange':
        if (event.view === 'day') {
          this.restorePickerCalendarPosition();
        }
        this.viewChange.emit(event.view);
        break;
      case 'yearChange':
        this.yearChange.emit(event.year);
        break;
    }
  }

  private syncTrigger(): void {
    const trigger = this.triggerRef()?.nativeElement ?? null;
    this.controller.registerTrigger(trigger);
  }

  private syncControllerInputs(): void {
    const previousCalendarLayout = this.controller.getOutputs().calendarLayout;
    this.controller.setConfig(this.getControllerConfig());

    const controlledValue = this.value();
    if (controlledValue !== undefined) {
      this.controller.setValue(controlledValue);
    }

    const controlledOpen = this.open();
    if (controlledOpen !== undefined) {
      this.controller.setOpen(controlledOpen);
    }

    this.applyInitialState(controlledValue, controlledOpen);
    const calendarLayoutChanged =
      previousCalendarLayout !== this.controller.getOutputs().calendarLayout;
    this.renderVersion.update((value) => value + 1);
    if (calendarLayoutChanged) {
      this.queueOverlayFocusSync();
    }
  }

  private getControllerConfig(): Partial<TngDateRangePickerConfig<TDate>> {
    return {
      adapter: this.adapter(),
      allowManualInput: this.allowManualInput(),
      ariaDescribedBy: this.ariaDescribedBy(),
      ariaLabel: this.ariaLabel(),
      ariaLabelledBy: this.ariaLabelledBy(),
      autoCommitView: this.autoCommitView(),
      calendarLayout: this.resolvedCalendarLayout(),
      closeOnEscape: this.closeOnEscape(),
      closeOnOutsideClick: this.closeOnOutsideClick(),
      closeOnSelect: this.closeOnSelect(),
      closeOthersOnOpen: this.closeOthersOnOpen(),
      direction: this.direction(),
      disableDate: this.disableDate() ?? undefined,
      disabled: this.disabled(),
      enableRangeSelection: this.enableRangeSelection(),
      enableTypeahead: this.enableTypeahead(),
      fixedWeeks: this.fixedWeeks(),
      id: this.id() ?? undefined,
      locale: this.locale(),
      maxDate: this.maxDate(),
      minDate: this.minDate(),
      onPartialInputCommit: this.onPartialInputCommit(),
      overlaySize: this.resolvedOverlaySize(),
      overlayRuntime: this.overlayRuntime(),
      ownerDocument: this.ownerDocument,
      restoreFocus: this.restoreFocus(),
      showOutsideDays: this.showOutsideDays(),
      skipDisabled: this.skipDisabled(),
      today: this.today(),
      trapFocus: this.trapFocus(),
      weekStartsOn: this.weekStartsOn(),
      yearPageSize: this.yearPageSize(),
    };
  }

  private applyInitialState(
    controlledValue: TngDateRangePickerSelectionInput<TDate> | undefined,
    controlledOpen: boolean | undefined,
  ): void {
    if (this.appliedInitialState) {
      return;
    }

    const defaultValue = this.defaultValue();
    if (controlledValue === undefined && defaultValue !== undefined) {
      this.controller.setValue(defaultValue);
    }

    if (controlledOpen === undefined && this.defaultOpen()) {
      this.controller.setOpen(true);
    }

    this.appliedInitialState = true;
  }

  public ngOnDestroy(): void {
    this.responsiveCalendarMedia?.removeEventListener('change', this.onResponsiveCalendarChange);
    this.ownerWindow?.removeEventListener('resize', this.onResponsiveWindowResize);
    this.unsubscribe();
    this.controller.destroy();
  }

  public clear(): void {
    this.controller.clear();
    this.controller.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  public close(reason: TngDateRangePickerCloseReason = 'programmatic'): void {
    this.controller.close(reason);
  }

  public openDateRangePicker(): void {
    this.controller.open();
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

  protected onDayCellClick(cell: Readonly<TngDateCell<TDate>>, calendarIndex: number): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.selectCalendarDate(cell.date, calendarIndex, { trigger: 'pointer' });
  }

  protected onDayCellPointerEnter(cell: Readonly<TngDateCell<TDate>>, calendarIndex: number): void {
    if (cell.disabled || cell.hidden) {
      return;
    }
    if (this.outputs().calendarLayout === 'dual' && calendarIndex === 0) {
      return;
    }

    this.controller.handleCellPointerEnter(cell.date);
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
        this.controller.open();
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
      this.restorePickerCalendarPosition();
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
    this.restorePickerCalendarPosition();
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

  protected onCalendarPeriodButtonClick(calendarIndex: number): void {
    this.pickerCalendarIndex.set(calendarIndex);
    if (calendarIndex > 0) {
      const calendar = this.outputs().calendars[calendarIndex];
      if (calendar !== undefined) {
        this.controller.setVisibleMonth(calendar.visibleMonth);
      }
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

  private restorePickerCalendarPosition(): void {
    if (this.resolvedCalendarLayout() !== 'dual' || this.pickerCalendarIndex() !== 1) {
      this.pickerCalendarIndex.set(0);
      return;
    }

    const activeDate = this.outputs().activeDate;
    this.controller.prevMonth();
    this.controller.setActiveDate(activeDate);
    this.pickerCalendarIndex.set(0);
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

  private resolveCurrentFocusTargetId(outputs: TngDateRangePickerOutputs<TDate>): string | null {
    const activeTargetByView = {
      day: outputs.calendars
        .flatMap((calendar) => calendar.cells)
        .find((cell) => cell.active && !cell.hidden),
      month: outputs.monthOptions.find((option) => option.active),
      year: outputs.yearOptions.find((option) => option.active),
    };

    return activeTargetByView[outputs.view]?.id ?? null;
  }

  private shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
    return OVERLAY_FOCUS_SYNC_KEYS.has(key);
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }

  private resolveOverlayCollision(
    placement: TngDateRangePickerPlacement,
  ): TngOverlayCollisionOptions {
    return {
      flip: placement === 'auto',
      padding: OVERLAY_VIEWPORT_MARGIN,
      shift: true,
    };
  }

  private resolveOverlayPlacement(placement: TngDateRangePickerPlacement): TngOverlayPlacement {
    return {
      align: 'end',
      side: placement === 'top' ? 'top' : 'bottom',
    };
  }
}
