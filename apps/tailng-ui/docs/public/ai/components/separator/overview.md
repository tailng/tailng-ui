---
id: "components/separator/overview"
title: "Separator component"
description: "Horizontal and vertical dividers for visual or semantic content grouping."
category: "components"
status: "stable"
tags: ["separator","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/separator/tng-separator.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/separator/overview"
componentGroup: "layout"
symbols: ["TngSeparatorComponent"]
selectors: ["tng-separator"]
productId: "separator"
section: "overview"
officialCatalog: true
generated: true
---

# Separator component

Horizontal and vertical dividers for visual or semantic content grouping.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSeparatorComponent],
  template: `<tng-separator />`,
})
export class SeparatorAgentExample {}
```

## Component family

- `TngSeparatorComponent` — selector `tng-separator`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/separator/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/separator/api.md)
- [Styling](https://tailng.dev/ai/components/separator/styling.md)
- [Examples](https://tailng.dev/ai/components/separator/examples.md)
