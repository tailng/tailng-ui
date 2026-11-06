---
id: "components/confetti/examples"
title: "Confetti examples"
description: "Confetti examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["confetti","feedback","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.component.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.types.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.utils.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/examples/confetti-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/examples/confetti-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/sections/examples/confetti-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/confetti/examples"
componentGroup: "feedback"
symbols: ["TngConfettiComponent"]
selectors: ["tng-confetti"]
productId: "confetti"
section: "examples"
officialCatalog: true
generated: true
---

# Confetti examples

## Examples

Use fullscreen bursts for major success events, contain celebrations inside focused surfaces, and reset controlled state after every completed launch.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngConfettiComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngConfettiComponent],
  template: `<tng-confetti />`,
})
export class ConfettiExample {}
```
