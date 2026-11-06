---
id: "components/navigation-menu/examples"
title: "Navigation Menu examples"
description: "Navigation Menu examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["navigation-menu","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/navigation-menu/tng-navigation-menu.component.ts"]
componentGroup: "navigation"
symbols: ["TngNavigationMenuComponent"]
selectors: ["tng-navigation-menu"]
productId: "navigation-menu"
section: "examples"
officialCatalog: false
generated: true
---

# Navigation Menu examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngNavigationMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngNavigationMenuComponent],
  template: `<tng-navigation-menu />`,
})
export class NavigationMenuExample {}
```
