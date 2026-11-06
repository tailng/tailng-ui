---
id: "components/bottom-sheet/overview"
title: "Bottom Sheet component"
description: "Display focused content in a modal panel attached to the bottom of the viewport."
category: "components"
status: "stable"
tags: ["bottom-sheet","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/bottom-sheet/tng-bottom-sheet.component.ts"]
componentGroup: "layout"
symbols: ["TngBottomSheetComponent"]
selectors: ["tng-bottom-sheet"]
productId: "bottom-sheet"
section: "overview"
officialCatalog: false
generated: true
---

# Bottom Sheet component

Display focused content in a modal panel attached to the bottom of the viewport.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngBottomSheetComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngBottomSheetComponent],
  template: `<tng-bottom-sheet />`,
})
export class BottomSheetAgentExample {}
```

## Component family

- `TngBottomSheetComponent` — selector `tng-bottom-sheet`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.

## Documentation sections

- [Api](https://tailng.dev/ai/components/bottom-sheet/api.md)
- [Styling](https://tailng.dev/ai/components/bottom-sheet/styling.md)
- [Examples](https://tailng.dev/ai/components/bottom-sheet/examples.md)
