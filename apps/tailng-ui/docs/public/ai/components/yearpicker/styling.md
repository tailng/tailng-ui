---
id: "components/yearpicker/styling"
title: "Yearpicker styling"
description: "Yearpicker styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["yearpicker","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/yearpicker/tng-yearpicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/styling/yearpicker-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/styling/yearpicker-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/styling/yearpicker-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/yearpicker/styling"
componentGroup: "form"
symbols: ["TngYearpickerComponent"]
selectors: ["tng-yearpicker"]
productId: "yearpicker"
section: "styling"
officialCatalog: true
generated: true
---

# Yearpicker styling

## Styling contract

`tng-yearpicker` delegates all rendering to the shared datepicker surface. Style against the exported data attributes and CSS custom properties rather than internal DOM structure or hard-coded color values.

### Slot selectors

| Selector | Purpose |
| --- | --- |
| `[data-slot="datepicker"]` | Root contract for field-level layout tokens, host state hooks, and shared semantic colors. |
| `[data-slot="datepicker-field"]` | Field wrapper containing the input shell and overlay anchor. |
| `[data-slot="datepicker-input-shell"]` | Combined input and trigger chrome. Apply border, invalid, open, and focus treatment here. |
| `[data-slot="datepicker-input"]` / `[data-slot="datepicker-trigger"]` | Editable text field and calendar icon trigger inside the shared shell. |
| `[data-slot="datepicker-overlay"]` | Year grid popup portaled to `body`. Scope theme tokens on an ancestor. |
| `[data-slot="datepicker-header"]` / `[data-slot="datepicker-nav-button"]` / `[data-slot="datepicker-period-button"]` | Header row and year page navigation controls. |
| `[data-slot="datepicker-grid"]` | Year grid container. |
| `[data-slot="datepicker-year"]` | Interactive year cells. |

### State hooks

| State | Applied on | Use case |
| --- | --- | --- |
| `[data-open]` | Host, input shell, trigger, overlay | Open-state affordances and trigger emphasis. |
| `[data-view]` | Host | Always `year` for the yearpicker; useful for scoped animations. |
| `[data-invalid]` | Input shell | Unparseable or out-of-range year input. |
| `[data-disabled]` | Host, year cells | Disabled field or out-of-bounds year cells. |
| `[data-selected]` | Year cells | Currently selected year. |
| `[data-active]` | Year cells | Current roving keyboard target. |
| `[data-focus-visible]` | Year cells | Keyboard focus ring treatment independent of selected state. |
| `[data-placement]` | Overlay | Responds to flipped popup placement above or below the field. |

### Common custom properties

All tokens use the `--tng-datepicker-` prefix since `tng-yearpicker` shares the datepicker component surface.

| Token | Typical usage |
| --- | --- |
| `--tng-datepicker-radius` | Input shell and overlay border radius. |
| `--tng-datepicker-field-height` | Combined input and trigger height. |
| `--tng-datepicker-overlay-padding` | Outer padding inside the year grid popup. |
| `--tng-datepicker-grid-gap` | Spacing between year cells. |
| `--tng-datepicker-picker-cell-size` | Base size for year cells. |
| `--tng-datepicker-brand` / `--tng-datepicker-focus` | Selection, hover, and focus ring accents. |
| `--tng-datepicker-border` / `--tng-datepicker-surface` / `--tng-datepicker-fg` | Field chrome, popup surface, and foreground styling. |
| `--tng-datepicker-shadow` | Popup depth shadow. |
| `--tng-datepicker-nav-size` | Header navigation button footprint. |

### Theme-aware wrapper shell

Prefer semantic tokens when placing the picker inside a utility shell so the surface stays aligned with theme and mode changes.

#### Theme-aware container

```css
.theme-aware-yearpicker-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  color: var(--tng-semantic-foreground-primary);
  background: var(--tng-semantic-background-surface);
}
```

### Compact override example

Override datepicker tokens on a scoped wrapper class to achieve a denser or roomier layout without touching global styles.

#### Scoped token overrides

```css
.compact-yearpicker {
  --tng-datepicker-radius: 0.7rem;
  --tng-datepicker-field-height: 2.6rem;
  --tng-datepicker-overlay-padding: 0.6rem;
  --tng-datepicker-grid-gap: 0.2rem;
  --tng-datepicker-picker-cell-size: 2.1rem;
  --tng-datepicker-brand: var(--tng-semantic-accent-brand);
  --tng-datepicker-focus: var(--tng-semantic-focus-ring);
}
```
