---
id: "components/confetti/styling"
title: "Confetti styling"
description: "Confetti styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["confetti","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.component.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.types.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.utils.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/styling/confetti-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/styling/confetti-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/confetti/styling"
componentGroup: "feedback"
symbols: ["TngConfettiComponent"]
selectors: ["tng-confetti"]
productId: "confetti"
section: "styling"
officialCatalog: true
generated: true
---

# Confetti styling

## Styling contract

### CSS variables

### Container overlay

For `fullscreen=false`, place the component inside an ancestor with `position: relative` and usually `overflow: hidden`.

### Performance

Use the default count for routine feedback. The DOM renderer clamps requests to 300 pieces.
