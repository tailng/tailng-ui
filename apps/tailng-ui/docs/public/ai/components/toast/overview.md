---
id: "components/toast/overview"
title: "Toast component"
description: "Stacked notification toasts with auto-dismiss timing, dismiss actions, and tone semantics."
category: "components"
status: "stable"
tags: ["toast","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/toast/tng-toast.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/toast/overview"
componentGroup: "feedback"
symbols: ["TngToastComponent"]
selectors: ["tng-toast"]
productId: "toast"
section: "overview"
officialCatalog: true
generated: true
---

# Toast component

Stacked notification toasts with auto-dismiss timing, dismiss actions, and tone semantics.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngToastComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngToastComponent],
  template: `<tng-toast />`,
})
export class ToastAgentExample {}
```

## Component family

- `TngToastComponent` — selector `tng-toast`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/toast/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/toast/api.md)
- [Styling](https://tailng.dev/ai/components/toast/styling.md)
- [Examples](https://tailng.dev/ai/components/toast/examples.md)
