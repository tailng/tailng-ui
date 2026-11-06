---
id: "components/listbox/overview"
title: "ListBox component"
description: "Listbox interaction patterns and keyboard behavior reference."
category: "components"
status: "stable"
tags: ["listbox","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/listbox/tng-listbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/listbox/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/listbox/overview"
componentGroup: "form"
symbols: ["TngListboxComponent"]
selectors: ["tng-listbox"]
productId: "listbox"
section: "overview"
officialCatalog: true
generated: true
---

# ListBox component

Listbox interaction patterns and keyboard behavior reference.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngListboxComponent],
  template: `<tng-listbox />`,
})
export class ListboxAgentExample {}
```

## Component family

- `TngListboxComponent` — selector `tng-listbox`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/listbox/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/listbox/api.md)
- [Styling](https://tailng.dev/ai/components/listbox/styling.md)
- [Examples](https://tailng.dev/ai/components/listbox/examples.md)
