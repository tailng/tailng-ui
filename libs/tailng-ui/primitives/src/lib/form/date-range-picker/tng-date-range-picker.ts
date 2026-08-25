import {
  createActiveDescendantController,
  createOverlayFocusHandoffController,
  createRovingFocusController,
  createTngIdFactory,
  createTypeaheadController,
  resolveFocusableElements,
  resolveGridNavigationKeyAction,
  resolveNavigableGridCell,
  type TngActiveDescendantController,
  type TngGridNavigationActionType,
  type TngOverlayDismissReason,
  type TngRovingFocusController,
} from '@tailng-ui/cdk';
import type { TngOverlayInteractionDomDocument } from '@tailng-ui/cdk/overlay';
import { createOverlayRuntime, type TngOverlayRuntime } from '@tailng-ui/cdk/runtime';
import {
  coerceWeekStartsOn,
  defaultDateRangePickerDateAdapter,
  normalizeDateInput,
} from './date-range-picker.adapters';
import {
  buildMonthGrid,
  buildMonthOptions,
  buildYearOptions,
  clampDateToMonth,
  compareMonthIdentity,
  datesEqual,
  findFirstEnabledDateInMonth,
  hasSelectableDateInMonth,
  hasSelectableDateInYear,
  isDateValueInMonth,
  moveDateSkippingDisabled,
  normalizeRangeOrder,
  resolveInitialFocusedSection,
  resolveLocaleWeekStartsOn,
  resolveViewForEscape,
  resolveWeekBoundaryDate,
  toDateKey,
} from './date-range-picker.utils';
import {
  clearSelectionForMode,
  normalizeSelectionInput,
  rangeIncludesDate,
  selectionValuesEqual,
  valueIncludesDate,
} from './date-range-picker.state';
import type {
  TngCalendarView,
  TngDateAdapter,
  TngDateCell,
  TngDateFormatToken,
  TngDateInputValue,
  TngDateRange,
  TngDateRangeValue,
  TngDateRangePickerCalendarLayout,
  TngDateRangePickerCalendarPanel,
  TngDateSelectionInput,
  TngDateValue,
  TngDateRangePickerAttributeMap,
  TngDateRangePickerCloseReason,
  TngDateRangePickerConfig,
  TngDateRangePickerController,
  TngDateRangePickerDirection,
  TngDateRangePickerEvent,
  TngDateRangePickerFocusedSection,
  TngDateRangePickerFocusStrategy,
  TngDateRangePickerLayout,
  TngDateRangePickerListener,
  TngDateRangePickerOverlayRuntime,
  TngDateRangePickerOutputs,
  TngDateRangePickerOverlayMode,
  TngDateRangePickerPosition,
  TngDateRangePickerSelectionMode,
  TngDateRangePickerState,
  TngDateRangePickerStatePatch,
  TngDateRangePickerTrigger,
  TngMonthOption,
  TngWeekdayIndex,
  TngYearOption,
} from './date-range-picker.types';

type TngResolvedConfig<TDate> = Readonly<{
  adapter: Readonly<TngDateAdapter<TDate>>;
  allowManualInput: boolean;
  ariaDescribedBy: string | null;
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  autoCommitView: boolean;
  calendarLayout: TngDateRangePickerCalendarLayout;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  closeOnSelect: boolean;
  closeOthersOnOpen: boolean;
  direction: TngDateRangePickerDirection;
  disableDate: ((date: TDate) => boolean) | null;
  disabled: boolean;
  enableRangeSelection: boolean;
  enableTypeahead: boolean;
  fixedWeeks: boolean;
  focusStrategy: TngDateRangePickerFocusStrategy;
  id: string;
  initialView: TngCalendarView;
  locale: string;
  max: TDate | null;
  min: TDate | null;
  onPartialInputCommit: boolean;
  overlayMode: TngDateRangePickerOverlayMode;
  overlayRuntime: TngOverlayRuntime | null;
  overlaySize: number;
  ownerDocument: Document | null;
  position: TngDateRangePickerPosition;
  preserveViewOnOpenClose: boolean;
  restoreFocus: boolean;
  selectionMode: TngDateRangePickerSelectionMode;
  showOutsideDays: boolean;
  skipDisabled: boolean;
  today: TDate;
  trapFocus: boolean;
  value: TngDateValue<TDate>;
  weekStartsOn: TngWeekdayIndex;
  yearPageSize: number;
}>;

type TngMutableState<TDate> = {
  activeDate: TDate;
  disabled: boolean;
  focusedSection: TngDateRangePickerFocusedSection;
  inputText: string;
  lastCloseReason: TngDateRangePickerCloseReason | null;
  open: boolean;
  validationError: string | null;
  value: TngDateValue<TDate>;
  view: TngCalendarView;
  visibleMonth: TDate;
};

type TngKeyboardEventLike = Readonly<
  Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
>;

const createDateRangePickerId = createTngIdFactory('tng-date-range-picker');
const createDateRangePickerFocusableId = createTngIdFactory('tng-date-range-picker-focusable');
const dateRangePickerRegistry = new Set<DateRangePickerController<unknown>>();
const dateRangePickerFocusHandoff = createOverlayFocusHandoffController();
const emptyWeekdayLabels = Object.freeze([]) as readonly string[];
const emptyCells = Object.freeze([]) as readonly TngDateCell<unknown>[];
const emptyCalendarPanels = Object.freeze(
  [],
) as readonly TngDateRangePickerCalendarPanel<unknown>[];
const emptyMonths = Object.freeze([]) as readonly TngMonthOption<unknown>[];
const emptyYears = Object.freeze([]) as readonly TngYearOption<unknown>[];

function freezeAttributes(
  attributes: Readonly<Record<string, string | null | undefined>>,
): TngDateRangePickerAttributeMap {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    normalized[key] = value;
  }
  return Object.freeze(normalized);
}

function mapOverlayDismissReason(reason: TngOverlayDismissReason): TngDateRangePickerCloseReason {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer' || reason === 'focus-outside') {
    return 'outside';
  }

  return 'programmatic';
}

function hasDisallowedModifiers(
  event: Readonly<Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey'>>,
): boolean {
  return event.altKey === true || event.ctrlKey === true || event.metaKey === true;
}

function normalizeView(value: string | undefined): TngCalendarView {
  return value === 'month' || value === 'year' ? value : 'day';
}

function normalizeCalendarLayout(value: string | undefined): TngDateRangePickerCalendarLayout {
  return value === 'dual' ? 'dual' : 'single';
}

function normalizePosition(value: string | undefined): TngDateRangePickerPosition {
  return value === 'center' || value === 'end' ? value : 'start';
}

function normalizeOverlayMode(value: string | undefined): TngDateRangePickerOverlayMode {
  return value === 'push' || value === 'side' ? value : 'overlay';
}

function normalizeDirection(value: string | undefined): TngDateRangePickerDirection {
  return value === 'rtl' ? 'rtl' : 'ltr';
}

function resolveDefaultLocale(ownerDocument: Document | null | undefined): string {
  const documentLocale = ownerDocument?.documentElement?.lang?.trim();
  if (documentLocale !== undefined && documentLocale !== '') {
    return documentLocale;
  }

  const navigatorLocale =
    ownerDocument?.defaultView?.navigator.languages[0] ??
    ownerDocument?.defaultView?.navigator.language;
  if (typeof navigatorLocale === 'string' && navigatorLocale.trim() !== '') {
    return navigatorLocale;
  }

  const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  if (intlLocale.trim() !== '') {
    return intlLocale;
  }

  return 'en-US';
}

function ensureYearPageSize(value: number | undefined): number {
  if (!Number.isFinite(value) || value === undefined) {
    return 24;
  }

  return Math.max(12, Math.trunc(value));
}

function isRangeSelectionValue<TDate>(value: TngDateValue<TDate>): value is TngDateRange<TDate> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'start') &&
    Object.prototype.hasOwnProperty.call(value, 'end')
  );
}

function getRangeStartDate<TDate>(value: TngDateValue<TDate>): TDate | null {
  return isRangeSelectionValue(value) ? value.start : null;
}

function getRangeEndDate<TDate>(value: TngDateValue<TDate>): TDate | null {
  return isRangeSelectionValue(value) ? value.end : null;
}

function hasCompleteRange<TDate>(value: TngDateValue<TDate>): boolean {
  return getRangeStartDate(value) !== null && getRangeEndDate(value) !== null;
}

const RANGE_INPUT_SEPARATOR = ' – ';

function splitRangeInputText(
  text: string,
): Readonly<{ endText: string; startText: string }> | null {
  const trimmed = text.trim();
  if (!trimmed.includes(RANGE_INPUT_SEPARATOR)) {
    return null;
  }

  const parts = trimmed.split(RANGE_INPUT_SEPARATOR);
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return null;
  }

  return { endText: parts[1], startText: parts[0] };
}

function hasPartialRange<TDate>(value: TngDateValue<TDate>): boolean {
  return getRangeStartDate(value) !== null && getRangeEndDate(value) === null;
}

function readDocument(input: Document | null | undefined): TngOverlayInteractionDomDocument | null {
  return input as TngOverlayInteractionDomDocument | null;
}

class DateRangePickerController<TDate> implements TngDateRangePickerController<TDate> {
  private readonly instanceId: string;
  private readonly gridId: string;
  private readonly overlayId: string;
  private readonly monthLabelId: string;
  private readonly listenerSet = new Set<TngDateRangePickerListener<TDate>>();
  private readonly typeahead = createTypeaheadController({
    items: [],
    matchStrategy: 'start',
  });
  private readonly dayRovingFocus: TngRovingFocusController;
  private readonly monthRovingFocus: TngRovingFocusController;
  private readonly yearRovingFocus: TngRovingFocusController;
  private readonly dayActiveDescendant: TngActiveDescendantController;

  private config: TngResolvedConfig<TDate>;
  private state: TngMutableState<TDate>;
  private destroyed = false;
  private version = 0;
  private rangeAnchorDate: TDate | null = null;
  private focusVisibleDate: TDate | null = null;
  private hoverDate: TDate | null = null;
  private yearPageStart = 0;
  private cachedOutputsVersion = -1;
  private cachedOutputs: TngDateRangePickerOutputs<TDate> | null = null;
  private cachedWeekdayLabels: readonly string[] = emptyWeekdayLabels;
  private cachedCalendars: readonly TngDateRangePickerCalendarPanel<TDate>[] =
    emptyCalendarPanels as readonly TngDateRangePickerCalendarPanel<TDate>[];
  private cachedMonthOptions: readonly TngMonthOption<TDate>[] =
    emptyMonths as readonly TngMonthOption<TDate>[];
  private cachedYearOptions: readonly TngYearOption<TDate>[] =
    emptyYears as readonly TngYearOption<TDate>[];
  private cachedGridVersion = -1;
  private cachedMonthVersion = -1;
  private cachedYearVersion = -1;
  private triggerElement: HTMLElement | null = null;
  private anchorElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private restoreFocusTargetId: string | null = null;
  private focusLayerRegistered = false;
  private overlayLayerRegistered = false;
  private skipNextFocusRestore = false;

  public constructor(config: Readonly<TngDateRangePickerConfig<TDate>>) {
    this.instanceId = config.id?.trim() || createDateRangePickerId();
    this.gridId = `${this.instanceId}-grid`;
    this.overlayId = `${this.instanceId}-overlay`;
    this.monthLabelId = `${this.instanceId}-month-label`;
    this.dayRovingFocus = createRovingFocusController({ itemIds: [], loop: false });
    this.monthRovingFocus = createRovingFocusController({ itemIds: [], loop: false });
    this.yearRovingFocus = createRovingFocusController({ itemIds: [], loop: false });
    this.dayActiveDescendant = createActiveDescendantController({
      hostId: this.gridId,
      itemIds: [],
      loop: false,
    });
    this.config = this.resolveConfig(config, null);
    const initialActiveDate = this.resolveInitialActiveDate(this.config.value, this.config.today);
    const visibleMonth = this.resolveVisibleMonthForSelection(this.config.value, initialActiveDate);
    this.state = {
      activeDate: initialActiveDate,
      disabled: this.config.disabled,
      focusedSection: resolveInitialFocusedSection(this.config.initialView),
      inputText: this.formatValueForInput(this.config.value),
      lastCloseReason: null,
      open: config.defaultOpen ?? false,
      validationError: null,
      value: this.config.value,
      view: this.config.initialView,
      visibleMonth,
    };
    this.focusVisibleDate = initialActiveDate;
    this.yearPageStart = this.resolveCenteredYearPageStart(
      this.config.adapter.getYear(initialActiveDate),
    );
    this.rangeAnchorDate = this.extractSelectionAnchor(this.state.value);

    if (this.state.open) {
      const activeElement = this.resolveActiveElement();
      this.restoreFocusTargetId =
        activeElement === null ? null : this.ensureElementId(activeElement);
      this.registerOverlayLayer();
      this.activateFocusLayer();
    }

    dateRangePickerRegistry.add(this as unknown as DateRangePickerController<unknown>);
  }

  public clear(): void {
    if (this.destroyed) {
      return;
    }

    const previousValue = this.state.value;
    const nextValue = clearSelectionForMode<TDate>(this.config.selectionMode);
    if (
      selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)
    ) {
      return;
    }

    this.state.value = nextValue;
    this.rangeAnchorDate = null;
    this.hoverDate = null;
    this.state.validationError = null;
    this.state.inputText = this.formatValueForInput(nextValue);
    const nextActive = this.resolveInitialActiveDate(nextValue, this.config.today);
    this.applyActiveDate(nextActive, 'programmatic', true);
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger: 'programmatic',
      type: 'valueChange',
      value: nextValue,
    });
  }

  public close(reason: TngDateRangePickerCloseReason = 'programmatic'): void {
    if (this.destroyed || !this.state.open) {
      return;
    }

    this.emit({ reason, type: 'closeStart' });
    this.state.open = false;
    this.state.lastCloseReason = reason;
    this.hoverDate = null;
    this.unregisterOverlayLayer();
    this.deactivateFocusLayer();
    this.bumpVersion();
    this.emit({ reason, type: 'closed' });
  }

  public commitInputText(): boolean {
    if (this.destroyed || !this.config.allowManualInput) {
      return false;
    }

    const inputText = this.state.inputText.trim();
    const rangeParts = splitRangeInputText(inputText);
    if (rangeParts !== null) {
      return this.commitRangeInputText(rangeParts);
    }

    const parsed = this.config.adapter.parse(inputText, this.config.locale);
    if (parsed === null || !this.isStrictInputCommitValue(inputText, parsed)) {
      this.state.validationError = 'invalid-input';
      this.bumpVersion();
      return false;
    }

    if (this.isDateDisabled(parsed)) {
      this.state.validationError = 'out-of-range';
      this.bumpVersion();
      return false;
    }

    this.state.validationError = null;
    this.selectDate(parsed, { trigger: 'text-input' });
    return true;
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.unregisterOverlayLayer();
    this.unregisterFocusLayer();
    this.listenerSet.clear();
    dateRangePickerRegistry.delete(this as unknown as DateRangePickerController<unknown>);
  }

  public formatDate(date: TDate, format: TngDateFormatToken | string = 'label'): string {
    return this.config.adapter.format(date, format, this.config.locale);
  }

  public getOutputs(): TngDateRangePickerOutputs<TDate> {
    if (this.cachedOutputs !== null && this.cachedOutputsVersion === this.version) {
      return this.cachedOutputs;
    }

    const calendars = this.getCalendars();
    const leadingCalendar = calendars[0];
    const outputs: TngDateRangePickerOutputs<TDate> = Object.freeze({
      activeDate: this.state.activeDate,
      calendarLayout: this.config.calendarLayout,
      calendars,
      cells: leadingCalendar?.cells ?? (emptyCells as readonly TngDateCell<TDate>[]),
      endDate: getRangeEndDate(this.state.value),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      getCellAttributes: (cellOrDate) => this.resolveCellAttributes(cellOrDate),
      getGridAttributes: (calendarIndex = 0) => this.resolveGridAttributes(calendarIndex),
      getHostAttributes: () => this.resolveHostAttributes(),
      getMonthAttributes: (monthOrOption) => this.resolveMonthAttributes(monthOrOption),
      getOverlayAttributes: () => this.resolveOverlayAttributes(),
      getTriggerAttributes: () => this.resolveTriggerAttributes(),
      getYearAttributes: (yearOrOption) => this.resolveYearAttributes(yearOrOption),
      inputText: this.state.inputText,
      labelMonthYear:
        leadingCalendar?.labelMonthYear ??
        this.config.adapter.format(this.state.visibleMonth, 'month-year', this.config.locale),
      layout: this.resolveLayout(),
      monthOptions: this.getMonthOptions(),
      open: this.state.open,
      previewEndDate: this.hoverDate,
      startDate: getRangeStartDate(this.state.value),
      validationError: this.state.validationError,
      value: this.state.value,
      view: this.state.view,
      visibleMonth: this.state.visibleMonth,
      weekdayLabels: this.getWeekdayLabels(),
      yearOptions: this.getYearOptions(),
    });

    this.cachedOutputsVersion = this.version;
    this.cachedOutputs = outputs;
    return outputs;
  }

  public getState(): TngDateRangePickerState<TDate> {
    return Object.freeze({
      activeDate: this.state.activeDate,
      disabled: this.state.disabled,
      endDate: getRangeEndDate(this.state.value),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      inputText: this.state.inputText,
      lastCloseReason: this.state.lastCloseReason,
      open: this.state.open,
      previewEndDate: this.hoverDate,
      startDate: getRangeStartDate(this.state.value),
      validationError: this.state.validationError,
      value: this.state.value,
      view: this.state.view,
      visibleMonth: this.state.visibleMonth,
    });
  }

  public goToNextMonth(): void {
    this.nextMonth();
  }

  public goToPrevMonth(): void {
    this.prevMonth();
  }

  public handleCellClick(
    date: TngDateInputValue<TDate>,
    options: Readonly<{ shiftKey?: boolean }> = {},
  ): void {
    this.selectDate(date, {
      shiftKey: options.shiftKey,
      trigger: 'pointer',
    });
  }

  public handleCellPointerEnter(date: TngDateInputValue<TDate>): void {
    if (this.destroyed || this.rangeAnchorDate === null || hasCompleteRange(this.state.value)) {
      return;
    }

    const normalized = normalizeDateInput(this.config.adapter, date, this.config.locale);
    if (normalized === null || this.isDateDisabled(normalized)) {
      return;
    }

    const previousPreviewEndDate = this.hoverDate;
    if (
      previousPreviewEndDate !== null &&
      datesEqual(this.config.adapter, previousPreviewEndDate, normalized)
    ) {
      return;
    }

    this.hoverDate = normalized;
    this.bumpVersion();
    this.emit({
      previewEndDate: normalized,
      previousPreviewEndDate,
      trigger: 'pointer',
      type: 'previewChange',
    });
  }

  public handleGridKeyDown(event: Readonly<TngKeyboardEventLike>): void {
    if (this.destroyed || this.state.disabled) {
      return;
    }

    if (event.key === 'Escape') {
      if (this.state.open) {
        event.preventDefault();
        this.close('escape');
      }
      return;
    }

    if (this.handlePageNavigation(event)) {
      return;
    }

    const action = resolveGridNavigationKeyAction(event, {
      direction: this.config.direction,
    });
    if (action === null) {
      if (this.config.enableTypeahead) {
        this.handleTypeahead(event.key);
      }
      return;
    }

    if (action.preventDefault) {
      event.preventDefault();
    }

    if (action.type === 'exit') {
      return;
    }

    if (action.type === 'activate') {
      const activeCalendarIndex =
        this.getCalendars().find((calendar) =>
          calendar.cells.some((cell) => cell.active && !cell.hidden),
        )?.index ?? 0;
      this.selectCalendarDate(this.state.activeDate, activeCalendarIndex, {
        shiftKey: event.shiftKey === true,
        trigger: 'keyboard',
      });
      return;
    }

    this.handleResolvedDayGridAction(action.type, event.shiftKey === true);
  }

  public handleMonthGridKeyDown(event: Readonly<TngKeyboardEventLike>): void {
    this.handlePickerGridKeyDown(event, 'month');
  }

  public handleOverlayKeyDown(event: Readonly<TngKeyboardEventLike>): void {
    if (this.destroyed || !this.config.trapFocus || event.key !== 'Tab') {
      return;
    }

    const overlay = this.overlayElement;
    if (overlay === null || !dateRangePickerFocusHandoff.isTrapActive(this.instanceId)) {
      return;
    }

    const focusableMemberIds = this.resolveTabbableOverlayMemberIds(overlay);
    const firstMemberId = focusableMemberIds[0];
    if (firstMemberId === undefined) {
      return;
    }

    const lastMemberId = focusableMemberIds[focusableMemberIds.length - 1] ?? firstMemberId;
    const activeElement = this.resolveActiveElement();
    const activeElementId =
      activeElement !== null && overlay.contains(activeElement)
        ? this.ensureElementId(activeElement)
        : null;

    let candidateId: string | null = null;
    if (activeElementId === null) {
      candidateId = event.shiftKey ? lastMemberId : firstMemberId;
    } else if (activeElementId === firstMemberId && event.shiftKey) {
      candidateId = lastMemberId;
    } else if (activeElementId === lastMemberId && !event.shiftKey) {
      candidateId = firstMemberId;
    } else {
      dateRangePickerFocusHandoff.recordFocus(this.instanceId, activeElementId);
      return;
    }

    const resolvedId = dateRangePickerFocusHandoff.resolveFocusCandidate(
      this.instanceId,
      candidateId,
    );
    if (resolvedId === null) {
      return;
    }

    const nextFocusTarget = this.resolveElementById(resolvedId);
    if (nextFocusTarget === null) {
      return;
    }

    event.preventDefault();
    nextFocusTarget.focus();
    dateRangePickerFocusHandoff.recordFocus(this.instanceId, resolvedId);
  }

  public handleTriggerKeyDown(
    event: Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>,
  ): void {
    if (this.destroyed || this.state.disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.open();
    }
  }

  public handleYearGridKeyDown(event: Readonly<TngKeyboardEventLike>): void {
    this.handlePickerGridKeyDown(event, 'year');
  }

  public nextMonth(): void {
    this.shiftVisibleMonth(1);
  }

  public nextYear(): void {
    this.shiftVisibleYear(1);
  }

  public open(): void {
    if (this.destroyed || this.state.disabled || this.state.open) {
      return;
    }

    if (this.config.closeOthersOnOpen) {
      for (const controller of dateRangePickerRegistry) {
        if (controller === (this as unknown as DateRangePickerController<unknown>)) {
          continue;
        }
        controller.close('programmatic');
      }
    }

    this.emit({ previous: false, type: 'openStart' });
    this.state.open = true;
    const activeElement = this.resolveActiveElement();
    if (activeElement !== null) {
      this.restoreFocusTargetId = this.ensureElementId(activeElement);
    } else if (this.triggerElement !== null) {
      this.restoreFocusTargetId = this.ensureElementId(this.triggerElement);
    } else {
      this.restoreFocusTargetId = null;
    }
    this.state.lastCloseReason = null;
    if (!this.config.preserveViewOnOpenClose) {
      this.state.view = this.config.initialView;
      this.state.focusedSection = resolveInitialFocusedSection(this.state.view);
    }
    this.applyActiveDate(
      this.resolveInitialActiveDate(this.state.value, this.config.today),
      'programmatic',
      true,
    );
    this.registerOverlayLayer();
    this.activateFocusLayer();
    this.focusCurrentOverlayTarget();
    this.bumpVersion();
    this.emit({ next: true, previous: false, type: 'opened' });
  }

  public parseInputText(text: string): TDate | null {
    return this.config.adapter.parse(text, this.config.locale);
  }

  public prevMonth(): void {
    this.shiftVisibleMonth(-1);
  }

  public prevYear(): void {
    this.shiftVisibleYear(-1);
  }

  public registerOverlay(element: HTMLElement | null): void {
    this.overlayElement = element;
    if (this.state.open) {
      this.registerOverlayLayer();
      this.registerFocusLayer();
      this.activateFocusLayer();
      this.focusCurrentOverlayTarget();
      this.bumpVersion();
    } else if (element === null) {
      this.unregisterFocusLayer();
    }
  }

  public registerTrigger(element: HTMLElement | null): void {
    this.triggerElement = element;
  }

  public registerAnchor(element: HTMLElement | null): void {
    this.anchorElement = element;
  }

  public suppressFocusRestoreOnClose(): void {
    this.skipNextFocusRestore = true;
  }

  public selectDate(
    date: TngDateInputValue<TDate>,
    options: Readonly<{ shiftKey?: boolean; trigger?: TngDateRangePickerTrigger }> = {},
  ): void {
    if (this.destroyed || this.state.disabled) {
      return;
    }

    const normalized = normalizeDateInput(this.config.adapter, date, this.config.locale);
    if (normalized === null) {
      this.state.validationError = 'invalid-value';
      this.bumpVersion();
      return;
    }

    if (this.isDateDisabled(normalized)) {
      return;
    }

    const trigger = options.trigger ?? 'programmatic';
    const previousValue = this.state.value;
    this.state.validationError = null;
    const nextValue = this.resolveNextSelection(normalized, options.shiftKey === true);
    if (
      selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)
    ) {
      if (this.state.validationError !== null) {
        this.bumpVersion();
      }
      return;
    }

    this.state.value = nextValue;
    this.state.inputText = this.formatValueForInput(nextValue);
    this.rangeAnchorDate = this.extractSelectionAnchor(nextValue) ?? normalized;
    this.applyActiveDate(normalized, trigger, true);
    this.hoverDate = null;
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger,
      type: 'valueChange',
      value: nextValue,
    });

    if (this.config.closeOnSelect && this.state.open && hasCompleteRange(nextValue)) {
      this.close('select');
    }
  }

  public selectCalendarDate(
    date: TngDateInputValue<TDate>,
    calendarIndex: number,
    options: Readonly<{ shiftKey?: boolean; trigger?: TngDateRangePickerTrigger }> = {},
  ): void {
    if (this.config.calendarLayout !== 'dual') {
      this.selectDate(date, options);
      return;
    }

    if (this.destroyed || this.state.disabled) {
      return;
    }

    const normalized = normalizeDateInput(this.config.adapter, date, this.config.locale);
    if (normalized === null) {
      this.setCalendarValidationError('invalid-value');
      return;
    }

    if (this.isDateDisabled(normalized)) {
      return;
    }

    this.selectDualCalendarBoundary(
      normalized,
      calendarIndex === 1 ? 'end' : 'start',
      options.trigger ?? 'programmatic',
    );
  }

  public selectMonth(monthIndex: number): void {
    if (this.destroyed) {
      return;
    }

    const normalizedMonth = Math.max(0, Math.min(11, Math.trunc(monthIndex)));
    const nextMonth = this.config.adapter.createDate(
      this.config.adapter.getYear(this.state.visibleMonth),
      normalizedMonth,
      1,
    );
    if (
      !hasSelectableDateInMonth(this.config.adapter, nextMonth, (date) => this.isDateDisabled(date))
    ) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    this.state.visibleMonth = nextMonth;
    const nextActive = clampDateToMonth(this.config.adapter, this.state.activeDate, nextMonth);
    this.applyActiveDate(nextActive, 'programmatic', true);
    this.bumpVersion();
    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: nextMonth,
    });

    if (this.config.autoCommitView) {
      this.setView('day');
    }
  }

  public selectYear(year: number): void {
    if (this.destroyed) {
      return;
    }

    const normalizedYear = Math.trunc(year);
    if (
      !hasSelectableDateInYear(
        this.config.adapter,
        normalizedYear,
        this.state.visibleMonth,
        (date) => this.isDateDisabled(date),
      )
    ) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const preferredMonth = this.config.adapter.getMonth(previousMonth);
    const nextMonth = this.resolveNearestEnabledMonthInYear(normalizedYear, preferredMonth);
    if (nextMonth === null) {
      return;
    }
    const nextVisibleMonth = this.config.adapter.startOfMonth(nextMonth);
    this.state.visibleMonth = nextVisibleMonth;
    this.yearPageStart = this.resolveCenteredYearPageStart(normalizedYear);
    const nextActive = clampDateToMonth(
      this.config.adapter,
      this.state.activeDate,
      nextVisibleMonth,
    );
    this.applyActiveDate(nextActive, 'programmatic', true);
    this.bumpVersion();
    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: nextVisibleMonth,
    });
    this.emit({
      previousYear,
      type: 'yearChange',
      year: normalizedYear,
    });

    if (this.config.autoCommitView) {
      this.setView('day');
    }
  }

  private resolveNearestEnabledMonthInYear(year: number, preferredMonth: number): TDate | null {
    const normalizedMonth = Math.max(0, Math.min(11, Math.trunc(preferredMonth)));

    for (let distance = 0; distance < 12; distance += 1) {
      const monthOffsets = distance === 0 ? [0] : [-distance, distance];
      for (const offset of monthOffsets) {
        const month = normalizedMonth + offset;
        if (month < 0 || month > 11) {
          continue;
        }

        const monthStart = this.config.adapter.createDate(year, month, 1);
        const firstEnabledDate = findFirstEnabledDateInMonth(
          this.config.adapter,
          monthStart,
          (date) => this.isDateDisabled(date),
        );
        if (firstEnabledDate !== null) {
          return firstEnabledDate;
        }
      }
    }

    return null;
  }

  public setActiveDate(
    date: TngDateInputValue<TDate>,
    trigger: TngDateRangePickerTrigger = 'programmatic',
  ): void {
    if (this.destroyed) {
      return;
    }

    const normalized = normalizeDateInput(this.config.adapter, date, this.config.locale);
    if (normalized === null) {
      return;
    }

    this.applyActiveDate(normalized, trigger, true);
    this.bumpVersion();
  }

  public setConfig(config: Partial<TngDateRangePickerConfig<TDate>>): void {
    if (this.destroyed) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const previousTrapFocus = this.config.trapFocus;
    const previousCalendarLayout = this.config.calendarLayout;
    this.config = this.resolveConfig(config, this.config);
    this.state.disabled = this.config.disabled;
    this.state.value = this.coerceSelectionWithinConstraints(this.state.value);
    if (
      !hasPartialRange(this.state.value) ||
      (this.hoverDate !== null && this.isDateDisabled(this.hoverDate))
    ) {
      this.hoverDate = null;
    }
    this.state.activeDate = this.resolveValidDate(this.state.activeDate, this.state.visibleMonth);
    if (previousCalendarLayout !== 'dual' && this.config.calendarLayout === 'dual') {
      this.state.visibleMonth = this.resolveVisibleMonthForSelection(
        this.state.value,
        this.state.activeDate,
      );
    }
    if (!this.isDateInVisibleCalendarWindow(this.state.activeDate)) {
      this.state.visibleMonth = this.resolveLeadingMonthForDate(this.state.activeDate);
    }
    this.yearPageStart = this.resolveCenteredYearPageStart(
      this.config.adapter.getYear(this.state.activeDate),
    );
    this.state.inputText = this.formatValueForInput(this.state.value);

    if (this.focusLayerRegistered && previousTrapFocus !== this.config.trapFocus) {
      this.unregisterFocusLayer();
      this.registerFocusLayer();
      if (this.state.open) {
        this.activateFocusLayer();
      }
    }

    this.bumpVersion();

    if (compareMonthIdentity(this.config.adapter, previousMonth, this.state.visibleMonth) !== 0) {
      this.emit({
        previousMonth,
        type: 'monthChange',
        visibleMonth: this.state.visibleMonth,
      });
    }

    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  public setDisabled(disabled: boolean): void {
    if (this.destroyed || this.state.disabled === disabled) {
      return;
    }

    this.state.disabled = disabled;
    this.bumpVersion();
  }

  public setFocusedSection(section: TngDateRangePickerFocusedSection): void {
    if (this.destroyed || this.state.focusedSection === section) {
      return;
    }

    this.state.focusedSection = section;
    this.bumpVersion();
  }

  public setInputText(text: string): void {
    if (this.destroyed || !this.config.allowManualInput) {
      return;
    }

    this.state.inputText = text;
    this.state.validationError = null;
    if (this.config.onPartialInputCommit) {
      this.commitInputText();
      return;
    }
    this.bumpVersion();
  }

  public setOpen(open: boolean): void {
    if (open) {
      this.open();
      return;
    }

    this.close('programmatic');
  }

  public setState(patch: Readonly<TngDateRangePickerStatePatch<TDate>>): void {
    if (this.destroyed) {
      return;
    }

    const previousView = this.state.view;
    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const previousActive = this.state.activeDate;
    const previousValue = this.state.value;

    if (patch.view !== undefined) {
      this.state.view = normalizeView(patch.view);
      this.state.focusedSection = resolveInitialFocusedSection(this.state.view);
    }

    if (patch.disabled !== undefined) {
      this.state.disabled = patch.disabled;
    }

    if (patch.visibleMonth !== undefined) {
      const normalized = normalizeDateInput(
        this.config.adapter,
        patch.visibleMonth,
        this.config.locale,
      );
      if (normalized !== null) {
        this.state.visibleMonth = this.config.adapter.startOfMonth(normalized);
      }
    }

    if (patch.activeDate !== undefined) {
      const normalized = normalizeDateInput(
        this.config.adapter,
        patch.activeDate,
        this.config.locale,
      );
      if (normalized !== null) {
        this.state.activeDate = this.resolveValidDate(normalized, this.state.visibleMonth);
      }
    }

    if (patch.value !== undefined) {
      const normalized = normalizeSelectionInput(
        this.config.adapter,
        this.config.selectionMode,
        patch.value,
        this.config.locale,
      );
      this.state.value = this.coerceSelectionWithinConstraints(normalized.value);
      this.rangeAnchorDate = this.extractSelectionAnchor(this.state.value);
      this.hoverDate = null;
    }

    if (patch.inputText !== undefined) {
      this.state.inputText = patch.inputText;
    } else {
      this.state.inputText = this.formatValueForInput(this.state.value);
    }

    this.bumpVersion();

    if (previousView !== this.state.view) {
      this.emit({
        previousView,
        type: 'viewChange',
        view: this.state.view,
      });
    }

    if (compareMonthIdentity(this.config.adapter, previousMonth, this.state.visibleMonth) !== 0) {
      this.emit({
        previousMonth,
        type: 'monthChange',
        visibleMonth: this.state.visibleMonth,
      });
    }

    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }

    if (!datesEqual(this.config.adapter, previousActive, this.state.activeDate)) {
      this.emit({
        activeDate: this.state.activeDate,
        previousActiveDate: previousActive,
        trigger: 'programmatic',
        type: 'activeChange',
      });
    }

    if (
      !selectionValuesEqual(
        this.config.adapter,
        this.config.selectionMode,
        previousValue,
        this.state.value,
      )
    ) {
      this.emit({
        previousValue,
        trigger: 'programmatic',
        type: 'valueChange',
        value: this.state.value,
      });
    }
  }

  public setValue(value: TngDateSelectionInput<TDate>): void {
    if (this.destroyed) {
      return;
    }

    const normalized = normalizeSelectionInput(
      this.config.adapter,
      this.config.selectionMode,
      value,
      this.config.locale,
    );
    const previousValidationError = this.state.validationError;
    if (normalized.validationError !== null) {
      this.state.validationError = normalized.validationError;
    }

    const coerced = this.coerceSelectionWithinConstraints(normalized.value);
    if (
      selectionValuesEqual(
        this.config.adapter,
        this.config.selectionMode,
        this.state.value,
        coerced,
      )
    ) {
      if (previousValidationError !== this.state.validationError) {
        this.bumpVersion();
      }
      return;
    }

    const previousValue = this.state.value;
    this.state.value = coerced;
    this.state.validationError = normalized.validationError;
    this.state.inputText = this.formatValueForInput(coerced);
    this.hoverDate = null;
    const anchor = this.extractSelectionAnchor(coerced);
    this.rangeAnchorDate = anchor;
    if (anchor !== null) {
      this.alignDualCalendarWindowToSelection(coerced);
      this.applyActiveDate(anchor, 'programmatic', true);
    }
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger: 'programmatic',
      type: 'valueChange',
      value: coerced,
    });
  }

  public setView(view: TngCalendarView): void {
    if (this.destroyed) {
      return;
    }

    const normalizedView = normalizeView(view);
    if (this.state.view === normalizedView) {
      return;
    }

    const previousView = this.state.view;
    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.view = normalizedView;
    this.state.focusedSection = resolveInitialFocusedSection(normalizedView);
    if (normalizedView === 'year') {
      this.yearPageStart = this.resolveCenteredYearPageStart(
        this.config.adapter.getYear(this.state.activeDate),
      );
    }
    if (normalizedView === 'day' && !this.isDateInVisibleCalendarWindow(this.state.activeDate)) {
      this.state.visibleMonth = this.resolveLeadingMonthForDate(this.state.activeDate);
    }
    this.bumpVersion();
    this.emit({
      previousView,
      type: 'viewChange',
      view: normalizedView,
    });
    if (compareMonthIdentity(this.config.adapter, previousMonth, this.state.visibleMonth) !== 0) {
      this.emit({
        previousMonth,
        type: 'monthChange',
        visibleMonth: this.state.visibleMonth,
      });
    }
    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  public setVisibleMonth(valueOrYear: TngDateInputValue<TDate> | number, month?: number): void {
    if (this.destroyed) {
      return;
    }

    let nextMonth: TDate | null;
    if (typeof valueOrYear === 'number') {
      if (month === undefined) {
        return;
      }
      nextMonth = this.config.adapter.createDate(Math.trunc(valueOrYear), Math.trunc(month), 1);
    } else {
      const normalized = normalizeDateInput(this.config.adapter, valueOrYear, this.config.locale);
      nextMonth = normalized === null ? null : this.config.adapter.startOfMonth(normalized);
    }

    if (nextMonth === null) {
      return;
    }

    if (!this.hasSelectableDateInCalendarWindow(nextMonth)) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.visibleMonth = this.config.adapter.startOfMonth(nextMonth);
    this.yearPageStart = this.resolveCenteredYearPageStart(
      this.config.adapter.getYear(this.state.visibleMonth),
    );
    this.state.activeDate = this.resolveValidDate(this.state.activeDate, this.state.visibleMonth);
    this.bumpVersion();
    if (compareMonthIdentity(this.config.adapter, previousMonth, this.state.visibleMonth) !== 0) {
      this.emit({
        previousMonth,
        type: 'monthChange',
        visibleMonth: this.state.visibleMonth,
      });
    }
    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  public setVisibleYear(year: number): void {
    this.selectYear(year);
  }

  public showDaysPanel(): void {
    this.setView('day');
  }

  public showMonthsPanel(): void {
    this.setView('month');
  }

  public showYearsPanel(): void {
    this.setView('year');
  }

  public subscribe(listener: TngDateRangePickerListener<TDate>): () => void {
    this.listenerSet.add(listener);
    return () => {
      this.listenerSet.delete(listener);
    };
  }

  public toggleOpen(): void {
    if (this.state.open) {
      this.close('programmatic');
      return;
    }

    this.open();
  }

  private applyActiveDate(
    nextDate: TDate,
    trigger: TngDateRangePickerTrigger,
    focusVisible: boolean,
  ): void {
    const resolved = this.resolveValidDate(nextDate, this.state.visibleMonth);
    if (datesEqual(this.config.adapter, resolved, this.state.activeDate)) {
      this.focusVisibleDate = focusVisible ? resolved : null;
      this.syncPreviewDateForFocus(resolved, trigger);
      this.bumpVersion();
      return;
    }

    const previousActiveDate = this.state.activeDate;
    this.state.activeDate = resolved;
    this.focusVisibleDate = focusVisible ? resolved : null;
    this.syncPreviewDateForFocus(resolved, trigger);
    if (!this.isDateInVisibleCalendarWindow(resolved)) {
      const previousMonth = this.state.visibleMonth;
      const previousYear = this.config.adapter.getYear(previousMonth);
      this.state.visibleMonth = this.resolveLeadingMonthForDate(
        resolved,
        trigger === 'keyboard' || hasCompleteRange(this.state.value),
      );
      this.emit({
        previousMonth,
        type: 'monthChange',
        visibleMonth: this.state.visibleMonth,
      });
      const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
      if (previousYear !== currentYear) {
        this.emit({
          previousYear,
          type: 'yearChange',
          year: currentYear,
        });
      }
    }
    this.emit({
      activeDate: resolved,
      previousActiveDate,
      trigger,
      type: 'activeChange',
    });
    this.bumpVersion();
  }

  private applyPickerActiveDate(
    nextDate: TDate,
    trigger: TngDateRangePickerTrigger,
    focusVisible: boolean,
  ): void {
    const resolved = this.resolveValidDate(nextDate, this.config.adapter.startOfMonth(nextDate));
    if (datesEqual(this.config.adapter, resolved, this.state.activeDate)) {
      this.focusVisibleDate = focusVisible ? resolved : null;
      this.bumpVersion();
      return;
    }

    const previousActiveDate = this.state.activeDate;
    this.state.activeDate = resolved;
    this.focusVisibleDate = focusVisible ? resolved : null;
    this.emit({
      activeDate: resolved,
      previousActiveDate,
      trigger,
      type: 'activeChange',
    });
    this.bumpVersion();
  }

  private isDateInVisibleCalendarWindow(date: TDate): boolean {
    if (isDateValueInMonth(this.config.adapter, date, this.state.visibleMonth)) {
      return true;
    }

    return (
      this.config.calendarLayout === 'dual' &&
      isDateValueInMonth(
        this.config.adapter,
        date,
        this.config.adapter.addMonths(this.state.visibleMonth, 1),
      )
    );
  }

  private resolveLeadingMonthForDate(
    date: TDate,
    preferTrailing = hasCompleteRange(this.state.value),
  ): TDate {
    const dateMonth = this.config.adapter.startOfMonth(date);
    if (
      this.config.calendarLayout === 'dual' &&
      preferTrailing &&
      this.config.adapter.compare(dateMonth, this.state.visibleMonth) > 0
    ) {
      return this.config.adapter.startOfMonth(this.config.adapter.addMonths(dateMonth, -1));
    }

    return dateMonth;
  }

  private bumpVersion(): void {
    this.version += 1;
  }

  private syncPreviewDateForFocus(date: TDate, trigger: TngDateRangePickerTrigger): void {
    if (trigger !== 'keyboard') {
      return;
    }

    if (
      getRangeStartDate(this.state.value) === null ||
      getRangeEndDate(this.state.value) !== null
    ) {
      this.hoverDate = null;
      return;
    }

    if (!this.isDateDisabled(date)) {
      this.hoverDate = date;
    }
  }

  private coerceSelectionWithinConstraints(value: TngDateValue<TDate>): TngDateValue<TDate> {
    if (value === null) {
      return clearSelectionForMode(this.config.selectionMode);
    }

    const range = normalizeRangeOrder(this.config.adapter, value as TngDateRange<TDate>);
    if (range.start === null) {
      return Object.freeze({ end: null, start: null });
    }
    if (this.isDateDisabled(range.start, { includeComponentDisabled: false })) {
      this.state.validationError = 'out-of-range';
      return Object.freeze({ end: null, start: null });
    }
    if (range.end === null) {
      return range;
    }
    if (this.isDateDisabled(range.end, { includeComponentDisabled: false })) {
      this.state.validationError = 'range-disabled';
      return Object.freeze({ end: null, start: range.start });
    }
    return range;
  }

  private emit(event: TngDateRangePickerEvent<TDate>): void {
    for (const listener of this.listenerSet) {
      listener(event);
    }
  }

  private extractSelectionAnchor(value: TngDateValue<TDate>): TDate | null {
    if (value === null) {
      return null;
    }
    if (isRangeSelectionValue(value)) {
      return value.end ?? value.start;
    }
    return null;
  }

  private formatValueForInput(value: TngDateValue<TDate>): string {
    if (value === null) {
      return '';
    }

    const range = value as TngDateRange<TDate>;
    if (range.start === null) {
      return '';
    }
    if (range.end === null) {
      return this.config.adapter.format(range.start, 'input', this.config.locale);
    }
    return `${this.config.adapter.format(range.start, 'input', this.config.locale)} – ${this.config.adapter.format(
      range.end,
      'input',
      this.config.locale,
    )}`;
  }

  private isStrictInputCommitValue(inputText: string, parsed: TDate): boolean {
    const canonicalInputText = this.config.adapter
      .format(parsed, 'input', this.config.locale)
      .trim();
    return inputText === canonicalInputText;
  }

  private isStrictRangePartCommitValue(partText: string, date: TDate): boolean {
    const canonicalInputText = this.config.adapter.format(date, 'input', this.config.locale).trim();
    return partText.trim() === canonicalInputText;
  }

  private isStrictRangeInputCommitValue(
    parts: Readonly<{ endText: string; startText: string }>,
    start: TDate,
    end: TDate,
  ): boolean {
    const first = parts.startText.trim();
    const second = parts.endText.trim();

    if (
      this.isStrictRangePartCommitValue(first, start) &&
      this.isStrictRangePartCommitValue(second, end)
    ) {
      return true;
    }

    return (
      this.isStrictRangePartCommitValue(first, end) &&
      this.isStrictRangePartCommitValue(second, start)
    );
  }

  private commitRangeInputText(parts: Readonly<{ endText: string; startText: string }>): boolean {
    const startParsed = this.config.adapter.parse(parts.startText.trim(), this.config.locale);
    const endParsed = this.config.adapter.parse(parts.endText.trim(), this.config.locale);

    if (startParsed === null || endParsed === null) {
      this.state.validationError = 'invalid-input';
      this.bumpVersion();
      return false;
    }

    if (!this.isStrictRangeInputCommitValue(parts, startParsed, endParsed)) {
      this.state.validationError = 'invalid-input';
      this.bumpVersion();
      return false;
    }

    return this.commitFullRangeFromInput(startParsed, endParsed);
  }

  private commitFullRangeFromInput(start: TDate, end: TDate): boolean {
    if (this.config.calendarLayout === 'dual' && this.config.adapter.compare(end, start) < 0) {
      this.setCalendarValidationError('end-before-start');
      return false;
    }

    const normalizedRange = normalizeRangeOrder(this.config.adapter, { end, start });

    if (
      normalizedRange.start === null ||
      normalizedRange.end === null ||
      this.isDateDisabled(normalizedRange.start) ||
      this.isDateDisabled(normalizedRange.end)
    ) {
      this.state.validationError = 'out-of-range';
      this.bumpVersion();
      return false;
    }

    const nextValue = Object.freeze({
      end: normalizedRange.end,
      start: normalizedRange.start,
    }) as TngDateRange<TDate>;

    const previousValue = this.state.value;
    if (
      selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)
    ) {
      this.state.validationError = null;
      return true;
    }

    this.state.validationError = null;
    this.state.value = nextValue;
    this.state.inputText = this.formatValueForInput(nextValue);
    this.rangeAnchorDate = normalizedRange.end;
    this.hoverDate = null;
    this.applyActiveDate(normalizedRange.end, 'text-input', true);
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger: 'text-input',
      type: 'valueChange',
      value: nextValue,
    });

    if (this.config.closeOnSelect && this.state.open && hasCompleteRange(nextValue)) {
      this.close('select');
    }

    return true;
  }

  private getCalendars(): readonly TngDateRangePickerCalendarPanel<TDate>[] {
    if (this.cachedGridVersion === this.version) {
      return this.cachedCalendars;
    }

    const calendarCount = this.config.calendarLayout === 'dual' ? 2 : 1;
    const visibleMonths = Array.from({ length: calendarCount }, (_, index) =>
      this.config.adapter.startOfMonth(
        this.config.adapter.addMonths(this.state.visibleMonth, index),
      ),
    );
    const calendars = visibleMonths.map((visibleMonth, index) => {
      const builtCells = buildMonthGrid({
        activeDate: this.state.activeDate,
        adapter: this.config.adapter,
        createCellId: (date) =>
          `${this.instanceId}-calendar-${index}-cell-${toDateKey(this.config.adapter, date)}`,
        fixedWeeks: this.config.fixedWeeks,
        focusStrategy: this.config.focusStrategy,
        focusedDate: this.focusVisibleDate,
        inRange: (date) => rangeIncludesDate(this.config.adapter, this.state.value, date),
        isDisabled: (date) => this.isDateDisabled(date),
        isPreviewRange: (date) => this.isInPreviewRange(date),
        isRangeEnd: (date) => {
          const range = this.state.value;
          return (
            isRangeSelectionValue(range) &&
            range.end !== null &&
            datesEqual(this.config.adapter, range.end, date)
          );
        },
        isRangeStart: (date) => {
          const range = this.state.value;
          return (
            isRangeSelectionValue(range) &&
            range.start !== null &&
            datesEqual(this.config.adapter, range.start, date)
          );
        },
        isSelected: (date) =>
          valueIncludesDate(this.config.adapter, this.config.selectionMode, this.state.value, date),
        locale: this.config.locale,
        showOutsideDays: this.config.showOutsideDays,
        today: this.config.today,
        visibleMonth,
        weekStartsOn: this.config.weekStartsOn,
      });
      const cells = builtCells.map((cell) => {
        const duplicatedByVisibleMonth =
          !cell.inMonth &&
          visibleMonths.some(
            (candidateMonth, candidateIndex) =>
              candidateIndex !== index &&
              isDateValueInMonth(this.config.adapter, cell.date, candidateMonth),
          );
        if (!duplicatedByVisibleMonth) {
          return cell;
        }

        return Object.freeze({
          ...cell,
          active: false,
          focusVisible: false,
          hidden: true,
          tabindex: -1,
        }) as TngDateCell<TDate>;
      });

      return Object.freeze({
        cells: Object.freeze(cells),
        getGridAttributes: () => this.resolveGridAttributes(index),
        index,
        labelMonthYear: this.config.adapter.format(visibleMonth, 'month-year', this.config.locale),
        rangeBoundary:
          this.config.calendarLayout === 'dual' ? (index === 0 ? 'start' : 'end') : null,
        visibleMonth,
      }) as TngDateRangePickerCalendarPanel<TDate>;
    });
    const navigableCells = calendars.flatMap((calendar) =>
      calendar.cells.filter((cell) => !cell.hidden),
    );

    this.syncDayFocusControllers(navigableCells);

    if (this.config.enableTypeahead) {
      this.typeahead.setItems(
        navigableCells
          .filter((cell) => !cell.disabled && !cell.hidden)
          .map((cell) => ({ disabled: false, id: cell.id, text: cell.label })),
      );
    }

    this.cachedCalendars = Object.freeze(calendars);
    this.cachedGridVersion = this.version;
    return this.cachedCalendars;
  }

  private getCells(): readonly TngDateCell<TDate>[] {
    return this.getCalendars()[0]?.cells ?? (emptyCells as readonly TngDateCell<TDate>[]);
  }

  private getMonthOptions(): readonly TngMonthOption<TDate>[] {
    if (this.cachedMonthVersion === this.version) {
      return this.cachedMonthOptions;
    }

    const options = buildMonthOptions({
      activeDate: this.state.activeDate,
      adapter: this.config.adapter,
      createId: (month) => `${this.instanceId}-month-${month}`,
      disabledMonth: (month) =>
        !hasSelectableDateInMonth(
          this.config.adapter,
          this.config.adapter.createDate(
            this.config.adapter.getYear(this.state.visibleMonth),
            month,
            1,
          ),
          (date) => this.isDateDisabled(date),
        ),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      locale: this.config.locale,
      selectedMonth: (month) => {
        const anchor = this.extractSelectionAnchor(this.state.value);
        return anchor !== null && this.config.adapter.getMonth(anchor) === month;
      },
      visibleMonth: this.state.visibleMonth,
    });

    this.syncMonthFocusController(options);

    this.cachedMonthOptions = options;
    this.cachedMonthVersion = this.version;
    return options;
  }

  private getWeekdayLabels(): readonly string[] {
    if (this.cachedWeekdayLabels.length > 0 && this.cachedGridVersion === this.version) {
      return this.cachedWeekdayLabels;
    }

    const start = this.config.adapter.startOfWeek(this.config.today, this.config.weekStartsOn);
    const labels = Array.from({ length: 7 }, (_, index) =>
      this.config.adapter.format(
        this.config.adapter.addDays(start, index),
        'weekday-short',
        this.config.locale,
      ),
    );
    this.cachedWeekdayLabels = Object.freeze(labels);
    return this.cachedWeekdayLabels;
  }

  private getYearOptions(): readonly TngYearOption<TDate>[] {
    if (this.cachedYearVersion === this.version) {
      return this.cachedYearOptions;
    }

    const totalYears = this.config.yearPageSize;
    const options = buildYearOptions({
      activeDate: this.state.activeDate,
      adapter: this.config.adapter,
      createId: (year) => `${this.instanceId}-year-${year}`,
      disabledYear: (year) =>
        !hasSelectableDateInYear(this.config.adapter, year, this.state.visibleMonth, (date) =>
          this.isDateDisabled(date),
        ),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      locale: this.config.locale,
      selectedYear: (year) => {
        const anchor = this.extractSelectionAnchor(this.state.value);
        return anchor !== null && this.config.adapter.getYear(anchor) === year;
      },
      startYear: this.yearPageStart,
      totalYears,
      visibleMonth: this.state.visibleMonth,
    });

    this.syncYearFocusController(options);

    this.cachedYearOptions = options;
    this.cachedYearVersion = this.version;
    return options;
  }

  private handlePageNavigation(event: Readonly<TngKeyboardEventLike>): boolean {
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const direction = event.key === 'PageDown' ? 1 : -1;
      const useYear = event.ctrlKey === true || event.metaKey === true || event.shiftKey === true;
      const nextActive = useYear
        ? this.config.adapter.addYears(this.state.activeDate, direction)
        : this.config.adapter.addMonths(this.state.activeDate, direction);
      this.applyActiveDate(nextActive, 'keyboard', true);
      return true;
    }

    return false;
  }

  private handlePickerGridKeyDown(
    event: Readonly<TngKeyboardEventLike>,
    view: 'month' | 'year',
  ): void {
    if (this.destroyed || this.state.disabled) {
      return;
    }

    const options = view === 'month' ? this.getMonthOptions() : this.getYearOptions();
    const activeIndex = options.findIndex((option) => option.active);

    if (event.key === 'Escape') {
      const nextView = resolveViewForEscape(this.state.view);
      if (nextView === null) {
        this.close('escape');
      } else {
        this.setView(nextView);
      }
      event.preventDefault();
      return;
    }

    const action = resolveGridNavigationKeyAction(event, {
      direction: this.config.direction,
    });
    if (action === null) {
      return;
    }

    if (action.preventDefault) {
      event.preventDefault();
    }

    if (action.type === 'exit') {
      return;
    }

    if (action.type === 'activate') {
      const activeOption = options[Math.max(0, activeIndex)];
      if (activeOption === undefined || activeOption.disabled) {
        return;
      }
      if (view === 'month') {
        this.selectMonth((activeOption as TngMonthOption<TDate>).index);
      } else {
        this.selectYear((activeOption as TngYearOption<TDate>).year);
      }
      return;
    }

    const currentOption = options[Math.max(0, activeIndex)];
    if (currentOption === undefined) {
      return;
    }
    const currentPosition = this.optionIndexToGridPosition(activeIndex, 4);

    const nextPosition = resolveNavigableGridCell(currentPosition, action.type, {
      bounds: {
        colCount: 4,
        rowCount: Math.ceil(options.length / 4),
      },
      cells: options.map((option, index) => ({
        col: index % 4,
        disabled: option.disabled,
        row: Math.floor(index / 4),
      })),
    });
    const yearDelta = view === 'year' ? this.resolveYearBoundaryDelta(action.type) : null;
    const monthDelta = view === 'month' ? this.resolveMonthBoundaryDelta(action.type) : null;
    const isBoundaryClamp =
      ((view === 'year' && yearDelta !== null) || (view === 'month' && monthDelta !== null)) &&
      nextPosition !== null &&
      nextPosition.row === currentPosition.row &&
      nextPosition.col === currentPosition.col;

    if (view === 'month' && currentOption.disabled && isBoundaryClamp) {
      const fallbackMonthOption = this.findNearestEnabledMonthOption(
        options as readonly TngMonthOption<TDate>[],
        activeIndex,
        action.type,
      );
      if (fallbackMonthOption !== null) {
        this.state.focusedSection = 'month';
        this.applyPickerActiveDate(fallbackMonthOption.date, 'keyboard', true);
      }
      return;
    }

    if (nextPosition === null || isBoundaryClamp) {
      if (view === 'year' && yearDelta !== null) {
        this.state.focusedSection = 'year';
        const fallbackYearOption =
          action.type === 'move-up' || action.type === 'move-down'
            ? this.findYearOptionInVerticalDirection(
                options as readonly TngYearOption<TDate>[],
                activeIndex,
                action.type,
              )
            : null;
        if (fallbackYearOption !== null) {
          this.applyPickerActiveDate(fallbackYearOption.date, 'keyboard', true);
          return;
        }
        const targetYear = (currentOption as TngYearOption<TDate>).year + yearDelta;
        if (
          !hasSelectableDateInYear(
            this.config.adapter,
            targetYear,
            this.state.visibleMonth,
            (date) => this.isDateDisabled(date),
          )
        ) {
          return;
        }
        this.shiftYearPageToInclude(targetYear);
        this.applyPickerActiveDate(
          this.config.adapter.createDate(
            targetYear,
            this.config.adapter.getMonth(this.state.visibleMonth),
            1,
          ),
          'keyboard',
          true,
        );
        return;
      }

      if (view === 'month' && monthDelta !== null) {
        this.state.focusedSection = 'month';
        const targetMonth = this.config.adapter.addMonths(
          (currentOption as TngMonthOption<TDate>).date,
          monthDelta,
        );
        if (
          !hasSelectableDateInMonth(this.config.adapter, targetMonth, (date) =>
            this.isDateDisabled(date),
          )
        ) {
          return;
        }
        this.shiftMonthGridToTarget(targetMonth);
        this.applyPickerActiveDate(targetMonth, 'keyboard', true);
      }
      return;
    }

    const nextIndex = nextPosition.row * 4 + nextPosition.col;
    const nextOption = options[nextIndex];
    if (nextOption === undefined || nextOption.disabled) {
      return;
    }

    if (view === 'month') {
      this.state.focusedSection = 'month';
    } else {
      this.state.focusedSection = 'year';
    }

    this.applyPickerActiveDate(nextOption.date, 'keyboard', true);
  }

  private findNearestEnabledMonthOption(
    options: readonly TngMonthOption<TDate>[],
    activeIndex: number,
    actionType: Exclude<TngGridNavigationActionType, 'activate' | 'exit'>,
  ): TngMonthOption<TDate> | null {
    const clampedActiveIndex = Math.max(0, Math.min(options.length - 1, activeIndex));
    const preferredDirection =
      actionType === 'move-left' ||
      actionType === 'move-up' ||
      actionType === 'move-row-start' ||
      actionType === 'move-grid-start'
        ? -1
        : 1;

    for (let distance = 1; distance < options.length; distance += 1) {
      const preferredOption = options[clampedActiveIndex + distance * preferredDirection];
      if (preferredOption !== undefined && !preferredOption.disabled) {
        return preferredOption;
      }

      const oppositeOption = options[clampedActiveIndex - distance * preferredDirection];
      if (oppositeOption !== undefined && !oppositeOption.disabled) {
        return oppositeOption;
      }
    }

    return null;
  }

  private findYearOptionInVerticalDirection(
    options: readonly TngYearOption<TDate>[],
    activeIndex: number,
    actionType: 'move-down' | 'move-up',
  ): TngYearOption<TDate> | null {
    if (actionType === 'move-up') {
      for (let index = activeIndex - 1; index >= 0; index -= 1) {
        const option = options[index];
        if (option !== undefined && !option.disabled) {
          return option;
        }
      }
      return null;
    }

    for (let index = activeIndex + 1; index < options.length; index += 1) {
      const option = options[index];
      if (option !== undefined && !option.disabled) {
        return option;
      }
    }

    return null;
  }

  private handleResolvedDayGridAction(
    actionType: Exclude<TngGridNavigationActionType, 'activate' | 'exit'>,
    shiftKey: boolean,
  ): void {
    const activeCalendar = this.getCalendars().find((calendar) =>
      calendar.cells.some((cell) => cell.active && !cell.hidden),
    );
    const cells = activeCalendar?.cells ?? this.getCells();
    const activeCell = cells.find((cell) => cell.active && !cell.hidden) ?? null;
    if (activeCell === null) {
      return;
    }

    if (
      actionType === 'move-left' ||
      actionType === 'move-right' ||
      actionType === 'move-up' ||
      actionType === 'move-down'
    ) {
      const delta =
        actionType === 'move-left'
          ? -1
          : actionType === 'move-right'
            ? 1
            : actionType === 'move-up'
              ? -7
              : 7;
      const nextDate = this.resolveDirectionalTarget(activeCell.date, delta);
      this.applyActiveDate(nextDate, 'keyboard', true);
      if (shiftKey && this.config.enableRangeSelection && this.config.calendarLayout !== 'dual') {
        this.commitRangeFromAnchor(nextDate);
      }
      return;
    }

    const nextPosition = resolveNavigableGridCell(
      {
        col: activeCell.colIndex,
        row: activeCell.rowIndex,
      },
      actionType,
      {
        bounds: {
          colCount: 7,
          rowCount: Math.ceil(cells.length / 7),
        },
        cells: cells.map((cell) => ({
          col: cell.colIndex,
          disabled: cell.disabled,
          row: cell.rowIndex,
        })),
      },
    );
    if (nextPosition === null) {
      return;
    }

    const nextCell = cells.find(
      (cell) => cell.colIndex === nextPosition.col && cell.rowIndex === nextPosition.row,
    );
    if (nextCell === undefined || nextCell.disabled) {
      return;
    }

    this.applyActiveDate(nextCell.date, 'keyboard', true);
  }

  private handleTypeahead(key: string): void {
    if (!/^\d$/.test(key)) {
      return;
    }

    const result = this.typeahead.handleKey(key);
    if (result.activeId === null) {
      return;
    }

    const cell = this.getCalendars()
      .flatMap((calendar) => calendar.cells)
      .find((item) => item.id === result.activeId);
    if (cell === undefined) {
      return;
    }

    this.applyActiveDate(cell.date, 'keyboard', true);
  }

  private isDateDisabled(
    date: TDate,
    options: Readonly<{ includeComponentDisabled?: boolean }> = {},
  ): boolean {
    if (options.includeComponentDisabled !== false && this.state?.disabled === true) {
      return true;
    }

    if (this.config.min !== null && this.config.adapter.compare(date, this.config.min) < 0) {
      return true;
    }

    if (this.config.max !== null && this.config.adapter.compare(date, this.config.max) > 0) {
      return true;
    }

    return this.config.disableDate?.(date) ?? false;
  }

  private isInPreviewRange(date: TDate): boolean {
    const start = getRangeStartDate(this.state.value);
    const previewEnd = this.hoverDate;
    if (start === null || previewEnd === null || getRangeEndDate(this.state.value) !== null) {
      return false;
    }

    const range = normalizeRangeOrder(this.config.adapter, {
      end: previewEnd,
      start,
    });
    if (range.start === null || range.end === null) {
      return false;
    }

    return (
      this.config.adapter.compare(range.start, date) <= 0 &&
      this.config.adapter.compare(range.end, date) >= 0
    );
  }

  private isPreviewEndDate(date: TDate): boolean {
    const start = getRangeStartDate(this.state.value);
    const previewEnd = this.hoverDate;
    return (
      start !== null &&
      previewEnd !== null &&
      getRangeEndDate(this.state.value) === null &&
      datesEqual(this.config.adapter, previewEnd, date)
    );
  }

  private registerOverlayLayer(): void {
    if (this.overlayLayerRegistered || this.config.overlayRuntime === null) {
      return;
    }

    this.config.overlayRuntime.registerLayer({
      containsTarget: (target) =>
        (target instanceof Node && this.overlayElement?.contains(target) === true) ||
        (target instanceof Node && this.triggerElement?.contains(target) === true) ||
        (target instanceof Node && this.anchorElement?.contains(target) === true),
      dismissOnEscape: this.config.closeOnEscape,
      dismissOnOutsidePointer: this.config.closeOnOutsideClick,
      id: `${this.instanceId}-layer`,
      modal: false,
      onDismiss: (reason) => this.close(mapOverlayDismissReason(reason)),
    });
    this.overlayLayerRegistered = true;
  }

  private activateFocusLayer(): void {
    this.registerFocusLayer();
    if (!this.focusLayerRegistered) {
      return;
    }

    dateRangePickerFocusHandoff.activateLayer(this.instanceId, this.restoreFocusTargetId);
  }

  private deactivateFocusLayer(): void {
    if (!this.focusLayerRegistered) {
      return;
    }

    const restoreFocusTargetId = dateRangePickerFocusHandoff.deactivateLayer(this.instanceId);
    const skipRestore = this.skipNextFocusRestore;
    this.skipNextFocusRestore = false;
    if (!this.config.restoreFocus || restoreFocusTargetId === null || skipRestore) {
      return;
    }

    const restoreFocusTarget = this.resolveElementById(restoreFocusTargetId) ?? this.triggerElement;
    restoreFocusTarget?.focus();
  }

  private focusCurrentOverlayTarget(): void {
    if (!this.state.open || this.overlayElement === null) {
      return;
    }

    const targetId = this.resolveCurrentOverlayTargetId();
    if (targetId === null) {
      return;
    }

    const resolvedTargetId = dateRangePickerFocusHandoff.resolveFocusCandidate(
      this.instanceId,
      targetId,
    );
    if (resolvedTargetId === null) {
      return;
    }

    const target = this.resolveElementById(resolvedTargetId);
    if (target === null) {
      return;
    }

    target.focus();
    dateRangePickerFocusHandoff.recordFocus(this.instanceId, resolvedTargetId);
  }

  private resolveActiveElement(): HTMLElement | null {
    const activeElement = this.config.ownerDocument?.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
  }

  private resolveElementById(id: string | null): HTMLElement | null {
    if (id === null) {
      return null;
    }

    const element = this.config.ownerDocument?.getElementById(id);
    return element instanceof HTMLElement ? element : null;
  }

  private resolveCellAttributes(
    cellOrDate: Readonly<TngDateCell<TDate>> | TDate,
  ): TngDateRangePickerAttributeMap {
    const cell =
      'id' in (cellOrDate as TngDateCell<TDate>)
        ? (cellOrDate as TngDateCell<TDate>)
        : this.getCalendars()
            .flatMap((calendar) => calendar.cells)
            .find(
              (candidate) =>
                candidate.inMonth &&
                datesEqual(this.config.adapter, candidate.date, cellOrDate as TDate),
            );
    if (cell === undefined) {
      return freezeAttributes({});
    }

    return freezeAttributes({
      'aria-current': cell.today ? 'date' : null,
      'aria-disabled': cell.disabled ? 'true' : null,
      'aria-label': this.resolveCellAriaLabel(cell),
      'aria-selected': cell.selected ? 'true' : 'false',
      'data-active': cell.active ? 'true' : null,
      'data-disabled': cell.disabled ? 'true' : null,
      'data-focused': cell.focusVisible ? 'true' : null,
      'data-focus-visible': cell.focusVisible ? 'true' : null,
      'data-hidden': cell.hidden ? 'true' : null,
      'data-in-month': cell.inMonth ? 'true' : null,
      'data-in-range': cell.inRange ? 'true' : null,
      'data-outside-month': cell.inMonth ? null : 'true',
      'data-preview-end': this.isPreviewEndDate(cell.date) ? 'true' : null,
      'data-preview-range': cell.previewRange ? 'true' : null,
      'data-range-end': cell.rangeEnd ? 'true' : null,
      'data-range-start': cell.rangeStart ? 'true' : null,
      'data-selected': cell.selected ? 'true' : null,
      'data-slot': 'date-range-picker-cell',
      'data-today': cell.today ? 'true' : null,
      id: cell.id,
      role: 'gridcell',
      tabindex:
        this.config.focusStrategy === 'roving'
          ? `${this.dayRovingFocus.getActiveId() === cell.id ? 0 : -1}`
          : '-1',
    });
  }

  private resolveCellAriaLabel(cell: Readonly<TngDateCell<TDate>>): string {
    const descriptors: string[] = [cell.label];
    if (cell.rangeStart) {
      descriptors.push('selected start date');
    }
    if (cell.rangeEnd) {
      descriptors.push('selected end date');
    }
    if (cell.inRange) {
      descriptors.push('in selected range');
    }
    if (cell.previewRange) {
      descriptors.push('in preview range');
    }
    if (this.isPreviewEndDate(cell.date)) {
      descriptors.push('preview end date');
    }
    if (cell.disabled) {
      descriptors.push('unavailable');
    }

    return descriptors.join(', ');
  }

  private resolveDirectionalTarget(currentDate: TDate, delta: number): TDate {
    if (!this.config.skipDisabled) {
      return this.config.adapter.addDays(currentDate, delta);
    }

    return moveDateSkippingDisabled({
      adapter: this.config.adapter,
      delta,
      isDisabled: (date) => this.isDateDisabled(date),
      start: currentDate,
    });
  }

  private resolveCurrentOverlayTargetId(): string | null {
    if (this.state.view === 'day') {
      if (this.config.focusStrategy === 'active-descendant') {
        const activeCalendarIndex =
          this.getCalendars().find((calendar) =>
            calendar.cells.some((cell) => cell.active && !cell.hidden),
          )?.index ?? 0;
        return this.resolveCalendarGridId(activeCalendarIndex);
      }

      return this.dayRovingFocus.getActiveId();
    }

    if (this.state.view === 'month') {
      return this.monthRovingFocus.getActiveId();
    }

    if (this.state.view === 'year') {
      return this.yearRovingFocus.getActiveId();
    }

    return null;
  }

  private resolveGridAttributes(calendarIndex = 0): TngDateRangePickerAttributeMap {
    const normalizedIndex = this.config.calendarLayout === 'dual' && calendarIndex === 1 ? 1 : 0;
    const calendar = this.getCalendars()[normalizedIndex];
    const activeCell = calendar?.cells.find((cell) => cell.active && !cell.hidden);
    const activeDescendantAttributes =
      this.config.focusStrategy === 'active-descendant' && activeCell !== undefined
        ? this.dayActiveDescendant.getHostAttributes()
        : null;

    return freezeAttributes({
      'aria-activedescendant': activeDescendantAttributes?.['aria-activedescendant'] ?? null,
      'aria-label':
        this.config.calendarLayout === 'dual' && calendar !== undefined
          ? `${normalizedIndex === 0 ? 'Start' : 'End'} date, ${calendar.labelMonthYear}`
          : null,
      'aria-labelledby': this.resolveCalendarMonthLabelId(normalizedIndex),
      'data-calendar-index': `${normalizedIndex}`,
      'data-range-boundary':
        this.config.calendarLayout === 'dual' ? (normalizedIndex === 0 ? 'start' : 'end') : null,
      'data-slot': 'date-range-picker-grid',
      id: this.resolveCalendarGridId(normalizedIndex),
      role: 'grid',
    });
  }

  private resolveCalendarGridId(calendarIndex: number): string {
    return calendarIndex === 0 ? this.gridId : `${this.gridId}-${calendarIndex}`;
  }

  private resolveCalendarMonthLabelId(calendarIndex: number): string {
    return calendarIndex === 0 ? this.monthLabelId : `${this.monthLabelId}-${calendarIndex}`;
  }

  private resolveHostAttributes(): TngDateRangePickerAttributeMap {
    return freezeAttributes({
      'aria-describedby': this.config.ariaDescribedBy,
      'aria-label': this.config.ariaLabel,
      'aria-labelledby': this.config.ariaLabelledBy,
      'data-calendar-layout': this.config.calendarLayout,
      'data-disabled': this.state.disabled ? 'true' : null,
      'data-open': this.state.open ? 'true' : 'false',
      'data-slot': 'date-range-picker',
      'data-view': this.state.view,
      dir: this.config.direction,
      role: 'group',
    });
  }

  private resolveInitialActiveDate(value: TngDateValue<TDate>, fallback: TDate): TDate {
    const anchor = this.extractSelectionAnchor(value);
    if (anchor !== null && !this.isDateDisabled(anchor)) {
      return anchor;
    }

    if (!this.isDateDisabled(fallback)) {
      return fallback;
    }

    if (
      this.config.max !== null &&
      this.config.adapter.compare(fallback, this.config.max) > 0 &&
      !this.isDateDisabled(this.config.max)
    ) {
      return this.config.max;
    }

    if (
      this.config.min !== null &&
      this.config.adapter.compare(fallback, this.config.min) < 0 &&
      !this.isDateDisabled(this.config.min)
    ) {
      return this.config.min;
    }

    const firstEnabled = findFirstEnabledDateInMonth(
      this.config.adapter,
      this.config.adapter.startOfMonth(fallback),
      (date) => this.isDateDisabled(date),
    );
    if (firstEnabled !== null) {
      return firstEnabled;
    }

    if (this.config.min !== null && !this.isDateDisabled(this.config.min)) {
      return this.config.min;
    }

    if (this.config.max !== null && !this.isDateDisabled(this.config.max)) {
      return this.config.max;
    }

    return fallback;
  }

  private resolveVisibleMonthForSelection(value: TngDateValue<TDate>, fallback: TDate): TDate {
    const endDate = getRangeEndDate(value);
    if (this.config.calendarLayout === 'dual' && hasCompleteRange(value) && endDate !== null) {
      return this.config.adapter.startOfMonth(this.config.adapter.addMonths(endDate, -1));
    }

    return this.config.adapter.startOfMonth(fallback);
  }

  private alignDualCalendarWindowToSelection(value: TngDateValue<TDate>): void {
    if (this.config.calendarLayout !== 'dual' || !hasCompleteRange(value)) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const nextMonth = this.resolveVisibleMonthForSelection(value, this.state.activeDate);
    if (compareMonthIdentity(this.config.adapter, previousMonth, nextMonth) === 0) {
      return;
    }

    this.state.visibleMonth = nextMonth;
    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: nextMonth,
    });

    const currentYear = this.config.adapter.getYear(nextMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  private resolveLayout(): TngDateRangePickerLayout {
    if (!this.state.open || this.config.overlayMode === 'overlay') {
      return Object.freeze({
        mode: this.config.overlayMode,
        offsetX: 0,
        width: 0,
      });
    }

    const width = this.config.overlaySize;
    if (this.config.position === 'center') {
      return Object.freeze({ mode: this.config.overlayMode, offsetX: 0, width });
    }

    const startOffset = this.config.direction === 'rtl' ? -width : width;
    const endOffset = this.config.direction === 'rtl' ? width : -width;
    return Object.freeze({
      mode: this.config.overlayMode,
      offsetX: this.config.position === 'start' ? startOffset : endOffset,
      width,
    });
  }

  private resolveMonthAttributes(
    monthOrOption: number | Readonly<TngMonthOption<TDate>>,
  ): TngDateRangePickerAttributeMap {
    const option =
      typeof monthOrOption === 'number'
        ? this.getMonthOptions().find((item) => item.index === monthOrOption)
        : monthOrOption;
    if (option === undefined) {
      return freezeAttributes({});
    }

    return freezeAttributes({
      'aria-disabled': option.disabled ? 'true' : null,
      'aria-selected': option.selected ? 'true' : 'false',
      'data-active': option.active ? 'true' : null,
      'data-disabled': option.disabled ? 'true' : null,
      'data-focus-visible': option.focusVisible ? 'true' : null,
      'data-selected': option.selected ? 'true' : null,
      'data-slot': 'date-range-picker-month',
      id: option.id,
      role: 'gridcell',
      tabindex: `${this.monthRovingFocus.getActiveId() === option.id ? 0 : -1}`,
    });
  }

  private selectDualCalendarBoundary(
    date: TDate,
    boundary: 'end' | 'start',
    trigger: TngDateRangePickerTrigger,
  ): void {
    const currentRange = isRangeSelectionValue(this.state.value)
      ? this.state.value
      : Object.freeze({ end: null, start: null });

    if (boundary === 'end' && currentRange.start === null) {
      this.setCalendarValidationError('start-required');
      return;
    }
    if (
      boundary === 'end' &&
      currentRange.start !== null &&
      this.config.adapter.compare(date, currentRange.start) < 0
    ) {
      this.setCalendarValidationError('end-before-start');
      return;
    }

    const nextValue = Object.freeze({
      end:
        boundary === 'end'
          ? date
          : currentRange.end !== null && this.config.adapter.compare(currentRange.end, date) >= 0
            ? currentRange.end
            : null,
      start: boundary === 'start' ? date : currentRange.start,
    }) as TngDateRange<TDate>;
    const previousValue = this.state.value;
    const previousValidationError = this.state.validationError;
    this.state.validationError = null;

    if (
      selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)
    ) {
      if (previousValidationError !== null) {
        this.bumpVersion();
        this.emit({
          previousValidationError,
          type: 'validationChange',
          validationError: null,
        });
      }
      return;
    }

    this.state.value = nextValue;
    this.state.inputText = this.formatValueForInput(nextValue);
    this.rangeAnchorDate = this.extractSelectionAnchor(nextValue) ?? date;
    this.applyActiveDate(date, trigger, true);
    this.hoverDate = null;
    this.bumpVersion();
    if (previousValidationError !== null) {
      this.emit({
        previousValidationError,
        type: 'validationChange',
        validationError: null,
      });
    }
    this.emit({
      previousValue,
      trigger,
      type: 'valueChange',
      value: nextValue,
    });

    if (
      boundary === 'end' &&
      this.config.closeOnSelect &&
      this.state.open &&
      hasCompleteRange(nextValue)
    ) {
      this.close('select');
    }
  }

  private setCalendarValidationError(validationError: string): void {
    const previousValidationError = this.state.validationError;
    this.state.validationError = validationError;
    this.hoverDate = null;
    this.bumpVersion();
    if (previousValidationError === validationError) {
      return;
    }

    this.emit({
      previousValidationError,
      type: 'validationChange',
      validationError,
    });
  }

  private resolveNextSelection(nextDate: TDate, shiftKey: boolean): TngDateValue<TDate> {
    const currentRange = isRangeSelectionValue(this.state.value)
      ? (this.state.value as TngDateRange<TDate>)
      : Object.freeze({ end: null, start: null });

    if (shiftKey && this.config.enableRangeSelection && this.rangeAnchorDate !== null) {
      const shiftedRange = normalizeRangeOrder(this.config.adapter, {
        end: nextDate,
        start: this.rangeAnchorDate,
      });
      if (shiftedRange.start !== null && shiftedRange.end !== null) {
        return shiftedRange;
      }
    }

    if (currentRange.start === null || currentRange.end !== null) {
      return Object.freeze({ end: null, start: nextDate });
    }

    const normalizedRange = normalizeRangeOrder(
      this.config.adapter,
      Object.freeze({ end: nextDate, start: currentRange.start }),
    );
    return normalizedRange;
  }

  private resolveOverlayAttributes(): TngDateRangePickerAttributeMap {
    return freezeAttributes({
      'aria-describedby': this.config.ariaDescribedBy,
      'aria-label': this.config.ariaLabel,
      'aria-labelledby': this.config.ariaLabelledBy ?? this.monthLabelId,
      'aria-modal': this.config.trapFocus ? 'true' : null,
      'data-calendar-layout': this.config.calendarLayout,
      'data-open': this.state.open ? 'true' : 'false',
      'data-position': this.config.position,
      'data-slot': 'date-range-picker-overlay',
      id: this.overlayId,
      role: 'dialog',
    });
  }

  private resolveTriggerAttributes(): TngDateRangePickerAttributeMap {
    return freezeAttributes({
      'aria-controls': this.overlayId,
      'aria-disabled': this.state.disabled ? 'true' : null,
      'aria-expanded': this.state.open ? 'true' : 'false',
      'aria-haspopup': 'dialog',
      'data-disabled': this.state.disabled ? 'true' : null,
      'data-open': this.state.open ? 'true' : 'false',
      'data-slot': 'date-range-picker-trigger',
      disabled: this.state.disabled ? 'true' : null,
      tabindex: this.state.open ? '-1' : undefined,
    });
  }

  private resolveValidDate(date: TDate, monthContext: TDate): TDate {
    const targetMonth = isDateValueInMonth(this.config.adapter, date, monthContext)
      ? monthContext
      : this.config.adapter.startOfMonth(date);
    let nextDate = date;
    if (!isDateValueInMonth(this.config.adapter, nextDate, targetMonth)) {
      nextDate = clampDateToMonth(this.config.adapter, nextDate, targetMonth);
    }

    if (!this.isDateDisabled(nextDate)) {
      return nextDate;
    }

    const fallback = findFirstEnabledDateInMonth(this.config.adapter, targetMonth, (candidate) =>
      this.isDateDisabled(candidate),
    );
    return fallback ?? nextDate;
  }

  private resolveYearAttributes(
    yearOrOption: number | Readonly<TngYearOption<TDate>>,
  ): TngDateRangePickerAttributeMap {
    const option =
      typeof yearOrOption === 'number'
        ? this.getYearOptions().find((item) => item.year === yearOrOption)
        : yearOrOption;
    if (option === undefined) {
      return freezeAttributes({});
    }

    return freezeAttributes({
      'aria-disabled': option.disabled ? 'true' : null,
      'aria-selected': option.selected ? 'true' : 'false',
      'data-active': option.active ? 'true' : null,
      'data-disabled': option.disabled ? 'true' : null,
      'data-focus-visible': option.focusVisible ? 'true' : null,
      'data-selected': option.selected ? 'true' : null,
      'data-slot': 'date-range-picker-year',
      id: option.id,
      role: 'gridcell',
      tabindex: `${this.yearRovingFocus.getActiveId() === option.id ? 0 : -1}`,
    });
  }

  private resolveConfig(
    nextConfig: Partial<TngDateRangePickerConfig<TDate>>,
    previous: TngResolvedConfig<TDate> | null,
  ): TngResolvedConfig<TDate> {
    const adapter =
      nextConfig.adapter ??
      previous?.adapter ??
      (defaultDateRangePickerDateAdapter as unknown as TngDateAdapter<TDate>);
    const ownerDocument =
      nextConfig.ownerDocument ??
      previous?.ownerDocument ??
      (typeof document === 'undefined' ? null : document);
    const locale = nextConfig.locale ?? previous?.locale ?? resolveDefaultLocale(ownerDocument);
    const today =
      normalizeDateInput(adapter, nextConfig.today ?? previous?.today ?? null, locale) ??
      previous?.today ??
      adapter.today();
    const normalizedValue =
      nextConfig.value !== undefined || previous === null
        ? normalizeSelectionInput(adapter, 'range', nextConfig.value ?? null, locale).value
        : previous.value;

    return Object.freeze({
      adapter,
      allowManualInput: nextConfig.allowManualInput ?? previous?.allowManualInput ?? true,
      ariaDescribedBy: nextConfig.ariaDescribedBy ?? previous?.ariaDescribedBy ?? null,
      ariaLabel: nextConfig.ariaLabel ?? previous?.ariaLabel ?? null,
      ariaLabelledBy: nextConfig.ariaLabelledBy ?? previous?.ariaLabelledBy ?? null,
      autoCommitView: nextConfig.autoCommitView ?? previous?.autoCommitView ?? true,
      calendarLayout: normalizeCalendarLayout(
        nextConfig.calendarLayout ?? previous?.calendarLayout,
      ),
      closeOnEscape: nextConfig.closeOnEscape ?? previous?.closeOnEscape ?? true,
      closeOnOutsideClick: nextConfig.closeOnOutsideClick ?? previous?.closeOnOutsideClick ?? true,
      closeOnSelect: nextConfig.closeOnSelect ?? previous?.closeOnSelect ?? false,
      closeOthersOnOpen: nextConfig.closeOthersOnOpen ?? previous?.closeOthersOnOpen ?? false,
      direction: normalizeDirection(nextConfig.direction ?? previous?.direction),
      disableDate: nextConfig.disableDate ?? previous?.disableDate ?? null,
      disabled: nextConfig.disabled ?? previous?.disabled ?? false,
      enableRangeSelection:
        nextConfig.enableRangeSelection ?? previous?.enableRangeSelection ?? true,
      enableTypeahead: nextConfig.enableTypeahead ?? previous?.enableTypeahead ?? true,
      fixedWeeks: nextConfig.fixedWeeks ?? previous?.fixedWeeks ?? true,
      focusStrategy: nextConfig.focusStrategy ?? previous?.focusStrategy ?? 'roving',
      id: nextConfig.id?.trim() || previous?.id || this.instanceId,
      initialView: normalizeView(nextConfig.initialView ?? previous?.initialView),
      locale,
      max: normalizeDateInput(
        adapter,
        nextConfig.maxDate ?? nextConfig.max ?? previous?.max ?? null,
        locale,
      ),
      min: normalizeDateInput(
        adapter,
        nextConfig.minDate ?? nextConfig.min ?? previous?.min ?? null,
        locale,
      ),
      onPartialInputCommit:
        nextConfig.onPartialInputCommit ?? previous?.onPartialInputCommit ?? false,
      overlayMode: normalizeOverlayMode(nextConfig.overlayMode ?? previous?.overlayMode),
      overlayRuntime:
        nextConfig.overlayRuntime ??
        previous?.overlayRuntime ??
        (ownerDocument !== null
          ? createOverlayRuntime({ documentRef: readDocument(ownerDocument) })
          : null),
      overlaySize: nextConfig.overlaySize ?? previous?.overlaySize ?? 320,
      ownerDocument,
      position: normalizePosition(nextConfig.position ?? previous?.position),
      preserveViewOnOpenClose:
        nextConfig.preserveViewOnOpenClose ?? previous?.preserveViewOnOpenClose ?? true,
      restoreFocus: nextConfig.restoreFocus ?? previous?.restoreFocus ?? true,
      selectionMode: 'range',
      showOutsideDays: nextConfig.showOutsideDays ?? previous?.showOutsideDays ?? true,
      skipDisabled: nextConfig.skipDisabled ?? previous?.skipDisabled ?? true,
      today,
      trapFocus: nextConfig.trapFocus ?? previous?.trapFocus ?? false,
      value: normalizedValue,
      weekStartsOn: coerceWeekStartsOn(
        nextConfig.weekStartsOn ?? previous?.weekStartsOn ?? resolveLocaleWeekStartsOn(locale),
      ),
      yearPageSize: ensureYearPageSize(nextConfig.yearPageSize ?? previous?.yearPageSize),
    });
  }

  private registerFocusLayer(): void {
    if (this.focusLayerRegistered || this.overlayElement === null) {
      return;
    }

    dateRangePickerFocusHandoff.registerLayer({
      layerId: this.instanceId,
      members: (): readonly string[] => {
        const overlay = this.overlayElement;
        if (overlay === null) {
          return [];
        }

        return this.resolveFocusableMemberIds(overlay);
      },
      restoreFocus: this.config.restoreFocus,
      trapFocus: this.config.trapFocus,
    });
    this.focusLayerRegistered = true;
  }

  private unregisterFocusLayer(): void {
    if (!this.focusLayerRegistered) {
      return;
    }

    dateRangePickerFocusHandoff.unregisterLayer(this.instanceId);
    this.focusLayerRegistered = false;
  }

  private resolveFocusableMemberIds(container: HTMLElement): readonly string[] {
    const focusableElements = resolveFocusableElements(container);
    const memberIds: string[] = [];
    const seenIds = new Set<string>();

    const registerMember = (element: HTMLElement): void => {
      const id = this.ensureElementId(element);
      if (seenIds.has(id)) {
        return;
      }

      seenIds.add(id);
      memberIds.push(id);
    };

    registerMember(container);
    for (const element of focusableElements) {
      registerMember(element);
    }

    return memberIds;
  }

  private resolveTabbableOverlayMemberIds(container: HTMLElement): readonly string[] {
    const focusableElements = resolveFocusableElements(container);
    const memberIds: string[] = [];
    const seenIds = new Set<string>();

    for (const element of focusableElements) {
      if (element.tabIndex < 0) {
        continue;
      }

      const id = this.ensureElementId(element);
      if (seenIds.has(id)) {
        continue;
      }

      seenIds.add(id);
      memberIds.push(id);
    }

    return memberIds;
  }

  private ensureElementId(element: HTMLElement): string {
    const existingId = element.id.trim();
    if (existingId.length > 0) {
      return existingId;
    }

    const generatedId = createDateRangePickerFocusableId();
    element.id = generatedId;
    return generatedId;
  }

  private optionIndexToGridPosition(
    index: number,
    columnCount: number,
  ): Readonly<{ col: number; row: number }> {
    return Object.freeze({
      col: Math.max(0, index) % columnCount,
      row: Math.floor(Math.max(0, index) / columnCount),
    });
  }

  private resolveCenteredYearPageStart(year: number): number {
    return year - Math.floor(this.config.yearPageSize / 2);
  }

  private resolveYearBoundaryDelta(
    actionType: Exclude<TngGridNavigationActionType, 'activate' | 'exit'>,
  ): number | null {
    if (actionType === 'move-left') {
      return -1;
    }

    if (actionType === 'move-right') {
      return 1;
    }

    if (actionType === 'move-up') {
      return -4;
    }

    if (actionType === 'move-down') {
      return 4;
    }

    return null;
  }

  private resolveMonthBoundaryDelta(
    actionType: Exclude<TngGridNavigationActionType, 'activate' | 'exit'>,
  ): number | null {
    if (actionType === 'move-left') {
      return -1;
    }

    if (actionType === 'move-right') {
      return 1;
    }

    if (actionType === 'move-up') {
      return -4;
    }

    if (actionType === 'move-down') {
      return 4;
    }

    return null;
  }

  private shiftYearPageToInclude(targetYear: number): void {
    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    let nextStart = this.yearPageStart;
    const pageSize = this.config.yearPageSize;

    while (targetYear < nextStart) {
      nextStart -= pageSize;
    }

    while (targetYear > nextStart + pageSize - 1) {
      nextStart += pageSize;
    }

    if (nextStart === this.yearPageStart) {
      return;
    }

    this.yearPageStart = nextStart;
    this.state.visibleMonth = this.config.adapter.createDate(
      targetYear,
      this.config.adapter.getMonth(this.state.visibleMonth),
      1,
    );

    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: this.state.visibleMonth,
    });

    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  private shiftMonthGridToTarget(targetMonth: TDate): void {
    const normalizedTargetMonth = this.config.adapter.startOfMonth(targetMonth);
    if (
      !hasSelectableDateInMonth(this.config.adapter, normalizedTargetMonth, (date) =>
        this.isDateDisabled(date),
      )
    ) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.visibleMonth = normalizedTargetMonth;

    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: this.state.visibleMonth,
    });

    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  private syncDayFocusControllers(cells: readonly TngDateCell<TDate>[]): void {
    const itemIds = cells.map((cell) => cell.id);
    const disabledIds = cells.filter((cell) => cell.disabled).map((cell) => cell.id);
    const activeCellId = cells.find((cell) => cell.active)?.id ?? null;

    this.dayRovingFocus.setItemIds(itemIds);
    this.dayRovingFocus.setDisabledIds(disabledIds);
    this.dayRovingFocus.setActiveId(activeCellId);
    this.dayActiveDescendant.setItemIds(itemIds);
    this.dayActiveDescendant.setDisabledIds(disabledIds);
    this.dayActiveDescendant.setActiveId(activeCellId);
  }

  private syncMonthFocusController(options: readonly TngMonthOption<TDate>[]): void {
    const itemIds = options.map((option) => option.id);
    const disabledIds = options.filter((option) => option.disabled).map((option) => option.id);
    const activeId = options.find((option) => option.active)?.id ?? null;

    this.monthRovingFocus.setItemIds(itemIds);
    this.monthRovingFocus.setDisabledIds(disabledIds);
    this.monthRovingFocus.setActiveId(activeId);
  }

  private syncYearFocusController(options: readonly TngYearOption<TDate>[]): void {
    const itemIds = options.map((option) => option.id);
    const disabledIds = options.filter((option) => option.disabled).map((option) => option.id);
    const activeId = options.find((option) => option.active)?.id ?? null;

    this.yearRovingFocus.setItemIds(itemIds);
    this.yearRovingFocus.setDisabledIds(disabledIds);
    this.yearRovingFocus.setActiveId(activeId);
  }

  private shiftVisibleMonth(direction: 1 | -1): void {
    const nextMonth = this.config.adapter.addMonths(this.state.visibleMonth, direction);
    if (!this.hasSelectableDateInCalendarWindow(nextMonth)) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.visibleMonth = this.config.adapter.startOfMonth(nextMonth);
    const nextActive = clampDateToMonth(
      this.config.adapter,
      this.state.activeDate,
      this.state.visibleMonth,
    );
    this.applyActiveDate(nextActive, 'keyboard', true);
    this.bumpVersion();
    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: this.state.visibleMonth,
    });

    const currentYear = this.config.adapter.getYear(this.state.visibleMonth);
    if (previousYear !== currentYear) {
      this.emit({
        previousYear,
        type: 'yearChange',
        year: currentYear,
      });
    }
  }

  private shiftVisibleYear(direction: 1 | -1): void {
    const nextYear = this.config.adapter.getYear(this.state.visibleMonth) + direction;
    this.selectYear(nextYear);
  }

  private hasSelectableDateInCalendarWindow(leadingMonth: TDate): boolean {
    if (
      hasSelectableDateInMonth(this.config.adapter, leadingMonth, (date) =>
        this.isDateDisabled(date),
      )
    ) {
      return true;
    }

    return (
      this.config.calendarLayout === 'dual' &&
      hasSelectableDateInMonth(
        this.config.adapter,
        this.config.adapter.addMonths(leadingMonth, 1),
        (date) => this.isDateDisabled(date),
      )
    );
  }

  private commitRangeFromAnchor(endDate: TDate): void {
    if (this.rangeAnchorDate === null) {
      return;
    }

    const previousValue = this.state.value;
    const nextValue = normalizeRangeOrder(this.config.adapter, {
      end: endDate,
      start: this.rangeAnchorDate,
    });
    if (nextValue.start === null || nextValue.end === null) {
      return;
    }
    this.state.value = nextValue;
    this.state.inputText = this.formatValueForInput(nextValue);
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger: 'keyboard',
      type: 'valueChange',
      value: nextValue,
    });
  }

  private unregisterOverlayLayer(): void {
    if (!this.overlayLayerRegistered || this.config.overlayRuntime === null) {
      return;
    }

    this.config.overlayRuntime.unregisterLayer(`${this.instanceId}-layer`);
    this.overlayLayerRegistered = false;
  }
}

export function createDateRangePickerController<TDate = Date>(
  config: Readonly<TngDateRangePickerConfig<TDate>> = {},
): TngDateRangePickerController<TDate> {
  return new DateRangePickerController(config);
}

export type {
  TngDateRangeValue,
  TngDateRangePickerAttributeMap,
  TngDateRangePickerCalendarLayout,
  TngDateRangePickerCalendarPanel,
  TngDateRangePickerCloseReason,
  TngDateRangePickerConfig,
  TngDateRangePickerController,
  TngDateRangePickerDirection,
  TngDateRangePickerEvent,
  TngDateRangePickerFocusedSection,
  TngDateRangePickerFocusStrategy,
  TngDateRangePickerLayout,
  TngDateRangePickerListener,
  TngDateRangePickerOverlayRuntime,
  TngDateRangePickerOutputs,
  TngDateRangePickerPosition,
  TngDateRangePickerState,
  TngDateRangePickerStatePatch,
} from './date-range-picker.types';

export { defaultDateRangePickerDateAdapter } from './date-range-picker.adapters';
