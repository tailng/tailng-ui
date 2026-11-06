---
id: "components/tabs/examples"
title: "Tabs examples"
description: "Tabs examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["tabs","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/examples/tabs-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/examples/tabs-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/examples/tabs-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tabs/examples"
componentGroup: "navigation"
symbols: ["TngTabsComponent"]
selectors: ["tng-tabs"]
productId: "tabs"
section: "examples"
officialCatalog: true
generated: true
---

# Tabs examples

## Examples

Common tabs patterns rendered through the components wrapper while the tab parts stay explicit.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngTabsComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTabsComponent],
  template: `<tng-tabs />`,
})
export class TabsExample {}
```
