---
id: "components/drawer/api"
title: "Drawer API"
description: "Drawer API reference for Angular applications."
category: "components"
status: "stable"
tags: ["drawer","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/drawer/tng-drawer.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/api/drawer-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/api/drawer-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/drawer/sections/api/drawer-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/drawer/api"
componentGroup: "layout"
symbols: ["TngDrawerComponent"]
selectors: ["tng-drawer"]
productId: "drawer"
section: "api"
officialCatalog: true
generated: true
---

# Drawer API

Slide-in overlay panel with position, mode, focus trap, and backdrop support.

## API reference

Drawer provides a container directive (`tngDrawerContainer`), drawer directive (`tngDrawer`), content directive (`tngDrawerContent`), and a styled wrapper component (`<tng-drawer>`).

### `[tngDrawerContainer]` directive

Attach on a wrapper element that hosts one or more drawers and the main content. Manages backdrop, scroll lock, and coordination between multiple drawers.

#### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `hasBackdrop` | `'auto' \| boolean` | `'auto'` | Show backdrop when any overlay drawer is open. |
| `closeOthersOnOpen` | `boolean` | `true` | Close other drawers when one opens. |
| `animate` | `boolean` | `true` | Enable open/close animations. |
| `lockScroll` | `'auto' \| boolean` | `'auto'` | Lock body scroll when overlay drawer is open. |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | Layout direction for start/end positioning. |

#### Host attributes

| Attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"drawer-container"` | Stable styling and query hook. |
| `data-direction` | Resolved direction | Current layout direction. |
| `data-content-count` | Number | Number of drawer content slots. |
| `data-content-conflict` | Present when conflict | Indicates push/side mode conflict. |

### `[tngDrawer]` directive

Attach on the drawer panel element. Controls open state, mode, position, focus trap, and accessibility.

#### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `opened` | `boolean` | — | Controlled open state. |
| `defaultOpened` | `boolean` | `false` | Initial uncontrolled open state. |
| `mode` | `'overlay' \| 'push' \| 'side'` | `'overlay'` | How drawer overlays or displaces content. |
| `position` | `'start' \| 'end'` | `'start'` | Side of the viewport. |
| `disabled` | `boolean` | `false` | Disable drawer interactions. |
| `backdrop` | `'auto' \| boolean` | `'auto'` | Show backdrop (overlay mode). |
| `closeOnOutsideClick` | `boolean \| undefined` | — | Close on backdrop click; undefined inherits from container. |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key. |
| `restoreFocus` | `boolean` | `true` | Restore focus to trigger on close. |
| `autoFocus` | `'drawer' \| 'first-focusable' \| 'none'` | `'drawer'` | Focus target when opening. |
| `trapFocus` | `'auto' \| boolean` | `'auto'` | Trap focus inside drawer when open. |
| `role` | `'navigation' \| 'dialog' \| 'complementary' \| 'region'` | `'navigation'` | ARIA role for the drawer. |
| `inertContent` | `boolean` | `false` | Make main content inert when open. |
| `allowBodyScroll` | `boolean` | `false` | Allow body scroll when overlay drawer is open. |
| `swipeToClose` | `boolean` | `false` | Close on swipe gesture (touch). |
| `fixedInViewport` | `boolean` | `false` | Fix drawer within viewport bounds. |
| `fixedTopGap` | `number` | `0` | Gap from top when fixed in viewport. |
| `fixedBottomGap` | `number` | `0` | Gap from bottom when fixed in viewport. |

#### Outputs

| Output | Payload | When it fires |
| --- | --- | --- |
| `openedChange` | `boolean` | Open state changes. |
| `tngDrawerOpened` | — | After drawer finishes opening. |
| `tngDrawerClosed` | — | After drawer finishes closing. |
| `openStart` | — | When open animation begins. |
| `closeStart` | — | When close animation begins. |
| `backdropClick` | — | When backdrop is clicked. |
| `positionChange` | `'start' \| 'end'` | When position changes. |

#### Host attributes

| Attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"drawer"` | Stable styling and query hook. |
| `data-state` | open/closed | Current open state. |
| `data-position` | start/end | Current position. |
| `data-mode` | overlay/push/side | Current mode. |
| `data-side` | left/right | Resolved side for RTL. |
| `data-disabled` | Present when disabled | Disabled state. |
| `hidden` | Present when closed | Visibility for closed state. |

### `[tngDrawerContent]` directive

Attach on the main content element. Receives offset from the container in push/side mode when drawers are open.

#### Host attributes

| Attribute | Value | Purpose |
| --- | --- | --- |
| `data-slot` | `"drawer-content"` | Stable styling and query hook. |

### `<tng-drawer>` component

Styled wrapper that uses `tngDrawer` via host directives. Exposes all primitive inputs/outputs plus component-specific API.

#### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `'Drawer'` | Accessible label for the drawer. |
| Plus all primitive inputs from `tngDrawer`: `opened`, `defaultOpened`, `mode`, `position`, `disabled`, `backdrop`, `closeOnOutsideClick`, `closeOnEscape`, `restoreFocus`, `autoFocus`, `trapFocus`, `role`, `inertContent`, `allowBodyScroll`, `swipeToClose`, `fixedInViewport`, `fixedTopGap`, `fixedBottomGap`. |

#### Outputs

| Output | Payload | When it fires |
| --- | --- | --- |
| All primitive outputs from `tngDrawer`: `openedChange`, `tngDrawerOpened`, `tngDrawerClosed`, `openStart`, `closeStart`, `backdropClick`, `positionChange`. |

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `open()` | `() => void` | Opens the drawer. |
| `close()` | `() => void` | Closes the drawer. |
| `toggle(force?)` | `(force?: boolean) => void` | Toggles open state; optional `force` to set explicitly. |
| `isOpen()` | `() => boolean` | Returns current open state. |
| `setRestoreFocusFallback(target)` | `(target: HTMLElement \| null) => void` | Sets fallback element for focus restore when trigger is unavailable. |
| `setRestoreFocusTarget(target)` | `(target: HTMLElement \| null) => void` | Sets explicit target for focus restore on close. |

## Source-derived public Angular API

### `TngDrawerComponent` — `tng-drawer`

- Inputs: `ariaLabel`
- Forwarded inputs: `allowBodyScroll`, `autoFocus`, `backdrop`, `closeOnEscape`, `closeOnOutsideClick`, `closeOnTab`, `defaultOpened`, `disabled`, `fixedBottomGap`, `fixedInViewport`, `fixedTopGap`, `inertContent`, `mode`, `opened`, `position`, `restoreFocus`, `role`, `swipeToClose`, `trapFocus`
- Forwarded outputs: `backdropClick`, `closeStart`, `openedChange`, `openStart`, `positionChange`, `tngDrawerClosed`, `tngDrawerOpened`
