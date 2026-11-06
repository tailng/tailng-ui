---
id: "components/dropdown-menu/examples"
title: "Dropdown Menu examples"
description: "Dropdown Menu examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["dropdown-menu","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/dropdown-menu/tng-dropdown-menu.component.ts"]
componentGroup: "navigation"
symbols: ["TngDropdownMenuComponent"]
selectors: ["tng-dropdown-menu"]
productId: "dropdown-menu"
section: "examples"
officialCatalog: false
generated: true
---

# Dropdown Menu examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngDropdownMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDropdownMenuComponent],
  template: `<tng-dropdown-menu />`,
})
export class DropdownMenuExample {}
```
