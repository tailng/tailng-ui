---
id: "components/menu/overview"
title: "Menu component"
description: "Contextual menu interactions, keyboard flow, and submenu behavior."
category: "components"
status: "stable"
tags: ["menu","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menu/tng-menu-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/navigation/menu/tng-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menu/overview"
componentGroup: "navigation"
symbols: ["TngMenuComponent"]
selectors: ["tng-menu"]
productId: "menu"
section: "overview"
officialCatalog: true
generated: true
---

# Menu component

Contextual menu interactions, keyboard flow, and submenu behavior.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMenuComponent],
  template: `<tng-menu />`,
})
export class MenuAgentExample {}
```

## Component family

- `TngMenuComponent` — selector `tng-menu`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/menu/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/menu/api.md)
- [Styling](https://tailng.dev/ai/components/menu/styling.md)
- [Examples](https://tailng.dev/ai/components/menu/examples.md)
