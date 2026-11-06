---
id: "components/copybutton/overview"
title: "CopyButton component"
description: "Clipboard actions, success/error states, and feedback hooks."
category: "components"
status: "stable"
tags: ["copybutton","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/copy-button/tng-copy-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/copybutton/overview"
componentGroup: "utility"
symbols: ["TngCopyButtonComponent"]
selectors: ["tng-copy-button"]
productId: "copybutton"
section: "overview"
officialCatalog: true
generated: true
---

# CopyButton component

Clipboard actions, success/error states, and feedback hooks.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCopyButtonComponent],
  template: `<tng-copy-button />`,
})
export class CopybuttonAgentExample {}
```

## Component family

- `TngCopyButtonComponent` — selector `tng-copy-button`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/copybutton/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/copybutton/api.md)
- [Styling](https://tailng.dev/ai/components/copybutton/styling.md)
- [Examples](https://tailng.dev/ai/components/copybutton/examples.md)
