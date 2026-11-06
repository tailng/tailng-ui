---
id: "components/month-daypicker/examples"
title: "Month Daypicker examples"
description: "Month Daypicker examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["month-daypicker","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/month-daypicker/tng-month-daypicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/examples/month-daypicker-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/examples/month-daypicker-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/examples/month-daypicker-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/month-daypicker/examples"
componentGroup: "form"
symbols: ["TngMonthDaypickerComponent"]
selectors: ["tng-month-daypicker"]
productId: "month-daypicker"
section: "examples"
officialCatalog: true
generated: true
---

# Month Daypicker examples

## Examples

These examples show the styled wrapper in its default plain-CSS presentation and in a theme-aware Tailwind shell across common use cases.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngMonthDaypickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMonthDaypickerComponent],
  template: `<tng-month-daypicker />`,
})
export class MonthDaypickerExample {}
```
