---
id: "components/grid/overview"
title: "Grid component"
description: "Arrange content in a responsive styled grid surface."
category: "components"
status: "stable"
tags: ["grid","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/grid/tng-grid.component.ts"]
componentGroup: "layout"
symbols: ["TngGridCellComponent","TngGridComponent","TngGridRowComponent"]
selectors: ["tng-grid-cell","tng-grid","tng-grid-row"]
productId: "grid"
section: "overview"
officialCatalog: false
generated: true
---

# Grid component

Arrange content in a responsive styled grid surface.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngGridComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngGridComponent],
  template: `<tng-grid />`,
})
export class GridAgentExample {}
```

## Component family

- `TngGridCellComponent` — selector `tng-grid-cell`
- `TngGridComponent` — selector `tng-grid`
- `TngGridRowComponent` — selector `tng-grid-row`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.

## Documentation sections

- [Api](https://tailng.dev/ai/components/grid/api.md)
- [Styling](https://tailng.dev/ai/components/grid/styling.md)
- [Examples](https://tailng.dev/ai/components/grid/examples.md)
