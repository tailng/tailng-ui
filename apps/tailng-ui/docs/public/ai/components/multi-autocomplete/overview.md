---
id: "components/multi-autocomplete/overview"
title: "MultiAutocomplete component"
description: "Chip-based autocomplete selection for multiple values."
category: "components"
status: "stable"
tags: ["multi-autocomplete","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multi-autocomplete/tng-multi-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multi-autocomplete/overview"
componentGroup: "form"
symbols: ["TngMultiAutocompleteComponent"]
selectors: ["tng-multi-autocomplete"]
productId: "multi-autocomplete"
section: "overview"
officialCatalog: true
generated: true
---

# MultiAutocomplete component

Chip-based autocomplete selection for multiple values.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  template: `<tng-multi-autocomplete />`,
})
export class MultiAutocompleteAgentExample {}
```

## Component family

- `TngMultiAutocompleteComponent` — selector `tng-multi-autocomplete`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/multi-autocomplete/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/multi-autocomplete/api.md)
- [Styling](https://tailng.dev/ai/components/multi-autocomplete/styling.md)
- [Examples](https://tailng.dev/ai/components/multi-autocomplete/examples.md)
