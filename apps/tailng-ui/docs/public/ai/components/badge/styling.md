---
id: "components/badge/styling"
title: "Badge styling"
description: "Badge styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["badge","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/badge/tng-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/styling/badge-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/styling/badge-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/styling/badge-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/badge/styling"
componentGroup: "utility"
symbols: ["TngBadgeComponent"]
selectors: ["[tngBadge]"]
productId: "badge"
section: "styling"
officialCatalog: true
generated: true
---

# Badge styling

## Styling contract

The components package keeps the same stable badge hooks as the primitive, so you style the host and generated bubble without depending on any extra wrapper markup.

### Stable hooks

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-slot` | `badge` | Stable selector for the generated badge bubble element. |
| `data-position` | `top-end \| top-start \| bottom-end \| bottom-start` | Placement hook for custom transforms and alignment tweaks. |
| `data-size` | `sm \| md \| lg` | Size scale hook. |
| `data-tone` | `danger \| info \| neutral \| success \| warning` | Semantic tone hook. |
| `data-variant` | `solid \| soft \| outline` | Variant hook for filled, soft, and outlined treatments. |
| `data-dot` | `present / absent` | Applied when dot mode is active. |
| `data-disabled` | `present / absent` | Applied when `tngBadgeDisabled` is true. |

### Generated node

### Owner guidance

Target the generated bubble under your host and keep host layout decisions on your own host class. The components export does not add a visual wrapper of its own.

#### badge.contract.css

```css
.tng-badge-host {
  position: relative;
}

.tng-badge[data-tone="success"][data-variant="soft"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);
  color: var(--tng-semantic-accent-success);
}

.tng-badge[data-variant="outline"] {
  background: var(--tng-semantic-background-base);
  border: 1px solid var(--tng-semantic-border-strong);
}

.tng-badge[data-dot] {
  min-height: 0.56rem;
  min-width: 0.56rem;
  padding: 0;
}

.tng-badge[data-position="bottom-start"] {
  transform: translate(-50%, 50%);
}
```
