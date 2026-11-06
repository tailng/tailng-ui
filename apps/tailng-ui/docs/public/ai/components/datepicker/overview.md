---
id: "components/datepicker/overview"
title: "Datepicker component"
description: "Material-style date selection with editable input, adapter formatting, and bounded calendar views."
category: "components"
status: "stable"
tags: ["datepicker","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/datepicker/tng-datepicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/datepicker/overview"
componentGroup: "form"
symbols: ["TngDatepickerComponent"]
selectors: ["tng-datepicker"]
productId: "datepicker"
section: "overview"
officialCatalog: true
generated: true
---

# Datepicker component

Material-style date selection with editable input, adapter formatting, and bounded calendar views.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngDatepickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDatepickerComponent],
  template: `<tng-datepicker />`,
})
export class DatepickerAgentExample {}
```

## Component family

- `TngDatepickerComponent` — selector `tng-datepicker`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/datepicker/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/datepicker/api.md)
- [Styling](https://tailng.dev/ai/components/datepicker/styling.md)
- [Examples](https://tailng.dev/ai/components/datepicker/examples.md)
