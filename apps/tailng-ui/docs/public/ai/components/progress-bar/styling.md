---
id: "components/progress-bar/styling"
title: "Progress Bar styling"
description: "Progress Bar styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-bar","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-bar/tng-progress-bar.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/styling/progress-bar-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/styling/progress-bar-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/styling/progress-bar-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-bar/styling"
componentGroup: "feedback"
symbols: ["TngProgressBarComponent"]
selectors: ["tng-progress-bar"]
productId: "progress-bar"
section: "styling"
officialCatalog: true
generated: true
---

# Progress Bar styling

## Styling contract

Progress Bar exposes stable slot hooks so design systems can control track, indicator, and indeterminate motion while still using the wrapper shell.

### Wrapper slot hooks

Both primitives and wrappers expose the same selectors: `progress-bar` and `progress-bar-indicator`.

#### Slot contract

```css
[data-slot="progress-bar"] {
  background: var(--tng-progress-bar-track, var(--tng-semantic-background-muted));
  border-radius: var(--tng-progress-bar-radius, var(--tng-radius-control, 0.5rem));
  height: var(--tng-progress-bar-height, 0.625rem);
  overflow: hidden;
}

[data-slot="progress-bar-indicator"] {
  background: var(--tng-progress-bar-indicator, var(--tng-semantic-accent-brand));
  border-radius: inherit;
  display: block;
  height: 100%;
}

[data-slot="progress-bar-indicator"][data-indeterminate] {
  animation: tng-progress-bar-indeterminate 1.1s ease-in-out infinite;
}
```

### Default shell

The wrapper adds a minimal block-level host and a gentle width transition so determinate updates feel responsive without imposing heavy visual styling.

#### Wrapper defaults

```css
:host {
  display: block;
  width: 100%;
}

.tng-progress-bar-indicator {
  transition: width var(--tng-progress-bar-transition-duration, 180ms) ease;
}

@media (prefers-reduced-motion: reduce) {
  .tng-progress-bar-indicator {
    transition: none;
  }
}
```

### Owner guidance
