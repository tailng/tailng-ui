---
id: "components/select/overview"
title: "Select component"
description: "Single-choice select surfaces and trigger/content composition."
category: "components"
status: "stable"
tags: ["select","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/select/tng-select.component.ts","libs/tailng-ui/components/src/lib/form/select/tng-select.slots.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/select/overview"
componentGroup: "form"
symbols: ["TngSelectComponent"]
selectors: ["tng-select"]
productId: "select"
section: "overview"
officialCatalog: true
generated: true
---

# Select component

Single-choice select surfaces and trigger/content composition.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSelectComponent],
  template: `<tng-select />`,
})
export class SelectAgentExample {}
```

## Component family

- `TngSelectComponent` — selector `tng-select`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/select/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/select/api.md)
- [Styling](https://tailng.dev/ai/components/select/styling.md)
- [Examples](https://tailng.dev/ai/components/select/examples.md)
