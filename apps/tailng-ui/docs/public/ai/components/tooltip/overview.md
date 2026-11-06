---
id: "components/tooltip/overview"
title: "Tooltip component"
description: "Hover/focus helper text with trigger/content association and side placement hooks."
category: "components"
status: "stable"
tags: ["tooltip","overlay","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/tooltip/overview"
componentGroup: "overlay"
symbols: ["TngTooltipComponent"]
selectors: ["tng-tooltip"]
productId: "tooltip"
section: "overview"
officialCatalog: true
generated: true
---

# Tooltip component

Hover/focus helper text with trigger/content association and side placement hooks.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTooltipComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTooltipComponent],
  template: `<tng-tooltip />`,
})
export class TooltipAgentExample {}
```

## Component family

- `TngTooltipComponent` — selector `tng-tooltip`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/overlay/tooltip/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/tooltip/api.md)
- [Styling](https://tailng.dev/ai/components/tooltip/styling.md)
- [Examples](https://tailng.dev/ai/components/tooltip/examples.md)
