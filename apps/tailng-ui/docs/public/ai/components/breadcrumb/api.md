---
id: "components/breadcrumb/api"
title: "Breadcrumb API"
description: "Breadcrumb API reference for Angular applications."
category: "components"
status: "stable"
tags: ["breadcrumb","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-item.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-link.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-list.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator-template.directive.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/api/breadcrumb-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/api/breadcrumb-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/api/breadcrumb-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/breadcrumb/api"
componentGroup: "navigation"
symbols: ["TngBreadcrumbComponent","TngBreadcrumbItemComponent","TngBreadcrumbLinkComponent","TngBreadcrumbListComponent","TngBreadcrumbSeparatorComponent","TngBreadcrumbSeparatorTemplateDirective"]
selectors: ["tng-breadcrumb","tng-breadcrumb-item","tng-breadcrumb-link","tng-breadcrumb-list","tng-breadcrumb-separator","ng-template[tngBreadcrumbSeparatorTemplate]"]
productId: "breadcrumb"
section: "api"
officialCatalog: true
generated: true
---

# Breadcrumb API

Hierarchical path navigation with optional collapse and current-page semantics.

## API reference

Breadcrumb combines minimal headless directives and a wrapper component that adds collapse, separator, and current-item resolution.

### Wrapper APIs

| Element | Input | Type | Description |
| --- | --- | --- | --- |
| `<tng-breadcrumb>` | `ariaLabel` | `string \| null` | Accessible label for the breadcrumb navigation landmark. |
| `<tng-breadcrumb>` | `separator` | `string` | Separator symbol rendered between visible breadcrumb items. |
| `<tng-breadcrumb>` | `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse` | `number \| null` | Collapse controls for long breadcrumb paths. |
| `<tng-breadcrumb-item>` | `href`, `routerLink` | `string \| string[] \| null` | Link target; item becomes text-only when both are absent. |
| `<tng-breadcrumb-item>` | `current`, `currentAsLink`, `disabled` | `boolean` | Current-page semantics, optional current-link, and disabled behavior. |

### Primitive directives

| Directive | Purpose | State hooks |
| --- | --- | --- |
| `tngBreadcrumb` | Root navigation landmark slot. | `data-slot="breadcrumb"` |
| `tngBreadcrumbList` | Ordered list slot for breadcrumb items. | `data-slot="breadcrumb-list"` |
| `tngBreadcrumbItem`, `tngBreadcrumbLink` | Item and link slots for owner-controlled rendering. | `data-slot="breadcrumb-item\|breadcrumb-link"` |
| `tngBreadcrumbSeparator` | Decorative separator slot rendered with `aria-hidden`. | `data-slot="breadcrumb-separator"` |

### Data attributes from wrapper items

## Source-derived public Angular API

### `TngBreadcrumbComponent` — `tng-breadcrumb`

- Inputs: `ariaLabel`, `collapseLabel`, `itemsAfterCollapse`, `itemsBeforeCollapse`, `maxItems`, `separator`

### `TngBreadcrumbItemComponent` — `tng-breadcrumb-item`

- Inputs: `current`, `currentAsLink`, `disabled`, `href`, `routerLink`

### `TngBreadcrumbLinkComponent` — `tng-breadcrumb-link`

- Inputs: `current`, `disabled`, `href`, `rel`, `routerLink`, `target`

### `TngBreadcrumbSeparatorComponent` — `tng-breadcrumb-separator`

- Inputs: `symbol`, `template`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngBreadcrumbListComponent` — `tng-breadcrumb-list`
- `TngBreadcrumbSeparatorTemplateDirective` — `ng-template[tngBreadcrumbSeparatorTemplate]`
