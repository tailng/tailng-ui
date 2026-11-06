---
id: "components/dialog/api"
title: "Dialog API"
description: "Dialog API reference for Angular applications."
category: "components"
status: "stable"
tags: ["dialog","overlay","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/dialog/tng-dialog.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/api/dialog-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/api/dialog-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/api/dialog-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/dialog/api"
componentGroup: "overlay"
symbols: ["TngDialogComponent"]
selectors: ["tng-dialog"]
productId: "dialog"
section: "api"
officialCatalog: true
generated: true
---

# Dialog API

Modal panel with backdrop dismissal, focus trap, and close reason outputs.

## API reference

Component dialog uses the styled `<tng-dialog>` wrapper and sits on top of the same primitive contract documented on the separate headless dialog page.

### Wrapper APIs

| Element | Input / Output | Type | Description |
| --- | --- | --- | --- |
| `<tng-dialog>` | `open`, `openChange` | `boolean` | Controlled open state for wrapper dialog instances. |
| `<tng-dialog>` | `title`, `description` | `string` | Accessible heading and description text rendered in the wrapper header. |
| `<tng-dialog>` | `closeOnEscape`, `closeOnBackdrop` | `boolean` | Dismiss policy for keyboard and backdrop interactions. |
| `<tng-dialog>` | `closed` | `'escape' \| 'backdrop' \| 'close-button' \| 'programmatic'` | Close reason payload for analytics and custom workflows. |
| `<tng-dialog>` projected content | `data-slot="dialog-content"` | attribute | Wrapper exposes a stable body hook around projected `ng-content`. |
| `<tng-dialog>` styling | `--tng-dialog-width`, `--tng-dialog-height` | `CSS length` | Panel dimension tokens. Width defaults to `34rem`; height defaults to `auto`. |

### Primitive directives

| Directive | Purpose | Key inputs |
| --- | --- | --- |
| `tngDialog` | Root modal state, focus trap, and dismissal logic. | `open`, `defaultOpen`, `trapFocus`, `restoreFocus` |
| `tngDialogBackdrop`, `tngDialogPanel` | Backdrop dismissal target and panel semantics/ARIA wiring. | `closeOnBackdropClick`, `ariaLabel*` |
| `tngDialogTrigger`, `tngDialogClose` | Open and close controls with reason emission. | `[tngDialogTrigger]`, `[tngDialogClose]` |
| `tngDialogTitle`, `tngDialogDescription`, `tngDialogContent`, `tngDialogActions` | Structured slots and IDs for accessible dialog labeling. | - |

### Keyboard contract (high level)

## Source-derived public Angular API

### `TngDialogComponent` — `tng-dialog`

- Inputs: `closeOnBackdrop`, `closeOnEscape`, `description`, `open`, `title`
- Outputs: `closed`, `openChange`
