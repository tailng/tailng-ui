---
id: "components/datepicker/api"
title: "Datepicker API"
description: "Datepicker API reference for Angular applications."
category: "components"
status: "stable"
tags: ["datepicker","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/datepicker/tng-datepicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/api/datepicker-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/api/datepicker-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/api/datepicker-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/datepicker/api"
componentGroup: "form"
symbols: ["TngDatepickerComponent"]
selectors: ["tng-datepicker"]
productId: "datepicker"
section: "api"
officialCatalog: true
generated: true
---

# Datepicker API

Material-style date selection with editable input, adapter formatting, and bounded calendar views.

## API reference

The default surface is `tng-datepicker`. When you need custom markup, use `createDatepickerController(...)`, `bindTngDatepicker(...)`, and the datepicker helper directives instead of wiring keyboard, focus, and ARIA behavior by hand.

The wrapper intentionally sets a few opinionated defaults on top of the controller, notably `closeOnSelect`, `trapFocus`, and `autoCommitView`.

### `tng-datepicker` (component)

#### Wrapper attachment

```html
<tng-datepicker
  [defaultValue]="'2024-04-22'"
  [minDate]="'2024-04-01'"
  [maxDate]="'2026-03-31'"
  selectionMode="single"
  ariaLabel="Invoice date"
></tng-datepicker>
```

### Outputs

| Output | Type | Details |
| --- | --- | --- |
| valueChange | TngDateValue<TDate> | Emits after click, keyboard commit, or a successful manual input commit. |
| openChange | boolean | Emits whenever the popup opens or closes. |
| closed | TngDatepickerCloseReason | Reports escape, outside, programmatic, or select close reasons. |
| activeDateChange | TDate | Emits as keyboard focus moves through the calendar model. |
| viewChange | 'day' \| 'month' \| 'year' | Tracks the current visible panel. |
| monthChange | TDate | Emits when the visible month block changes. |
| yearChange | number | Emits when the visible year page anchor changes. |

### Wrapper instance methods

| Method | Purpose |
| --- | --- |
| clear() | Clears the current selection for the active selection mode and returns the wrapper to day view. |
| close(reason?) | Programmatically closes the popup with an optional close reason. |
| openDatepicker() | Programmatically opens the popup. |
| showDaysPanel() / showMonthsPanel() / showYearsPanel() | Drives the visible panel explicitly when the default drill-down flow is not enough. |
| toggleOpen() | Toggles the popup state. |

### Headless binding layer

#### Controller + Angular binding

```ts
import { bindTngDatepicker, createDatepickerController } from '@tailng-ui/primitives';

readonly controller = createDatepickerController<Date>({
  ownerDocument: document,
  value: '2024-04-22',
  today: '2024-04-18',
  minDate: '2024-04-01',
  maxDate: '2026-03-31',
  closeOnSelect: true,
  trapFocus: true,
});

readonly datepicker = bindTngDatepicker(this.controller);
```

#### Field + overlay wiring

```html
<section [tngDatepickerHost]="controller">
  <div data-slot="datepicker-field">
    <div #anchorShell>
      <div
        data-slot="datepicker-input-shell"
        [attr.data-invalid]="datepicker.outputs().validationError !== null ? 'true' : null"
        [attr.data-open]="datepicker.outputs().getTriggerAttributes()['data-open']"
      >
        <input [tngDatepickerInput]="controller" type="text" placeholder="MM-DD-YYYY" />
        <button [tngDatepickerTrigger]="controller" type="button">Open</button>
      </div>

      <section [tngDatepickerOverlay]="controller" [tngDatepickerOverlayAnchor]="anchorShell">
        <button [tngDatepickerPrevButton]="controller" type="button">‹</button>
        <button [tngDatepickerPeriodButton]="controller" type="button">
          {{ datepicker.periodLabel() }}
        </button>
        <button [tngDatepickerNextButton]="controller" type="button">›</button>

        <div [tngDatepickerDayGrid]="controller">
          @for (cell of datepicker.outputs().cells; track cell.id) {
            <button [tngDatepickerDayCell]="cell" type="button">{{ cell.label }}</button>
          }
        </div>
      </section>
    </div>
  </div>
</section>
```

| Helper | Purpose |
| --- | --- |
| bindTngDatepicker(controller) | Returns signals for outputs() and periodLabel() so Angular templates can stay declarative. |
| [tngDatepickerHost] | Applies the public root attributes such as data-open, data-view, and ARIA labels. |
| [tngDatepickerInput] / [tngDatepickerTrigger] | Forward manual input editing, trigger registration, and wrapper-grade open and keyboard behavior. |
| [tngDatepickerOverlay] | Ports the popup to document.body, syncs public overlay attributes, and keeps focus and positioning aligned. |
| [tngDatepickerPrevButton] / [tngDatepickerNextButton] / [tngDatepickerPeriodButton] | Own the standard navigation and drill-down flow without per-view branching in your component. |
| [tngDatepickerDayGrid] / [tngDatepickerDayCell] | Forward day-grid keyboarding, click handling, hover range behavior, and the public day-cell state hooks. |
| [tngDatepickerMonthGrid] / [tngDatepickerMonthOption] / [tngDatepickerYearGrid] / [tngDatepickerYearOption] | Handle month and year picker keyboarding and selection while preserving the public slot contract. |

### Advanced controller options

The wrapper covers the common surface. These options are available when you work with the controller directly.

| Option | Type | Default | Details |
| --- | --- | --- | --- |
| initialView | 'day' \| 'month' \| 'year' | 'day' | Starts the controller on a different panel than the wrapper exposes by default. |
| overlayMode | 'overlay' \| 'push' \| 'side' | 'overlay' | Changes how the controller models overlay layout when you are fully headless. |
| position | 'start' \| 'center' \| 'end' | 'start' | Changes overlay alignment relative to the field in headless layouts. |
| focusStrategy | 'active-descendant' \| 'roving' | 'roving' | Lets advanced compositions opt into a different grid focus model. |
| maxSelections | number \| null | null | Caps the number of selected values in multiple mode. |
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

### `TngDatepickerComponent` — `tng-datepicker`

- Inputs: `adapter`, `allowDeselect`, `allowManualInput`, `ariaDescribedBy`, `ariaLabel`, `ariaLabelledBy`, `autoCommitView`, `closeOnEscape`, `closeOnOutsideClick`, `closeOnSelect`, `closeOthersOnOpen`, `defaultOpen`, `defaultValue`, `direction`, `disabled`, `disableDate`, `fullWidth`, `id`, `inputAriaLabel`, `invalid`, `locale`, `maxDate`, `minDate`, `open`, `overlayMinSize`, `overlayRuntime`, `overlaySize`, `placeholder`, `placement`, `readonly`, `required`, `restoreFocus`, `scrollStrategy`, `selectionMode`, `showOutsideDays`, `today`, `trapFocus`, `weekStartsOn`, `yearPageSize`
- Two-way models: `value`
- Outputs: `activeDateChange`, `closed`, `monthChange`, `openChange`, `viewChange`, `yearChange`
