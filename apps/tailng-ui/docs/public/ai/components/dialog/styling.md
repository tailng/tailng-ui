---
id: "components/dialog/styling"
title: "Dialog styling"
description: "Dialog styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["dialog","overlay","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/dialog/tng-dialog.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/styling/dialog-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/styling/dialog-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/styling/dialog-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/dialog/styling"
componentGroup: "overlay"
symbols: ["TngDialogComponent"]
selectors: ["tng-dialog"]
productId: "dialog"
section: "styling"
officialCatalog: true
generated: true
---

# Dialog styling

## Styling contract

Wrapper dialog ships minimum theme styles, and the underlying primitive surface still exposes stable slot and state attributes for deeper shell customization.

### Core data attributes

### Reference CSS

#### dialog-styling.css

```css
[tngDialog][data-open="true"] {
  --dialog-backdrop: rgb(2 6 23 / 56%);
  --tng-dialog-width: 64rem;
  --tng-dialog-height: 28rem;
}

[data-slot="dialog-backdrop"] {
  align-items: center;
  background: var(--dialog-backdrop);
  display: grid;
  inset: 0;
  position: fixed;
}

[data-slot="dialog-panel"] {
  background: var(--tng-semantic-background-surface);
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.9rem;
  display: grid;
  gap: 0.75rem;
  height: var(--tng-dialog-height, auto);
  max-width: var(--tng-dialog-width, 34rem);
  padding: 1rem;
}

[data-slot="dialog-content"] {
  display: grid;
  gap: 0.75rem;
  max-block-size: min(52vh, 24rem);
  overflow: auto;
  padding-inline: 1rem;
}

[data-slot="dialog-close"] {
  border-radius: 0.6rem;
  min-height: 2rem;
}
```
