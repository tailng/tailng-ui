---
id: "components/toggle/overview"
title: "Toggle component"
description: "Pressed button semantics for compact on/off actions and toolbar commands."
category: "components"
status: "stable"
tags: ["toggle","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/toggle/tng-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/toggle/overview"
componentGroup: "form"
symbols: ["TngToggleComponent"]
selectors: ["tng-toggle"]
productId: "toggle"
section: "overview"
officialCatalog: true
generated: true
---

# Toggle component

Pressed button semantics for compact on/off actions and toolbar commands.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngToggleComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngToggleComponent],
  template: `<tng-toggle />`,
})
export class ToggleAgentExample {}
```

## Component family

- `TngToggleComponent` — selector `tng-toggle`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/toggle/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/toggle/api.md)
- [Styling](https://tailng.dev/ai/components/toggle/styling.md)
- [Examples](https://tailng.dev/ai/components/toggle/examples.md)
