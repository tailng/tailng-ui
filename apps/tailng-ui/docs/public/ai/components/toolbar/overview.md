---
id: "components/toolbar/overview"
title: "Toolbar component"
description: "Group related actions with toolbar semantics and keyboard navigation."
category: "components"
status: "stable"
tags: ["toolbar","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/toolbar/tng-toolbar.component.ts"]
componentGroup: "navigation"
symbols: ["TngToolbarComponent"]
selectors: ["tng-toolbar"]
productId: "toolbar"
section: "overview"
officialCatalog: false
generated: true
---

# Toolbar component

Group related actions with toolbar semantics and keyboard navigation.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngToolbarComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngToolbarComponent],
  template: `<tng-toolbar />`,
})
export class ToolbarAgentExample {}
```

## Component family

- `TngToolbarComponent` — selector `tng-toolbar`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.

## Documentation sections

- [Api](https://tailng.dev/ai/components/toolbar/api.md)
- [Styling](https://tailng.dev/ai/components/toolbar/styling.md)
- [Examples](https://tailng.dev/ai/components/toolbar/examples.md)
