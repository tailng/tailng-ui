---
id: "components/menu/styling"
title: "Menu styling"
description: "Menu styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["menu","navigation","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menu/tng-menu-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/navigation/menu/tng-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/styling/menu-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/styling/menu-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/styling/menu-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menu/styling"
componentGroup: "navigation"
symbols: ["TngMenuComponent"]
selectors: ["tng-menu"]
productId: "menu"
section: "styling"
officialCatalog: true
generated: true
---

# Menu styling

## Styling contract

Wrapper menu styling still relies on public state attributes, so you can theme `<tng-menu>` and projected items without reaching into private DOM structure. Trigger controls keep their own component or application styling.

### CSS contract table

| Selector | Applied on | Purpose |
| --- | --- | --- |
| `tng-menu[data-state='open']` | Menu panel host | Visible panel surface, border, spacing, and layout. |
| `aria-expanded='true'` | Resolved trigger control | Open state for the trigger control; style it through the trigger’s own class or component API. |
| `[tngMenuItem]` | Command item | Typography, spacing, and pointer affordance. |
| `[tngMenuItem][data-active]` | Command item | Keyboard-active state for arrow traversal. |
| `[tngMenuItem][aria-expanded='true']` | Command item | Submenu-open indicator for nested menus. |
| `[tngMenuItem][aria-disabled='true']` | Command item | Disabled visual state. |
| `[tngMenuGroupLabel]`, `[tngMenuSeparator]` | Menu sub-elements | Group labels and visual separators between command sets. |

### Example style contract

#### menu.contract.css

```css
tng-menu[data-state="open"] {
  background: var(--tng-semantic-background-canvas);
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  display: grid;
  gap: 0.25rem;
  min-width: 14rem;
  padding: 0.45rem;
}

.menu-trigger[aria-expanded="true"],
.menu-trigger [aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);
  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 74%, var(--tng-semantic-foreground-primary));
}

[tngMenuItem] {
  border-radius: 0.55rem;
  min-height: 2rem;
  padding: 0.42rem 0.65rem;
}

[tngMenuItem][data-active],
[tngMenuItem][aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);
}

[tngMenuItem][aria-disabled="true"] {
  opacity: 0.55;
}

[tngMenuGroupLabel] {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```
