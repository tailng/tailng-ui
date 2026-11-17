---
id: "components/monthpicker/examples"
title: "Monthpicker examples"
description: "Monthpicker examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["monthpicker","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/monthpicker/tng-monthpicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/monthpicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/monthpicker/sections/examples/monthpicker-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/monthpicker/examples"
componentGroup: "form"
symbols: ["TngMonthpickerComponent"]
selectors: ["tng-monthpicker"]
productId: "monthpicker"
section: "examples"
officialCatalog: true
generated: true
---

# Monthpicker examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngMonthpickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMonthpickerComponent],
  template: `<tng-monthpicker />`,
})
export class MonthpickerExample {}
```
