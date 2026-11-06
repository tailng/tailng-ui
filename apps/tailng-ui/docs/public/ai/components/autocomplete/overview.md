---
id: "components/autocomplete/overview"
title: "AutoComplete component"
description: "Single-value autocomplete patterns and filtering behavior."
category: "components"
status: "stable"
tags: ["autocomplete","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/autocomplete/tng-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/autocomplete/overview"
componentGroup: "form"
symbols: ["TngAutocompleteComponent"]
selectors: ["tng-autocomplete"]
productId: "autocomplete"
section: "overview"
officialCatalog: true
generated: true
---

# AutoComplete component

Single-value autocomplete patterns and filtering behavior.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngAutocompleteComponent],
  template: `<tng-autocomplete />`,
})
export class AutocompleteAgentExample {}
```

## Component family

- `TngAutocompleteComponent` — selector `tng-autocomplete`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/autocomplete/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/autocomplete/api.md)
- [Styling](https://tailng.dev/ai/components/autocomplete/styling.md)
- [Examples](https://tailng.dev/ai/components/autocomplete/examples.md)
