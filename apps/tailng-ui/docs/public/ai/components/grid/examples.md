---
id: "components/grid/examples"
title: "Grid examples"
description: "Grid examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["grid","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/grid/tng-grid.component.ts"]
componentGroup: "layout"
symbols: ["TngGridCellComponent","TngGridComponent","TngGridRowComponent"]
selectors: ["tng-grid-cell","tng-grid","tng-grid-row"]
productId: "grid"
section: "examples"
officialCatalog: false
generated: true
---

# Grid examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngGridComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngGridComponent],
  template: `<tng-grid />`,
})
export class GridExample {}
```
