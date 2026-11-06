---
id: "components/tree/overview"
title: "Tree component"
description: "Hierarchical data navigation with keyboard support, selection, and expand/collapse."
category: "components"
status: "stable"
tags: ["tree","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tree/tng-tree.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tree/overview"
componentGroup: "navigation"
symbols: ["TngTreeComponent"]
selectors: ["tng-tree"]
productId: "tree"
section: "overview"
officialCatalog: true
generated: true
---

# Tree component

Hierarchical data navigation with keyboard support, selection, and expand/collapse.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTreeComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTreeComponent],
  template: `<tng-tree />`,
})
export class TreeAgentExample {}
```

## Component family

- `TngTreeComponent` — selector `tng-tree`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/tree/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/tree/api.md)
- [Styling](https://tailng.dev/ai/components/tree/styling.md)
- [Examples](https://tailng.dev/ai/components/tree/examples.md)
