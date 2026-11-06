---
id: "components/input/styling"
title: "Input styling"
description: "Input styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["input","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input/tng-input.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/styling/input-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/styling/input-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/styling/input-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input/styling"
componentGroup: "form"
symbols: ["TngInputComponent"]
selectors: ["tng-input"]
productId: "input"
section: "styling"
officialCatalog: true
generated: true
---

# Input styling

## Styling contract

Style the Input component through the host-level token contract. The simple path is to put `--tng-input-*` overrides directly on `<tng-input>` and avoid reaching into its internal DOM.

### CSS contracts

These selectors are the public component-level styling surface. Internal group slots belong to the headless layer and should not be the normal path for component styling.

#### Public selectors

```css
tng-input
[data-slot="input-component"]
tng-input-field
[data-slot="input-field-wrapper"]
[data-appearance]
[data-size]
[data-tone]
[data-full-width]
```

### Shell state hooks

Focus, invalid, disabled, and readonly treatment should hang off the emitted shell state attrs instead of custom classes or input event bookkeeping.

#### State hooks

```css
.doc-cmp-input-style-doc-statehooks-host {
  --tng-input-border: #cbd5e1;
  --tng-input-focus-ring: rgba(59, 130, 246, 0.2);
}

.doc-cmp-input-style-doc-statehooks-shell [data-slot="input-group"][data-invalid] {
  border-color: #ef4444;
}

.doc-cmp-input-style-doc-statehooks-shell [data-slot="input-group"][data-disabled] {
  opacity: 0.58;
  cursor: not-allowed;
}
```

### Theme contract tokens

The current theme contract is token-driven. Override these on the component host or a scoped wrapper when you want to change shell rhythm, chrome, or emphasis.

#### Public input tokens

```css
--tng-input-gap
--tng-input-bg
--tng-input-border
--tng-input-radius
--tng-input-fg
--tng-input-min-height
--tng-input-px
--tng-input-py
--tng-input-focus-ring
--tng-input-font-size
--tng-input-font-weight
--tng-input-line-height
--tng-input-placeholder
```

### Different styling pattern examples

## Styling examples

### Theme token override

```css
.doc-cmp-input-style-pattern-theme-host {
  --tng-input-bg: #ffffff;
  --tng-input-border: #cbd5e1;
  --tng-input-radius: 0.75rem;
  --tng-input-min-height: 2.5rem;
  --tng-input-px: 0.8rem;
  --tng-input-focus-ring: rgba(59, 130, 246, 0.2);
  --tng-input-font-size: 0.98rem;
  --tng-input-font-weight: 500;
  --tng-input-line-height: 1.35;
  --tng-input-placeholder: #94a3b8;
}
```

### Density control

```css
.doc-cmp-input-style-pattern-density-host {
  --tng-input-min-height: 2.2rem;
  --tng-input-px: 0.68rem;
  --tng-input-gap: 0.45rem;
  --tng-input-radius: 0.65rem;
}
```
