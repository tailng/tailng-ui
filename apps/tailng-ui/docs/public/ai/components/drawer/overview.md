---
id: "components/drawer/overview"
title: "Drawer component"
description: "Slide-in overlay panel with position, mode, focus trap, and backdrop support."
category: "components"
status: "stable"
tags: ["drawer","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/drawer/tng-drawer.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/drawer/overview"
componentGroup: "layout"
symbols: ["TngDrawerComponent"]
selectors: ["tng-drawer"]
productId: "drawer"
section: "overview"
officialCatalog: true
generated: true
---

# Drawer component

Slide-in overlay panel with position, mode, focus trap, and backdrop support.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngDrawerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDrawerComponent],
  template: `<tng-drawer />`,
})
export class DrawerAgentExample {}
```

## Component family

- `TngDrawerComponent` — selector `tng-drawer`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/drawer/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/drawer/api.md)
- [Styling](https://tailng.dev/ai/components/drawer/styling.md)
- [Examples](https://tailng.dev/ai/components/drawer/examples.md)
