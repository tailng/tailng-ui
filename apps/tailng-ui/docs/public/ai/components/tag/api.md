---
id: "components/tag/api"
title: "Tag API"
description: "Tag API reference for Angular applications."
category: "components"
status: "stable"
tags: ["tag","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tag/tng-tag.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/api/tag-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/api/tag-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/api/tag-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/tag/api"
componentGroup: "utility"
symbols: ["TngTagComponent"]
selectors: ["tng-tag"]
productId: "tag"
section: "api"
officialCatalog: true
generated: true
---

# Tag API

Compact label chips with optional icon and removable close action.

## API reference

The wrapper component builds on the headless tag primitives. You style and author projected content through `<tng-tag>`, while remove behavior still comes from the primitive foundation under the hood.

### Component wrapper

| Input / Output | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic tone styling. |
| `appearance` | `'soft' \| 'solid' \| 'outline'` | `'soft'` | Visual treatment. |
| `shape` | `'pill' \| 'rounded'` | `'pill'` | Corner radius mode. |
| `size` | `'sm' \| 'md'` | `'md'` | Size preset hook. |
| `disabled` | `boolean` | `false` | Disables remove action and reflects disabled state on the inner primitive. |
| `removable` | `boolean` | `false` | Renders the built-in close button. |
| `label` | `string \| null` | `null` | Forwarded to the primitive label context. |
| `closeAriaLabel` | `string \| null` | `null` | Accessible label override for the built-in close button. |
| `(removed)` | `void` | — | Emitted when the built-in close button removes the tag. |

### Projected primitives

Use `tngTagIcon` when you want the wrapper to apply the stable icon slot hook to projected leading content.

### Primitive foundation

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `tngTagDisabled` | `boolean` | `false` | Marks the tag disabled and prevents close removal. |
| `tngTagRemovable` | `boolean` | `false` | Enables removable behavior for `tngTagClose`. |
| `tngTagLabel` | `string \| null` | `null` | Label source used for the default close `aria-label`. |
| `(tngTagRemoved)` | `void` | — | Emitted when the close action is accepted. |
| `tngTagCloseAriaLabel` | `string \| null` | `null` | Explicit accessible name for the close action. |
| `Keyboard` | `Enter / Space` | Enabled | Triggers remove request when the parent tag is removable. |

The wrapper does not replace the primitive slots. It layers style defaults and a close button on top of the same headless remove contract.

## Source-derived public Angular API

### `TngTagComponent` — `tng-tag`

- Inputs: `appearance`, `closeAriaLabel`, `disabled`, `label`, `removable`, `shape`, `size`, `tone`
- Outputs: `removed`
