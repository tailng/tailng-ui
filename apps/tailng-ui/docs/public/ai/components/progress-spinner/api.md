---
id: "components/progress-spinner/api"
title: "Progress Spinner API"
description: "Progress Spinner API reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-spinner","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-spinner/tng-progress-spinner.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/api/progress-spinner-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/api/progress-spinner-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/api/progress-spinner-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-spinner/api"
componentGroup: "feedback"
symbols: ["TngProgressSpinnerComponent"]
selectors: ["tng-progress-spinner"]
productId: "progress-spinner"
section: "api"
officialCatalog: true
generated: true
---

# Progress Spinner API

Circular determinate and indeterminate loading states with aria semantics.

## API reference

Progress Spinner exposes a compact wrapper contract: normalized range values, indeterminate mode, and semantic accessibility attributes.

### Wrapper component

`tng-progress-spinner` renders the SVG shell for you, computes dash offset from the normalized range, and forwards the primitive semantics underneath.

#### Wrapper usage

```html
<tng-progress-spinner [value]="68" ariaLabel="Upload progress"></tng-progress-spinner>
<tng-progress-spinner [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-spinner>
```

### Size and range inputs

The wrapper exposes the primitive range inputs and adds `ariaLabel`, `size`, and `strokeWidth` so teams can scale the spinner without rewriting the SVG template.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `min` | `number` | `0` | Lower bound used to clamp `value`. |
| `max` | `number` | `100` | Upper bound used to clamp `value`; never falls below `min`. |
| `value` | `number` | `0` | Current determinate progress value. |
| `indeterminate` | `boolean` | `false` | Hides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. |
| `ariaLabel` | `string \| null` | `null` | Supplies an explicit accessible name when surrounding context is not enough. |
| `size` | `number` | `40` | Sets the rendered spinner size through the wrapper CSS variable. |
| `strokeWidth` | `number` | `4` | Controls both the track and indicator stroke width. |

### Primitive foundation

Under the hood, the wrapper uses `tngProgressSpinner` for the semantic root. Reach for the headless page when you want to author the SVG, circles, and motion directly.

#### Primitive foundation

```html
<span tngProgressSpinner [value]="68" aria-label="Upload progress">
  <!-- owner-authored SVG/circle rendering -->
</span>
```

## Source-derived public Angular API

### `TngProgressSpinnerComponent` — `tng-progress-spinner`

- Inputs: `ariaLabel`, `indeterminate`, `max`, `min`, `size`, `strokeWidth`, `value`
