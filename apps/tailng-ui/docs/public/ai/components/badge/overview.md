---
id: "components/badge/overview"
title: "Badge component"
description: "Count, dot, and placement badges for notifications and status overlays."
category: "components"
status: "stable"
tags: ["badge","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/badge/tng-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/badge/overview"
componentGroup: "utility"
symbols: ["TngBadgeComponent"]
selectors: ["[tngBadge]"]
productId: "badge"
section: "overview"
officialCatalog: true
generated: true
---

# Badge component

Count, dot, and placement badges for notifications and status overlays.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngBadgeComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngBadgeComponent],
  template: `<div tngBadge></div>`,
})
export class BadgeAgentExample {}
```

## Component family

- `TngBadgeComponent` — selector `[tngBadge]`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/badge/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/badge/api.md)
- [Styling](https://tailng.dev/ai/components/badge/styling.md)
- [Examples](https://tailng.dev/ai/components/badge/examples.md)
