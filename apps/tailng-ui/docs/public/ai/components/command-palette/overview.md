---
id: "components/command-palette/overview"
title: "Command Palette component"
description: "Modal search palette with query output, templated results, keyboard selection, and empty/loading states."
category: "components"
status: "stable"
tags: ["command-palette","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/command-palette/tng-command-palette.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/command-palette/overview"
componentGroup: "utility"
symbols: ["TngCommandPaletteComponent"]
selectors: ["tng-command-palette"]
productId: "command-palette"
section: "overview"
officialCatalog: true
generated: true
---

# Command Palette component

Modal search palette with query output, templated results, keyboard selection, and empty/loading states.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCommandPaletteComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCommandPaletteComponent],
  template: `<tng-command-palette />`,
})
export class CommandPaletteAgentExample {}
```

## Component family

- `TngCommandPaletteComponent` — selector `tng-command-palette`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/command-palette/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/command-palette/api.md)
- [Styling](https://tailng.dev/ai/components/command-palette/styling.md)
- [Examples](https://tailng.dev/ai/components/command-palette/examples.md)
