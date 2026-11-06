---
id: "components/input-field/overview"
title: "Input Field component"
description: "Projected input shell with prefix and suffix slots for icons, helper text, and inline actions."
category: "components"
status: "stable"
tags: ["input-field","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-field/tng-input-field.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-field/overview"
componentGroup: "form"
symbols: ["TngInputFieldComponent"]
selectors: ["tng-input-field"]
productId: "input-field"
section: "overview"
officialCatalog: true
generated: true
---

# Input Field component

Projected input shell with prefix and suffix slots for icons, helper text, and inline actions.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngInputFieldComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngInputFieldComponent],
  template: `<tng-input-field />`,
})
export class InputFieldAgentExample {}
```

## Component family

- `TngInputFieldComponent` — selector `tng-input-field`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/input-field/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/input-field/api.md)
- [Styling](https://tailng.dev/ai/components/input-field/styling.md)
- [Examples](https://tailng.dev/ai/components/input-field/examples.md)
