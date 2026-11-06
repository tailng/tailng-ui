---
id: "components/tree-table/overview"
title: "Tree Table component"
description: "Hierarchical treegrid table with expand/collapse rows, selection, keyboard navigation, and accessible aria attributes."
category: "components"
status: "stable"
tags: ["tree-table","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/tree-table/index.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table-column.type.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/tree-table/overview"
componentGroup: "layout"
symbols: ["TngTreeTableComponent"]
selectors: ["tng-tree-table"]
productId: "tree-table"
section: "overview"
officialCatalog: true
generated: true
---

# Tree Table component

Hierarchical treegrid table with expand/collapse rows, selection, keyboard navigation, and accessible aria attributes.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTreeTableComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTreeTableComponent],
  template: `<tng-tree-table [columns]="$any(null)" />`,
})
export class TreeTableAgentExample {}
```

## Component family

- `TngTreeTableComponent` — selector `tng-tree-table`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/tree-table/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/tree-table/api.md)
- [Styling](https://tailng.dev/ai/components/tree-table/styling.md)
- [Examples](https://tailng.dev/ai/components/tree-table/examples.md)
