---
id: "components/range-slider/overview"
title: "Range Slider component"
description: "Dual-thumb slider for selecting bounded minimum and maximum values."
category: "components"
status: "stable"
tags: ["range-slider","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.component.ts","libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/range-slider/overview"
componentGroup: "form"
symbols: ["TngRangeSliderComponent"]
selectors: ["tng-range-slider"]
productId: "range-slider"
section: "overview"
officialCatalog: true
generated: true
---

# Range Slider component

Dual-thumb slider for selecting bounded minimum and maximum values.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngRangeSliderComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngRangeSliderComponent],
  template: `<tng-range-slider />`,
})
export class RangeSliderAgentExample {}
```

## Component family

- `TngRangeSliderComponent` — selector `tng-range-slider`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/range-slider/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/range-slider/api.md)
- [Styling](https://tailng.dev/ai/components/range-slider/styling.md)
- [Examples](https://tailng.dev/ai/components/range-slider/examples.md)
