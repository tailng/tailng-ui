---
id: "components/separator/styling"
title: "Separator styling"
description: "Separator styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["separator","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/separator/tng-separator.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/styling/separator-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/styling/separator-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/styling/separator-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/separator/styling"
componentGroup: "layout"
symbols: ["TngSeparatorComponent"]
selectors: ["tng-separator"]
productId: "separator"
section: "styling"
officialCatalog: true
generated: true
---

# Separator styling

## Styling contract

Separator exposes a compact styling contract built around slot and orientation data attributes. Theme at the token level and keep context-specific spacing in container styles.

### State hooks

| Hook | Where | Use |
| --- | --- | --- |
| `data-slot="separator"` | Primitive + wrapper root | Base color, thickness, and shared motion tokens. |
| `data-orientation="horizontal"` | Root | Horizontal width/height rules. |
| `data-orientation="vertical"` | Root | Vertical width/min-height rules. |
| `aria-hidden="true"` | Decorative mode | Confirms divider is presentational only. |
| `role="separator"` | Semantic mode | Announces meaningful separation to assistive tech. |

### CSS starter

#### Separator CSS contract

```css
[data-slot="separator"] {
  background: var(--tng-semantic-border-strong);
}

[data-slot="separator"][data-orientation="horizontal"] {
  block-size: 1px;
  inline-size: 100%;
}

[data-slot="separator"][data-orientation="vertical"] {
  inline-size: 1px;
  min-block-size: 1rem;
}

.toolbar [data-slot="separator"] {
  margin-inline: 0.5rem;
}
```
