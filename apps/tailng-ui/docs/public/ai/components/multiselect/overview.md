---
id: "components/multiselect/overview"
title: "MultiSelect component"
description: "Multiple-selection dropdown behavior and state handling."
category: "components"
status: "stable"
tags: ["multiselect","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multiselect/tng-multiselect.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multiselect/overview"
componentGroup: "form"
symbols: ["TngMultiSelectComponent"]
selectors: ["tng-multiselect"]
productId: "multiselect"
section: "overview"
officialCatalog: true
generated: true
---

# MultiSelect component

Multiple-selection dropdown behavior and state handling.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMultiSelectComponent],
  template: `<tng-multiselect />`,
})
export class MultiselectAgentExample {}
```

## Component family

- `TngMultiSelectComponent` — selector `tng-multiselect`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/multiselect/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/multiselect/api.md)
- [Styling](https://tailng.dev/ai/components/multiselect/styling.md)
- [Examples](https://tailng.dev/ai/components/multiselect/examples.md)
