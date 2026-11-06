---
id: "components/checkbox/examples"
title: "Checkbox examples"
description: "Checkbox examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["checkbox","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/examples/checkbox-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/examples/checkbox-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/examples/checkbox-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/checkbox/examples"
componentGroup: "form"
symbols: ["TngCheckboxComponent"]
selectors: ["tng-checkbox"]
productId: "checkbox"
section: "examples"
officialCatalog: true
generated: true
---

# Checkbox examples

## Examples

Production-focused checkbox patterns rendered with the component layer only. Each variant keeps the `<tng-checkbox>` API stable while swapping the surrounding styling system.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCheckboxComponent],
  template: `<tng-checkbox />`,
})
export class CheckboxExample {}
```
