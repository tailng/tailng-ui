---
id: "components/dropdown-menu/overview"
title: "Dropdown Menu component"
description: "Open a contextual menu from an explicit trigger control."
category: "components"
status: "stable"
tags: ["dropdown-menu","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/dropdown-menu/tng-dropdown-menu.component.ts"]
componentGroup: "navigation"
symbols: ["TngDropdownMenuComponent"]
selectors: ["tng-dropdown-menu"]
productId: "dropdown-menu"
section: "overview"
officialCatalog: false
generated: true
---

# Dropdown Menu component

Open a contextual menu from an explicit trigger control.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngDropdownMenuComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDropdownMenuComponent],
  template: `<tng-dropdown-menu />`,
})
export class DropdownMenuAgentExample {}
```

## Component family

- `TngDropdownMenuComponent` — selector `tng-dropdown-menu`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.

## Documentation sections

- [Api](https://tailng.dev/ai/components/dropdown-menu/api.md)
- [Styling](https://tailng.dev/ai/components/dropdown-menu/styling.md)
- [Examples](https://tailng.dev/ai/components/dropdown-menu/examples.md)
