---
id: "components/tabs/api"
title: "Tabs API"
description: "Tabs API reference for Angular applications."
category: "components"
status: "stable"
tags: ["tabs","navigation","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/api/tabs-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/api/tabs-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tabs/api"
componentGroup: "navigation"
symbols: ["TngTabsComponent"]
selectors: ["tng-tabs"]
productId: "tabs"
section: "api"
officialCatalog: true
generated: true
---

# Tabs API

Sectioned navigation with tablist, triggers, panels, and controlled or uncontrolled selection.

## API reference

`<tng-tabs>` is a wrapper root. The behavior contract for selection, focus, and panel activation still comes from the tabs primitives.

### Wrapper component

| Input / Output | Type | Default | Notes |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `'Tabs'` | Applied to the wrapper host when you do not supply your own label. |
| `value` | `string \| number \| null` | `undefined` | Controlled selected value forwarded to the primitive root. |
| `defaultValue` | `string \| number \| null` | `undefined` | Uncontrolled initial selection. |
| `activation` | `'auto' \| 'manual'` | `'auto'` | Controls whether focus movement also selects the active tab. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Changes arrow-key behavior and reflected orientation hooks. |
| `scrollButtons` | `'auto' \| 'off' \| 'on'` | `'off'` | Enables scroll-button visibility logic for overflowed tablists. |
| `loop`, `dir`, `disabled`, `lazy`, `keepAlive` | `primitive forwarded inputs` | varies | Forwarded directly through the wrapper to the primitive root. |
| `(valueChange)`, `(tabChange)`, `(focusChange)` | `events` | — | Emitted by the primitive root and re-exposed by the wrapper. |

### Tablist, tab, and panel

The wrapper does not replace `tngTabList`, `tngTab`, or `tngTabPanel`. You still import and author those parts explicitly.

| Part | Selector | Important inputs | Notes |
| --- | --- | --- | --- |
| Tab list | `[tngTabList]` | `ariaLabel`, `ariaLabelledby` | Provides the required `tablist` role and registration surface. |
| Tab trigger | `[tngTab]` | `value`, `disabled`, `panelId` | Reflects selection, focus, and disabled state through stable data attributes. |
| Tab panel | `[tngTabPanel]` | `value`, `labelledById`, `unmountOnExit` | Uses `hidden` when inactive and can unmount on exit if requested. |

### Primitive foundation

The wrapper only adds the default root shell and the optional `ariaLabel` input. Selection logic, roving focus, keyboard handling, and panel lifecycle all still belong to the headless tabs primitive.

## Source-derived public Angular API

### `TngTabsComponent` — `tng-tabs`

- Inputs: `ariaLabel`
- Forwarded inputs: `activation`, `defaultValue`, `dir`, `disabled`, `keepAlive`, `lazy`, `loop`, `orientation`, `scrollButtons`, `value`
- Forwarded outputs: `focusChange`, `tabChange`, `valueChange`
