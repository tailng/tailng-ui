---
id: "components/date-range-picker/api"
title: "Date Range Picker API"
description: "Date Range Picker API reference for Angular applications."
category: "components"
status: "stable"
tags: ["date-range-picker","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/date-range-picker/tng-date-range-picker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/api/date-range-picker-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/api/date-range-picker-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/api/date-range-picker-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/date-range-picker/api"
componentGroup: "form"
symbols: ["TngDateRangePickerComponent"]
selectors: ["tng-date-range-picker"]
productId: "date-range-picker"
section: "api"
officialCatalog: true
generated: true
---

# Date Range Picker API

Material-style date range selection with editable input, adapter formatting, and bounded calendar views.

## API reference

The default surface is `tng-date-range-picker`. When you need custom markup, use `createDateRangePickerController(...)`, `bindTngDateRangePicker(...)`, and the date range picker helper directives instead of wiring keyboard, focus, and ARIA behavior by hand.

The wrapper intentionally sets a few opinionated defaults on top of the controller, notably `closeOnSelect`, `trapFocus`, and `autoCommitView`.

### `tng-date-range-picker` (component)

#### Wrapper attachment

```html
<tng-date-range-picker
  calendarLayout="dual"
  [defaultValue]="{ start: '2024-04-22', end: '2024-04-26' }"
  [minDate]="'2024-04-01'"
  [maxDate]="'2026-03-31'"
  ariaLabel="Invoice period"
></tng-date-range-picker>
```

### Outputs

| Output | Type | Details |
| --- | --- | --- |
| valueChange | TngDateRangePickerValue<TDate> | Emits after a click, keyboard commit, or successful manual input range commit. |
| openChange | boolean | Emits whenever the popup opens or closes. |
| closed | TngDateRangePickerCloseReason | Reports escape, outside, programmatic, or select close reasons. |
| activeDateChange | TDate | Emits as keyboard focus moves through the calendar model. |
| previewEndDateChange | TDate | Emits as the pointer hovers over candidate end dates during an in-progress range selection. |
| viewChange | 'day' \| 'month' \| 'year' | Tracks the current visible panel. |
| monthChange | TDate | Emits when the visible month block changes. |
| yearChange | number | Emits when the visible year page anchor changes. |

### Wrapper instance methods

| Method | Purpose |
| --- | --- |
| clear() | Clears the current range selection and returns the wrapper to day view. |
| close(reason?) | Programmatically closes the popup with an optional close reason. |
| openDateRangePicker() | Programmatically opens the popup. |
| showDaysPanel() / showMonthsPanel() / showYearsPanel() | Drives the visible panel explicitly when the default drill-down flow is not enough. |
| toggleOpen() | Toggles the popup state. |

### Headless binding layer

#### Controller + Angular binding

```ts
import { bindTngDateRangePicker, createDateRangePickerController } from '@tailng-ui/primitives';

readonly controller = createDateRangePickerController<Date>({
  ownerDocument: document,
  value: { start: '2024-04-22', end: '2024-04-26' },
  today: '2024-04-18',
  minDate: '2024-04-01',
  maxDate: '2026-03-31',
  closeOnSelect: true,
  calendarLayout: 'dual',
  trapFocus: true,
});

readonly dateRangePicker = bindTngDateRangePicker(this.controller);
```

#### Field + overlay wiring

```html
<section [tngDateRangePickerHost]="controller">
  <div data-slot="date-range-picker-field">
    <div #anchorShell>
      <div
        data-slot="date-range-picker-input-shell"
        [attr.data-invalid]="dateRangePicker.outputs().validationError !== null ? 'true' : null"
        [attr.data-open]="dateRangePicker.outputs().getTriggerAttributes()['data-open']"
      >
        <input [tngDateRangePickerInput]="controller" type="text" placeholder="MM-DD-YYYY - MM-DD-YYYY" />
        <button [tngDateRangePickerTrigger]="controller" type="button">Open</button>
      </div>

      <section [tngDateRangePickerOverlay]="controller" [tngDateRangePickerOverlayAnchor]="anchorShell">
        <button [tngDateRangePickerPrevButton]="controller" type="button">‹</button>
        <button [tngDateRangePickerPeriodButton]="controller" type="button">
          {{ dateRangePicker.periodLabel() }}
        </button>
        <button [tngDateRangePickerNextButton]="controller" type="button">›</button>

        @for (calendar of dateRangePicker.outputs().calendars; track calendar.index) {
          <div
            [tngDateRangePickerDayGrid]="controller"
            [tngDateRangePickerCalendarIndex]="calendar.index"
          >
            @for (cell of calendar.cells; track cell.id) {
              <button [tngDateRangePickerDayCell]="cell" type="button">{{ cell.label }}</button>
            }
          </div>
        }
      </section>
    </div>
  </div>
</section>
```

| Helper | Purpose |
| --- | --- |
| bindTngDateRangePicker(controller) | Returns signals for outputs() and periodLabel() so Angular templates can stay declarative. |
| [tngDateRangePickerHost] | Applies the public root attributes such as data-open, data-view, and ARIA labels. |
| [tngDateRangePickerInput] / [tngDateRangePickerTrigger] | Forward manual input editing, trigger registration, and wrapper-grade open and keyboard behavior. |
| [tngDateRangePickerOverlay] | Ports the popup to document.body, syncs public overlay attributes, and keeps focus and positioning aligned. |
| [tngDateRangePickerPrevButton] / [tngDateRangePickerNextButton] / [tngDateRangePickerPeriodButton] | Own the standard navigation and drill-down flow without per-view branching in your component. |
| [tngDateRangePickerDayGrid] / [tngDateRangePickerDayCell] | Forward day-grid keyboarding, click handling, hover range behavior, and the public day-cell state hooks. |
| [tngDateRangePickerMonthGrid] / [tngDateRangePickerMonthOption] / [tngDateRangePickerYearGrid] / [tngDateRangePickerYearOption] | Handle month and year picker keyboarding and selection while preserving the public slot contract. |

### Advanced controller options

The wrapper covers the common surface. These options are available when you work with the controller directly.

| Option | Type | Default | Details |
| --- | --- | --- | --- |
| initialView | 'day' \| 'month' \| 'year' | 'day' | Starts the controller on a different panel than the wrapper exposes by default. |
| calendarLayout | 'single' \| 'dual' | 'single' | Controls whether outputs.calendars contains one sequential range calendar or a consecutive start/end pair. |
| overlayMode | 'overlay' \| 'push' \| 'side' | 'overlay' | Changes how the controller models overlay layout when you are fully headless. |
| position | 'start' \| 'center' \| 'end' | 'start' | Changes overlay alignment relative to the field in headless layouts. |
| focusStrategy | 'active-descendant' \| 'roving' | 'roving' | Lets advanced compositions opt into a different grid focus model. |
| onPartialInputCommit | boolean | false | Allows partial manual input commits in advanced headless flows. |
| preserveViewOnOpenClose | boolean | true | Keeps the current panel when reopening instead of always returning to day view. |
| skipDisabled | boolean | true | Controls whether keyboard movement jumps across disabled dates. |

### Controller methods

| Method | Purpose |
| --- | --- |
| getOutputs() / getState() | Read the live render model or the lower-level mutable state snapshot. |
| open() / close() / toggleOpen() | Own popup visibility when you are not using the wrapper. |
| setInputText(...) / commitInputText() / parseInputText(...) | Support manual editing with adapter validation and bound checks. |
| selectDate(...) / clear() / setValue(...) | Own the committed selection state directly. |
| showYearsPanel() / showMonthsPanel() / showDaysPanel() | Drive the visible panel explicitly. |
| setConfig(...) | Reconfigures the controller after creation for advanced custom integrations. |
| subscribe(...) | Exposes low-level controller events when the template bindings are not enough. |

## Source-derived public Angular API

### `TngDateRangePickerComponent` — `tng-date-range-picker`

- Inputs: `adapter`, `allowManualInput`, `ariaDescribedBy`, `ariaLabel`, `ariaLabelledBy`, `autoCommitView`, `calendarLayout`, `closeOnEscape`, `closeOnOutsideClick`, `closeOnSelect`, `closeOthersOnOpen`, `defaultOpen`, `defaultValue`, `direction`, `disabled`, `disableDate`, `enableRangeSelection`, `enableTypeahead`, `fixedWeeks`, `fullWidth`, `id`, `inputAriaLabel`, `invalid`, `locale`, `maxDate`, `minDate`, `onPartialInputCommit`, `open`, `overlayMinSize`, `overlayRuntime`, `overlaySize`, `placeholder`, `placement`, `readonly`, `restoreFocus`, `scrollStrategy`, `showOutsideDays`, `skipDisabled`, `today`, `trapFocus`, `weekStartsOn`, `yearPageSize`
- Two-way models: `value`
- Outputs: `activeDateChange`, `closed`, `monthChange`, `openChange`, `previewEndDateChange`, `viewChange`, `yearChange`
