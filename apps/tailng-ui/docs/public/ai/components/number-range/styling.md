---
id: "components/number-range/styling"
title: "Number Range styling"
description: "Number Range styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["number-range","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/number-range/index.ts","libs/tailng-ui/components/src/lib/form/number-range/tng-number-range.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/styling/number-range-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/styling/number-range-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/styling/number-range-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/number-range/styling"
componentGroup: "form"
symbols: ["TngNumberRangeComponent"]
selectors: ["tng-number-range"]
productId: "number-range"
section: "styling"
officialCatalog: true
generated: true
---

# Number Range styling

## Styling contract

Style `<tng-number-range>` through the host-level token contract. Set `--tng-number-range-*` overrides on the host element or a scoped parent class and avoid reaching into internal DOM selectors for routine visual changes.

### CSS contracts

These selectors are the public styling surface. Internal slots follow the BEM-style class contract used in the component template and are safe to target for fine-grained overrides.

#### Public selectors

```css
tng-number-range
.tng-number-range
.tng-number-range__input
.tng-number-range__input--min
.tng-number-range__input--max
.tng-number-range__separator
```

### Shell state hooks

Invalid, disabled, and readonly styling should use the emitted state attributes rather than custom class bookkeeping or input event listeners.

#### State hooks

```css
.my-range-host {
  --tng-number-range-border: #cbd5e1;
  --tng-number-range-focus-ring: rgba(59, 130, 246, 0.2);
}

.my-range-host .tng-number-range[data-invalid] {
  border-color: #ef4444;
}

.my-range-host .tng-number-range[data-disabled] {
  opacity: 0.58;
  cursor: not-allowed;
}
```

### Theme contract tokens

All visual properties fall back to semantic tokens so they automatically track the active theme and light/dark mode. Override any token on the host or a scoped wrapper.

#### Public number-range tokens

```css
--tng-number-range-bg
--tng-number-range-border
--tng-number-range-fg
--tng-number-range-placeholder
--tng-number-range-radius
--tng-number-range-min-height
--tng-number-range-px
--tng-number-range-gap
--tng-number-range-focus-ring
--tng-number-range-invalid-border
--tng-number-range-separator-color
```

### Different styling pattern examples

## Styling examples

### Theme token override

```css
.my-price-range-host {
  --tng-number-range-bg: #ffffff;
  --tng-number-range-border: #cbd5e1;
  --tng-number-range-radius: 0.75rem;
  --tng-number-range-min-height: 2.5rem;
  --tng-number-range-px: 0.8rem;
  --tng-number-range-gap: 0.5rem;
  --tng-number-range-focus-ring: rgba(59, 130, 246, 0.2);
  --tng-number-range-separator-color: #94a3b8;
}
```

### Density control

```css
.my-compact-range-host {
  --tng-number-range-min-height: 2rem;
  --tng-number-range-px: 0.6rem;
  --tng-number-range-gap: 0.25rem;
  --tng-number-range-radius: 0.5rem;
}
```
