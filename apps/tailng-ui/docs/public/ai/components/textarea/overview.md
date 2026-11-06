---
id: "components/textarea/overview"
title: "Textarea component"
description: "Multiline text input patterns with input-first primitives and styled textarea wrappers."
category: "components"
status: "stable"
tags: ["textarea","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/textarea/overview"
componentGroup: "form"
symbols: ["TngTextareaComponent"]
selectors: ["tng-textarea"]
productId: "textarea"
section: "overview"
officialCatalog: true
generated: true
---

# Textarea component

Multiline text input patterns with input-first primitives and styled textarea wrappers.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTextareaComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTextareaComponent],
  template: `<tng-textarea />`,
})
export class TextareaAgentExample {}
```

## Component family

- `TngTextareaComponent` — selector `tng-textarea`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/textarea/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/textarea/api.md)
- [Styling](https://tailng.dev/ai/components/textarea/styling.md)
- [Examples](https://tailng.dev/ai/components/textarea/examples.md)
