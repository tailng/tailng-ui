---
id: "components/breadcrumb/overview"
title: "Breadcrumb component"
description: "Hierarchical path navigation with optional collapse and current-page semantics."
category: "components"
status: "stable"
tags: ["breadcrumb","navigation","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-item.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-link.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-list.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator-template.directive.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/breadcrumb/overview"
componentGroup: "navigation"
symbols: ["TngBreadcrumbComponent","TngBreadcrumbItemComponent","TngBreadcrumbLinkComponent","TngBreadcrumbListComponent","TngBreadcrumbSeparatorComponent","TngBreadcrumbSeparatorTemplateDirective"]
selectors: ["tng-breadcrumb","tng-breadcrumb-item","tng-breadcrumb-link","tng-breadcrumb-list","tng-breadcrumb-separator","ng-template[tngBreadcrumbSeparatorTemplate]"]
productId: "breadcrumb"
section: "overview"
officialCatalog: true
generated: true
---

# Breadcrumb component

Hierarchical path navigation with optional collapse and current-page semantics.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngBreadcrumbComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngBreadcrumbComponent],
  template: `<tng-breadcrumb />`,
})
export class BreadcrumbAgentExample {}
```

## Component family

- `TngBreadcrumbComponent` — selector `tng-breadcrumb`
- `TngBreadcrumbItemComponent` — selector `tng-breadcrumb-item`
- `TngBreadcrumbLinkComponent` — selector `tng-breadcrumb-link`
- `TngBreadcrumbListComponent` — selector `tng-breadcrumb-list`
- `TngBreadcrumbSeparatorComponent` — selector `tng-breadcrumb-separator`
- `TngBreadcrumbSeparatorTemplateDirective` — selector `ng-template[tngBreadcrumbSeparatorTemplate]`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/navigation/breadcrumb/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/breadcrumb/api.md)
- [Styling](https://tailng.dev/ai/components/breadcrumb/styling.md)
- [Examples](https://tailng.dev/ai/components/breadcrumb/examples.md)
