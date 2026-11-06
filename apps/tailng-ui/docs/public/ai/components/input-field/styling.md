---
id: "components/input-field/styling"
title: "Input Field styling"
description: "Input Field styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["input-field","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-field/tng-input-field.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/styling/input-field-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/styling/input-field-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/styling/input-field-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-field/styling"
componentGroup: "form"
symbols: ["TngInputFieldComponent"]
selectors: ["tng-input-field"]
productId: "input-field"
section: "styling"
officialCatalog: true
generated: true
---

# Input Field styling

## Styling contract

Style `tng-input-field` through host CSS variables and your own classes on projected prefix, suffix, and action elements.

### Supported contract

The public styling path is the host token contract inherited from the shared input shell. Apply these vars on a class attached to `<tng-input-field>`.

#### Public host contract

```css
.docs-input-field-shell {
  --tng-input-bg: var(--tng-semantic-background-surface);
  --tng-input-border: var(--tng-semantic-border-subtle);
  --tng-input-fg: var(--tng-semantic-foreground-primary);
  --tng-input-radius: 0.85rem;
  --tng-input-min-height: 2.75rem;
  --tng-input-px: 0.9rem;
  --tng-input-gap: 0.65rem;
  --tng-input-focus-ring: color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);
  --tng-input-font-size: 0.96rem;
  --tng-input-line-height: 1.45;
  --tng-input-placeholder: var(--tng-semantic-foreground-muted);
}
```

### Shell state ownership

The wrapper consumes the focus and validation states internally. If you need custom shell selectors keyed off `data-focused` or `data-invalid`, move to the headless `<tng-input-group>` primitive.

#### State ownership

```html
/* <tng-input-field> exposes host tokens. */
/* Focus, invalid, disabled, and readonly attrs still live on the inner primitive group. */
/* If you need custom shell selectors keyed off those attrs, move to headless input-group. */

<tng-input-group class="docs-search-group">
  <span tngInputFieldPrefix aria-hidden="true">Search</span>
  <input tngInput type="search" />
</tng-input-group>

.docs-search-group[data-focused] {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-focus-ring) 24%, transparent);
}
```

### Workspace slug shell

### Projected content classes

## Styling examples

### Projected content classes

```html
<div class="docs-search-shell">
  <tng-input-field>
    <span tngInputFieldPrefix class="docs-search-prefix" aria-hidden="true">
      <tng-icon icon="search"></tng-icon>
    </span>
    <input tngInput type="search" placeholder="Search docs" />
    <button tngInputFieldSuffix type="button" class="docs-search-action">Clear</button>
  </tng-input-field>
</div>

.docs-search-shell {
  --tng-input-border: var(--tng-semantic-border-subtle);
  --tng-input-radius: 0.85rem;
}

.docs-search-prefix { color: var(--tng-semantic-foreground-secondary); }
.docs-search-action { color: var(--tng-semantic-foreground-secondary); }
```
