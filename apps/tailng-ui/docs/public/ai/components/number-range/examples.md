---
id: "components/number-range/examples"
title: "Number Range examples"
description: "Number Range examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["number-range","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/number-range/index.ts","libs/tailng-ui/components/src/lib/form/number-range/tng-number-range.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/examples/number-range-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/examples/number-range-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/examples/number-range-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/number-range/examples"
componentGroup: "form"
symbols: ["TngNumberRangeComponent"]
selectors: ["tng-number-range"]
productId: "number-range"
section: "examples"
officialCatalog: true
generated: true
---

# Number Range examples

## Examples

Common usage patterns for `<tng-number-range>`, from a simple range field through constrained inputs, validation feedback, and state variants.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngNumberRangeComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
export class NumberRangeExample {}
```
