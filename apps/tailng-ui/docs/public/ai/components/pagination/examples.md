---
id: "components/pagination/examples"
title: "Pagination examples"
description: "Pagination examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["pagination","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/paginator/tng-paginator.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/pagination/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/pagination/sections/examples/pagination-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/pagination/examples"
componentGroup: "navigation"
symbols: ["TngPaginatorComponent"]
selectors: ["tng-paginator"]
productId: "pagination"
section: "examples"
officialCatalog: true
generated: true
---

# Pagination examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngPaginatorComponent],
  template: `<tng-paginator />`,
})
export class PaginationExample {}
```
