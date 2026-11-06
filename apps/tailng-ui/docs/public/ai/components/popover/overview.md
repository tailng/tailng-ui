---
id: "components/popover/overview"
title: "Popover component"
description: "Anchored floating panel with trigger semantics and outside/Escape dismissal."
category: "components"
status: "stable"
tags: ["popover","overlay","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/popover/tng-popover-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/overlay/popover/tng-popover.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/popover/overview"
componentGroup: "overlay"
symbols: ["TngPopoverComponent"]
selectors: ["tng-popover"]
productId: "popover"
section: "overview"
officialCatalog: true
generated: true
---

# Popover component

Anchored floating panel with trigger semantics and outside/Escape dismissal.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngPopoverComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngPopoverComponent],
  template: `<tng-popover />`,
})
export class PopoverAgentExample {}
```

## Component family

- `TngPopoverComponent` — selector `tng-popover`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/overlay/popover/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/popover/api.md)
- [Styling](https://tailng.dev/ai/components/popover/styling.md)
- [Examples](https://tailng.dev/ai/components/popover/examples.md)
