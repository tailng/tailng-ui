---
id: "components/pagination/overview"
title: "Pagination component"
description: "Styled paginator controls for page movement, ranges, page size, and server mode."
category: "components"
status: "stable"
tags: ["pagination","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/paginator/tng-paginator.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/pagination/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/pagination/overview"
componentGroup: "navigation"
symbols: ["TngPaginatorComponent"]
selectors: ["tng-paginator"]
productId: "pagination"
section: "overview"
officialCatalog: true
generated: true
---

# Pagination component

Styled paginator controls for page movement, ranges, page size, and server mode.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngPaginatorComponent],
  template: `<tng-paginator />`,
})
export class PaginationAgentExample {}
```

## Component family

- `TngPaginatorComponent` — selector `tng-paginator`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/pagination/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/pagination/api.md)
- [Styling](https://tailng.dev/ai/components/pagination/styling.md)
- [Examples](https://tailng.dev/ai/components/pagination/examples.md)
