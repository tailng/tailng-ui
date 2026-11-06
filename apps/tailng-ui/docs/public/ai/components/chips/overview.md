---
id: "components/chips/overview"
title: "Chips component"
description: "Tokenized input and removable item chip usage patterns."
category: "components"
status: "stable"
tags: ["chips","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/chips/tng-chip.component.ts","libs/tailng-ui/components/src/lib/form/chips/tng-chips.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/chips/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/chips/overview"
componentGroup: "form"
symbols: ["TngChipComponent","TngChipsComponent"]
selectors: ["tng-chip","tng-chips"]
productId: "chips"
section: "overview"
officialCatalog: true
generated: true
---

# Chips component

Tokenized input and removable item chip usage patterns.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngChipsComponent],
  template: `<tng-chips />`,
})
export class ChipsAgentExample {}
```

## Component family

- `TngChipComponent` — selector `tng-chip`
- `TngChipsComponent` — selector `tng-chips`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/chips/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/chips/api.md)
- [Styling](https://tailng.dev/ai/components/chips/styling.md)
- [Examples](https://tailng.dev/ai/components/chips/examples.md)
