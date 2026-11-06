---
id: "components/month-daypicker/api"
title: "Month Daypicker API"
description: "Month Daypicker API reference for Angular applications."
category: "components"
status: "stable"
tags: ["month-daypicker","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/month-daypicker/tng-month-daypicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/api/month-daypicker-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/api/month-daypicker-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/api/month-daypicker-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/month-daypicker/api"
componentGroup: "form"
symbols: ["TngMonthDaypickerComponent"]
selectors: ["tng-month-daypicker"]
productId: "month-daypicker"
section: "api"
officialCatalog: true
generated: true
---

# Month Daypicker API

Month-day selection for recurring dates without exposing a year in the value.

## API reference

The default surface is `tng-month-daypicker`. It wraps the shared datepicker surface with a `MM-DD` adapter and pins navigation so the year panel is never committed as a value.

### Value type

#### TngMonthDayValue

```ts
type TngMonthDayValue = Readonly<{
  day: number;   // 1–31
  month: number; // 1–12
}>;
```

Month and day values are normalized on input: `month` is clamped to 1–12 and `day` to 1–31. Actual calendar validation (e.g. Feb 29 in a non-leap year) relies on the `year` input for the internal date adapter.

### `tng-month-daypicker` (component)

#### Wrapper attachment

```html
<tng-month-daypicker
  [defaultValue]="{ month: 12, day: 25 }"
  [year]="2024"
  placeholder="MM-DD"
></tng-month-daypicker>
```

### Outputs

| Output | Type | Details |
| --- | --- | --- |
| valueChange | TngMonthDayValue | Emits the selected { month, day } object after a calendar click or successful manual input commit. |
| openChange | boolean | Emits whenever the popup opens or closes. |

### Form-field integration

`tng-month-daypicker` registers itself with the `TNG_FORM_FIELD_CONTROL` token so it works seamlessly inside `tng-form-field`. The focusable element is the inner datepicker text input — clicking the form-field label routes focus there directly. The `invalid` and `required` inputs are forwarded to the shared control adapter so error and hint messaging renders correctly.

## Source-derived public Angular API

### `TngMonthDaypickerComponent` — `tng-month-daypicker`

- Inputs: `allowManualInput`, `defaultOpen`, `defaultValue`, `disabled`, `fullWidth`, `invalid`, `placeholder`, `readonly`, `required`, `restoreFocus`, `scrollStrategy`, `year`
- Two-way models: `value`
- Outputs: `openChange`
