---
id: "components/collapsible/overview"
title: "Collapsible component"
description: "Expandable disclosure regions with headless and styled integration paths."
category: "components"
status: "stable"
tags: ["collapsible","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/collapsible/tng-collapsible.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/collapsible/overview"
componentGroup: "layout"
symbols: ["TngCollapsibleComponent"]
selectors: ["tng-collapsible"]
productId: "collapsible"
section: "overview"
officialCatalog: true
generated: true
---

# Collapsible component

Expandable disclosure regions with headless and styled integration paths.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCollapsibleComponent],
  template: `<tng-collapsible />`,
})
export class CollapsibleAgentExample {}
```

## Component family

- `TngCollapsibleComponent` — selector `tng-collapsible`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/collapsible/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/collapsible/api.md)
- [Styling](https://tailng.dev/ai/components/collapsible/styling.md)
- [Examples](https://tailng.dev/ai/components/collapsible/examples.md)
