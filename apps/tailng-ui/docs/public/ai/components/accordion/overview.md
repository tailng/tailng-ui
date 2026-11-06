---
id: "components/accordion/overview"
title: "Accordion component"
description: "Single and multi-expand panel groups with keyboard navigation and aria wiring."
category: "components"
status: "stable"
tags: ["accordion","layout","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/accordion/tng-accordion.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/accordion/overview"
componentGroup: "layout"
symbols: ["TngAccordionComponent","TngAccordionItemComponent","TngAccordionPanelComponent","TngAccordionTriggerComponent"]
selectors: ["tng-accordion","tng-accordion-item","tng-accordion-panel","tng-accordion-trigger"]
productId: "accordion"
section: "overview"
officialCatalog: true
generated: true
---

# Accordion component

Single and multi-expand panel groups with keyboard navigation and aria wiring.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngAccordionComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngAccordionComponent],
  template: `<tng-accordion />`,
})
export class AccordionAgentExample {}
```

## Component family

- `TngAccordionComponent` — selector `tng-accordion`
- `TngAccordionItemComponent` — selector `tng-accordion-item`
- `TngAccordionPanelComponent` — selector `tng-accordion-panel`
- `TngAccordionTriggerComponent` — selector `tng-accordion-trigger`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/layout/accordion/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/accordion/api.md)
- [Styling](https://tailng.dev/ai/components/accordion/styling.md)
- [Examples](https://tailng.dev/ai/components/accordion/examples.md)
