---
id: "components/card/styling"
title: "Card styling"
description: "Card styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["card","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/card/tng-card.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/styling/card-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/styling/card-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/styling/card-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/card/styling"
componentGroup: "layout"
symbols: ["TngCardActionsComponent","TngCardComponent","TngCardContentComponent","TngCardDescriptionComponent","TngCardDividerComponent","TngCardFooterComponent","TngCardHeaderComponent","TngCardLinkComponent","TngCardMediaComponent","TngCardTitleComponent"]
selectors: ["tng-card-actions","tng-card","tng-card-content","tng-card-description","tng-card-divider","tng-card-footer","tng-card-header","tng-card-link","tng-card-media","tng-card-title"]
productId: "card"
section: "styling"
officialCatalog: true
generated: true
---

# Card styling

## Styling contract

Card styling is slot-driven. Target slot hooks and wrapper data attributes so headless and wrapper implementations stay visually aligned.

### State and slot hooks

| Hook | Where | Use |
| --- | --- | --- |
| `data-slot="card"` | Root | Container layout, border, surface tone, and spacing. |
| `data-slot="card-header"` | Header | Title/description spacing rules. |
| `data-slot="card-content"` | Content | Body rhythm and typography normalization. |
| `data-slot="card-footer"` | Footer | Footer alignment and action spacing. |
| `data-slot="card-media"` | Media | Media aspect ratio and clipping. |
| `data-slot="card-actions"` | Actions | Action row layout and optional start/end alignment. |
| `data-slot="card-link"` | Link | Link styling and disabled semantics. |
| `data-variant`, `data-tone`, `data-padding` | `tng-card` root | Variant, tone, and spacing theming controls. |
| `data-interactive`, `data-elevated` | `tng-card` root | Hover/focus states and elevation treatment. |

### CSS starter

#### Card styling contract

```css
[data-slot="card"] {
  display: grid;
  gap: 0.85rem;
  border: 1px solid var(--tng-semantic-border-strong);
  border-radius: 1rem;
}

[data-slot="card"][data-variant="outline"] {
  background: var(--tng-semantic-background-canvas);
}

[data-slot="card"][data-tone="primary"] {
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 40%, var(--tng-semantic-border-strong));
}

[data-slot="card"][data-interactive]:hover {
  border-color: var(--tng-semantic-accent-brand);
}

[data-slot="card-actions"][data-align="start"] {
  justify-content: flex-start;
}

[data-slot="card-link"][aria-disabled="true"] {
  opacity: 0.65;
  pointer-events: none;
}
```
