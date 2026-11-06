---
id: "components/date-range-picker/overview"
title: "Date Range Picker component"
description: "Material-style date range selection with editable input, adapter formatting, and bounded calendar views."
category: "components"
status: "stable"
tags: ["date-range-picker","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/date-range-picker/tng-date-range-picker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/date-range-picker/overview"
componentGroup: "form"
symbols: ["TngDateRangePickerComponent"]
selectors: ["tng-date-range-picker"]
productId: "date-range-picker"
section: "overview"
officialCatalog: true
generated: true
---

# Date Range Picker component

Material-style date range selection with editable input, adapter formatting, and bounded calendar views.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngDateRangePickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngDateRangePickerComponent],
  template: `<tng-date-range-picker />`,
})
export class DateRangePickerAgentExample {}
```

## Component family

- `TngDateRangePickerComponent` — selector `tng-date-range-picker`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/date-range-picker/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/date-range-picker/api.md)
- [Styling](https://tailng.dev/ai/components/date-range-picker/styling.md)
- [Examples](https://tailng.dev/ai/components/date-range-picker/examples.md)
