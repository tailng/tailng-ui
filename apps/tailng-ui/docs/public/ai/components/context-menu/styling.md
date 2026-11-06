---
id: "components/context-menu/styling"
title: "Context Menu styling"
description: "Context Menu styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["context-menu","navigation","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/context-menu/tng-context-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/styling/context-menu-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/styling/context-menu-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/styling/context-menu-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/context-menu/styling"
componentGroup: "navigation"
symbols: ["TngContextMenuComponent"]
selectors: ["tng-context-menu"]
productId: "context-menu"
section: "styling"
officialCatalog: true
generated: true
---

# Context Menu styling

## Styling contract

Context Menu styling relies on public slot and state attributes so custom themes can style target affordances and menu surfaces without private DOM coupling. The wrapper adds a minimum panel skin, but placement and item treatments still live on those public hooks.

### CSS contract table

| Selector | Applied on | Purpose |
| --- | --- | --- |
| `[data-slot='context-menu-trigger']` | Context target surface | Right-click affordance and focus ring styling. |
| `[data-slot='menu'][data-state='open']` | Context menu panel | Panel visibility, border, spacing, and background surface. |
| `[data-slot='menu-item']` | Action item | Typography, spacing, and pointer affordance for actions. |
| `[data-slot='menu-item'][data-active]` | Action item | Keyboard-active state from arrow traversal. |
| `[data-slot='menu-item'][aria-expanded='true']` | Submenu trigger item | Expanded state for nested context menus. |
| `[data-slot='menu-item'][aria-disabled='true']` | Disabled action item | Dimmed visual affordance for non-interactive actions. |
| `[data-slot='menu-group-label']`, `[data-slot='menu-separator']` | Menu sub-elements | Section labeling and separation inside larger action groups. |

### Example style contract

#### context-menu.contract.css

```css
.context-shell {
  position: relative;
}

[data-slot="context-menu-trigger"] {
  cursor: context-menu;
}

.context-shell [data-slot="menu"] {
  left: 0;
  position: absolute;
  top: calc(100% + 0.42rem);
}

.context-shell [data-slot="menu"][data-state="open"] {
  box-shadow: 0 14px 34px -22px color-mix(in srgb, var(--tng-semantic-foreground-primary) 38%, transparent);
}

.context-shell [data-slot="menu-item"] {
  border-radius: 0.55rem;
  min-height: 2rem;
  padding: 0.42rem 0.65rem;
}

.context-shell [data-slot="menu-item"][data-active],
.context-shell [data-slot="menu-item"][aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);
}

.context-shell [data-slot="menu-item"][aria-disabled="true"] {
  opacity: 0.55;
}
```
