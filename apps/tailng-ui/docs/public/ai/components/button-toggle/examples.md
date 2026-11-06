---
id: "components/button-toggle/examples"
title: "Button Toggle examples"
description: "Button Toggle examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["button-toggle","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle-group.component.ts","libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/examples/button-toggle-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/examples/button-toggle-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/examples/button-toggle-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/button-toggle/examples"
componentGroup: "form"
symbols: ["TngButtonToggleComponent","TngButtonToggleGroupComponent"]
selectors: ["tng-button-toggle","tng-button-toggle-group"]
productId: "button-toggle"
section: "examples"
officialCatalog: true
generated: true
---

# Button Toggle examples

## Text alignment

Selected:

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngButtonToggleComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngButtonToggleComponent],
  template: `<tng-button-toggle />`,
})
export class ButtonToggleExample {}
```
