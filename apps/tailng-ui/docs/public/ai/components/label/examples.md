---
id: "components/label/examples"
title: "Label examples"
description: "Label examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["label","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/label/tng-label.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/examples/label-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/examples/label-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/examples/label-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/label/examples"
componentGroup: "form"
symbols: ["TngLabelComponent"]
selectors: ["tng-label"]
productId: "label"
section: "examples"
officialCatalog: true
generated: true
---

# Label examples

Project: · Alerts:

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngLabelComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngLabelComponent],
  template: `<tng-label />`,
})
export class LabelExample {}
```
