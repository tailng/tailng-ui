---
id: "components/split/api"
title: "Split Layout API"
description: "Split Layout API reference for Angular applications."
category: "components"
status: "stable"
tags: ["split","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.engine.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.types.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/api/split-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/api/split-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/split/api"
componentGroup: "layout"
symbols: ["TngSplitGroupComponent","TngSplitHandleComponent","TngSplitPaneDirective"]
selectors: ["tng-split-group","tng-split-handle","[tngSplitPane]"]
productId: "split"
section: "api"
officialCatalog: true
generated: true
---

# Split Layout API

Resizable horizontal and vertical panes with controlled sizes, collapse states, and accessible handles.

## Split Layout API

Import all three standalone building blocks from `@tailng-ui/components`.

### `tng-split-group`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Chooses left/right or top/bottom layout. |
| `disabled` | `boolean` | `false` | Preserves sizes while disabling every handle. |
| `step` | `number` | `10` | Default arrow-key increment in pixels. |
| `largeStep` | `number` | `50` | Default Shift+Arrow increment. |

### `[tngSplitPane]`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `paneId` | `string` | generated | Stable id used by events and imperative methods. |
| `size` | `number \| null` | `null` | Controlled pixel size. |
| `defaultSize` | `number \| null` | `null` | Initial uncontrolled pixel size. |
| `minSize`, `maxSize` | `number` | `0`, unbounded | Expanded size constraints. |
| `grow` | `number` | `0` | Weight used to receive remaining container space. |
| `collapsible` | `boolean` | `false` | Allows keyboard, pointer, or API collapse. |
| `collapsed` | `boolean \| undefined` | `undefined` | Optional controlled collapse state. |
| `defaultCollapsed` | `boolean` | `false` | Initial uncontrolled collapse state. |
| `collapsedSize` | `number` | `0` | Collapsed pixels; use a nonzero value for an icon rail. |
| `disabled` | `boolean` | `false` | Prevents adjacent handles from resizing this pane. |

`sizeChange` and `collapsedChange` emit controlled-state requests.

### `tng-split-handle`

`ariaLabel` names the separator. Optional `step` and `largeStep` override the group, while `primaryPane` selects `'previous'`, `'next'`, or automatic collapse behavior.

### Events and methods

`resizeStart`, frame-coalesced `resize`, and `resizeEnd` emit `TngSplitResizeEvent` with adjacent ids, final pixel sizes, and `pointer`, `keyboard`, or `api` source.

The exported group instance provides `recalculate()`, `setPaneSize(id, pixels)`, `setPaneCollapsed(id, state)`, and `togglePane(id)`. Persistence remains application-owned.

## Source-derived public Angular API

### `TngSplitGroupComponent` — `tng-split-group`

- Inputs: `disabled`, `largeStep`, `orientation`, `step`
- Outputs: `resize`, `resizeEnd`, `resizeStart`

### `TngSplitHandleComponent` — `tng-split-handle`

- Inputs: `ariaLabel`, `disabled`, `largeStep`, `primaryPane`, `step`

### `TngSplitPaneDirective` — `[tngSplitPane]`

- Inputs: `collapsed`, `collapsedSize`, `collapsible`, `defaultCollapsed`, `defaultSize`, `disabled`, `grow`, `maxSize`, `minSize`, `paneId`, `size`
- Outputs: `collapsedChange`, `sizeChange`
