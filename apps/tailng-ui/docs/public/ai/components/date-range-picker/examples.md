---
id: "components/date-range-picker/examples"
title: "Date Range Picker examples"
description: "Date Range Picker examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["date-range-picker","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/date-range-picker/tng-date-range-picker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/examples/date-range-picker-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/examples/date-range-picker-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/examples/date-range-picker-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/date-range-picker/examples"
componentGroup: "form"
symbols: ["TngDateRangePickerComponent"]
selectors: ["tng-date-range-picker"]
productId: "date-range-picker"
section: "examples"
officialCatalog: true
generated: true
---

# Date Range Picker examples

## Examples

These examples focus on the styled wrapper in its default plain-CSS presentation and in a theme-aware Tailwind shell. Headless composition lives in the separate headless Date Range Picker section.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngDateRangePickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDateRangePickerComponent],
  template: `<tng-date-range-picker />`,
})
export class DateRangePickerExample {}
```
