---
id: "components/yearpicker/api"
title: "Yearpicker API"
description: "Yearpicker API reference for Angular applications."
category: "components"
status: "stable"
tags: ["yearpicker","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/yearpicker/tng-yearpicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/api/yearpicker-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/api/yearpicker-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/api/yearpicker-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/yearpicker/api"
componentGroup: "form"
symbols: ["TngYearpickerComponent"]
selectors: ["tng-yearpicker"]
productId: "yearpicker"
section: "api"
officialCatalog: true
generated: true
---

# Yearpicker API

Year-only selection built on the shared datepicker surface.

## API reference

The default surface is `tng-yearpicker`. It wraps the shared datepicker with a year-only adapter and opens the year grid directly, closing automatically after selection and emitting a plain `number`.

### `tng-yearpicker` (component)

#### Wrapper attachment

```html
<tng-yearpicker
  [defaultValue]="2024"
  [minYear]="2000"
  [maxYear]="2030"
  placeholder="YYYY"
></tng-yearpicker>
```

### Outputs

| Output | Type | Details |
| --- | --- | --- |
| valueChange | number | Emits the selected year as a plain number after a grid click or successful manual input commit. |
| openChange | boolean | Emits whenever the popup opens or closes. |

### Internal lifecycle notes

The year grid popup follows a two-step commit: when the user selects a year cell, the controller records it as a pending year and transitions to the month view. The component intercepts the `viewChange` event — when the view reaches `month` with a pending year, it emits `valueChange` and closes the popup immediately. This keeps the UX feeling instant without requiring a separate confirm button.

### Form-field integration

`tng-yearpicker` registers itself with the `TNG_FORM_FIELD_CONTROL` token so it works seamlessly inside `tng-form-field`. The focusable element is the inner datepicker text input — clicking the form-field label routes focus there directly. The `invalid` and `required` inputs are forwarded to the shared control adapter so error and hint messaging renders correctly.

## Source-derived public Angular API

### `TngYearpickerComponent` — `tng-yearpicker`

- Inputs: `allowManualInput`, `defaultOpen`, `defaultValue`, `disabled`, `fixedDay`, `fixedMonth`, `fullWidth`, `invalid`, `maxYear`, `minYear`, `placeholder`, `readonly`, `required`, `restoreFocus`, `scrollStrategy`, `yearPageSize`
- Two-way models: `value`
- Outputs: `openChange`
