---
id: "components/skeleton/overview"
title: "Skeleton component"
description: "Decorative placeholder blocks for loading layouts and content scaffolding."
category: "components"
status: "stable"
tags: ["skeleton","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/skeleton/tng-skeleton.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/skeleton/overview"
componentGroup: "feedback"
symbols: ["TngSkeletonComponent"]
selectors: ["tng-skeleton"]
productId: "skeleton"
section: "overview"
officialCatalog: true
generated: true
---

# Skeleton component

Decorative placeholder blocks for loading layouts and content scaffolding.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSkeletonComponent],
  template: `<tng-skeleton />`,
})
export class SkeletonAgentExample {}
```

## Component family

- `TngSkeletonComponent` — selector `tng-skeleton`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/skeleton/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/skeleton/api.md)
- [Styling](https://tailng.dev/ai/components/skeleton/styling.md)
- [Examples](https://tailng.dev/ai/components/skeleton/examples.md)
