---
id: "components/tooltip/styling"
title: "Tooltip styling"
description: "Tooltip styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["tooltip","overlay","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/styling/tooltip-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/styling/tooltip-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/styling/tooltip-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/tooltip/styling"
componentGroup: "overlay"
symbols: ["TngTooltipComponent"]
selectors: ["tng-tooltip"]
productId: "tooltip"
section: "styling"
officialCatalog: true
generated: true
---

# Tooltip styling

## Styling contract

The wrapper forwards slot and state hooks through its built-in trigger and floating content, so teams can restyle the shell without depending on internal DOM structure.

### Core data attributes

### Overlay z-index

Tooltip content uses `var(--tng-tooltip-z-overlay, var(--tng-tooltip-overlay-z-index, var(--tng-z-overlay, 20)))`. Set `--tng-tooltip-z-overlay` on `tng-tooltip` (or an ancestor), or set `--tng-z-overlay` app-wide so tooltips share the same stacking context as other overlays.

### Reference CSS

#### tooltip-styling.css

```css
tng-tooltip {
  --tng-tooltip-z-overlay: 1100;
}

/* or app-wide */
:root {
  --tng-z-overlay: 1100;
}

[data-slot="tooltip-trigger"] {
  border-radius: 0.7rem;
  min-height: 2.1rem;
  padding-inline: 0.9rem;
}

[data-slot="tooltip-trigger"][data-state="open"] {
  border-color: var(--tng-semantic-accent-brand);
}

[data-slot="tooltip-content"] {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.7rem;
  box-shadow: 0 20px 36px color-mix(in srgb, #020617 24%, transparent);
  padding: 0.45rem 0.62rem;
  pointer-events: none;
}

[data-slot="tooltip-content"][data-side="top"] {
  transform-origin: bottom center;
}

[data-slot="tooltip-content"][hidden] {
  display: none !important;
}
```
