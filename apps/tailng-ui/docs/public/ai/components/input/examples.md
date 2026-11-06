---
id: "components/input/examples"
title: "Input examples"
description: "Input examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["input","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input/tng-input.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/examples/input-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/examples/input-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/examples/input-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input/examples"
componentGroup: "form"
symbols: ["TngInputComponent"]
selectors: ["tng-input"]
productId: "input"
section: "examples"
officialCatalog: true
generated: true
---

# Input examples

## Examples

Component-first input patterns built around `<tng-input>`. Adornment-heavy compositions now live on the dedicated Input Field page.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngInputComponent],
  template: `<tng-input />`,
})
export class InputExample {}
```
