---
id: "components/tree/api"
title: "Tree API"
description: "Tree API reference for Angular applications."
category: "components"
status: "stable"
tags: ["tree","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tree/tng-tree.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/api/tree-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/api/tree-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tree/sections/api/tree-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tree/api"
componentGroup: "navigation"
symbols: ["TngTreeComponent"]
selectors: ["tng-tree"]
productId: "tree"
section: "api"
officialCatalog: true
generated: true
---

# Tree API

Hierarchical data navigation with keyboard support, selection, and expand/collapse.

## API reference

Tree ships as headless primitives for full ownership and a styled wrapper component for quick adoption.

### `tngTree` (directive)

Root container that orchestrates keyboard navigation, roving focus, and selection state.

#### Primitive usage

```html
<div tngTree [selectionMode]="'single'" aria-label="Files">
  <div tngTreeItem [value]="'src'" [defaultExpanded]="true">
    <span tngTreeIndicator>📂</span> src
    <div tngTreeGroup>
      <div tngTreeItem [value]="'index'">
        <span tngTreeIndicator>📄</span> index.ts
      </div>
    </div>
  </div>
</div>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'none'` | Controls item selection behavior. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Sets `aria-orientation` and key mapping direction. |
| `value` | `TngTreeValue \| TngTreeValue[] \| null` | `undefined` | Controlled selection value. |
| `defaultValue` | `TngTreeValue \| TngTreeValue[] \| null` | `undefined` | Initial uncontrolled selection. |
| `disabled` | `boolean` | `false` | Disables the entire tree. |

| Output | Type | Notes |
| --- | --- | --- |
| `valueChange` | `TngTreeValue \| TngTreeValue[] \| null` | Emits when selection changes. |

| Host attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"tree"` | Stable styling hook. |
| `role` | `"tree"` | ARIA tree role. |
| `aria-orientation` | `"vertical" \| "horizontal"` | Reflects `orientation` input. |
| `aria-multiselectable` | `"true" \| "false" \| null` | Reflects the current selection mode and is omitted when `selectionMode` is `'none'`. |

### `tngTreeItem` (directive)

Individual node inside the tree. Manages expansion state and selection.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `TngTreeValue` | — | Required. Unique identifier for this node. |
| `expanded` | `boolean \| undefined` | `undefined` | Controlled expansion state. |
| `defaultExpanded` | `boolean` | `false` | Initial uncontrolled expansion. |
| `disabled` | `boolean` | `false` | Disables this node. |

| Output | Type | Notes |
| --- | --- | --- |
| `expandedChange` | `boolean` | Emits when expanded state toggles. |

| Host attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"tree-item"` | Stable styling hook. |
| `data-expanded` | `"true" \| "false"` | Expansion state for CSS selectors. |
| `data-selected` | `"true" \| "false"` | Selection state for CSS selectors. |
| `data-disabled` | `"true" \| "false"` | Disabled state for CSS selectors. |
| `aria-expanded` | `"true" \| "false" \| null` | Set on branch nodes only. |
| `aria-selected` | `"true" \| "false" \| null` | Set when selection mode is not `'none'`. |

### `tngTreeGroup` (directive)

Wraps child items of a branch node. Registers itself as a child group on the parent `tngTreeItem`.

| Host attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"tree-group"` | Stable styling hook. |
| `role` | `"group"` | ARIA group role. |

### `tngTreeIndicator` (directive)

Disclosure indicator that toggles expand/collapse when clicked. Reflects the parent item's expansion state via `data-expanded`.

| Host attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"tree-indicator"` | Stable styling hook. |
| `data-expanded` | `"true" \| "false"` | Mirrors parent item's expansion state. |

### `tng-tree` (component)

Styled wrapper that accepts flat node data and renders a complete tree with expand/collapse toggles, keyboard navigation, selection, typeahead, and depth indentation.

#### Component usage

```html
<tng-tree
  [nodes]="treeNodes"
  [defaultExpandedIds]="['src']"
  [defaultSelectedId]="'index'"
  [ariaLabel]="'Files'"
  (selectedIdChange)="onSelect($event)"
/>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `nodes` | `TngTreeItem[]` | `[]` | Flat array of ` id, label, parentId?, description?, disabled? `. |
| `ariaLabel` | `string` | `'Tree'` | Accessible label for the tree root. |
| `defaultExpandedIds` | `string[]` | `[]` | Node IDs expanded on first render. |
| `defaultSelectedId` | `string \| null` | `null` | Node ID selected on first render. |

| Output | Type | Notes |
| --- | --- | --- |
| `selectedIdChange` | `string \| null` | Emits the selected node ID. |

## Source-derived public Angular API

### `TngTreeComponent` — `tng-tree`

- Inputs: `ariaLabel`, `defaultExpandedIds`, `defaultSelectedId`, `nodes`
- Outputs: `selectedIdChange`
