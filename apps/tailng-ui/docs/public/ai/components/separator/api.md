---
id: "components/separator/api"
title: "Separator API"
description: "Separator API reference for Angular applications."
category: "components"
status: "stable"
tags: ["separator","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/separator/tng-separator.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/api/separator-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/api/separator-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/api/separator-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/separator/api"
componentGroup: "layout"
symbols: ["TngSeparatorComponent"]
selectors: ["tng-separator"]
productId: "separator"
section: "api"
officialCatalog: true
generated: true
---

# Separator API

Horizontal and vertical dividers for visual or semantic content grouping.

## API reference

Separator is a non-interactive divider primitive with a thin wrapper component. The API surface is intentionally small: orientation and decorative semantics.

### `tngSeparator` (directive)

Attach on any block element to render a horizontal or vertical divider with semantic control.

#### Primitive attachment

```html
<div tngSeparator></div>
<div tngSeparator orientation="vertical"></div>
<div tngSeparator [decorative]="false"></div>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls visual line axis and semantic `aria-orientation` when semantic. |
| `decorative` | `boolean` | `true` | When `true`, applies `aria-hidden="true"`. When `false`, applies `role="separator"`. |

### `tng-separator` (component)

Wrapper component that renders an inner element with `tngSeparator` and forwards the same inputs.

#### Component usage

```html
<tng-separator></tng-separator>
<tng-separator orientation="vertical"></tng-separator>
<tng-separator [decorative]="false"></tng-separator>
```

| Surface | Value | Purpose |
| --- | --- | --- |
| Root hook | `data-slot="separator"` | Stable CSS selector for both primitive and wrapper usage. |
| Orientation hook | `data-orientation="horizontal\|vertical"` | Drive horizontal/vertical dimensions in custom CSS. |
| Semantic mode | `role="separator"` + `aria-orientation` | Expose meaningful structure to assistive technologies. |

## Source-derived public Angular API

### `TngSeparatorComponent` — `tng-separator`

- Inputs: `decorative`, `orientation`
