---
id: "components/drawer/examples"
title: "Drawer examples"
description: "Drawer examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["drawer","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/drawer/tng-drawer.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/examples/drawer-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/examples/drawer-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/examples/drawer-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/drawer/examples"
componentGroup: "layout"
symbols: ["TngDrawerComponent"]
selectors: ["tng-drawer"]
productId: "drawer"
section: "examples"
officialCatalog: true
generated: true
---

# Drawer examples

## Drawer examples

Persistent side drawer used as a navigation panel. Content shifts when the drawer opens or closes.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngDrawerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDrawerComponent],
  template: `<tng-drawer />`,
})
export class DrawerExample {}
```
