---
id: "components/tag/overview"
title: "Tag component"
description: "Compact label chips with optional icon and removable close action."
category: "components"
status: "stable"
tags: ["tag","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tag/tng-tag.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/tag/overview"
componentGroup: "utility"
symbols: ["TngTagComponent"]
selectors: ["tng-tag"]
productId: "tag"
section: "overview"
officialCatalog: true
generated: true
---

# Tag component

Compact label chips with optional icon and removable close action.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTagComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTagComponent],
  template: `<tng-tag />`,
})
export class TagAgentExample {}
```

## Component family

- `TngTagComponent` — selector `tng-tag`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/tag/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/tag/api.md)
- [Styling](https://tailng.dev/ai/components/tag/styling.md)
- [Examples](https://tailng.dev/ai/components/tag/examples.md)
