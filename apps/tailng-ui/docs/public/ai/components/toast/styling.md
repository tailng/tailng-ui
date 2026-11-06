---
id: "components/toast/styling"
title: "Toast styling"
description: "Toast styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["toast","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/toast/tng-toast.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/styling/toast-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/styling/toast-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/toast/sections/styling/toast-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/toast/styling"
componentGroup: "feedback"
symbols: ["TngToastComponent"]
selectors: ["tng-toast"]
productId: "toast"
section: "styling"
officialCatalog: true
generated: true
---

# Toast styling

## Styling contract

Toast exposes the underlying viewport/item slot hooks while still shipping a minimum wrapper shell. Style through the public hooks first, and move to headless or ownable when you need to own the inner markup.

### Wrapper slot hooks

Use `[data-slot="toast-viewport"]` as the layout anchor and `[data-slot="toast-item"]` for message cards. Branch by `data-tone`, `data-state`, and viewport `data-mode` to style semantic and layout variants.

#### Recommended CSS contract

```css
[data-slot="toast-viewport"] {
  display: grid;
  gap: 0.65rem;
  pointer-events: none;
  position: fixed;
}

[data-slot="toast-item"] {
  background: var(--tng-semantic-background-surface);
  border: 1px solid var(--tng-semantic-border-default);
  border-radius: 0.85rem;
  color: var(--tng-semantic-foreground-primary);
  display: grid;
  gap: 0.6rem;
  grid-template-columns: 1fr auto;
  pointer-events: auto;
}

[data-slot="toast-item"][data-tone="success"] {
  border-color: var(--tng-semantic-accent-success);
}

[data-slot="toast-item"][data-tone="warning"] {
  border-color: var(--tng-semantic-accent-warning);
}

[data-slot="toast-item"][data-tone="danger"] {
  border-color: var(--tng-semantic-accent-danger);
}

[data-slot="toast-item"][data-state="closed"] {
  opacity: 0;
  pointer-events: none;
}
```

### Default shell

The wrapper already includes close-button, title, message, and action-button layout. Treat that as a minimum implementation detail rather than a public style API. Theme the outer item surface and viewport placement first.

### Owner guidance
