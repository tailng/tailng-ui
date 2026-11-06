---
id: "components/menubar/overview"
title: "Menubar component"
description: "Top-level menubar patterns with owned menu integration."
category: "components"
status: "stable"
tags: ["menubar","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menubar/tng-menubar.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menubar/overview"
componentGroup: "navigation"
symbols: ["TngMenubarComponent"]
selectors: ["tng-menubar"]
productId: "menubar"
section: "overview"
officialCatalog: true
generated: true
---

# Menubar component

Top-level menubar patterns with owned menu integration.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngMenubarComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMenubarComponent],
  template: `<tng-menubar />`,
})
export class MenubarAgentExample {}
```

## Component family

- `TngMenubarComponent` — selector `tng-menubar`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/menubar/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/menubar/api.md)
- [Styling](https://tailng.dev/ai/components/menubar/styling.md)
- [Examples](https://tailng.dev/ai/components/menubar/examples.md)
