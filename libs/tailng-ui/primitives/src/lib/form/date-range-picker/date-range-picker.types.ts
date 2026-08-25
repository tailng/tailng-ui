import type { TngOverlayRuntime } from '@tailng-ui/cdk';

export type TngCalendarView = 'day' | 'month' | 'year';
export type TngDateRangePickerCalendarLayout = 'dual' | 'single';
export type TngDateRangePickerSelectionMode = 'range';
export type TngDateRangePickerDirection = 'ltr' | 'rtl';
export type TngDateRangePickerFocusStrategy = 'active-descendant' | 'roving';
export type TngDateRangePickerFocusedSection = 'day' | 'month' | 'year';
export type TngDateRangePickerOverlayMode = 'overlay' | 'push' | 'side';
export type TngDateRangePickerPosition = 'center' | 'end' | 'start';
export type TngDateRangePickerCloseReason = 'escape' | 'outside' | 'programmatic' | 'select';
export type TngDateFormatToken =
  | 'input'
  | 'label'
  | 'month-year'
  | 'month-long'
  | 'month-short'
  | 'weekday-short'
  | 'weekday-narrow'
  | 'day-number'
  | 'year-label';
export type TngWeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TngDateInputValue<TDate> = Date | TDate | string | null | undefined;

export type TngDateRange<TDate> = Readonly<{
  end: TDate | null;
  start: TDate | null;
}>;

export type TngDateRangeValue<TDate = Date> = TngDateRange<TDate>;

export type TngDateRangeInput<TDate> = Readonly<{
  end: TngDateInputValue<TDate>;
  start: TngDateInputValue<TDate>;
}>;

export type TngDateValue<TDate> = TngDateRange<TDate> | null;
export type TngDateSelectionInput<TDate> = TngDateInputValue<TDate> | TngDateRangeInput<TDate>;

export type TngDateRangePickerTrigger = 'keyboard' | 'pointer' | 'programmatic' | 'text-input';

type TngDateRangePickerKnownAttributes = {
  id?: string;
};

export type TngDateRangePickerAttributeMap = Readonly<
  Record<string, string> & TngDateRangePickerKnownAttributes
>;

export type TngDateAdapter<TDate> = Readonly<{
  addDays: (date: TDate, amount: number) => TDate;
  addMonths: (date: TDate, amount: number) => TDate;
  addYears: (date: TDate, amount: number) => TDate;
  compare: (left: TDate, right: TDate) => -1 | 0 | 1;
  createDate: (year: number, month: number, day: number) => TDate;
  deserialize?: (value: unknown, locale?: string) => TDate | null;
  endOfMonth: (date: TDate) => TDate;
  format: (date: TDate, format: TngDateFormatToken | string, locale?: string) => string;
  getDate: (date: TDate) => number;
  getDay: (date: TDate) => number;
  getMonth: (date: TDate) => number;
  getYear: (date: TDate) => number;
  isValid: (date: TDate) => boolean;
  parse: (text: string, locale?: string) => TDate | null;
  startOfMonth: (date: TDate) => TDate;
  startOfWeek: (date: TDate, weekStartsOn: TngWeekdayIndex) => TDate;
  today: () => TDate;
}>;

export type TngDateCell<TDate> = Readonly<{
  active: boolean;
  colIndex: number;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  hidden: boolean;
  id: string;
  inMonth: boolean;
  inRange: boolean;
  label: string;
  previewRange: boolean;
  rangeEnd: boolean;
  rangeStart: boolean;
  rowIndex: number;
  selected: boolean;
  tabindex: -1 | 0;
  today: boolean;
}>;

export type TngMonthOption<TDate> = Readonly<{
  active: boolean;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  id: string;
  index: number;
  label: string;
  selected: boolean;
  tabindex: -1 | 0;
}>;

export type TngYearOption<TDate> = Readonly<{
  active: boolean;
  date: TDate;
  disabled: boolean;
  focusVisible: boolean;
  id: string;
  label: string;
  selected: boolean;
  tabindex: -1 | 0;
  year: number;
}>;

export type TngDateRangePickerLayout = Readonly<{
  mode: TngDateRangePickerOverlayMode;
  offsetX: number;
  width: number;
}>;

export type TngDateRangePickerCalendarPanel<TDate> = Readonly<{
  cells: readonly TngDateCell<TDate>[];
  getGridAttributes: () => TngDateRangePickerAttributeMap;
  index: number;
  labelMonthYear: string;
  rangeBoundary: 'end' | 'start' | null;
  visibleMonth: TDate;
}>;

export type TngDateRangePickerState<TDate> = Readonly<{
  activeDate: TDate;
  disabled: boolean;
  endDate: TDate | null;
  focusedDate: TDate | null;
  focusedSection: TngDateRangePickerFocusedSection;
  inputText: string;
  lastCloseReason: TngDateRangePickerCloseReason | null;
  open: boolean;
  previewEndDate: TDate | null;
  startDate: TDate | null;
  validationError: string | null;
  value: TngDateValue<TDate>;
  view: TngCalendarView;
  visibleMonth: TDate;
}>;

export type TngDateRangePickerOutputs<TDate> = Readonly<{
  activeDate: TDate;
  calendarLayout: TngDateRangePickerCalendarLayout;
  calendars: readonly TngDateRangePickerCalendarPanel<TDate>[];
  cells: readonly TngDateCell<TDate>[];
  endDate: TDate | null;
  focusedDate: TDate | null;
  focusedSection: TngDateRangePickerFocusedSection;
  getCellAttributes: (
    cellOrDate: Readonly<TngDateCell<TDate>> | TDate,
  ) => TngDateRangePickerAttributeMap;
  getGridAttributes: (calendarIndex?: number) => TngDateRangePickerAttributeMap;
  getHostAttributes: () => TngDateRangePickerAttributeMap;
  getMonthAttributes: (
    monthOrOption: number | Readonly<TngMonthOption<TDate>>,
  ) => TngDateRangePickerAttributeMap;
  getOverlayAttributes: () => TngDateRangePickerAttributeMap;
  getTriggerAttributes: () => TngDateRangePickerAttributeMap;
  getYearAttributes: (
    yearOrOption: number | Readonly<TngYearOption<TDate>>,
  ) => TngDateRangePickerAttributeMap;
  inputText: string;
  labelMonthYear: string;
  layout: TngDateRangePickerLayout;
  monthOptions: readonly TngMonthOption<TDate>[];
  open: boolean;
  previewEndDate: TDate | null;
  startDate: TDate | null;
  validationError: string | null;
  value: TngDateValue<TDate>;
  view: TngCalendarView;
  visibleMonth: TDate;
  weekdayLabels: readonly string[];
  yearOptions: readonly TngYearOption<TDate>[];
}>;

export type TngDateRangePickerEvent<TDate> =
  | Readonly<{
      next: boolean;
      previous: boolean;
      type: 'opened';
    }>
  | Readonly<{
      previous: boolean;
      type: 'openStart';
    }>
  | Readonly<{
      reason: TngDateRangePickerCloseReason;
      type: 'closeStart';
    }>
  | Readonly<{
      reason: TngDateRangePickerCloseReason;
      type: 'closed';
    }>
  | Readonly<{
      activeDate: TDate;
      previousActiveDate: TDate;
      trigger: TngDateRangePickerTrigger;
      type: 'activeChange';
    }>
  | Readonly<{
      previewEndDate: TDate;
      previousPreviewEndDate: TDate | null;
      trigger: 'pointer';
      type: 'previewChange';
    }>
  | Readonly<{
      trigger: TngDateRangePickerTrigger;
      type: 'valueChange';
      value: TngDateValue<TDate>;
      previousValue: TngDateValue<TDate>;
    }>
  | Readonly<{
      previousValidationError: string | null;
      type: 'validationChange';
      validationError: string | null;
    }>
  | Readonly<{
      previousView: TngCalendarView;
      type: 'viewChange';
      view: TngCalendarView;
    }>
  | Readonly<{
      previousMonth: TDate;
      type: 'monthChange';
      visibleMonth: TDate;
    }>
  | Readonly<{
      previousYear: number;
      type: 'yearChange';
      year: number;
    }>;

export type TngDateRangePickerListener<TDate> = (event: TngDateRangePickerEvent<TDate>) => void;

export type TngDateRangePickerConfig<TDate> = Readonly<{
  adapter?: TngDateAdapter<TDate>;
  allowManualInput?: boolean;
  ariaDescribedBy?: string | null;
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  autoCommitView?: boolean;
  calendarLayout?: TngDateRangePickerCalendarLayout;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnSelect?: boolean;
  closeOthersOnOpen?: boolean;
  defaultOpen?: boolean;
  direction?: TngDateRangePickerDirection;
  disableDate?: (date: TDate) => boolean;
  disabled?: boolean;
  enableRangeSelection?: boolean;
  enableTypeahead?: boolean;
  fixedWeeks?: boolean;
  focusStrategy?: TngDateRangePickerFocusStrategy;
  id?: string;
  initialView?: TngCalendarView;
  locale?: string;
  max?: TngDateInputValue<TDate>;
  maxDate?: TngDateInputValue<TDate>;
  min?: TngDateInputValue<TDate>;
  minDate?: TngDateInputValue<TDate>;
  onPartialInputCommit?: boolean;
  overlayMode?: TngDateRangePickerOverlayMode;
  overlayRuntime?: TngOverlayRuntime | null;
  overlaySize?: number;
  ownerDocument?: Document | null;
  position?: TngDateRangePickerPosition;
  preserveViewOnOpenClose?: boolean;
  restoreFocus?: boolean;
  showOutsideDays?: boolean;
  skipDisabled?: boolean;
  today?: TngDateInputValue<TDate>;
  trapFocus?: boolean;
  value?: TngDateSelectionInput<TDate>;
  weekStartsOn?: TngWeekdayIndex;
  yearPageSize?: number;
}>;

export type TngDateRangePickerStatePatch<TDate> = Readonly<{
  activeDate?: TngDateInputValue<TDate>;
  disabled?: boolean;
  inputText?: string;
  value?: TngDateSelectionInput<TDate>;
  view?: TngCalendarView;
  visibleMonth?: TngDateInputValue<TDate>;
}>;

export type TngDateRangePickerController<TDate> = Readonly<{
  clear: () => void;
  close: (reason?: TngDateRangePickerCloseReason) => void;
  commitInputText: () => boolean;
  destroy: () => void;
  formatDate: (date: TDate, format?: TngDateFormatToken | string) => string;
  getOutputs: () => TngDateRangePickerOutputs<TDate>;
  getState: () => TngDateRangePickerState<TDate>;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  handleCellClick: (
    date: TngDateInputValue<TDate>,
    options?: Readonly<{ shiftKey?: boolean }>,
  ) => void;
  handleCellPointerEnter: (date: TngDateInputValue<TDate>) => void;
  handleGridKeyDown: (
    event: Readonly<
      Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
    >,
  ) => void;
  handleMonthGridKeyDown: (
    event: Readonly<
      Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
    >,
  ) => void;
  handleOverlayKeyDown: (
    event: Readonly<
      Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
    >,
  ) => void;
  handleTriggerKeyDown: (event: Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>) => void;
  handleYearGridKeyDown: (
    event: Readonly<
      Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'key' | 'metaKey' | 'preventDefault' | 'shiftKey'>
    >,
  ) => void;
  nextMonth: () => void;
  nextYear: () => void;
  open: () => void;
  parseInputText: (text: string) => TDate | null;
  prevMonth: () => void;
  prevYear: () => void;
  registerOverlay: (element: HTMLElement | null) => void;
  registerAnchor: (element: HTMLElement | null) => void;
  registerTrigger: (element: HTMLElement | null) => void;
  suppressFocusRestoreOnClose: () => void;
  selectDate: (
    date: TngDateInputValue<TDate>,
    options?: Readonly<{ shiftKey?: boolean; trigger?: TngDateRangePickerTrigger }>,
  ) => void;
  selectCalendarDate: (
    date: TngDateInputValue<TDate>,
    calendarIndex: number,
    options?: Readonly<{ shiftKey?: boolean; trigger?: TngDateRangePickerTrigger }>,
  ) => void;
  selectMonth: (monthIndex: number) => void;
  selectYear: (year: number) => void;
  setActiveDate: (date: TngDateInputValue<TDate>, trigger?: TngDateRangePickerTrigger) => void;
  setConfig: (config: Partial<TngDateRangePickerConfig<TDate>>) => void;
  setDisabled: (disabled: boolean) => void;
  setFocusedSection: (section: TngDateRangePickerFocusedSection) => void;
  setInputText: (text: string) => void;
  setOpen: (open: boolean) => void;
  setState: (patch: TngDateRangePickerStatePatch<TDate>) => void;
  setValue: (value: TngDateSelectionInput<TDate>) => void;
  setView: (view: TngCalendarView) => void;
  setVisibleMonth: (valueOrYear: TngDateInputValue<TDate> | number, month?: number) => void;
  setVisibleYear: (year: number) => void;
  showDaysPanel: () => void;
  showMonthsPanel: () => void;
  showYearsPanel: () => void;
  subscribe: (listener: TngDateRangePickerListener<TDate>) => () => void;
  toggleOpen: () => void;
}>;
