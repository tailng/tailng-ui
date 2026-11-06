---
id: "components/context-menu/api"
title: "Context Menu API"
description: "Context Menu API reference for Angular applications."
category: "components"
status: "stable"
tags: ["context-menu","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/context-menu/tng-context-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/api/context-menu-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/api/context-menu-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/api/context-menu-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/context-menu/api"
componentGroup: "navigation"
symbols: ["TngContextMenuComponent"]
selectors: ["tng-context-menu"]
productId: "context-menu"
section: "api"
officialCatalog: true
generated: true
---

# Context Menu API

Right-click and keyboard context actions anchored to element surfaces.

## API reference

Context Menu composes menu primitives with a dedicated trigger directive for right-click and keyboard context invocation. The exported `tngContextMenu` instance also exposes anchor state so owners can choose their own placement strategy.

### Wrapper APIs

| Element / Directive | Input / Output | Type | Description |
| --- | --- | --- | --- |
| `<tng-context-menu>` | `ariaLabel` | `string` | Accessible label for the context panel. |
| `<tng-context-menu>` | `loop`, `disabled`, `closeOnSelect` | `boolean` | Forwards core menu traversal, disable state, and select-close behavior. |
| `<tng-context-menu>` | `dismissOnOutsideClick`, `dismissOnFocusout` | `boolean` | Dismiss policy applied to the hosted menu panel. |
| `<tng-context-menu>` | `tngMenuOpened`, `tngMenuClosed`, `tngMenuSelect` | `EventEmitter` | Lifecycle and selection outputs from the underlying menu primitive. |
| `[tngContextMenuTrigger]` | `tngContextMenuTrigger` | `TngContextMenu` | Binds a target element to a context-menu instance. |

### Primitive directives

| Directive | Purpose | Notes |
| --- | --- | --- |
| `tngContextMenu` | Connects context trigger semantics to a menu panel host. | Applied together with `tngMenu` on the menu surface. |
| `tngContextMenuTrigger` | Listens for `contextmenu`, `Shift + F10`, and `ContextMenu`. | Sets `data-slot="context-menu-trigger"`, `aria-haspopup`, `aria-controls`, and `aria-expanded`. |
| `tngMenu`, `tngMenuItem` | Menu state, keyboard traversal, selection, submenu composition. | Shared primitive contract with menu and menubar docs. |

### Exported Instance

| Method | Type | Description |
| --- | --- | --- |
| `isOpen()` | `boolean` | Current open state for the linked context menu. |
| `close(restoreFocus)` | `(restoreFocus: boolean) => void` | Closes the panel and optionally restores focus to the trigger target. |
| `getAnchorType()` | `'pointer' \| 'element' \| null` | Tells whether the current open came from right-click coordinates or keyboard context invocation. |
| `getPointerAnchor()` | `TngContextMenuPointerAnchor \| null` | Viewport client coordinates captured during right-click open. Returns `null` for keyboard opens. |

### Keyboard contract (high level)

## Source-derived public Angular API

### `TngContextMenuComponent` — `tng-context-menu`

- Inputs: `ariaLabel`
- Forwarded inputs: `closeOnSelect`, `disabled`, `dismissOnFocusout`, `dismissOnOutsideClick`, `loop`
- Forwarded outputs: `tngMenuClosed`, `tngMenuOpened`, `tngMenuSelect`
