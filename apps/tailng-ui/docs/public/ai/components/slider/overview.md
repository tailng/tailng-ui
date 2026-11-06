---
id: "components/slider/overview"
title: "Slider component"
description: "Single-value slider for numeric settings and continuous values."
category: "components"
status: "stable"
tags: ["slider","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/slider/tng-slider.component.ts","libs/tailng-ui/components/src/lib/form/slider/tng-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/slider/overview"
componentGroup: "form"
symbols: ["TngSliderComponent"]
selectors: ["tng-slider"]
productId: "slider"
section: "overview"
officialCatalog: true
generated: true
---

# Slider component

Single-value slider for numeric settings and continuous values.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSliderComponent],
  template: `<tng-slider />`,
})
export class SliderAgentExample {}
```

## Component family

- `TngSliderComponent` — selector `tng-slider`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/slider/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/slider/api.md)
- [Styling](https://tailng.dev/ai/components/slider/styling.md)
- [Examples](https://tailng.dev/ai/components/slider/examples.md)
