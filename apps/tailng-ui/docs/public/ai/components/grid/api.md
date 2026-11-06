---
id: "components/grid/api"
title: "Grid API"
description: "Grid API reference for Angular applications."
category: "components"
status: "stable"
tags: ["grid","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/grid/tng-grid.component.ts"]
componentGroup: "layout"
symbols: ["TngGridCellComponent","TngGridComponent","TngGridRowComponent"]
selectors: ["tng-grid-cell","tng-grid","tng-grid-row"]
productId: "grid"
section: "api"
officialCatalog: false
generated: true
---

# Grid API

Arrange content in a responsive styled grid surface.

## Source-derived public Angular API

### `TngGridCellComponent` — `tng-grid-cell`

- Forwarded inputs: `cellRole`, `colIndex`, `colSpan`, `disabled`, `rowIndex`, `rowSpan`, `selected`

### `TngGridComponent` — `tng-grid`

- Forwarded inputs: `ariaColcount`, `ariaLabel`, `ariaRowcount`, `defaultValue`, `dir`, `focusCol`, `focusRow`, `selectionMode`, `value`, `wrap`
- Forwarded outputs: `cellActivate`, `focusChange`, `focusColChange`, `focusRowChange`, `valueChange`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngGridRowComponent` — `tng-grid-row`
