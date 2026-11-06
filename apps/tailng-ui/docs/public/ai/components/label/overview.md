---
id: "components/label/overview"
title: "Label component"
description: "Accessible label semantics for explicit and wrapped control association."
category: "components"
status: "stable"
tags: ["label","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/label/tng-label.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/label/overview"
componentGroup: "form"
symbols: ["TngLabelComponent"]
selectors: ["tng-label"]
productId: "label"
section: "overview"
officialCatalog: true
generated: true
---

# Label component

Accessible label semantics for explicit and wrapped control association.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngLabelComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngLabelComponent],
  template: `<tng-label />`,
})
export class LabelAgentExample {}
```

## Component family

- `TngLabelComponent` — selector `tng-label`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/label/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/label/api.md)
- [Styling](https://tailng.dev/ai/components/label/styling.md)
- [Examples](https://tailng.dev/ai/components/label/examples.md)
