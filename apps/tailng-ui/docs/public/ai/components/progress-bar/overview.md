---
id: "components/progress-bar/overview"
title: "Progress Bar component"
description: "Linear determinate and indeterminate loading states with aria semantics."
category: "components"
status: "stable"
tags: ["progress-bar","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-bar/tng-progress-bar.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-bar/overview"
componentGroup: "feedback"
symbols: ["TngProgressBarComponent"]
selectors: ["tng-progress-bar"]
productId: "progress-bar"
section: "overview"
officialCatalog: true
generated: true
---

# Progress Bar component

Linear determinate and indeterminate loading states with aria semantics.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngProgressBarComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngProgressBarComponent],
  template: `<tng-progress-bar />`,
})
export class ProgressBarAgentExample {}
```

## Component family

- `TngProgressBarComponent` — selector `tng-progress-bar`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/progress-bar/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/progress-bar/api.md)
- [Styling](https://tailng.dev/ai/components/progress-bar/styling.md)
- [Examples](https://tailng.dev/ai/components/progress-bar/examples.md)
