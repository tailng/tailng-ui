---
id: "components/tree-table/api"
title: "Tree Table API"
description: "Tree Table API reference for Angular applications."
category: "components"
status: "stable"
tags: ["tree-table","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/tree-table/index.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table-column.type.ts","libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/tree-table/sections/api/tree-table-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/tree-table/api"
componentGroup: "layout"
symbols: ["TngTreeTableComponent"]
selectors: ["tng-tree-table"]
productId: "tree-table"
section: "api"
officialCatalog: true
generated: true
---

# Tree Table API

Hierarchical treegrid table with expand/collapse rows, selection, keyboard navigation, and accessible aria attributes.

## Source-derived public Angular API

### `TngTreeTableComponent` — `tng-tree-table`

- Inputs: `ariaLabel`, `columns`, `data`, `density`, `dir`, `disabled`, `emptyText`, `expandedKeys`, `expandOnRowClick`, `getChildren`, `getKey`, `indentSize`, `loading`, `loadingText`, `rowClass`, `rowStyle`, `selectable`, `selectedKeys`, `treeColumnKey`
- Required inputs: `columns`
- Outputs: `expandedKeysChange`, `rowClick`, `rowCollapse`, `rowExpand`, `selectedKeysChange`
