---
id: "components/menu/api"
title: "Menu API"
description: "Menu API reference for Angular applications."
category: "components"
status: "stable"
tags: ["menu","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menu/tng-menu-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/navigation/menu/tng-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/api/menu-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/api/menu-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menu/api"
componentGroup: "navigation"
symbols: ["TngMenuComponent"]
selectors: ["tng-menu"]
productId: "menu"
section: "api"
officialCatalog: true
generated: true
---

# Menu API

Contextual menu interactions, keyboard flow, and submenu behavior.

## API reference

Reference for the `tng-menu` component and `[tngMenuTriggerFor]` wiring from `@tailng-ui/components`, with primitives projected into the menu host.

### Wrapper APIs

| Element / Directive | Input / Output | Type | Description |
| --- | --- | --- | --- |
| `<tng-menu>` | `ariaLabel` | `string` | Accessible label for the menu panel. |
| `<tng-menu>` | `loop`, `disabled`, `closeOnSelect` | `boolean` | Controls focus traversal, interaction lock, and auto-close behavior. |
| `<tng-menu>` | `dismissOnOutsideClick`, `dismissOnFocusout` | `boolean` | Dismiss policy for pointer and focus transitions. |
| `<tng-menu>` | `tngMenuOpened`, `tngMenuClosed`, `tngMenuSelect` | `EventEmitter` | Menu lifecycle and selection outputs. |
| `[tngMenuTriggerFor]` | `tngMenuTriggerFor` | `TngMenu` | Connects a trigger element to a wrapper menu instance. |

### Projected directives

| Directive | Used on | Purpose |
| --- | --- | --- |
| `tngMenuItem` | Projected command button | Selectable command item. Combine with `tngMenuItemValue` for emitted values, or `[tngMenuItemSubmenu]` for cascaded menus. |
| `tngMenuGroupLabel` | Projected label element | Optional section label for grouped command sets inside a wrapper menu. |
| `tngMenuSeparator` | Projected separator element | Visual break between clusters of commands inside the same wrapper menu. |

### Keyboard contract (high level)

## Source-derived public Angular API

### `TngMenuComponent` — `tng-menu`

- Inputs: `ariaLabel`, `scrollStrategy`
- Forwarded inputs: `closeOnSelect`, `disabled`, `dismissOnFocusout`, `dismissOnOutsideClick`, `loop`
- Forwarded outputs: `tngMenuClosed`, `tngMenuOpened`, `tngMenuSelect`
