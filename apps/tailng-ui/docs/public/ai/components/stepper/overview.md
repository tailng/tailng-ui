---
id: "components/stepper/overview"
title: "Stepper component"
description: "Styled stepper shell powered by headless value, focus, and state management."
category: "components"
status: "stable"
tags: ["stepper","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/stepper/tng-stepper.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/stepper/overview"
componentGroup: "layout"
symbols: ["TngStepperComponent","TngStepperItemComponent"]
selectors: ["tng-stepper","tng-stepper-item"]
productId: "stepper"
section: "overview"
officialCatalog: true
generated: true
---

# Stepper component

Styled stepper shell powered by headless value, focus, and state management.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngStepperComponent],
  template: `<tng-stepper />`,
})
export class StepperAgentExample {}
```

## Component family

- `TngStepperComponent` — selector `tng-stepper`
- `TngStepperItemComponent` — selector `tng-stepper-item`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/stepper/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/stepper/api.md)
- [Styling](https://tailng.dev/ai/components/stepper/styling.md)
- [Examples](https://tailng.dev/ai/components/stepper/examples.md)
