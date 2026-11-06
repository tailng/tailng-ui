---
id: "components/popover/styling"
title: "Popover styling"
description: "Popover styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["popover","overlay","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/popover/tng-popover-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/overlay/popover/tng-popover.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/styling/popover-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/styling/popover-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/styling/popover-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/popover/styling"
componentGroup: "overlay"
symbols: ["TngPopoverComponent"]
selectors: ["tng-popover"]
productId: "popover"
section: "styling"
officialCatalog: true
generated: true
---

# Popover styling

## Styling contract

Wrapper popover ships minimum theme styles, and the underlying primitive surface still exposes stable slot and state attributes for teams that need deeper shell customization.

### Core data attributes

### Reference CSS

#### popover-styling.css

```css
tng-popover {
  --tng-popover-panel-radius: 0.9rem;
  --tng-popover-z-overlay: 60;
}

[data-slot="popover-trigger"] {
  border-radius: 0.65rem;
}

[data-slot="popover-panel"] {
  background: var(--tng-semantic-background-surface);
  border: 1px solid var(--tng-semantic-border-strong);
  border-radius: 0.9rem;
  display: grid;
  gap: 0.75rem;
  min-width: 16rem;
  max-width: min(24rem, 90vw);
  padding: 1rem;
  box-shadow: 0 22px 42px color-mix(in srgb, var(--tng-semantic-foreground-primary) 22%, transparent);
}

[data-slot="popover-close"] {
  border-radius: 0.6rem;
  min-height: 2rem;
}

[data-slot="popover-panel"][hidden] {
  display: none !important;
}
```
