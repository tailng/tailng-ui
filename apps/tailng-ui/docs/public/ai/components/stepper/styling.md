---
id: "components/stepper/styling"
title: "Stepper styling"
description: "Stepper styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["stepper","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/stepper/tng-stepper.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/styling/stepper-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/styling/stepper-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/styling/stepper-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/stepper/styling"
componentGroup: "layout"
symbols: ["TngStepperComponent","TngStepperItemComponent"]
selectors: ["tng-stepper","tng-stepper-item"]
productId: "stepper"
section: "styling"
officialCatalog: true
generated: true
---

# Stepper styling

## Styling contract

The wrapper owns the shell class while the headless primitive emits stable slot, orientation, state, and focus hooks across projected items and triggers.

### State hooks

| Hook | Where | Use |
| --- | --- | --- |
| `data-slot="stepper"` | Root (library-owned) | Container spacing, orientation layouts, connector styling. |
| `data-orientation` | Root (library-owned) | Horizontal and vertical layout selectors. |
| `data-linear` | Root (library-owned) | Linear-flow styling or analytics hook when linear mode is active. |
| `data-slot="stepper-item"` | Projected item (library-owned) | Per-step row styling. |
| `data-slot="stepper-trigger"` | Projected trigger (library-owned) | Focus rings, hit target sizing, and button/link reset styles. |
| `data-state="current"` | Projected item and trigger (library-owned) | Active step emphasis and readable current-state styling. |
| `data-state="completed"` | Projected item and trigger (library-owned) | Past-step confirmation colors and icon treatment. |
| `data-state="upcoming"` | Projected item and trigger (library-owned) | Muted future-step presentation. |
| `data-state="error"` | Projected item and trigger (library-owned) | Validation/processing failure styling. |
| `aria-current="step"` | Projected trigger (library-owned) | Current-step accessibility and selector hook. |

### CSS starter

#### Stepper state contract

```css
tng-stepper.tng-stepper,
[tngStepper][data-slot="stepper"] {
  display: grid;
  gap: 0.65rem;
}

[data-slot="stepper-item"][data-state="current"] {
  border-color: var(--tng-semantic-accent-brand);
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);
}

[data-slot="stepper-item"][data-state="completed"] {
  border-color: var(--tng-semantic-accent-success);
}

[data-slot="stepper-item"][data-state="error"] {
  border-color: var(--tng-semantic-accent-danger);
}

[data-slot="stepper-trigger"]:focus-visible {
  outline: 2px solid var(--tng-semantic-accent-brand);
  outline-offset: 2px;
}
```

Style the wrapper host for the shell, then target projected primitive slots for item state, trigger focus, optional markers, panels, and connectors.
