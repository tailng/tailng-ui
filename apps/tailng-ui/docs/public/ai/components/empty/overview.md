---
id: "components/empty/overview"
title: "Empty component"
description: "Empty-state layout with icon, title, description, and action composition."
category: "components"
status: "stable"
tags: ["empty","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/empty/tng-empty.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/empty/overview"
componentGroup: "feedback"
symbols: ["TngEmptyActionsComponent","TngEmptyComponent","TngEmptyDescriptionComponent","TngEmptyIconComponent","TngEmptyTitleComponent"]
selectors: ["tng-empty-actions","tng-empty","tng-empty-description","tng-empty-icon","tng-empty-title"]
productId: "empty"
section: "overview"
officialCatalog: true
generated: true
---

# Empty component

Empty-state layout with icon, title, description, and action composition.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngEmptyComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngEmptyComponent],
  template: `<tng-empty />`,
})
export class EmptyAgentExample {}
```

## Component family

- `TngEmptyActionsComponent` — selector `tng-empty-actions`
- `TngEmptyComponent` — selector `tng-empty`
- `TngEmptyDescriptionComponent` — selector `tng-empty-description`
- `TngEmptyIconComponent` — selector `tng-empty-icon`
- `TngEmptyTitleComponent` — selector `tng-empty-title`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/empty/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/empty/api.md)
- [Styling](https://tailng.dev/ai/components/empty/styling.md)
- [Examples](https://tailng.dev/ai/components/empty/examples.md)
