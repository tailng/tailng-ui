---
id: "components/toggle/examples"
title: "Toggle examples"
description: "Toggle examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["toggle","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/toggle/tng-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/examples/toggle-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/examples/toggle-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/examples/toggle-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/toggle/examples"
componentGroup: "form"
symbols: ["TngToggleComponent"]
selectors: ["tng-toggle"]
productId: "toggle"
section: "examples"
officialCatalog: true
generated: true
---

# Toggle examples

## Formatting actions

Each toggle keeps its own pressed state until the form is submitted.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngToggleComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngToggleComponent],
  template: `<tng-toggle />`,
})
export class ToggleExample {}
```
