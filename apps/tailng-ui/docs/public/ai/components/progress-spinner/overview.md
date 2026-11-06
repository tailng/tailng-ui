---
id: "components/progress-spinner/overview"
title: "Progress Spinner component"
description: "Circular determinate and indeterminate loading states with aria semantics."
category: "components"
status: "stable"
tags: ["progress-spinner","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-spinner/tng-progress-spinner.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-spinner/overview"
componentGroup: "feedback"
symbols: ["TngProgressSpinnerComponent"]
selectors: ["tng-progress-spinner"]
productId: "progress-spinner"
section: "overview"
officialCatalog: true
generated: true
---

# Progress Spinner component

Circular determinate and indeterminate loading states with aria semantics.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  template: `<tng-progress-spinner />`,
})
export class ProgressSpinnerAgentExample {}
```

## Component family

- `TngProgressSpinnerComponent` — selector `tng-progress-spinner`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/progress-spinner/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/progress-spinner/api.md)
- [Styling](https://tailng.dev/ai/components/progress-spinner/styling.md)
- [Examples](https://tailng.dev/ai/components/progress-spinner/examples.md)
