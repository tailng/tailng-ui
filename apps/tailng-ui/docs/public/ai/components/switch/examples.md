---
id: "components/switch/examples"
title: "Switch examples"
description: "Switch examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["switch","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/examples/switch-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/examples/switch-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/examples/switch-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/switch/examples"
componentGroup: "form"
symbols: ["TngSwitchComponent"]
selectors: ["tng-switch"]
productId: "switch"
section: "examples"
officialCatalog: true
generated: true
---

# Switch examples

Release email: · Freeze window:

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `<tng-switch />`,
})
export class SwitchExample {}
```
