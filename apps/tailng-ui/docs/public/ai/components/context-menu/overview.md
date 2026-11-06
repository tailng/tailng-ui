---
id: "components/context-menu/overview"
title: "Context Menu component"
description: "Right-click and keyboard context actions anchored to element surfaces."
category: "components"
status: "stable"
tags: ["context-menu","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/context-menu/tng-context-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/context-menu/overview"
componentGroup: "navigation"
symbols: ["TngContextMenuComponent"]
selectors: ["tng-context-menu"]
productId: "context-menu"
section: "overview"
officialCatalog: true
generated: true
---

# Context Menu component

Right-click and keyboard context actions anchored to element surfaces.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngContextMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngContextMenuComponent],
  template: `<tng-context-menu />`,
})
export class ContextMenuAgentExample {}
```

## Component family

- `TngContextMenuComponent` — selector `tng-context-menu`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/context-menu/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/context-menu/api.md)
- [Styling](https://tailng.dev/ai/components/context-menu/styling.md)
- [Examples](https://tailng.dev/ai/components/context-menu/examples.md)
