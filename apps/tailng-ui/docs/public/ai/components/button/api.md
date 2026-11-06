---
id: "components/button/api"
title: "Button API"
description: "Button API reference for Angular applications."
category: "components"
status: "stable"
tags: ["button","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/button/tng-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/api/button-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/api/button-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/api/button-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/button/api"
componentGroup: "utility"
symbols: ["TngButtonComponent"]
selectors: ["tng-button"]
productId: "button"
section: "api"
officialCatalog: true
generated: true
---

# Button API

Press/action semantics, accessibility, and interaction states.

## API reference

`<tng-button>` wraps `tngPress` with a minimum visual shell and forwards the primitive’s ARIA and disabled semantics to the internal button host.

### Wrapper component

The wrapper always renders a native button and applies the base `.tng-button` shell. Use it when you want the library’s size, tone, and appearance contract rather than styling every button host yourself.

### ARIA and state inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `appearance` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` | Visual button treatment. |
| `tone` | `'primary' \| 'neutral' \| 'success' \| 'danger'` | `'primary'` | Semantic color intent. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height and horizontal padding. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Forwarded to the native button host. |
| `disabled` | `boolean` | `false` | Disables interaction and reflects disabled host attrs. |
| `ariaPressed` | `boolean \| null` | `null` | Pressed-state semantics for toggle-like buttons. |
| `ariaExpanded` | `boolean \| null` | `null` | Expanded state for disclosure and popup triggers. |
| `ariaHasPopup` | `TngPressAriaHasPopup \| null` | `null` | Popup relationship hint like `menu`, `dialog`, or `listbox`. |
| `ariaControls` | `string \| null` | `null` | ID reference for the controlled content surface. |

### Primitive foundation

The wrapper is built on `tngPress`. If you need anchor hosts, button-like link semantics, or completely custom visuals, use the dedicated headless `Button` page and apply `tngPress` directly to native `button` or `a` hosts.

## Source-derived public Angular API

### `TngButtonComponent` — `tng-button`

- Inputs: `appearance`, `ariaControls`, `ariaExpanded`, `ariaHasPopup`, `ariaLabel`, `ariaLabelledby`, `ariaPressed`, `disabled`, `size`, `tone`, `type`
