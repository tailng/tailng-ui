---
id: "components/tabs/overview"
title: "Tabs component"
description: "Sectioned navigation with tablist, triggers, panels, and controlled or uncontrolled selection."
category: "components"
status: "stable"
tags: ["tabs","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tabs/overview"
componentGroup: "navigation"
symbols: ["TngTabsComponent"]
selectors: ["tng-tabs"]
productId: "tabs"
section: "overview"
officialCatalog: true
generated: true
---

# Tabs component

Sectioned navigation with tablist, triggers, panels, and controlled or uncontrolled selection.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngTabsComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTabsComponent],
  template: `<tng-tabs />`,
})
export class TabsAgentExample {}
```

## Component family

- `TngTabsComponent` — selector `tng-tabs`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/tabs/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/tabs/api.md)
- [Styling](https://tailng.dev/ai/components/tabs/styling.md)
- [Examples](https://tailng.dev/ai/components/tabs/examples.md)
