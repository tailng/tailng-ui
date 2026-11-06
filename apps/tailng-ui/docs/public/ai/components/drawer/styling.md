---
id: "components/drawer/styling"
title: "Drawer styling"
description: "Drawer styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["drawer","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/drawer/tng-drawer.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/styling/drawer-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/styling/drawer-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/styling/drawer-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/drawer/styling"
componentGroup: "layout"
symbols: ["TngDrawerComponent"]
selectors: ["tng-drawer"]
productId: "drawer"
section: "styling"
officialCatalog: true
generated: true
---

# Drawer styling

## Drawer styling

Drawer exposes data attributes on each primitive for targeted styling. The styled `<tng-drawer>` component applies sensible defaults.

### Primitive data hooks

| Selector | Attribute | Values |
| --- | --- | --- |
| `[tngDrawerContainer]` | `data-slot` | `"drawer-container"` |
| `[tngDrawerContainer]` | `data-direction` | `"ltr"` \| `"rtl"` |
| `[tngDrawer]` | `data-slot` | `"drawer"` |
| `[tngDrawer]` | `data-state` | `"open"` \| `"closed"` |
| `[tngDrawer]` | `data-position` | `"start"` \| `"end"` |
| `[tngDrawer]` | `data-mode` | `"overlay"` \| `"push"` \| `"side"` |
| `[tngDrawer]` | `data-side` | `"left"` \| `"right"` |
| `[tngDrawer]` | `data-disabled` | Present when disabled |
| `[tngDrawerContent]` | `data-slot` | `"drawer-content"` |

### Component CSS classes

The `<tng-drawer>` component renders on the `:host` element with semantic token defaults for background, border, and padding. Override styles via `::ng-deep` or custom CSS targeting `data-slot` / `data-state` attributes.

### Starter CSS

Baseline styles for building a drawer layout from the headless primitives.

#### drawer.css

```css
/* Drawer container layout */
[data-slot="drawer-container"] {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Drawer panel */
[data-slot="drawer"] {
  background: var(--tng-semantic-background-surface);
  border-right: 1px solid var(--tng-semantic-border-subtle);
  min-width: 16rem;
  padding: 1rem;
  transition: transform 0.3s ease;
}

[data-slot="drawer"][data-state="closed"] {
  display: none;
}

[data-slot="drawer"][data-position="end"] {
  border-left: 1px solid var(--tng-semantic-border-subtle);
  border-right: none;
}

/* Drawer content */
[data-slot="drawer-content"] {
  flex: 1;
  padding: 1rem;
  transition: margin 0.3s ease;
}
```
