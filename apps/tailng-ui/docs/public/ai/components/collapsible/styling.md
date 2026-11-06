---
id: "components/collapsible/styling"
title: "Collapsible styling"
description: "Collapsible styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["collapsible","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/collapsible/tng-collapsible.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/styling/collapsible-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/styling/collapsible-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/styling/collapsible-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/collapsible/styling"
componentGroup: "layout"
symbols: ["TngCollapsibleComponent"]
selectors: ["tng-collapsible"]
productId: "collapsible"
section: "styling"
officialCatalog: true
generated: true
---

# Collapsible styling

## Styling contract

Style against explicit data hooks from the collapsible host and each step item. Keep state tokens centralized so current/completed/error remain visually consistent across flows.

### State hooks

| Hook | Where | Use |
| --- | --- | --- |
| `data-slot="collapsible"` | Root | Container spacing, orientation layouts, connector styling. |
| `data-state="current"` | Owner-authored child item | Active step emphasis and readable focus baseline. |
| `data-state="completed"` | Owner-authored child item | Past-step confirmation colors and icon treatment. |
| `data-state="upcoming"` | Owner-authored child item | Muted future-step presentation. |
| `data-state="error"` | Owner-authored child item | Validation/processing failure styling. |

### CSS starter

#### Collapsible state contract

```css
[data-slot="collapsible"] {
  display: grid;
  gap: 0.65rem;
}

[data-slot="collapsible"] [data-state="current"] {
  border-color: var(--tng-semantic-accent-brand);
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);
}

[data-slot="collapsible"] [data-state="completed"] {
  border-color: var(--tng-semantic-accent-success);
}

[data-slot="collapsible"] [data-state="error"] {
  border-color: var(--tng-semantic-accent-danger);
}
```
