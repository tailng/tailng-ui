---
id: "components/switch/overview"
title: "Switch component"
description: "Two-state on/off toggle with track/thumb rendering and arrow-key support."
category: "components"
status: "stable"
tags: ["switch","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/switch/overview"
componentGroup: "form"
symbols: ["TngSwitchComponent"]
selectors: ["tng-switch"]
productId: "switch"
section: "overview"
officialCatalog: true
generated: true
---

# Switch component

Two-state on/off toggle with track/thumb rendering and arrow-key support.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `<tng-switch />`,
})
export class SwitchAgentExample {}
```

## Component family

- `TngSwitchComponent` — selector `tng-switch`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/switch/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/switch/api.md)
- [Styling](https://tailng.dev/ai/components/switch/styling.md)
- [Examples](https://tailng.dev/ai/components/switch/examples.md)
