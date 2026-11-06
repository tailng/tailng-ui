---
id: "components/empty/styling"
title: "Empty styling"
description: "Empty styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["empty","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/empty/tng-empty.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/styling/empty-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/styling/empty-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/styling/empty-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/empty/styling"
componentGroup: "feedback"
symbols: ["TngEmptyActionsComponent","TngEmptyComponent","TngEmptyDescriptionComponent","TngEmptyIconComponent","TngEmptyTitleComponent"]
selectors: ["tng-empty-actions","tng-empty","tng-empty-description","tng-empty-icon","tng-empty-title"]
productId: "empty"
section: "styling"
officialCatalog: true
generated: true
---

# Empty styling

## Styling contract

Empty wrapper components expose the same public slot hooks as the primitives. Style through those hooks first, and move to headless or ownable when you need to own the full shell.

### Wrapper slot hooks

Style the same selectors for both headless primitives and wrapper components: `empty`, `empty-icon`, `empty-title`, `empty-description`, and `empty-actions`.

#### Recommended CSS contract

```css
[data-slot="empty"] {
  border: 1px dashed var(--tng-semantic-border-strong);
  border-radius: 1rem;
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  padding: 1.5rem;
}

[data-slot="empty"][data-align="start"] {
  justify-items: start;
  text-align: left;
}

[data-slot="empty-icon"] {
  color: var(--tng-semantic-foreground-muted);
  font-size: 1.75rem;
}

[data-slot="empty-actions"] {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Default shell

The wrapper already provides a dashed surface, text alignment, and basic part spacing. Treat those defaults as a baseline shell rather than styling against private wrapper internals.

### Owner guidance
