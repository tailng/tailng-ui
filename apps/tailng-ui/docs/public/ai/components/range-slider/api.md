---
id: "components/range-slider/api"
title: "Range Slider API"
description: "Range Slider API reference for Angular applications."
category: "components"
status: "stable"
tags: ["range-slider","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.component.ts","libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/sections/api/range-slider-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/sections/api/range-slider-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/range-slider/api"
componentGroup: "form"
symbols: ["TngRangeSliderComponent"]
selectors: ["tng-range-slider"]
productId: "range-slider"
section: "api"
officialCatalog: true
generated: true
---

# Range Slider API

Dual-thumb slider for selecting bounded minimum and maximum values.

## `tng-range-slider`

| Property | Type | Details |
| --- | --- | --- |
| value / valueChange | TngRangeSliderValue / output | Controlled { min, max } selection updated by either thumb. |
| lowerBound, upperBound | number \| undefined | Form-safe outer bounds for both thumbs. Defaults to 0 and 100. |
| min, max | number \| undefined | Deprecated standalone aliases. Do not combine them with formField. |
| step | number | Positive increment. Defaults to 1. |
| minGap | number | Minimum permitted distance between the selected endpoints. |
| minAriaLabel, maxAriaLabel | string | Distinct accessible names for the minimum and maximum thumbs. |
| disabled, invalid, required | boolean | Shared control state integrated with tng-form-field and Signal Forms. |

## Bounds

Use `lowerBound` and `upperBound` for the control domain. The selected value continues to use `min` and `max` endpoint properties.

## Angular Signal Forms

Signal Forms reserves `min` and `max` bindings. The range-specific bound names can be bound safely on the same element as `formField`.

## Source-derived public Angular API

### `TngRangeSliderComponent` — `tng-range-slider`

- Inputs: `ariaDescribedBy`, `ariaLabel`, `ariaLabelledBy`, `disabled`, `id`, `invalid`, `lowerBound`, `max`, `maxAriaLabel`, `maxValueText`, `min`, `minAriaLabel`, `minGap`, `minValueText`, `required`, `step`, `upperBound`
- Two-way models: `value`
