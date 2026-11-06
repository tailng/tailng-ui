---
id: "components/confetti/api"
title: "Confetti API"
description: "Confetti API reference for Angular applications."
category: "components"
status: "stable"
tags: ["confetti","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.component.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.types.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.utils.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/api/confetti-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/api/confetti-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/confetti/api"
componentGroup: "feedback"
symbols: ["TngConfettiComponent"]
selectors: ["tng-confetti"]
productId: "confetti"
section: "api"
officialCatalog: true
generated: true
---

# Confetti API

Controlled decorative paper bursts for successful actions and milestones.

## API reference

### TngConfetti

A standalone component exported as both `TngConfetti` and `TngConfettiComponent`.

### Inputs

| Name | Type / default | Purpose |
| --- | --- | --- |
| active | boolean / false | Launch on a false-to-true transition. |
| origin | 'bottom' \| 'center' / 'bottom' | Burst origin. |
| variant | 'paper' / 'paper' | V1 visual variant. |
| duration | number / 3000 | Total lifecycle in milliseconds. |
| pieces | number / 120 | Clamped to 0–300. |
| fullscreen | boolean / true | Viewport or positioned-container overlay. |
| reducedMotion | boolean \| 'auto' / 'auto' | System preference or explicit override. |
| colors | string[] \| null / null | Particle palette. |
| zIndex | number \| null / null | Overlay stacking override. |

### Output

`completed` emits once after a launch. Reset `active` to false before launching again.

## Source-derived public Angular API

### `TngConfettiComponent` — `tng-confetti`

- Inputs: `active`, `colors`, `duration`, `fullscreen`, `origin`, `pieces`, `reducedMotion`, `variant`, `zIndex`
- Outputs: `completed`
