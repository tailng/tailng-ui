---
id: "components/codeblock/overview"
title: "Codeblock component"
description: "Code rendering, highlighting adapters, and line metadata."
category: "components"
status: "stable"
tags: ["codeblock","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/code-block/highlighting.ts","libs/tailng-ui/components/src/lib/utility/code-block/tng-code-block.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/codeblock/overview"
componentGroup: "utility"
symbols: ["TngCodeBlockComponent"]
selectors: ["tng-code-block"]
productId: "codeblock"
section: "overview"
officialCatalog: true
generated: true
---

# Codeblock component

Code rendering, highlighting adapters, and line metadata.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCodeBlockComponent],
  template: `<tng-code-block />`,
})
export class CodeblockAgentExample {}
```

## Component family

- `TngCodeBlockComponent` — selector `tng-code-block`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/codeblock/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/codeblock/api.md)
- [Styling](https://tailng.dev/ai/components/codeblock/styling.md)
- [Examples](https://tailng.dev/ai/components/codeblock/examples.md)
