---
id: "components/datepicker/examples"
title: "Datepicker examples"
description: "Datepicker examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["datepicker","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/datepicker/tng-datepicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/examples/datepicker-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/examples/datepicker-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/examples/datepicker-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/datepicker/examples"
componentGroup: "form"
symbols: ["TngDatepickerComponent"]
selectors: ["tng-datepicker"]
productId: "datepicker"
section: "examples"
officialCatalog: true
generated: true
---

# Datepicker examples

## Examples

These examples focus on the styled wrapper in its default plain-CSS presentation and in a theme-aware Tailwind shell. Headless composition lives in the separate headless Datepicker section.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngDatepickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDatepickerComponent],
  template: `<tng-datepicker />`,
})
export class DatepickerExample {}
```
