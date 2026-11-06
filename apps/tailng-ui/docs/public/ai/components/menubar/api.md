---
id: "components/menubar/api"
title: "Menubar API"
description: "Menubar API reference for Angular applications."
category: "components"
status: "stable"
tags: ["menubar","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menubar/tng-menubar.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/api/menubar-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menubar/sections/api/menubar-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menubar/api"
componentGroup: "navigation"
symbols: ["TngMenubarComponent"]
selectors: ["tng-menubar"]
productId: "menubar"
section: "api"
officialCatalog: true
generated: true
---

# Menubar API

Top-level menubar patterns with owned menu integration.

## API reference

Menubar docs cover wrapper components (`tng-menubar`/`tng-menu`) and headless directives for full ownership.

### Wrapper APIs

| Element | Input / Output | Type | Description |
| --- | --- | --- | --- |
| `<tng-menubar>` | `ariaLabel` | `string` | Accessible label for the menubar region. |
| `<tng-menubar>` | `loop` | `boolean` | Wrap focus movement between first/last top-level items. |
| `<tng-menu>` | `ariaLabel` | `string` | Accessible label for the menu panel. |
| `<tng-menu>` | `loop`, `disabled`, `closeOnSelect` | `boolean` | Configures item navigation and close behavior. |
| `<tng-menu>` | `tngMenuOpened`, `tngMenuClosed`, `tngMenuSelect` | `EventEmitter` | Lifecycle and selection events for menu interaction. |

### Primitive directives

| Directive | Purpose | Key inputs |
| --- | --- | --- |
| `tngMenubar` | Top-level command bar semantics and roving focus. | `loop` |
| `tngMenubarItem` | Focusable menubar item and owned menu link. | `[tngMenubarMenu]` |
| `tngMenu` | Menu panel with keyboard traversal and typeahead. | `loop`, `disabled`, `closeOnSelect` |
| `tngMenuItem` | Selectable option in menu panel. | `tngMenuItemValue`, `disabled`, `[tngMenuItemSubmenu]` |

### Keyboard contract (high level)

## Source-derived public Angular API

### `TngMenubarComponent` — `tng-menubar`

- Inputs: `ariaLabel`
- Forwarded inputs: `loop`
