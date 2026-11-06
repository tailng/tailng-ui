---
id: "components/date-range-picker/styling"
title: "Date Range Picker styling"
description: "Date Range Picker styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["date-range-picker","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/date-range-picker/tng-date-range-picker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/styling/date-range-picker-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/styling/date-range-picker-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/date-range-picker/sections/styling/date-range-picker-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/date-range-picker/styling"
componentGroup: "form"
symbols: ["TngDateRangePickerComponent"]
selectors: ["tng-date-range-picker"]
productId: "date-range-picker"
section: "styling"
officialCatalog: true
generated: true
---

# Date Range Picker styling

## Styling contract

The wrapper, the helper directives, and the portaled overlay all share one public slot and state contract. Style against the exported data attributes and CSS variables instead of DOM structure or fixed light and dark utility classes.

### Slot selectors

| Selector | Purpose |
| --- | --- |
| `[data-slot="date-range-picker"]` | Root contract for field-level layout tokens, host state hooks, and shared semantic colors. |
| `[data-slot="date-range-picker-field"]` | Field wrapper that contains the input shell and the overlay anchor. |
| `[data-slot="date-range-picker-input-shell"]` | Combined input and trigger chrome. Use this for border, invalid, open, and focus treatment. |
| `[data-slot="date-range-picker-input"]` / `[data-slot="date-range-picker-trigger"]` | Editable text field and calendar trigger inside the shared shell. |
| `[data-slot="date-range-picker-overlay"]` | Popup panel. It is portaled to `body`, so scope theme tokens on an ancestor that can be copied to the overlay. |
| `[data-slot="date-range-picker-calendars"]` / `[data-slot="date-range-picker-calendar-panel"]` | Calendar collection and each visible month panel. Use these slots to customize single- and dual-calendar layouts. |
| `[data-slot="date-range-picker-header"]` / `[data-slot="date-range-picker-calendar-header"]` / `[data-slot="date-range-picker-nav-button"]` / `[data-slot="date-range-picker-period-button"]` | Header row and drill-down controls. |
| `[data-slot="date-range-picker-weekdays"]` / `[data-slot="date-range-picker-weekday"]` | Weekday label row in day view. |
| `[data-slot="date-range-picker-grid"]` | Shared grid container for day, month, and year panels. |
| `[data-slot="date-range-picker-cell"]` / `[data-slot="date-range-picker-month"]` / `[data-slot="date-range-picker-year"]` | Interactive day, month, and year cells. |

### State hooks

| State | Applied on | Use case |
| --- | --- | --- |
| `[data-open]` | Host, input shell, trigger, overlay | Open-state affordances and trigger emphasis. |
| `[data-view]` | Host | View-specific layout or animation changes across day, month, and year panels. |
| `[data-calendar-layout]` | Host, overlay | Resolved `single` or `dual` layout, including responsive mode after breakpoint evaluation. |
| `[data-range-boundary]` | Dual calendar panels and day grids | Identifies the fixed `start` and `end` editing surfaces. |
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
| `--tng-date-range-picker-radius` | Input shell and overlay radius. |
| `--tng-date-range-picker-field-height` | Combined input and trigger height. |
| `--tng-date-range-picker-overlay-padding` | Outer padding inside the popup panel. |
| `--tng-date-range-picker-z-overlay` | Portaled overlay stacking level. Falls back to `--tng-z-overlay`. |
| `--tng-date-range-picker-overlay-min-width` / `--tng-date-range-picker-overlay-max-width` | Headless popup width bounds. Wrapper inputs take precedence when supplied. |
| `--tng-date-range-picker-grid-gap` | Spacing between day, month, and year cells. |
| `--tng-date-range-picker-calendar-gap` | Spacing between the two visible month panels in dual layout. |
| `--tng-date-range-picker-day-cell-size` / `--tng-date-range-picker-picker-cell-size` | Base cell sizing for day and picker panels. |
| `--tng-date-range-picker-brand` / `--tng-date-range-picker-focus` | Selection, hover, and focus accents. |
| `--tng-date-range-picker-border` / `--tng-date-range-picker-surface` / `--tng-date-range-picker-fg` | Field chrome, popup surface, and foreground styling. |
| `--tng-date-range-picker-shadow` / `--tng-date-range-picker-focus-shadow` | Popup depth and focus ring treatment. |
| `--tng-date-range-picker-nav-size` | Header navigation button footprint. |

### Theme-aware wrapper shell

When you place the wrapper inside a utility shell, prefer semantic tokens so the surrounding surface stays aligned with theme and mode changes and the portaled overlay inherits the same visual language.

#### Theme-aware container

```css
.theme-aware-date-range-picker-shell {
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
.booking-date-range-picker {
  --tng-date-range-picker-radius: 0.9rem;
  --tng-date-range-picker-field-height: 2.8rem;
  --tng-date-range-picker-overlay-padding: 0.72rem;
  --tng-date-range-picker-grid-gap: clamp(0.12rem, 1.15%, 0.28rem);
  --tng-date-range-picker-day-cell-size: 2.15rem;
  --tng-date-range-picker-picker-cell-size: 2.25rem;
  --tng-date-range-picker-z-overlay: 80;
  --tng-date-range-picker-brand: var(--tng-semantic-accent-brand);
  --tng-date-range-picker-focus: var(--tng-semantic-focus-ring);
}
```
