---
id: "components/menubar/styling"
title: "Menubar styling"
description: "Menubar styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["menubar","navigation","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menubar/tng-menubar.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/styling/menubar-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/styling/menubar-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/styling/menubar-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menubar/styling"
componentGroup: "navigation"
symbols: ["TngMenubarComponent"]
selectors: ["tng-menubar"]
productId: "menubar"
section: "styling"
officialCatalog: true
generated: true
---

# Menubar styling

## Styling contract

Menubar and menu are fully styleable through public directives and state attributes; no internal wrapper selectors are required.

### CSS contract table

| Selector | Applied on | Purpose |
| --- | --- | --- |
| `[tngMenubar]` | Menubar host | Top-level command strip layout and focus grouping. |
| `[tngMenubarItem]` | Top-level trigger | Trigger spacing, typography, hover/focus states. |
| `[tngMenubarItem][aria-expanded='true']` | Top-level trigger | Current open menu trigger state. |
| `[tngMenu][data-state='open']` | Menu panel host | Open panel surface, positioning, and elevation. |
| `[tngMenuItem][data-active]` | Menu option | Keyboard-active option styling. |
| `[tngMenuItem][aria-disabled='true']` | Menu option | Disabled affordance and interaction cue. |
| `[tngMenuGroupLabel]`, `[tngMenuSeparator]` | Menu sub-elements | Section labels and dividers inside long command menus. |

### Example style contract

#### menubar.contract.css

```css
[tngMenubar] {
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.35rem;
}

[tngMenubarItem] {
  border-radius: 0.7rem;
  padding: 0.5rem 0.9rem;
}

[tngMenubarItem][aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, transparent);
}

[tngMenu][data-state="open"] {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  min-width: 14rem;
  padding: 0.4rem;
  position: absolute;
}

[tngMenuItem] {
  border-radius: 0.55rem;
  min-height: 2.1rem;
  padding: 0.4rem 0.65rem;
}

[tngMenuItem][data-active],
[tngMenuItem][aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);
}

[tngMenuItem][aria-disabled="true"] {
  opacity: 0.55;
}
```
