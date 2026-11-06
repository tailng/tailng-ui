---
id: "components/form-field/overview"
title: "Form Field component"
description: "Complete field wrapper for labels, controls, hints, errors, and accessibility wiring."
category: "components"
status: "stable"
tags: ["form-field","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adapter.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adornment.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-message.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.component.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.control.ts","apps/tailng-ui/docs/src/app/pages/components/form/form-field/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/form-field/overview"
componentGroup: "form"
symbols: ["TngFormFieldComponent"]
selectors: ["tng-form-field"]
productId: "form-field"
section: "overview"
officialCatalog: true
generated: true
---

# Form Field component

Complete field wrapper for labels, controls, hints, errors, and accessibility wiring.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngFormFieldComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngFormFieldComponent],
  template: `<tng-form-field />`,
})
export class FormFieldAgentExample {}
```

## Component family

- `TngFormFieldComponent` — selector `tng-form-field`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/form-field/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/form-field/api.md)
- [Styling](https://tailng.dev/ai/components/form-field/styling.md)
- [Examples](https://tailng.dev/ai/components/form-field/examples.md)
