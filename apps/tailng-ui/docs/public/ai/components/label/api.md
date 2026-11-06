---
id: "components/label/api"
title: "Label API"
description: "Label API reference for Angular applications."
category: "components"
status: "stable"
tags: ["label","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/label/tng-label.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/api/label-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/api/label-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/label/sections/api/label-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/label/api"
componentGroup: "form"
symbols: ["TngLabelComponent"]
selectors: ["tng-label"]
productId: "label"
section: "api"
officialCatalog: true
generated: true
---

# Label API

Accessible label semantics for explicit and wrapped control association.

## API reference

`<tng-label>` is a styled wrapper around the `tngLabel` primitive. Most component consumers work with the wrapper, but it helps to understand what the primitive forwards.

### Primitive: `label[tngLabel]`

#### Primitive attachment

```html
<label tngLabel for="release-owner">Release owner</label>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Adds `data-disabled` for reduced-emphasis label styling. |
| `required` | `boolean` | `false` | Adds `data-required`; keep required semantics on the control itself. |

### Component: `<tng-label>`

#### Component attachment

```html
<tng-label forId="release-owner" [required]="true">Release owner</tng-label>
<input id="release-owner" aria-required="true" />
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `forId` | `string` | `''` | Maps to native `for` when the trimmed value is non-empty. |
| `required` | `boolean` | `false` | Shows the built-in asterisk and forwards `data-required`. |
| `disabled` | `boolean` | `false` | Forwards `data-disabled` to the internal label for muted styling. |

### State attributes

## Source-derived public Angular API

### `TngLabelComponent` — `tng-label`

- Inputs: `disabled`, `forId`, `required`
