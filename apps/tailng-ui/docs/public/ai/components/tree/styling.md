---
id: "components/tree/styling"
title: "Tree styling"
description: "Tree styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["tree","navigation","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tree/tng-tree.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/styling/tree-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/styling/tree-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/styling/tree-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tree/styling"
componentGroup: "navigation"
symbols: ["TngTreeComponent"]
selectors: ["tng-tree"]
productId: "tree"
section: "styling"
officialCatalog: true
generated: true
---

# Tree styling

## Styling contract

Style against explicit data hooks from tree primitives and the component's CSS classes. Use `data-slot` and `data-*` attributes for state-driven styling.

### Primitive data hooks

| Hook | Element | Use |
| --- | --- | --- |
| `data-slot="tree"` | Root | Container styling, orientation layout. |
| `data-slot="tree-item"` | Node | Row layout, padding, cursor. |
| `data-slot="tree-group"` | Children container | Indentation, border-left connector. |
| `data-slot="tree-indicator"` | Disclosure icon | Expand/collapse icon rotation or swap. |
| `data-expanded="true\|false"` | Item, Indicator | Toggle child visibility and icon state. |
| `data-selected="true\|false"` | Item | Selection highlight. |
| `data-disabled="true\|false"` | Item | Muted/disabled presentation. |

### Primitive CSS starter

#### Headless tree CSS contract

```css
/* Collapse children when parent is not expanded */
[data-slot='tree-item'][data-expanded='false'] > [data-slot='tree-group'] {
  display: none;
}

/* Selection highlight */
[data-slot='tree-item'][data-selected='true'] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);
  color: var(--tng-semantic-accent-brand);
}

/* Focus ring */
[data-slot='tree-item']:focus-visible {
  box-shadow: 0 0 0 2px var(--tng-semantic-focus-ring);
}

/* Group indentation */
[data-slot='tree-group'] {
  margin-left: 1.25rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--tng-semantic-border-subtle);
}
```

### Component CSS classes

| Class | Element | Purpose |
| --- | --- | --- |
| `.tng-tree-shell` | Root wrapper | Background, border, border-radius, padding. |
| `.tng-tree-root` | Focusable container | Grid layout, outline, focus ring. |
| `.tng-tree-item` | Row | Grid layout with `--tng-tree-level` indentation. |
| `.tng-tree-item-active` | Active row | Keyboard-focused highlight. |
| `.tng-tree-item-selected` | Selected row | Selection background. |
| `.tng-tree-item-disabled` | Disabled row | Reduced opacity, `not-allowed` cursor. |
| `.tng-tree-toggle` | Expand/collapse button | Disclosure toggle styling. |
| `.tng-tree-node` | Label button | Clickable label area for selection. |
| `.tng-tree-label` | Label text | Primary node text. |
| `.tng-tree-description` | Description text | Secondary muted description. |

### Component CSS starter

#### Component tree CSS contract

```css
.tng-tree-shell {
  background: var(--tng-semantic-background-base);
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.tng-tree-item {
  padding-inline-start: calc(0.5rem + (var(--tng-tree-level) * 1rem));
}

.tng-tree-item-active {
  background: color-mix(in srgb, var(--tng-semantic-focus-ring) 15%, transparent);
}

.tng-tree-item-selected {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);
}

.tng-tree-item-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
```
