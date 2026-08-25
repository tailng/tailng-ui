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
import { coerceWeekStartsOn, defaultDatepickerDateAdapter, normalizeDateInput } from './datepicker.adapters';
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
} from './datepicker.utils';
import {
  clearSelectionForMode,
  normalizeSelectionInput,
  rangeIncludesDate,
  selectionValuesEqual,
  valueIncludesDate,
} from './datepicker.state';
import type {
  TngCalendarView,
  TngDateAdapter,
  TngDateCell,
  TngDateFormatToken,
  TngDateInputValue,
  TngDateRange,
  TngDateSelectionInput,
  TngDateValue,
  TngDatepickerAttributeMap,
  TngDatepickerCloseReason,
  TngDatepickerConfig,
  TngDatepickerController,
  TngDatepickerDirection,
  TngDatepickerEvent,
  TngDatepickerFocusedSection,
  TngDatepickerFocusStrategy,
  TngDatepickerLayout,
  TngDatepickerListener,
  TngDatepickerOverlayRuntime,
  TngDatepickerOutputs,
  TngDatepickerOverlayMode,
  TngDatepickerPosition,
  TngDatepickerSelectionMode,
  TngDatepickerState,
  TngDatepickerStatePatch,
  TngDatepickerTrigger,
  TngMonthOption,
  TngWeekdayIndex,
  TngYearOption,
} from './datepicker.types';

type TngResolvedConfig<TDate> = Readonly<{
  adapter: Readonly<TngDateAdapter<TDate>>;
  allowDeselect: boolean;
  allowManualInput: boolean;
  ariaDescribedBy: string | null;
  ariaLabel: string | null;
  ariaLabelledBy: string | null;
  autoCommitView: boolean;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  closeOnSelect: boolean;
  closeOthersOnOpen: boolean;
  direction: TngDatepickerDirection;
  disableDate: ((date: TDate) => boolean) | null;
  disabled: boolean;
  enableMultipleRangeSelection: boolean;
  enableRangeSelection: boolean;
  enableTypeahead: boolean;
  fixedWeeks: boolean;
  focusStrategy: TngDatepickerFocusStrategy;
  id: string;
  initialView: TngCalendarView;
  locale: string;
  max: TDate | null;
  maxSelections: number | null;
  min: TDate | null;
  onPartialInputCommit: boolean;
  overlayMode: TngDatepickerOverlayMode;
  overlayRuntime: TngOverlayRuntime | null;
  overlaySize: number;
  ownerDocument: Document | null;
  position: TngDatepickerPosition;
  preserveViewOnOpenClose: boolean;
  restoreFocus: boolean;
  selectionMode: TngDatepickerSelectionMode;
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
  focusedSection: TngDatepickerFocusedSection;
  inputText: string;
  lastCloseReason: TngDatepickerCloseReason | null;
  open: boolean;
  validationError: string | null;
  value: TngDateValue<TDate>;
  view: TngCalendarView;
  visibleMonth: TDate;
};

type TngKeyboardEventLike = Readonly<
  Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
>;

const createDatepickerId = createTngIdFactory('tng-datepicker');
const createDatepickerFocusableId = createTngIdFactory('tng-datepicker-focusable');
const datepickerRegistry = new Set<DatepickerController<unknown>>();
const datepickerFocusHandoff = createOverlayFocusHandoffController();
const emptyWeekdayLabels = Object.freeze([]) as readonly string[];
const emptyCells = Object.freeze([]) as readonly TngDateCell<unknown>[];
const emptyMonths = Object.freeze([]) as readonly TngMonthOption<unknown>[];
const emptyYears = Object.freeze([]) as readonly TngYearOption<unknown>[];

function freezeAttributes(attributes: Readonly<Record<string, string | null | undefined>>): TngDatepickerAttributeMap {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    normalized[key] = value;
  }
  return Object.freeze(normalized);
}

function mapOverlayDismissReason(reason: TngOverlayDismissReason): TngDatepickerCloseReason {
  if (reason === 'escape-key') {
    return 'escape';
  }

  if (reason === 'outside-pointer' || reason === 'focus-outside') {
    return 'outside';
  }

  return 'programmatic';
}

function hasDisallowedModifiers(event: Readonly<Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey'>>): boolean {
  return event.altKey === true || event.ctrlKey === true || event.metaKey === true;
}

function normalizeSelectionMode(value: string | undefined): TngDatepickerSelectionMode {
  return value === 'multiple' || value === 'range' ? value : 'single';
}

function normalizeView(value: string | undefined): TngCalendarView {
  return value === 'month' || value === 'year' ? value : 'day';
}

function normalizePosition(value: string | undefined): TngDatepickerPosition {
  return value === 'center' || value === 'end' ? value : 'start';
}

function normalizeOverlayMode(value: string | undefined): TngDatepickerOverlayMode {
  return value === 'push' || value === 'side' ? value : 'overlay';
}

function normalizeDirection(value: string | undefined): TngDatepickerDirection {
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

function readDocument(
  input: Document | null | undefined,
): TngOverlayInteractionDomDocument | null {
  return input as TngOverlayInteractionDomDocument | null;
}

class DatepickerController<TDate> implements TngDatepickerController<TDate> {
  private readonly instanceId: string;
  private readonly gridId: string;
  private readonly overlayId: string;
  private readonly monthLabelId: string;
  private readonly listenerSet = new Set<TngDatepickerListener<TDate>>();
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
  private cachedOutputs: TngDatepickerOutputs<TDate> | null = null;
  private cachedWeekdayLabels: readonly string[] = emptyWeekdayLabels;
  private cachedCells: readonly TngDateCell<TDate>[] = emptyCells as readonly TngDateCell<TDate>[];
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

  public constructor(config: Readonly<TngDatepickerConfig<TDate>>) {
    this.instanceId = config.id?.trim() || createDatepickerId();
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
    const visibleMonth = this.config.adapter.startOfMonth(initialActiveDate);
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
    this.yearPageStart = this.resolveCenteredYearPageStart(this.config.adapter.getYear(initialActiveDate));
    this.rangeAnchorDate = this.extractSelectionAnchor(this.state.value);

    if (this.state.open) {
      const activeElement = this.resolveActiveElement();
      this.restoreFocusTargetId = activeElement === null ? null : this.ensureElementId(activeElement);
      this.registerOverlayLayer();
      this.activateFocusLayer();
    }

    datepickerRegistry.add(this as unknown as DatepickerController<unknown>);
  }

  public clear(): void {
    if (this.destroyed) {
      return;
    }

    const previousValue = this.state.value;
    const nextValue = clearSelectionForMode<TDate>(this.config.selectionMode);
    if (selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)) {
      return;
    }

    this.state.value = nextValue;
    this.rangeAnchorDate = null;
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

  public close(reason: TngDatepickerCloseReason = 'programmatic'): void {
    if (this.destroyed || !this.state.open) {
      return;
    }

    this.emit({ reason, type: 'closeStart' });
    this.state.open = false;
    this.state.lastCloseReason = reason;
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
    const parsed = this.parseInputText(inputText);
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
    datepickerRegistry.delete(this as unknown as DatepickerController<unknown>);
  }

  public formatDate(date: TDate, format: TngDateFormatToken | string = 'label'): string {
    return this.config.adapter.format(date, format, this.config.locale);
  }

  public getOutputs(): TngDatepickerOutputs<TDate> {
    if (this.cachedOutputs !== null && this.cachedOutputsVersion === this.version) {
      return this.cachedOutputs;
    }

    const outputs: TngDatepickerOutputs<TDate> = Object.freeze({
      activeDate: this.state.activeDate,
      cells: this.getCells(),
      focusedSection: this.state.focusedSection,
      getCellAttributes: (cellOrDate) => this.resolveCellAttributes(cellOrDate),
      getGridAttributes: () => this.resolveGridAttributes(),
      getHostAttributes: () => this.resolveHostAttributes(),
      getMonthAttributes: (monthOrOption) => this.resolveMonthAttributes(monthOrOption),
      getOverlayAttributes: () => this.resolveOverlayAttributes(),
      getTriggerAttributes: () => this.resolveTriggerAttributes(),
      getYearAttributes: (yearOrOption) => this.resolveYearAttributes(yearOrOption),
      inputText: this.state.inputText,
      labelMonthYear: this.config.adapter.format(this.state.visibleMonth, 'month-year', this.config.locale),
      layout: this.resolveLayout(),
      monthOptions: this.getMonthOptions(),
      open: this.state.open,
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

  public getState(): TngDatepickerState<TDate> {
    return Object.freeze({
      activeDate: this.state.activeDate,
      disabled: this.state.disabled,
      focusedSection: this.state.focusedSection,
      inputText: this.state.inputText,
      lastCloseReason: this.state.lastCloseReason,
      open: this.state.open,
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
    if (this.destroyed || this.config.selectionMode !== 'range' || this.rangeAnchorDate === null) {
      return;
    }

    const normalized = normalizeDateInput(this.config.adapter, date, this.config.locale);
    if (normalized === null) {
      return;
    }

    this.hoverDate = normalized;
    this.bumpVersion();
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
      this.selectDate(this.state.activeDate, {
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
    if (overlay === null || !datepickerFocusHandoff.isTrapActive(this.instanceId)) {
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
      activeElement !== null && overlay.contains(activeElement) ? this.ensureElementId(activeElement) : null;

    let candidateId: string | null = null;
    if (activeElementId === null) {
      candidateId = event.shiftKey ? lastMemberId : firstMemberId;
    } else if (activeElementId === firstMemberId && event.shiftKey) {
      candidateId = lastMemberId;
    } else if (activeElementId === lastMemberId && !event.shiftKey) {
      candidateId = firstMemberId;
    } else {
      datepickerFocusHandoff.recordFocus(this.instanceId, activeElementId);
      return;
    }

    const resolvedId = datepickerFocusHandoff.resolveFocusCandidate(this.instanceId, candidateId);
    if (resolvedId === null) {
      return;
    }

    const nextFocusTarget = this.resolveElementById(resolvedId);
    if (nextFocusTarget === null) {
      return;
    }

    event.preventDefault();
    nextFocusTarget.focus();
    datepickerFocusHandoff.recordFocus(this.instanceId, resolvedId);
  }

  public handleTriggerKeyDown(event: Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>): void {
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
      for (const controller of datepickerRegistry) {
        if (controller === (this as unknown as DatepickerController<unknown>)) {
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
    this.applyActiveDate(this.resolveInitialActiveDate(this.state.value, this.config.today), 'programmatic', true);
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
    options: Readonly<{ shiftKey?: boolean; trigger?: TngDatepickerTrigger }> = {},
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
    if (selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, nextValue)) {
      if (this.state.validationError !== null) {
        this.bumpVersion();
      }
      return;
    }

    this.state.value = nextValue;
    this.state.inputText = this.formatValueForInput(nextValue);
    this.rangeAnchorDate = this.extractSelectionAnchor(nextValue) ?? normalized;
    this.applyActiveDate(normalized, trigger, true);
    this.bumpVersion();
    this.emit({
      previousValue,
      trigger,
      type: 'valueChange',
      value: nextValue,
    });

    if (this.config.closeOnSelect && this.state.open) {
      this.close('select');
    }
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
    if (!hasSelectableDateInMonth(this.config.adapter, nextMonth, (date) => this.isDateDisabled(date))) {
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
    if (!hasSelectableDateInYear(
      this.config.adapter,
      normalizedYear,
      this.state.visibleMonth,
      (date) => this.isDateDisabled(date),
    )) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const nextMonth = this.resolveSelectableMonthInYear(
      normalizedYear,
      this.config.adapter.getMonth(previousMonth),
    );
    if (nextMonth === null) {
      return;
    }

    this.state.visibleMonth = nextMonth;
    this.yearPageStart = this.resolveCenteredYearPageStart(normalizedYear);
    const nextActive = clampDateToMonth(this.config.adapter, this.state.activeDate, nextMonth);
    this.applyActiveDate(nextActive, 'programmatic', true);
    this.bumpVersion();
    this.emit({
      previousMonth,
      type: 'monthChange',
      visibleMonth: nextMonth,
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

  public setActiveDate(date: TngDateInputValue<TDate>, trigger: TngDatepickerTrigger = 'programmatic'): void {
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

  public setConfig(config: Partial<TngDatepickerConfig<TDate>>): void {
    if (this.destroyed) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    const previousTrapFocus = this.config.trapFocus;
    this.config = this.resolveConfig(config, this.config);
    this.state.disabled = this.config.disabled;
    this.state.value = this.coerceSelectionWithinConstraints(this.state.value);
    this.state.activeDate = this.resolveValidDate(this.state.activeDate, this.state.visibleMonth);
    if (!isDateValueInMonth(this.config.adapter, this.state.activeDate, this.state.visibleMonth)) {
      this.state.visibleMonth = this.config.adapter.startOfMonth(this.state.activeDate);
    }
    this.yearPageStart = this.resolveCenteredYearPageStart(this.config.adapter.getYear(this.state.activeDate));
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

  public setFocusedSection(section: TngDatepickerFocusedSection): void {
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

  public setState(patch: Readonly<TngDatepickerStatePatch<TDate>>): void {
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
      const normalized = normalizeDateInput(this.config.adapter, patch.visibleMonth, this.config.locale);
      if (normalized !== null) {
        this.state.visibleMonth = this.config.adapter.startOfMonth(normalized);
      }
    }

    if (patch.activeDate !== undefined) {
      const normalized = normalizeDateInput(this.config.adapter, patch.activeDate, this.config.locale);
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

    if (!selectionValuesEqual(this.config.adapter, this.config.selectionMode, previousValue, this.state.value)) {
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
    if (normalized.validationError !== null) {
      this.state.validationError = normalized.validationError;
    }

    const coerced = this.coerceSelectionWithinConstraints(normalized.value);
    if (selectionValuesEqual(this.config.adapter, this.config.selectionMode, this.state.value, coerced)) {
      return;
    }

    const previousValue = this.state.value;
    this.state.value = coerced;
    this.state.validationError = normalized.validationError;
    this.state.inputText = this.formatValueForInput(coerced);
    const anchor = this.extractSelectionAnchor(coerced);
    if (anchor !== null) {
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
      this.yearPageStart = this.resolveCenteredYearPageStart(this.config.adapter.getYear(this.state.activeDate));
    }
    if (
      normalizedView === 'day' &&
      !isDateValueInMonth(this.config.adapter, this.state.activeDate, this.state.visibleMonth)
    ) {
      this.state.visibleMonth = this.config.adapter.startOfMonth(this.state.activeDate);
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

    if (!hasSelectableDateInMonth(this.config.adapter, nextMonth, (date) => this.isDateDisabled(date))) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.visibleMonth = this.config.adapter.startOfMonth(nextMonth);
    this.yearPageStart = this.resolveCenteredYearPageStart(this.config.adapter.getYear(this.state.visibleMonth));
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

  public subscribe(listener: TngDatepickerListener<TDate>): () => void {
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
    trigger: TngDatepickerTrigger,
    focusVisible: boolean,
  ): void {
    const resolved = this.resolveValidDate(nextDate, this.state.visibleMonth);
    if (datesEqual(this.config.adapter, resolved, this.state.activeDate)) {
      this.focusVisibleDate = focusVisible ? resolved : null;
      this.bumpVersion();
      return;
    }

    const previousActiveDate = this.state.activeDate;
    this.state.activeDate = resolved;
    this.focusVisibleDate = focusVisible ? resolved : null;
    if (!isDateValueInMonth(this.config.adapter, resolved, this.state.visibleMonth)) {
      const previousMonth = this.state.visibleMonth;
      const previousYear = this.config.adapter.getYear(previousMonth);
      this.state.visibleMonth = this.config.adapter.startOfMonth(resolved);
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
    trigger: TngDatepickerTrigger,
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

  private bumpVersion(): void {
    this.version += 1;
  }

  private coerceSelectionWithinConstraints(value: TngDateValue<TDate>): TngDateValue<TDate> {
    if (value === null) {
      return clearSelectionForMode(this.config.selectionMode);
    }

    if (this.config.selectionMode === 'single') {
      const date = value as TDate;
      if (this.isDateDisabled(date)) {
        this.state.validationError = 'out-of-range';
        return null;
      }
      return date;
    }

    if (this.config.selectionMode === 'multiple') {
      const values = (value as readonly TDate[]).filter((date) => !this.isDateDisabled(date));
      if ((value as readonly TDate[]).length !== values.length) {
        this.state.validationError = 'out-of-range';
      }
      return Object.freeze(values);
    }

    const range = normalizeRangeOrder(this.config.adapter, value as TngDateRange<TDate>);
    if (range.start === null) {
      return Object.freeze({ end: null, start: null });
    }
    if (this.isDateDisabled(range.start)) {
      this.state.validationError = 'out-of-range';
      return Object.freeze({ end: null, start: null });
    }
    if (range.end === null) {
      return range;
    }
    if (this.isDateDisabled(range.end) || this.rangeContainsDisabledDate(range.start, range.end)) {
      this.state.validationError = 'range-disabled';
      return Object.freeze({ end: null, start: range.start });
    }
    return range;
  }

  private emit(event: TngDatepickerEvent<TDate>): void {
    for (const listener of this.listenerSet) {
      listener(event);
    }
  }

  private extractSelectionAnchor(value: TngDateValue<TDate>): TDate | null {
    if (value === null) {
      return null;
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value[value.length - 1] : null;
    }
    if (isRangeSelectionValue(value)) {
      return value.end ?? value.start;
    }
    return value as TDate;
  }

  private formatValueForInput(value: TngDateValue<TDate>): string {
    if (value === null) {
      return '';
    }

    if (this.config.selectionMode === 'single') {
      return this.config.adapter.format(value as TDate, 'input', this.config.locale);
    }

    if (this.config.selectionMode === 'multiple') {
      return (value as readonly TDate[])
        .map((date) => this.config.adapter.format(date, 'input', this.config.locale))
        .join(', ');
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
    const canonicalInputText = this.config.adapter.format(parsed, 'input', this.config.locale).trim();
    return inputText === canonicalInputText;
  }

  private getCells(): readonly TngDateCell<TDate>[] {
    if (this.cachedGridVersion === this.version) {
      return this.cachedCells;
    }

    const cells = buildMonthGrid({
      activeDate: this.state.activeDate,
      adapter: this.config.adapter,
      createCellId: (date) => `${this.instanceId}-cell-${toDateKey(this.config.adapter, date)}`,
      fixedWeeks: this.config.fixedWeeks,
      focusStrategy: this.config.focusStrategy,
      focusedDate: this.focusVisibleDate,
      inRange: (date) => rangeIncludesDate(this.config.adapter, this.state.value, date),
      isDisabled: (date) => this.isDateDisabled(date),
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
      visibleMonth: this.state.visibleMonth,
      weekStartsOn: this.config.weekStartsOn,
    });

    this.syncDayFocusControllers(cells);

    if (this.config.enableTypeahead) {
      this.typeahead.setItems(
        cells
          .filter((cell) => !cell.disabled && !cell.hidden)
          .map((cell) => ({ disabled: false, id: cell.id, text: cell.label })),
      );
    }

    this.cachedCells = cells;
    this.cachedGridVersion = this.version;
    return cells;
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
          this.config.adapter.createDate(this.config.adapter.getYear(this.state.visibleMonth), month, 1),
          (date) => this.isDateDisabled(date),
        ),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      locale: this.config.locale,
      selectedMonth: (month) => {
        if (this.config.selectionMode === 'multiple') {
          return false;
        }
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
      this.config.adapter.format(this.config.adapter.addDays(start, index), 'weekday-short', this.config.locale),
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
        !hasSelectableDateInYear(
          this.config.adapter,
          year,
          this.state.visibleMonth,
          (date) => this.isDateDisabled(date),
        ),
      focusedDate: this.focusVisibleDate,
      focusedSection: this.state.focusedSection,
      locale: this.config.locale,
      selectedYear: (year) => {
        if (this.config.selectionMode === 'multiple') {
          return false;
        }
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

    const nextPosition = resolveNavigableGridCell(
      currentPosition,
      action.type,
      {
        bounds: {
          colCount: 4,
          rowCount: Math.ceil(options.length / 4),
        },
        cells: options.map((option, index) => ({
          col: index % 4,
          disabled: option.disabled,
          row: Math.floor(index / 4),
        })),
      },
    );
    const yearDelta = view === 'year' ? this.resolveYearBoundaryDelta(action.type) : null;
    const monthDelta = view === 'month' ? this.resolveMonthBoundaryDelta(action.type) : null;
    const isBoundaryClamp =
      ((view === 'year' && yearDelta !== null) || (view === 'month' && monthDelta !== null)) &&
      nextPosition !== null &&
      nextPosition.row === currentPosition.row &&
      nextPosition.col === currentPosition.col;

    if (nextPosition === null || isBoundaryClamp) {
      if (view === 'year' && yearDelta !== null) {
        this.state.focusedSection = 'year';
        const fallbackYearOption =
          action.type === 'move-up' || action.type === 'move-down'
            ? this.findYearOptionInVerticalDirection(options as readonly TngYearOption<TDate>[], activeIndex, action.type)
            : null;
        if (fallbackYearOption !== null) {
          this.applyPickerActiveDate(fallbackYearOption.date, 'keyboard', true);
          return;
        }
        const targetYear = (currentOption as TngYearOption<TDate>).year + yearDelta;
        if (!hasSelectableDateInYear(
          this.config.adapter,
          targetYear,
          this.state.visibleMonth,
          (date) => this.isDateDisabled(date),
        )) {
          return;
        }
        this.shiftYearPageToInclude(targetYear);
        this.applyPickerActiveDate(
          this.config.adapter.createDate(targetYear, this.config.adapter.getMonth(this.state.visibleMonth), 1),
          'keyboard',
          true,
        );
        return;
      }

      if (view === 'month' && monthDelta !== null) {
        this.state.focusedSection = 'month';
        const targetMonth = this.config.adapter.addMonths((currentOption as TngMonthOption<TDate>).date, monthDelta);
        if (!hasSelectableDateInMonth(this.config.adapter, targetMonth, (date) => this.isDateDisabled(date))) {
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
    const cells = this.getCells();
    const activeCell = cells.find((cell) => cell.active) ?? null;
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
      if (
        shiftKey &&
        this.config.selectionMode === 'range' &&
        this.config.enableRangeSelection
      ) {
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

    const cell = this.getCells().find((item) => item.id === result.activeId);
    if (cell === undefined) {
      return;
    }

    this.applyActiveDate(cell.date, 'keyboard', true);
  }

  private isDateDisabled(date: TDate): boolean {
    if (this.state?.disabled === true) {
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

  private rangeContainsDisabledDate(start: TDate, end: TDate): boolean {
    let current = start;
    while (this.config.adapter.compare(current, end) <= 0) {
      if (this.isDateDisabled(current)) {
        return true;
      }
      current = this.config.adapter.addDays(current, 1);
    }
    return false;
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

    datepickerFocusHandoff.activateLayer(this.instanceId, this.restoreFocusTargetId);
  }

  private deactivateFocusLayer(): void {
    if (!this.focusLayerRegistered) {
      return;
    }

    const restoreFocusTargetId = datepickerFocusHandoff.deactivateLayer(this.instanceId);
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

    const resolvedTargetId = datepickerFocusHandoff.resolveFocusCandidate(this.instanceId, targetId);
    if (resolvedTargetId === null) {
      return;
    }

    const target = this.resolveElementById(resolvedTargetId);
    if (target === null) {
      return;
    }

    target.focus();
    datepickerFocusHandoff.recordFocus(this.instanceId, resolvedTargetId);
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

  private resolveCellAttributes(cellOrDate: Readonly<TngDateCell<TDate>> | TDate): TngDatepickerAttributeMap {
    const cell = 'id' in (cellOrDate as TngDateCell<TDate>)
      ? (cellOrDate as TngDateCell<TDate>)
      : this.getCells().find((candidate) => datesEqual(this.config.adapter, candidate.date, cellOrDate as TDate));
    if (cell === undefined) {
      return freezeAttributes({});
    }

    return freezeAttributes({
      'aria-current': cell.today ? 'date' : null,
      'aria-disabled': cell.disabled ? 'true' : null,
      'aria-selected': cell.selected ? 'true' : 'false',
      'data-active': cell.active ? 'true' : null,
      'data-disabled': cell.disabled ? 'true' : null,
      'data-focus-visible': cell.focusVisible ? 'true' : null,
      'data-hidden': cell.hidden ? 'true' : null,
      'data-in-month': cell.inMonth ? 'true' : null,
      'data-in-range': cell.inRange ? 'true' : null,
      'data-range-end': cell.rangeEnd ? 'true' : null,
      'data-range-start': cell.rangeStart ? 'true' : null,
      'data-selected': cell.selected ? 'true' : null,
      'data-slot': 'datepicker-cell',
      id: cell.id,
      role: 'gridcell',
      tabindex:
        this.config.focusStrategy === 'roving'
          ? `${this.dayRovingFocus.getActiveId() === cell.id ? 0 : -1}`
          : '-1',
    });
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
        return this.gridId;
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

  private resolveGridAttributes(): TngDatepickerAttributeMap {
    const activeDescendantAttributes =
      this.config.focusStrategy === 'active-descendant'
        ? this.dayActiveDescendant.getHostAttributes()
        : null;

    return freezeAttributes({
      'aria-activedescendant': activeDescendantAttributes?.['aria-activedescendant'] ?? null,
      'aria-labelledby': this.monthLabelId,
      'data-slot': 'datepicker-grid',
      id: this.gridId,
      role: 'grid',
    });
  }

  private resolveHostAttributes(): TngDatepickerAttributeMap {
    return freezeAttributes({
      'aria-describedby': this.config.ariaDescribedBy,
      'aria-label': this.config.ariaLabel,
      'aria-labelledby': this.config.ariaLabelledBy,
      'data-disabled': this.state.disabled ? 'true' : null,
      'data-open': this.state.open ? 'true' : 'false',
      'data-slot': 'datepicker',
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

  private resolveSelectableMonthInYear(year: number, preferredMonth: number): TDate | null {
    const normalizedPreferredMonth = Math.max(0, Math.min(11, Math.trunc(preferredMonth)));
    const createMonth = (month: number): TDate => this.config.adapter.createDate(year, month, 1);
    const hasSelectableDate = (monthDate: TDate): boolean =>
      hasSelectableDateInMonth(this.config.adapter, monthDate, (date) => this.isDateDisabled(date));

    const preferred = createMonth(normalizedPreferredMonth);
    if (hasSelectableDate(preferred)) {
      return preferred;
    }

    for (let offset = 1; offset < 12; offset += 1) {
      const previousMonth = normalizedPreferredMonth - offset;
      if (previousMonth >= 0) {
        const previous = createMonth(previousMonth);
        if (hasSelectableDate(previous)) {
          return previous;
        }
      }

      const nextMonth = normalizedPreferredMonth + offset;
      if (nextMonth < 12) {
        const next = createMonth(nextMonth);
        if (hasSelectableDate(next)) {
          return next;
        }
      }
    }

    return null;
  }

  private resolveLayout(): TngDatepickerLayout {
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
  ): TngDatepickerAttributeMap {
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
      'data-slot': 'datepicker-month',
      id: option.id,
      role: 'gridcell',
      tabindex: `${this.monthRovingFocus.getActiveId() === option.id ? 0 : -1}`,
    });
  }

  private resolveNextSelection(nextDate: TDate, shiftKey: boolean): TngDateValue<TDate> {
    if (this.config.selectionMode === 'single') {
      if (
        this.config.allowDeselect &&
        this.state.value !== null &&
        !Array.isArray(this.state.value) &&
        datesEqual(this.config.adapter, this.state.value as TDate, nextDate)
      ) {
        return null;
      }

      return nextDate;
    }

    if (this.config.selectionMode === 'range') {
      const currentRange =
        isRangeSelectionValue(this.state.value)
          ? (this.state.value as TngDateRange<TDate>)
          : Object.freeze({ end: null, start: null });

      if (
        shiftKey &&
        this.config.enableRangeSelection &&
        this.rangeAnchorDate !== null &&
        !this.rangeContainsDisabledDate(
          normalizeRangeOrder(this.config.adapter, {
            end: nextDate,
            start: this.rangeAnchorDate,
          }).start as TDate,
          normalizeRangeOrder(this.config.adapter, {
            end: nextDate,
            start: this.rangeAnchorDate,
          }).end as TDate,
        )
      ) {
        return normalizeRangeOrder(this.config.adapter, Object.freeze({ end: nextDate, start: this.rangeAnchorDate }));
      }

      if (currentRange.start === null || currentRange.end !== null) {
        return Object.freeze({ end: null, start: nextDate });
      }

      const normalizedRange = normalizeRangeOrder(
        this.config.adapter,
        Object.freeze({ end: nextDate, start: currentRange.start }),
      );
      if (
        normalizedRange.start !== null &&
        normalizedRange.end !== null &&
        this.rangeContainsDisabledDate(normalizedRange.start, normalizedRange.end)
      ) {
        return Object.freeze({ end: null, start: currentRange.start });
      }

      return normalizedRange;
    }

    const currentValues: TDate[] = Array.isArray(this.state.value)
      ? [...(this.state.value as readonly TDate[])]
      : [];
    const existingIndex = currentValues.findIndex((selected) => datesEqual(this.config.adapter, selected, nextDate));
    if (shiftKey && this.config.enableMultipleRangeSelection && this.rangeAnchorDate !== null) {
      const dates: TDate[] = [];
      const orderedRange = normalizeRangeOrder(this.config.adapter, {
        end: nextDate,
        start: this.rangeAnchorDate,
      });
      if (orderedRange.start !== null && orderedRange.end !== null) {
        let cursor: TDate = orderedRange.start;
        while (this.config.adapter.compare(cursor, orderedRange.end) <= 0) {
          if (!this.isDateDisabled(cursor)) {
            dates.push(cursor);
          }
          cursor = this.config.adapter.addDays(cursor, 1);
        }
      }
      const merged = Array.from(new Map([...currentValues, ...dates].map((date) => [toDateKey(this.config.adapter, date), date])).values());
      const sorted = merged.sort((left, right) => this.config.adapter.compare(left, right));
      if (this.config.maxSelections !== null && sorted.length > this.config.maxSelections) {
        this.state.validationError = 'max-selections';
      }
      return Object.freeze(sorted.slice(0, this.config.maxSelections ?? Number.MAX_SAFE_INTEGER));
    }

    if (existingIndex >= 0) {
      currentValues.splice(existingIndex, 1);
      return Object.freeze(currentValues);
    }

    if (this.config.maxSelections !== null && currentValues.length >= this.config.maxSelections) {
      this.state.validationError = 'max-selections';
      return Object.freeze(currentValues);
    }

    currentValues.push(nextDate);
    currentValues.sort((left, right) => this.config.adapter.compare(left, right));
    return Object.freeze(currentValues);
  }

  private resolveOverlayAttributes(): TngDatepickerAttributeMap {
    return freezeAttributes({
      'aria-describedby': this.config.ariaDescribedBy,
      'aria-label': this.config.ariaLabel,
      'aria-labelledby': this.config.ariaLabelledBy ?? this.monthLabelId,
      'aria-modal': this.config.trapFocus ? 'true' : null,
      'data-open': this.state.open ? 'true' : 'false',
      'data-position': this.config.position,
      'data-slot': 'datepicker-overlay',
      id: this.overlayId,
      role: 'dialog',
    });
  }

  private resolveTriggerAttributes(): TngDatepickerAttributeMap {
    return freezeAttributes({
      'aria-controls': this.overlayId,
      'aria-expanded': this.state.open ? 'true' : 'false',
      'aria-haspopup': 'dialog',
      'data-open': this.state.open ? 'true' : 'false',
      'data-slot': 'datepicker-trigger',
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
  ): TngDatepickerAttributeMap {
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
      'data-slot': 'datepicker-year',
      id: option.id,
      role: 'gridcell',
      tabindex: `${this.yearRovingFocus.getActiveId() === option.id ? 0 : -1}`,
    });
  }

  private resolveConfig(
    nextConfig: Partial<TngDatepickerConfig<TDate>>,
    previous: TngResolvedConfig<TDate> | null,
  ): TngResolvedConfig<TDate> {
    const adapter = nextConfig.adapter ?? previous?.adapter ?? (defaultDatepickerDateAdapter as unknown as TngDateAdapter<TDate>);
    const ownerDocument = nextConfig.ownerDocument ?? previous?.ownerDocument ?? (typeof document === 'undefined' ? null : document);
    const locale = nextConfig.locale ?? previous?.locale ?? resolveDefaultLocale(ownerDocument);
    const today =
      normalizeDateInput(adapter, nextConfig.today ?? previous?.today ?? null, locale) ??
      previous?.today ??
      adapter.today();
    const normalizedValue =
      nextConfig.value !== undefined || previous === null
        ? normalizeSelectionInput(
            adapter,
            normalizeSelectionMode(nextConfig.selectionMode ?? previous?.selectionMode),
            nextConfig.value ?? null,
            locale,
          ).value
        : previous.value;

    return Object.freeze({
      adapter,
      allowDeselect: nextConfig.allowDeselect ?? previous?.allowDeselect ?? false,
      allowManualInput: nextConfig.allowManualInput ?? previous?.allowManualInput ?? true,
      ariaDescribedBy: nextConfig.ariaDescribedBy ?? previous?.ariaDescribedBy ?? null,
      ariaLabel: nextConfig.ariaLabel ?? previous?.ariaLabel ?? null,
      ariaLabelledBy: nextConfig.ariaLabelledBy ?? previous?.ariaLabelledBy ?? null,
      autoCommitView: nextConfig.autoCommitView ?? previous?.autoCommitView ?? true,
      closeOnEscape: nextConfig.closeOnEscape ?? previous?.closeOnEscape ?? true,
      closeOnOutsideClick: nextConfig.closeOnOutsideClick ?? previous?.closeOnOutsideClick ?? true,
      closeOnSelect: nextConfig.closeOnSelect ?? previous?.closeOnSelect ?? false,
      closeOthersOnOpen: nextConfig.closeOthersOnOpen ?? previous?.closeOthersOnOpen ?? false,
      direction: normalizeDirection(nextConfig.direction ?? previous?.direction),
      disableDate: nextConfig.disableDate ?? previous?.disableDate ?? null,
      disabled: nextConfig.disabled ?? previous?.disabled ?? false,
      enableMultipleRangeSelection:
        nextConfig.enableMultipleRangeSelection ?? previous?.enableMultipleRangeSelection ?? true,
      enableRangeSelection: nextConfig.enableRangeSelection ?? previous?.enableRangeSelection ?? true,
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
      maxSelections: nextConfig.maxSelections ?? previous?.maxSelections ?? null,
      min: normalizeDateInput(
        adapter,
        nextConfig.minDate ?? nextConfig.min ?? previous?.min ?? null,
        locale,
      ),
      onPartialInputCommit: nextConfig.onPartialInputCommit ?? previous?.onPartialInputCommit ?? false,
      overlayMode: normalizeOverlayMode(nextConfig.overlayMode ?? previous?.overlayMode),
      overlayRuntime:
        nextConfig.overlayRuntime ??
        previous?.overlayRuntime ??
        (ownerDocument !== null ? createOverlayRuntime({ documentRef: readDocument(ownerDocument) }) : null),
      overlaySize: nextConfig.overlaySize ?? previous?.overlaySize ?? 320,
      ownerDocument,
      position: normalizePosition(nextConfig.position ?? previous?.position),
      preserveViewOnOpenClose:
        nextConfig.preserveViewOnOpenClose ?? previous?.preserveViewOnOpenClose ?? true,
      restoreFocus: nextConfig.restoreFocus ?? previous?.restoreFocus ?? true,
      selectionMode: normalizeSelectionMode(nextConfig.selectionMode ?? previous?.selectionMode),
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

    datepickerFocusHandoff.registerLayer({
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

    datepickerFocusHandoff.unregisterLayer(this.instanceId);
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

    const generatedId = createDatepickerFocusableId();
    element.id = generatedId;
    return generatedId;
  }

  private optionIndexToGridPosition(index: number, columnCount: number): Readonly<{ col: number; row: number }> {
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
    if (!hasSelectableDateInMonth(this.config.adapter, normalizedTargetMonth, (date) => this.isDateDisabled(date))) {
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
    if (!hasSelectableDateInMonth(this.config.adapter, nextMonth, (date) => this.isDateDisabled(date))) {
      return;
    }

    const previousMonth = this.state.visibleMonth;
    const previousYear = this.config.adapter.getYear(previousMonth);
    this.state.visibleMonth = this.config.adapter.startOfMonth(nextMonth);
    const nextActive = clampDateToMonth(this.config.adapter, this.state.activeDate, this.state.visibleMonth);
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
    if (this.rangeContainsDisabledDate(nextValue.start, nextValue.end)) {
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

export function createDatepickerController<TDate = Date>(
  config: Readonly<TngDatepickerConfig<TDate>> = {},
): TngDatepickerController<TDate> {
  return new DatepickerController(config);
}

export type {
  TngCalendarView,
  TngDateAdapter,
  TngDateCell,
  TngDateFormatToken,
  TngDateInputValue,
  TngDateRange,
  TngDateSelectionInput,
  TngDateValue,
  TngDatepickerAttributeMap,
  TngDatepickerCloseReason,
  TngDatepickerConfig,
  TngDatepickerController,
  TngDatepickerDirection,
  TngDatepickerEvent,
  TngDatepickerFocusedSection,
  TngDatepickerFocusStrategy,
  TngDatepickerLayout,
  TngDatepickerListener,
  TngDatepickerOverlayRuntime,
  TngDatepickerOutputs,
  TngDatepickerPosition,
  TngDatepickerSelectionMode,
  TngDatepickerState,
  TngMonthOption,
  TngWeekdayIndex,
  TngYearOption,
} from './datepicker.types';

export { defaultDatepickerDateAdapter, normalizeDateInput } from './datepicker.adapters';
