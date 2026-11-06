---
id: "components/confetti/overview"
title: "Confetti component"
description: "Controlled decorative paper bursts for successful actions and milestones."
category: "components"
status: "stable"
tags: ["confetti","feedback","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.component.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.types.ts","libs/tailng-ui/components/src/lib/feedback/confetti/tng-confetti.utils.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/confetti/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/confetti/overview"
componentGroup: "feedback"
symbols: ["TngConfettiComponent"]
selectors: ["tng-confetti"]
productId: "confetti"
section: "overview"
officialCatalog: true
generated: true
---

# Confetti component

Controlled decorative paper bursts for successful actions and milestones.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngConfettiComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngConfettiComponent],
  template: `<tng-confetti />`,
})
export class ConfettiAgentExample {}
```

## Component family

- `TngConfettiComponent` — selector `tng-confetti`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/feedback/confetti/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/confetti/api.md)
- [Styling](https://tailng.dev/ai/components/confetti/styling.md)
- [Examples](https://tailng.dev/ai/components/confetti/examples.md)
