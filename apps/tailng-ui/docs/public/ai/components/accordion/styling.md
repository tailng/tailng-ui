---
id: "components/accordion/styling"
title: "Accordion styling"
description: "Accordion styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["accordion","layout","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/accordion/tng-accordion.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/styling/accordion-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/styling/accordion-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/styling/accordion-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/accordion/styling"
componentGroup: "layout"
symbols: ["TngAccordionComponent","TngAccordionItemComponent","TngAccordionPanelComponent","TngAccordionTriggerComponent"]
selectors: ["tng-accordion","tng-accordion-item","tng-accordion-panel","tng-accordion-trigger"]
productId: "accordion"
section: "styling"
officialCatalog: true
generated: true
---

# Accordion styling

## Styling contract

Accordion exposes predictable slot/state attributes so teams can style primitives and wrappers consistently in plain CSS or utility layers.

### State hooks

| Hook | Where | Use |
| --- | --- | --- |
| `data-slot="accordion"` | Root | Overall container surface, border, spacing, and group-level layout. |
| `data-type="single\|multiple"` | Root | Switch layout accents based on single or multiple expansion mode. |
| `data-slot="accordion-item"` | Item | Per-item separators and disabled presentation. |
| `data-slot="accordion-trigger"` | Trigger | Button typography, hover, focus, and open/closed state styles. |
| `data-slot="accordion-indicator"` | Default chevron or projected custom indicator | Icon sizing, alignment, and open-state transforms. |
| `data-state="open\|closed"` | Item, trigger, panel, indicator | Animate chevrons, open panels, and stateful backgrounds. |
| `data-disabled="true\|false"` | Root, item, trigger | Visual lock for disabled sections and pointer affordances. |
| `data-slot="accordion-panel"` | Panel | Panel container spacing and typography treatment. |

### CSS starter

#### Accordion state contract

```css
[data-slot="accordion"] {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
}

[data-slot="accordion-trigger"][data-state="open"] {
  color: var(--tng-semantic-accent-brand);
}

[data-slot="accordion-indicator"][data-state="open"] {
  transform: rotate(180deg);
}

[data-slot="accordion-item"][data-disabled="true"] {
  opacity: 0.6;
}

[data-slot="accordion-panel"][data-state="closed"] {
  display: none;
}
```
