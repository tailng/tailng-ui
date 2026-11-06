---
id: "components/empty/api"
title: "Empty API"
description: "Empty API reference for Angular applications."
category: "components"
status: "stable"
tags: ["empty","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/empty/tng-empty.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/api/empty-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/api/empty-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/api/empty-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/empty/api"
componentGroup: "feedback"
symbols: ["TngEmptyActionsComponent","TngEmptyComponent","TngEmptyDescriptionComponent","TngEmptyIconComponent","TngEmptyTitleComponent"]
selectors: ["tng-empty-actions","tng-empty","tng-empty-description","tng-empty-icon","tng-empty-title"]
productId: "empty"
section: "api"
officialCatalog: true
generated: true
---

# Empty API

Empty-state layout with icon, title, description, and action composition.

## API reference

`<tng-empty>` is a light wrapper around the empty primitives. It adds the default shell and an `align` input while keeping the same projected parts for icon, title, description, and actions.

### `<tng-empty>` root

The root wrapper renders the default dashed shell and passes alignment through a public attribute on the internal surface.

#### Root usage

```html
<tng-empty align="start">
  <tng-empty-icon>🔎</tng-empty-icon>
  <tng-empty-title>No matching records</tng-empty-title>
  <tng-empty-description>
    Try broadening your search criteria.
  </tng-empty-description>
</tng-empty>
```

| Input | Type | Default | Purpose |
| --- | --- | --- | --- |
| `align` | `'center' \| 'start'` | `'center'` | Switches the shell between centered and left-aligned content. |

### Wrapper parts

The wrapper parts mirror the primitive slots. Use the projected part components to keep your structure explicit while staying on the wrapper surface.

#### Part composition

```html
<tng-empty>
  <tng-empty-icon>📭</tng-empty-icon>
  <tng-empty-title>No messages</tng-empty-title>
  <tng-empty-description>
    You are all caught up. Invite your team to start new conversations.
  </tng-empty-description>
  <tng-empty-actions>
    <button type="button">Invite team</button>
  </tng-empty-actions>
</tng-empty>
```

| Component | Selector | Purpose |
| --- | --- | --- |
| `TngEmptyIconComponent` | `<tng-empty-icon>` | Optional icon or illustration region. |
| `TngEmptyTitleComponent` | `<tng-empty-title>` | Primary headline for the state. |
| `TngEmptyDescriptionComponent` | `<tng-empty-description>` | Supporting explanation and next-step guidance. |
| `TngEmptyActionsComponent` | `<tng-empty-actions>` | Optional row for CTA buttons or links. |

### Primitive foundation

The wrapper renders the same public `data-slot` hooks as the primitives. If you need a fully custom shell or want to skip the wrapper defaults entirely, use the headless empty page instead.

## Source-derived public Angular API

### `TngEmptyComponent` — `tng-empty`

- Inputs: `align`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngEmptyActionsComponent` — `tng-empty-actions`
- `TngEmptyDescriptionComponent` — `tng-empty-description`
- `TngEmptyIconComponent` — `tng-empty-icon`
- `TngEmptyTitleComponent` — `tng-empty-title`
