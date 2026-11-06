---
id: "components/code-editor/overview"
title: "Code Editor component"
description: "Editable source code with adapter-based highlighting, native textarea semantics, and synchronized overlay rendering."
category: "components"
status: "stable"
tags: ["code-editor","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/code-editor/tng-code-editor.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/code-editor/overview"
componentGroup: "form"
symbols: ["TngCodeEditorComponent"]
selectors: ["tng-code-editor"]
productId: "code-editor"
section: "overview"
officialCatalog: true
generated: true
---

# Code Editor component

Editable source code with adapter-based highlighting, native textarea semantics, and synchronized overlay rendering.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCodeEditorComponent],
  template: `<tng-code-editor />`,
})
export class CodeEditorAgentExample {}
```

## Component family

- `TngCodeEditorComponent` — selector `tng-code-editor`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/code-editor/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/code-editor/api.md)
- [Styling](https://tailng.dev/ai/components/code-editor/styling.md)
- [Examples](https://tailng.dev/ai/components/code-editor/examples.md)
