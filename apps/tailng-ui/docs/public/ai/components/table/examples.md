---
id: "components/table/examples"
title: "Table examples"
description: "Table examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["table","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/table/tng-table.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/table/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/table/sections/examples/table-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/table/examples"
componentGroup: "layout"
symbols: ["TngTableComponent"]
selectors: ["tng-table"]
productId: "table"
section: "examples"
officialCatalog: true
generated: true
---

# Table examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngTableComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTableComponent],
  template: `<tng-table />`,
})
export class TableExample {}
```
