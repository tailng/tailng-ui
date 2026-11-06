---
id: "components/progress-spinner/styling"
title: "Progress Spinner styling"
description: "Progress Spinner styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-spinner","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-spinner/tng-progress-spinner.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/styling/progress-spinner-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/styling/progress-spinner-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/styling/progress-spinner-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-spinner/styling"
componentGroup: "feedback"
symbols: ["TngProgressSpinnerComponent"]
selectors: ["tng-progress-spinner"]
productId: "progress-spinner"
section: "styling"
officialCatalog: true
generated: true
---

# Progress Spinner styling

## Styling contract

Progress Spinner exposes stable hooks for the root slot and spinner circles so design systems can tune size, stroke, and motion while still using the wrapper shell.

### Wrapper slot hooks

Use `[data-slot="progress-spinner"]` for root sizing and `.tng-progress-spinner-track`/`.tng-progress-spinner-indicator` for circle styling.

#### Slot contract

```css
[data-slot="progress-spinner"] {
  --tng-progress-spinner-size: 40px;
  --tng-progress-spinner-stroke-width: 4px;
}

.tng-progress-spinner-track {
  stroke: var(--tng-semantic-border-subtle);
}

.tng-progress-spinner-indicator {
  stroke: var(--tng-semantic-accent-brand);
  transition: stroke-dashoffset 180ms ease;
}

.tng-progress-spinner-indicator[data-indeterminate] {
  animation: tng-progress-spinner-indeterminate 1s linear infinite;
}
```

### Default shell

The wrapper provides an inline-flex host, an SVG shell, and the default CSS variables for spinner size and stroke width so most teams only need slot-level overrides.

#### Wrapper defaults

```css
:host {
  display: inline-flex;
}

.tng-progress-spinner {
  display: inline-flex;
  height: var(--tng-progress-spinner-size, 40px);
  width: var(--tng-progress-spinner-size, 40px);
}
```

### Owner guidance
