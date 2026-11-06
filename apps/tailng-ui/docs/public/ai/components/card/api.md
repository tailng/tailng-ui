---
id: "components/card/api"
title: "Card API"
description: "Card API reference for Angular applications."
category: "components"
status: "stable"
tags: ["card","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/card/tng-card.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/api/card-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/api/card-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/api/card-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/card/api"
componentGroup: "layout"
symbols: ["TngCardActionsComponent","TngCardComponent","TngCardContentComponent","TngCardDescriptionComponent","TngCardDividerComponent","TngCardFooterComponent","TngCardHeaderComponent","TngCardLinkComponent","TngCardMediaComponent","TngCardTitleComponent"]
selectors: ["tng-card-actions","tng-card","tng-card-content","tng-card-description","tng-card-divider","tng-card-footer","tng-card-header","tng-card-link","tng-card-media","tng-card-title"]
productId: "card"
section: "api"
officialCatalog: true
generated: true
---

# Card API

Grouped content surfaces with optional media, actions, and footer composition.

## API reference

Card is a structural surface primitive with optional wrapper components for consistent visual defaults.

### `tngCard` and slot directives (primitives)

Attach directives to semantic elements to define the card structure while keeping full markup ownership.

#### Primitive attachment

```html
<article tngCard>
  <header tngCardHeader>
    <h3 tngCardTitle>Card title</h3>
    <p tngCardDescription>Card description</p>
  </header>
  <section tngCardContent>Body content</section>
  <footer tngCardFooter>
    <div tngCardActions>
      <button type="button">Action</button>
    </div>
  </footer>
</article>
```

| Directive | Selector | Data slot | Purpose |
| --- | --- | --- | --- |
| `TngCard` | `[tngCard]` | `card` | Root container for grouped content. |
| `TngCardHeader` | `[tngCardHeader]` | `card-header` | Top metadata section. |
| `TngCardTitle` | `[tngCardTitle]` | `card-title` | Primary heading hook. |
| `TngCardDescription` | `[tngCardDescription]` | `card-description` | Supporting summary text. |
| `TngCardContent` | `[tngCardContent]` | `card-content` | Main body region. |
| `TngCardFooter` | `[tngCardFooter]` | `card-footer` | Footer container for meta/actions. |
| `TngCardMedia` | `[tngCardMedia]` | `card-media` | Image/video slot wrapper. |
| `TngCardActions` | `[tngCardActions]` | `card-actions` | Action row alignment hook. |
| `TngCardDivider` | `[tngCardDivider]` | `card-divider` | Separator hook between sections. |
| `TngCardLink` | `[tngCardLink]` | `card-link` | Focusable link hook inside card surfaces. |

### `tng-card` wrappers (components)

Wrapper components apply baseline styles while preserving primitive slot contracts and composition.

#### Component attachment

```html
<tng-card variant="outline" tone="neutral" padding="md">
  <tng-card-header>
    <tng-card-title>Card title</tng-card-title>
    <tng-card-description>Card description</tng-card-description>
  </tng-card-header>
  <tng-card-content>Body content</tng-card-content>
  <tng-card-footer>
    <tng-card-actions>
      <button type="button">Action</button>
    </tng-card-actions>
  </tng-card-footer>
</tng-card>
```

| Surface | Input | Type | Default |
| --- | --- | --- | --- |
| `tng-card` | `variant` | `'ghost' \| 'outline' \| 'solid'` | `'solid'` |
| `tng-card` | `tone` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` |
| `tng-card` | `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `tng-card` | `interactive` | `boolean` | `false` |
| `tng-card` | `elevated` | `boolean` | `false` |
| `tng-card-actions` | `align` | `'start' \| 'end'` | `'end'` |
| `tng-card-link` | `href` | `string \| null` | `'#'` |
| `tng-card-link` | `disabled` | `boolean` | `false` |

## Source-derived public Angular API

### `TngCardActionsComponent` — `tng-card-actions`

- Inputs: `align`

### `TngCardComponent` — `tng-card`

- Inputs: `elevated`, `interactive`, `padding`, `tone`, `variant`

### `TngCardLinkComponent` — `tng-card-link`

- Inputs: `ariaLabel`, `disabled`, `href`, `rel`, `target`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngCardContentComponent` — `tng-card-content`
- `TngCardDescriptionComponent` — `tng-card-description`
- `TngCardDividerComponent` — `tng-card-divider`
- `TngCardFooterComponent` — `tng-card-footer`
- `TngCardHeaderComponent` — `tng-card-header`
- `TngCardMediaComponent` — `tng-card-media`
- `TngCardTitleComponent` — `tng-card-title`
