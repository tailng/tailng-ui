---
id: "components/number-range/overview"
title: "Number Range component"
description: "Dual numeric input for min/max range selection with built-in validity checking and form integration."
category: "components"
status: "stable"
tags: ["number-range","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/number-range/index.ts","libs/tailng-ui/components/src/lib/form/number-range/tng-number-range.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/number-range/overview"
componentGroup: "form"
symbols: ["TngNumberRangeComponent"]
selectors: ["tng-number-range"]
productId: "number-range"
section: "overview"
officialCatalog: true
generated: true
---

# Number Range component

Dual numeric input for min/max range selection with built-in validity checking and form integration.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngNumberRangeComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
export class NumberRangeAgentExample {}
```

## Component family

- `TngNumberRangeComponent` — selector `tng-number-range`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/number-range/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/number-range/api.md)
- [Styling](https://tailng.dev/ai/components/number-range/styling.md)
- [Examples](https://tailng.dev/ai/components/number-range/examples.md)
