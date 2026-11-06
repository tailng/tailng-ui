---
id: "components/tooltip/api"
title: "Tooltip API"
description: "Tooltip API reference for Angular applications."
category: "components"
status: "stable"
tags: ["tooltip","overlay","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/api/tooltip-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/api/tooltip-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/api/tooltip-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/tooltip/api"
componentGroup: "overlay"
symbols: ["TngTooltipComponent"]
selectors: ["tng-tooltip"]
productId: "tooltip"
section: "api"
officialCatalog: true
generated: true
---

# Tooltip API

Hover/focus helper text with trigger/content association and side placement hooks.

## API reference

The wrapper surface centers on `<tng-tooltip>`. For primitive directives and root-owned positioning details, use the headless tooltip docs.

### Wrapper component: <tng-tooltip>

| Input / Output | Type | Description |
| --- | --- | --- |
| `triggerLabel` | `string` | Fallback trigger text rendered by the built-in button. |
| `text` | `string` | Fallback tooltip message when no projected content is provided. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | Placement hint exposed through `data-side` on tooltip content and flipped when needed. |
| `openDelay`, `closeDelay` | `number` | Delay in milliseconds before open/close transitions are applied. |
| `disabled` | `boolean` | Disables hover/focus interactions and keeps tooltip closed. |
| `ariaLabel` | `string \| null` | Accessible label for the built-in trigger button. |
| `openChange` | `boolean` | Emits each time wrapper state changes from open to closed (and vice versa). |

### Projected content

| Surface | Purpose | Notes |
| --- | --- | --- |
| `[trigger]` slot | Projects custom trigger content into the built-in wrapper button. | Use this for icons or branded trigger labels without replacing the wrapper behavior. |
| Default content slot | Projects tooltip body content into the floating shell. | Fallbacks to `text` when nothing is projected. Keep the content short and non-interactive. |

### Behavior baseline

## Source-derived public Angular API

### `TngTooltipComponent` — `tng-tooltip`

- Inputs: `ariaLabel`, `closeDelay`, `disabled`, `openDelay`, `side`, `text`, `triggerLabel`
- Outputs: `openChange`
