---
id: "components/button-toggle/overview"
title: "Button Toggle component"
description: "Single and multiple pressed-button groups for toolbars and view switches."
category: "components"
status: "stable"
tags: ["button-toggle","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle-group.component.ts","libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/button-toggle/overview"
componentGroup: "form"
symbols: ["TngButtonToggleComponent","TngButtonToggleGroupComponent"]
selectors: ["tng-button-toggle","tng-button-toggle-group"]
productId: "button-toggle"
section: "overview"
officialCatalog: true
generated: true
---

# Button Toggle component

Single and multiple pressed-button groups for toolbars and view switches.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngButtonToggleComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngButtonToggleComponent],
  template: `<tng-button-toggle />`,
})
export class ButtonToggleAgentExample {}
```

## Component family

- `TngButtonToggleComponent` — selector `tng-button-toggle`
- `TngButtonToggleGroupComponent` — selector `tng-button-toggle-group`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/button-toggle/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/button-toggle/api.md)
- [Styling](https://tailng.dev/ai/components/button-toggle/styling.md)
- [Examples](https://tailng.dev/ai/components/button-toggle/examples.md)
