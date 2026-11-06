---
id: "components/radio/overview"
title: "Radio component"
description: "Single-choice grouped selection with native semantics and keyboard behavior."
category: "components"
status: "stable"
tags: ["radio","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/radio/tng-radio.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/radio/overview"
componentGroup: "form"
symbols: ["TngRadioComponent"]
selectors: ["tng-radio"]
productId: "radio"
section: "overview"
officialCatalog: true
generated: true
---

# Radio component

Single-choice grouped selection with native semantics and keyboard behavior.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngRadioComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngRadioComponent],
  template: `<tng-radio />`,
})
export class RadioAgentExample {}
```

## Component family

- `TngRadioComponent` — selector `tng-radio`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/radio/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/radio/api.md)
- [Styling](https://tailng.dev/ai/components/radio/styling.md)
- [Examples](https://tailng.dev/ai/components/radio/examples.md)
