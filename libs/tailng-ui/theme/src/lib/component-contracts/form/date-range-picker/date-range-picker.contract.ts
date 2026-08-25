/**
 * TailNG Date Range Picker — headless style contract
 *
 * Scope: headless controller + primitive attribute maps rendered in app markup.
 * Styling must rely on:
 *  - slot attributes: data-slot="..."
 *  - host states: data-open / data-disabled / data-view
 *  - item states: data-active / data-selected / data-focus-visible / data-disabled
 *  - day states: data-in-month / data-in-range / data-range-start / data-range-end / data-preview-range
 *
 * No tag selectors. No DOM assumptions beyond slot names.
 */

export const tngDateRangePickerSlots = {
  root: 'date-range-picker',
  field: 'date-range-picker-field',
  inputShell: 'date-range-picker-input-shell',
  input: 'date-range-picker-input',
  trigger: 'date-range-picker-trigger',
  overlay: 'date-range-picker-overlay',
  header: 'date-range-picker-header',
  calendars: 'date-range-picker-calendars',
  calendarPanel: 'date-range-picker-calendar-panel',
  calendarHeader: 'date-range-picker-calendar-header',
  navButton: 'date-range-picker-nav-button',
  periodButton: 'date-range-picker-period-button',
  viewSwitcher: 'date-range-picker-view-switcher',
  viewChip: 'date-range-picker-view-chip',
  weekdays: 'date-range-picker-weekdays',
  weekday: 'date-range-picker-weekday',
  grid: 'date-range-picker-grid',
  cell: 'date-range-picker-cell',
  month: 'date-range-picker-month',
  year: 'date-range-picker-year',
  footer: 'date-range-picker-footer',
  action: 'date-range-picker-action',
} as const;

export type TngDateRangePickerSlot =
  (typeof tngDateRangePickerSlots)[keyof typeof tngDateRangePickerSlots];

export const tngDateRangePickerHostStates = {
  open: 'data-open',
  disabled: 'data-disabled',
  view: 'data-view',
  invalid: 'data-invalid',
} as const;

export const tngDateRangePickerItemStates = {
  active: 'data-active',
  selected: 'data-selected',
  focusVisible: 'data-focus-visible',
  disabled: 'data-disabled',
} as const;

export const tngDateRangePickerDayStates = {
  inMonth: 'data-in-month',
  inRange: 'data-in-range',
  previewRange: 'data-preview-range',
  previewEnd: 'data-preview-end',
  rangeStart: 'data-range-start',
  rangeEnd: 'data-range-end',
  today: 'data-today',
  outsideMonth: 'data-outside-month',
  hidden: 'data-hidden',
} as const;

export const tngDateRangePickerCssVars = {
  // Layout
  radius: '--tng-date-range-picker-radius',
  fieldHeight: '--tng-date-range-picker-field-height',
  overlayGap: '--tng-date-range-picker-overlay-gap',
  dayCellSize: '--tng-date-range-picker-day-cell-size',
  pickerCellSize: '--tng-date-range-picker-picker-cell-size',
  gridGap: '--tng-date-range-picker-grid-gap',
  inlineGap: '--tng-date-range-picker-inline-gap',
  overlayPadding: '--tng-date-range-picker-overlay-padding',
  calendarGap: '--tng-date-range-picker-calendar-gap',

  // Visual aliases
  border: '--tng-date-range-picker-border',
  borderStrong: '--tng-date-range-picker-border-strong',
  bg: '--tng-date-range-picker-bg',
  surface: '--tng-date-range-picker-surface',
  canvas: '--tng-date-range-picker-canvas',
  fg: '--tng-date-range-picker-fg',
  muted: '--tng-date-range-picker-muted',
  brand: '--tng-date-range-picker-brand',
  danger: '--tng-date-range-picker-danger',
  focus: '--tng-date-range-picker-focus',
  shadow: '--tng-date-range-picker-shadow',
  focusShadow: '--tng-date-range-picker-focus-shadow',
  ease: '--tng-date-range-picker-ease',

  // Wrapper layout hooks used by the component implementation
  navSize: '--tng-date-range-picker-nav-size',
} as const;

export const tngDateRangePickerSemanticTokens = {
  bg: '--tng-semantic-background-surface',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  borderStrong: '--tng-semantic-border-strong',
  brand: '--tng-semantic-accent-brand',
  danger: '--tng-semantic-accent-danger',
  focusRing: '--tng-semantic-focus-ring',
} as const;
