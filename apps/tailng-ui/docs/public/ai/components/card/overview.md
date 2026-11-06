---
id: "components/card/overview"
title: "Card component"
description: "Grouped content surfaces with optional media, actions, and footer composition."
category: "components"
status: "stable"
tags: ["card","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/card/tng-card.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/card/overview"
componentGroup: "layout"
symbols: ["TngCardActionsComponent","TngCardComponent","TngCardContentComponent","TngCardDescriptionComponent","TngCardDividerComponent","TngCardFooterComponent","TngCardHeaderComponent","TngCardLinkComponent","TngCardMediaComponent","TngCardTitleComponent"]
selectors: ["tng-card-actions","tng-card","tng-card-content","tng-card-description","tng-card-divider","tng-card-footer","tng-card-header","tng-card-link","tng-card-media","tng-card-title"]
productId: "card"
section: "overview"
officialCatalog: true
generated: true
---

# Card component

Grouped content surfaces with optional media, actions, and footer composition.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngCardComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCardComponent],
  template: `<tng-card />`,
})
export class CardAgentExample {}
```

## Component family

- `TngCardActionsComponent` — selector `tng-card-actions`
- `TngCardComponent` — selector `tng-card`
- `TngCardContentComponent` — selector `tng-card-content`
- `TngCardDescriptionComponent` — selector `tng-card-description`
- `TngCardDividerComponent` — selector `tng-card-divider`
- `TngCardFooterComponent` — selector `tng-card-footer`
- `TngCardHeaderComponent` — selector `tng-card-header`
- `TngCardLinkComponent` — selector `tng-card-link`
- `TngCardMediaComponent` — selector `tng-card-media`
- `TngCardTitleComponent` — selector `tng-card-title`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/card/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/card/api.md)
- [Styling](https://tailng.dev/ai/components/card/styling.md)
- [Examples](https://tailng.dev/ai/components/card/examples.md)
