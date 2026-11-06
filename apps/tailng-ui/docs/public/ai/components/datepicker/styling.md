---
id: "components/datepicker/styling"
title: "Datepicker styling"
description: "Datepicker styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["datepicker","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/datepicker/tng-datepicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/styling/datepicker-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/styling/datepicker-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/datepicker/sections/styling/datepicker-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/datepicker/styling"
componentGroup: "form"
symbols: ["TngDatepickerComponent"]
selectors: ["tng-datepicker"]
productId: "datepicker"
section: "styling"
officialCatalog: true
generated: true
---

# Datepicker styling

## Styling contract

The wrapper, the helper directives, and the portaled overlay all share one public slot and state contract. Style against the exported data attributes and CSS variables instead of DOM structure or fixed light and dark utility classes.

### Slot selectors

| Selector | Purpose |
| --- | --- |
| `[data-slot="datepicker"]` | Root contract for field-level layout tokens, host state hooks, and shared semantic colors. |
| `[data-slot="datepicker-field"]` | Field wrapper that contains the input shell and the overlay anchor. |
| `[data-slot="datepicker-input-shell"]` | Combined input and trigger chrome. Use this for border, invalid, open, and focus treatment. |
| `[data-slot="datepicker-input"]` / `[data-slot="datepicker-trigger"]` | Editable text field and calendar trigger inside the shared shell. |
| `[data-slot="datepicker-overlay"]` | Popup panel. It is portaled to `body`, so scope theme tokens on an ancestor that can be copied to the overlay. |
| `[data-slot="datepicker-header"]` / `[data-slot="datepicker-nav-button"]` / `[data-slot="datepicker-period-button"]` | Header row and drill-down controls. |
| `[data-slot="datepicker-weekdays"]` / `[data-slot="datepicker-weekday"]` | Weekday label row in day view. |
| `[data-slot="datepicker-grid"]` | Shared grid container for day, month, and year panels. |
| `[data-slot="datepicker-cell"]` / `[data-slot="datepicker-month"]` / `[data-slot="datepicker-year"]` | Interactive day, month, and year cells. |

### State hooks

| State | Applied on | Use case |
| --- | --- | --- |
| `[data-open]` | Host, input shell, trigger, overlay | Open-state affordances and trigger emphasis. |
| `[data-view]` | Host | View-specific layout or animation changes across day, month, and year panels. |
| `[data-invalid]` | Input shell | Manual input parse and bounds failure treatment. |
| `[data-disabled]` | Host, day cells, month cells, year cells | Disabled field or out-of-range date visuals. |
| `[data-active]` | Day, month, and year cells | Current roving target when focus and selection differ. |
| `[data-selected]` | Day, month, and year cells | Committed selection state. |
| `[data-focus-visible]` | Day, month, and year cells | Keyboard focus treatment independent of selected state. |
| `[data-hidden]` | Day cells | Lets headless layouts suppress or fade hidden outside-month cells cleanly. |
| `[data-in-month]` | Day cells | Distinguishes outside-month days from the visible month. |
| `[data-in-range]`, `[data-range-start]`, `[data-range-end]` | Day cells in range mode | Supports shared background, start cap, and end cap styling for range selection. |
| `[data-placement]` / `[data-position]` | Overlay | Respond to flipped popup placement and horizontal alignment. |

### Common custom properties

| Token | Typical usage |
| --- | --- |
| `--tng-datepicker-radius` | Input shell and overlay radius. |
| `--tng-datepicker-field-height` | Combined input and trigger height. |
| `--tng-datepicker-overlay-padding` | Outer padding inside the popup panel. |
| `--tng-datepicker-z-overlay` | Portaled overlay stacking level. Falls back to `--tng-z-overlay`. |
| `--tng-datepicker-overlay-min-width` / `--tng-datepicker-overlay-max-width` | Headless popup width bounds. Wrapper inputs take precedence when supplied. |
| `--tng-datepicker-grid-gap` | Spacing between day, month, and year cells. |
| `--tng-datepicker-day-cell-size` / `--tng-datepicker-picker-cell-size` | Base cell sizing for day and picker panels. |
| `--tng-datepicker-brand` / `--tng-datepicker-focus` | Selection, hover, and focus accents. |
| `--tng-datepicker-border` / `--tng-datepicker-surface` / `--tng-datepicker-fg` | Field chrome, popup surface, and foreground styling. |
| `--tng-datepicker-shadow` / `--tng-datepicker-focus-shadow` | Popup depth and focus ring treatment. |
| `--tng-datepicker-nav-size` | Header navigation button footprint. |

### Theme-aware wrapper shell

When you place the wrapper inside a utility shell, prefer semantic tokens so the surrounding surface stays aligned with theme and mode changes and the portaled overlay inherits the same visual language.

#### Theme-aware container

```css
.theme-aware-datepicker-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  color: var(--tng-semantic-foreground-primary);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-background-base) 92%, var(--tng-semantic-background-surface) 8%),
    color-mix(in srgb, var(--tng-semantic-background-base) 76%, var(--tng-semantic-background-surface) 24%)
  );
}
```

### Compact override example

These tokens are already tuned for the docs examples. Override them on a wrapper scope when a denser or roomier product surface needs a different rhythm.

#### Scoped token overrides

```css
.booking-datepicker {
  --tng-datepicker-radius: 0.9rem;
  --tng-datepicker-field-height: 2.8rem;
  --tng-datepicker-overlay-padding: 0.72rem;
  --tng-datepicker-grid-gap: clamp(0.12rem, 1.15%, 0.28rem);
  --tng-datepicker-day-cell-size: 2.15rem;
  --tng-datepicker-picker-cell-size: 2.25rem;
  --tng-datepicker-z-overlay: 80;
  --tng-datepicker-brand: var(--tng-semantic-accent-brand);
  --tng-datepicker-focus: var(--tng-semantic-focus-ring);
}
```
