---
id: "components/checkbox/overview"
title: "Checkbox component"
description: "Binary and tri-state selection patterns with headless and styled usage."
category: "components"
status: "stable"
tags: ["checkbox","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/checkbox/overview"
componentGroup: "form"
symbols: ["TngCheckboxComponent"]
selectors: ["tng-checkbox"]
productId: "checkbox"
section: "overview"
officialCatalog: true
generated: true
---

# Checkbox component

Binary and tri-state selection patterns with headless and styled usage.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCheckboxComponent],
  template: `<tng-checkbox />`,
})
export class CheckboxAgentExample {}
```

## Component family

- `TngCheckboxComponent` — selector `tng-checkbox`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/checkbox/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/checkbox/api.md)
- [Styling](https://tailng.dev/ai/components/checkbox/styling.md)
- [Examples](https://tailng.dev/ai/components/checkbox/examples.md)
