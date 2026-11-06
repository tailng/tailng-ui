---
id: "components/radio/examples"
title: "Radio examples"
description: "Radio examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["radio","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/radio/tng-radio.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/examples/radio-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/examples/radio-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/examples/radio-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/radio/examples"
componentGroup: "form"
symbols: ["TngRadioComponent"]
selectors: ["tng-radio"]
productId: "radio"
section: "examples"
officialCatalog: true
generated: true
---

# Radio examples

## Billing plan

Selected:

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngRadioComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngRadioComponent],
  template: `<tng-radio />`,
})
export class RadioExample {}
```
