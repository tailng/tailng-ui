import type { TngOverlayRuntime } from '@tailng-ui/cdk/runtime';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type -- The named public boundary keeps APF declarations on package imports.
export interface TngDatepickerOverlayRuntime extends TngOverlayRuntime {}

export type TngCalendarView = 'day' | 'month' | 'year';
export type TngDatepickerSelectionMode = 'single' | 'range' | 'multiple';
export type TngDatepickerDirection = 'ltr' | 'rtl';
export type TngDatepickerFocusStrategy = 'active-descendant' | 'roving';
export type TngDatepickerFocusedSection = 'day' | 'month' | 'year';
export type TngDatepickerOverlayMode = 'overlay' | 'push' | 'side';
export type TngDatepickerPosition = 'center' | 'end' | 'start';
export type TngDatepickerCloseReason = 'escape' | 'outside' | 'programmatic' | 'select';
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

export type TngDateRangeInput<TDate> = Readonly<{
  end: TngDateInputValue<TDate>;
  start: TngDateInputValue<TDate>;
}>;

export type TngDateValue<TDate> = TDate | TngDateRange<TDate> | readonly TDate[] | null;
export type TngDateSelectionInput<TDate> =
  | TngDateInputValue<TDate>
  | TngDateRangeInput<TDate>
  | readonly TngDateInputValue<TDate>[];

export type TngDatepickerTrigger =
  | 'keyboard'
  | 'pointer'
  | 'programmatic'
  | 'text-input';

  type TngDatepickerKnownAttributes = {
    id?: string;
  };
  
  export type TngDatepickerAttributeMap = Readonly<
    Record<string, string> & TngDatepickerKnownAttributes
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

export type TngDatepickerLayout = Readonly<{
  mode: TngDatepickerOverlayMode;
  offsetX: number;
  width: number;
}>;

export type TngDatepickerState<TDate> = Readonly<{
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
}>;

export type TngDatepickerOutputs<TDate> = Readonly<{
  activeDate: TDate;
  cells: readonly TngDateCell<TDate>[];
  focusedSection: TngDatepickerFocusedSection;
  getCellAttributes: (cellOrDate: Readonly<TngDateCell<TDate>> | TDate) => TngDatepickerAttributeMap;
  getGridAttributes: () => TngDatepickerAttributeMap;
  getHostAttributes: () => TngDatepickerAttributeMap;
  getMonthAttributes: (monthOrOption: number | Readonly<TngMonthOption<TDate>>) => TngDatepickerAttributeMap;
  getOverlayAttributes: () => TngDatepickerAttributeMap;
  getTriggerAttributes: () => TngDatepickerAttributeMap;
  getYearAttributes: (yearOrOption: number | Readonly<TngYearOption<TDate>>) => TngDatepickerAttributeMap;
  inputText: string;
  labelMonthYear: string;
  layout: TngDatepickerLayout;
  monthOptions: readonly TngMonthOption<TDate>[];
  open: boolean;
  validationError: string | null;
  value: TngDateValue<TDate>;
  view: TngCalendarView;
  visibleMonth: TDate;
  weekdayLabels: readonly string[];
  yearOptions: readonly TngYearOption<TDate>[];
}>;

export type TngDatepickerEvent<TDate> =
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
      reason: TngDatepickerCloseReason;
      type: 'closeStart';
    }>
  | Readonly<{
      reason: TngDatepickerCloseReason;
      type: 'closed';
    }>
  | Readonly<{
      activeDate: TDate;
      previousActiveDate: TDate;
      trigger: TngDatepickerTrigger;
      type: 'activeChange';
    }>
  | Readonly<{
      trigger: TngDatepickerTrigger;
      type: 'valueChange';
      value: TngDateValue<TDate>;
      previousValue: TngDateValue<TDate>;
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

export type TngDatepickerListener<TDate> = (event: TngDatepickerEvent<TDate>) => void;

export type TngDatepickerConfig<TDate> = Readonly<{
  adapter?: TngDateAdapter<TDate>;
  allowDeselect?: boolean;
  allowManualInput?: boolean;
  ariaDescribedBy?: string | null;
  ariaLabel?: string | null;
  ariaLabelledBy?: string | null;
  autoCommitView?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnSelect?: boolean;
  closeOthersOnOpen?: boolean;
  defaultOpen?: boolean;
  direction?: TngDatepickerDirection;
  disableDate?: (date: TDate) => boolean;
  disabled?: boolean;
  enableMultipleRangeSelection?: boolean;
  enableRangeSelection?: boolean;
  enableTypeahead?: boolean;
  fixedWeeks?: boolean;
  focusStrategy?: TngDatepickerFocusStrategy;
  id?: string;
  initialView?: TngCalendarView;
  locale?: string;
  max?: TngDateInputValue<TDate>;
  maxDate?: TngDateInputValue<TDate>;
  maxSelections?: number | null;
  min?: TngDateInputValue<TDate>;
  minDate?: TngDateInputValue<TDate>;
  onPartialInputCommit?: boolean;
  overlayMode?: TngDatepickerOverlayMode;
  overlayRuntime?: TngDatepickerOverlayRuntime | null;
  overlaySize?: number;
  ownerDocument?: Document | null;
  position?: TngDatepickerPosition;
  preserveViewOnOpenClose?: boolean;
  restoreFocus?: boolean;
  selectionMode?: TngDatepickerSelectionMode;
  showOutsideDays?: boolean;
  skipDisabled?: boolean;
  today?: TngDateInputValue<TDate>;
  trapFocus?: boolean;
  value?: TngDateSelectionInput<TDate>;
  weekStartsOn?: TngWeekdayIndex;
  yearPageSize?: number;
}>;

export type TngDatepickerStatePatch<TDate> = Readonly<{
  activeDate?: TngDateInputValue<TDate>;
  disabled?: boolean;
  inputText?: string;
  value?: TngDateSelectionInput<TDate>;
  view?: TngCalendarView;
  visibleMonth?: TngDateInputValue<TDate>;
}>;

export type TngDatepickerController<TDate> = Readonly<{
  clear: () => void;
  close: (reason?: TngDatepickerCloseReason) => void;
  commitInputText: () => boolean;
  destroy: () => void;
  formatDate: (date: TDate, format?: TngDateFormatToken | string) => string;
  getOutputs: () => TngDatepickerOutputs<TDate>;
  getState: () => TngDatepickerState<TDate>;
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
  handleTriggerKeyDown: (
    event: Readonly<Pick<KeyboardEvent, 'key' | 'preventDefault'>>,
  ) => void;
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
  registerAnchor: (element: HTMLElement | null) => void;
  registerOverlay: (element: HTMLElement | null) => void;
  registerTrigger: (element: HTMLElement | null) => void;
  suppressFocusRestoreOnClose: () => void;
  selectDate: (
    date: TngDateInputValue<TDate>,
    options?: Readonly<{ shiftKey?: boolean; trigger?: TngDatepickerTrigger }>,
  ) => void;
  selectMonth: (monthIndex: number) => void;
  selectYear: (year: number) => void;
  setActiveDate: (date: TngDateInputValue<TDate>, trigger?: TngDatepickerTrigger) => void;
  setConfig: (config: Partial<TngDatepickerConfig<TDate>>) => void;
  setDisabled: (disabled: boolean) => void;
  setFocusedSection: (section: TngDatepickerFocusedSection) => void;
  setInputText: (text: string) => void;
  setOpen: (open: boolean) => void;
  setState: (patch: TngDatepickerStatePatch<TDate>) => void;
  setValue: (value: TngDateSelectionInput<TDate>) => void;
  setView: (view: TngCalendarView) => void;
  setVisibleMonth: (valueOrYear: TngDateInputValue<TDate> | number, month?: number) => void;
  setVisibleYear: (year: number) => void;
  showDaysPanel: () => void;
  showMonthsPanel: () => void;
  showYearsPanel: () => void;
  subscribe: (listener: TngDatepickerListener<TDate>) => () => void;
  toggleOpen: () => void;
}>;
