---
id: "components/popover/api"
title: "Popover API"
description: "Popover API reference for Angular applications."
category: "components"
status: "stable"
tags: ["popover","overlay","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/popover/tng-popover-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/overlay/popover/tng-popover.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/api/popover-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/api/popover-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/api/popover-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/popover/api"
componentGroup: "overlay"
symbols: ["TngPopoverComponent"]
selectors: ["tng-popover"]
productId: "popover"
section: "api"
officialCatalog: true
generated: true
---

# Popover API

Anchored floating panel with trigger semantics and outside/Escape dismissal.

## API reference

Component popover uses the styled `<tng-popover>` wrapper and sits on top of the same primitive contract documented on the separate headless popover page.

### Wrapper component: <tng-popover>

| Element | Input / Output | Type | Description |
| --- | --- | --- | --- |
| `<tng-popover>` | `open`, `openChange` | `boolean` | Controlled popover state. Leave `open` undefined for uncontrolled mode. |
| `<tng-popover>` | `defaultOpen` | `boolean` | Initial open state when uncontrolled. |
| `[tngPopoverTriggerFor]` | Popover reference | `TngPopoverComponent` | Links a native button, `tng-button`, or trigger-target component to the detached panel. |
| `<tng-popover>` | `disabled` | `boolean` | Prevents opening from trigger interactions. |
| `<tng-popover>` | `closeOnEscape`, `closeOnOutsidePointer` | `boolean` | Dismiss policy for keyboard escape and outside pointer interactions. |
| `<tng-popover>` | `closeOnFocusOutside` | `boolean` | Closes when focus enters an element outside the trigger, panel, and owned nested overlays. Defaults to `false`. |
| `<tng-popover>` | `restoreFocus` | `boolean` | Restores focus to trigger/previous element after close. |
| `<tng-popover>` | `autoFocus` | `boolean \| 'first-focusable' \| 'panel' \| 'none'` | Controls what receives focus when the panel opens. `true` maps to `'first-focusable'`; `false` maps to `'none'`. |
| `<tng-popover>` | `side`, `align` | `'top' \| 'right' \| 'bottom' \| 'left'`, `'start' \| 'center' \| 'end'` | Requested anchored placement. The resolved placement is exposed via `data-side` and `data-align`. |
| `<tng-popover>` | `offset`, `collisionPadding` | `number` | Controls trigger distance and minimum viewport clearance while flipping and shifting. |
| `<tng-popover>` | `panelRole`, `panelAriaLabel`, `panelAriaLabelledby`, `ariaHasPopup` | `'dialog' \| 'menu' \| 'listbox' \| 'region' \| 'none'`, `string` | ARIA contract for panel semantics and the linked trigger. |
| `<tng-popover>` | `closed` | `'escape' \| 'focus-outside' \| 'outside-pointer' \| 'programmatic' \| 'trigger-toggle' | Close reason payload for analytics and flow state tracking. |

### Primitive directives

| Directive | Purpose | Key inputs / outputs |
| --- | --- | --- |
| `tngPopover` | Root state machine for open/close, dismissal, placement, and accessibility wiring. | `open`, `defaultOpen`, `closeOnEscape`, `closeOnFocusOutside`, `closeOnOutsidePointer`, `autoFocus`, `side`, `align`, `openChange`, `closed` |
| `tngPopoverTrigger` | Binds trigger element to a popover instance and toggles open/close on click. | `[tngPopoverTrigger]` (optional explicit popover instance) |
| `tngPopoverPanel` / `tngPopoverContent` | Panel surface with generated id, role, hidden state, and slot attributes. | Reads state from root; no separate inputs required. |
| `tngPopoverClose` | Closes the popover when clicked and emits reason through root `closed`. | `[tngPopoverClose]` close reason (optional) |

### Keyboard contract (high level)

## Source-derived public Angular API

### `TngPopoverComponent` — `tng-popover`

- Inputs: `align`, `ariaHasPopup`, `autoFocus`, `closeOnEscape`, `closeOnFocusOutside`, `closeOnOutsidePointer`, `collisionPadding`, `defaultOpen`, `disabled`, `offset`, `open`, `panelAriaLabel`, `panelAriaLabelledby`, `panelRole`, `restoreFocus`, `scrollStrategy`, `side`
- Outputs: `closed`, `openChange`
