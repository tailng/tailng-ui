---
id: "components/tree-table/examples"
title: "Tree Table examples"
description: "Tree Table examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["tree-table","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/tree-table/index.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table-column.type.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/sections/examples/tree-table-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/sections/examples/tree-table-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/sections/examples/tree-table-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/tree-table/examples"
componentGroup: "layout"
symbols: ["TngTreeTableComponent"]
selectors: ["tng-tree-table"]
productId: "tree-table"
section: "examples"
officialCatalog: true
generated: true
---

# Tree Table examples

## Examples

Copy-pasteable tree table examples. Each demo is interactive — click the toggle buttons or press ArrowRight/Left on any row.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngTreeTableComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTreeTableComponent],
  template: `<tng-tree-table />`,
})
export class TreeTableExample {}
```
