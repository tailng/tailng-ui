---
id: "components/navigation-menu/overview"
title: "Navigation Menu component"
description: "Compose application navigation with nested and keyboard-accessible menu content."
category: "components"
status: "stable"
tags: ["navigation-menu","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/navigation-menu/tng-navigation-menu.component.ts"]
componentGroup: "navigation"
symbols: ["TngNavigationMenuComponent"]
selectors: ["tng-navigation-menu"]
productId: "navigation-menu"
section: "overview"
officialCatalog: false
generated: true
---

# Navigation Menu component

Compose application navigation with nested and keyboard-accessible menu content.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngNavigationMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngNavigationMenuComponent],
  template: `<tng-navigation-menu />`,
})
export class NavigationMenuAgentExample {}
```

## Component family

- `TngNavigationMenuComponent` — selector `tng-navigation-menu`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.

## Documentation sections

- [Api](https://tailng.dev/ai/components/navigation-menu/api.md)
- [Styling](https://tailng.dev/ai/components/navigation-menu/styling.md)
- [Examples](https://tailng.dev/ai/components/navigation-menu/examples.md)
