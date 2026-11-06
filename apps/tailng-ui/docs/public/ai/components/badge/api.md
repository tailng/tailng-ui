---
id: "components/badge/api"
title: "Badge API"
description: "Badge API reference for Angular applications."
category: "components"
status: "stable"
tags: ["badge","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/badge/tng-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/api/badge-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/api/badge-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/api/badge-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/badge/api"
componentGroup: "utility"
symbols: ["TngBadgeComponent"]
selectors: ["[tngBadge]"]
productId: "badge"
section: "api"
officialCatalog: true
generated: true
---

# Badge API

Count, dot, and placement badges for notifications and status overlays.

## API reference

The components package re-exports `tngBadge` with the same generated badge-node behavior, so the API surface is the same directive contract available from `@tailng-ui/components`.

### Component package export

Import `TngBadge` from `@tailng-ui/components` when you want to stay on the components surface. It keeps the same `[tngBadge]` selector and does not add extra wrapper DOM around your host.

### Directive inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `tngBadge` | `number \| string \| null \| undefined` | `null` | Primary badge content value. |
| `tngBadgeDot` | `boolean` | `false` | When true, renders dot-only mode and hides text content. |
| `tngBadgeMax` | `number` | `99` | Numeric cap. Values above max render as `max+`. |
| `tngBadgeHidden` | `boolean` | `false` | Temporarily disables rendering without changing the value. |
| `tngBadgePosition` | `'top-end' \| 'top-start' \| 'bottom-end' \| 'bottom-start'` | `'top-end'` | Anchor corner used for badge placement. |
| `tngBadgeSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size data hook for badge spacing/typography contracts. |
| `tngBadgeTone` | `'danger' \| 'info' \| 'neutral' \| 'success' \| 'warning'` | `'danger'` | Semantic tone hook and default color pair. |
| `tngBadgeVariant` | `'solid' \| 'soft' \| 'outline'` | `'solid'` | Variant hook for contract-level styling. |
| `tngBadgeOffsetX` | `number \| string \| null \| undefined` | `null` | Horizontal offset, for example `4` or `'0.25rem'`. |
| `tngBadgeOffsetY` | `number \| string \| null \| undefined` | `null` | Vertical offset. |
| `tngBadgeClass` | `string \| null \| undefined` | `null` | Appends class names to generated badge node. |
| `tngBadgeStyle` | `Record<string, string \| number> \| null \| undefined` | `null` | Inline style map merged onto the badge node. |
| `tngBadgeDisabled` | `boolean` | `false` | Adds `data-disabled` hook on the badge node. |

### Primitive foundation

The components export extends the headless Badge primitive. There are no extra outputs or imperative methods, and rendering still updates reactively from the bound inputs.

Use the dedicated headless Badge page when you want the primitive-only import surface or when you are documenting lower-level host ownership patterns.

## Source-derived public Angular API

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngBadgeComponent` — `[tngBadge]`
