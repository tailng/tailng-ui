---
id: "components/split/overview"
title: "Split Layout component"
description: "Resizable horizontal and vertical panes with controlled sizes, collapse states, and accessible handles."
category: "components"
status: "stable"
tags: ["split","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.engine.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.types.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/split/overview"
componentGroup: "layout"
symbols: ["TngSplitGroupComponent","TngSplitHandleComponent","TngSplitPaneDirective"]
selectors: ["tng-split-group","tng-split-handle","[tngSplitPane]"]
productId: "split"
section: "overview"
officialCatalog: true
generated: true
---

# Split Layout component

Resizable horizontal and vertical panes with controlled sizes, collapse states, and accessible handles.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSplitGroupComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSplitGroupComponent],
  template: `<tng-split-group />`,
})
export class SplitAgentExample {}
```

## Component family

- `TngSplitGroupComponent` — selector `tng-split-group`
- `TngSplitHandleComponent` — selector `tng-split-handle`
- `TngSplitPaneDirective` — selector `[tngSplitPane]`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/split/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/split/api.md)
- [Styling](https://tailng.dev/ai/components/split/styling.md)
- [Examples](https://tailng.dev/ai/components/split/examples.md)
