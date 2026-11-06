---
id: "components/progress-bar/api"
title: "Progress Bar API"
description: "Progress Bar API reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-bar","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-bar/tng-progress-bar.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/api/progress-bar-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/api/progress-bar-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/api/progress-bar-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-bar/api"
componentGroup: "feedback"
symbols: ["TngProgressBarComponent"]
selectors: ["tng-progress-bar"]
productId: "progress-bar"
section: "api"
officialCatalog: true
generated: true
---

# Progress Bar API

Linear determinate and indeterminate loading states with aria semantics.

## API reference

Progress Bar exposes a minimal wrapper contract: normalized range values, indeterminate mode, and semantic accessibility attributes.

### Wrapper component

`tng-progress-bar` renders the track and indicator for you, computes determinate width from the range, and forwards the primitive semantics underneath.

#### Wrapper usage

```html
<tng-progress-bar [value]="68" ariaLabel="Upload progress"></tng-progress-bar>
<tng-progress-bar [indeterminate]="true" ariaLabel="Syncing data"></tng-progress-bar>
```

### Range inputs

The wrapper exposes the same range inputs as the primitive and adds `ariaLabel` for easier explicit naming from template code.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `min` | `number` | `0` | Lower bound used to clamp `value`. |
| `max` | `number` | `100` | Upper bound used to clamp `value`; never falls below `min`. |
| `value` | `number` | `0` | Current determinate progress value. |
| `indeterminate` | `boolean` | `false` | Hides `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. |
| `ariaLabel` | `string \| null` | `null` | Supplies a direct accessible name. Use this or `ariaLabelledby`. |
| `ariaLabelledby` | `string \| null` | `null` | References the ID of visible text that names the progress bar. |
| `ariaValueText` | `string \| null` | `null` | Provides a human-readable value such as “Three of five files”. |

### Primitive foundation

Under the hood, the wrapper uses `tngProgressBar` for the semantic root and `tngProgressBarIndicator` for the fill element. Reach for the headless page when you want to own that markup directly.

#### Primitive foundation

```html
<div tngProgressBar [value]="68" class="progress-track">
  <span tngProgressBarIndicator [style.width.%]="68" class="progress-indicator"></span>
</div>
```

## Source-derived public Angular API

### `TngProgressBarComponent` — `tng-progress-bar`

- Inputs: `ariaLabel`, `ariaLabelledby`, `ariaValueText`, `indeterminate`, `max`, `min`, `value`
