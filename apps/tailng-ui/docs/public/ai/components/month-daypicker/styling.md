---
id: "components/month-daypicker/styling"
title: "Month Daypicker styling"
description: "Month Daypicker styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["month-daypicker","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/month-daypicker/tng-month-daypicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/styling/month-daypicker-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/styling/month-daypicker-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/month-daypicker/sections/styling/month-daypicker-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/month-daypicker/styling"
componentGroup: "form"
symbols: ["TngMonthDaypickerComponent"]
selectors: ["tng-month-daypicker"]
productId: "month-daypicker"
section: "styling"
officialCatalog: true
generated: true
---

# Month Daypicker styling

## Styling contract

`tng-month-daypicker` delegates all rendering to the shared datepicker surface. Style against the exported data attributes and CSS custom properties rather than internal DOM structure or hard-coded color values.

### Slot selectors

| Selector | Purpose |
| --- | --- |
| `[data-slot="datepicker"]` | Root contract for field-level layout tokens, host state hooks, and shared semantic colors. |
| `[data-slot="datepicker-field"]` | Field wrapper containing the input shell and overlay anchor. |
| `[data-slot="datepicker-input-shell"]` | Combined input and trigger chrome. Apply border, invalid, open, and focus treatment here. |
| `[data-slot="datepicker-input"]` / `[data-slot="datepicker-trigger"]` | Editable text field and calendar icon trigger inside the shared shell. |
| `[data-slot="datepicker-overlay"]` | Popup panel portaled to `body`. Scope theme tokens on an ancestor that can be mirrored to the overlay. |
| `[data-slot="datepicker-header"]` / `[data-slot="datepicker-nav-button"]` / `[data-slot="datepicker-period-button"]` | Header row and month/day navigation controls. |
| `[data-slot="datepicker-grid"]` | Shared grid container for month and day panels. |
| `[data-slot="datepicker-cell"]` / `[data-slot="datepicker-month"]` | Interactive day and month cells. |

### State hooks

| State | Applied on | Use case |
| --- | --- | --- |
| `[data-open]` | Host, input shell, trigger, overlay | Open-state affordances and trigger emphasis. |
| `[data-view]` | Host | View-specific layout changes across day and month panels. |
| `[data-invalid]` | Input shell | Manual input parse failure or out-of-bounds treatment. |
| `[data-disabled]` | Host, day cells, month cells | Disabled field or out-of-range date visuals. |
| `[data-selected]` | Day and month cells | Committed selection state. |
| `[data-active]` | Day and month cells | Current roving keyboard target. |
| `[data-focus-visible]` | Day and month cells | Keyboard focus ring treatment independent of selected state. |
| `[data-in-month]` | Day cells | Distinguishes outside-month days from the visible month. |
| `[data-placement]` | Overlay | Responds to flipped popup placement above or below the field. |

### Common custom properties

All tokens use the `--tng-datepicker-` prefix since `tng-month-daypicker` shares the datepicker component surface.

| Token | Typical usage |
| --- | --- |
| `--tng-datepicker-radius` | Input shell and overlay border radius. |
| `--tng-datepicker-field-height` | Combined input and trigger height. |
| `--tng-datepicker-overlay-padding` | Outer padding inside the calendar popup. |
| `--tng-datepicker-grid-gap` | Spacing between day and month cells. |
| `--tng-datepicker-day-cell-size` / `--tng-datepicker-picker-cell-size` | Base cell sizing for day and month panels. |
| `--tng-datepicker-brand` / `--tng-datepicker-focus` | Selection, hover, and focus ring accents. |
| `--tng-datepicker-border` / `--tng-datepicker-surface` / `--tng-datepicker-fg` | Field chrome, popup surface, and foreground styling. |
| `--tng-datepicker-shadow` | Popup depth shadow. |

### Theme-aware wrapper shell

Prefer semantic tokens when placing the picker inside a utility shell so the surface stays aligned with theme and mode changes.

#### Theme-aware container

```css
.theme-aware-month-daypicker-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  color: var(--tng-semantic-foreground-primary);
  background: var(--tng-semantic-background-surface);
}
```

### Compact override example

Override datepicker tokens on a scoped wrapper class to achieve a denser or roomier layout without touching global styles.

#### Scoped token overrides

```css
.compact-month-daypicker {
  --tng-datepicker-radius: 0.7rem;
  --tng-datepicker-field-height: 2.6rem;
  --tng-datepicker-overlay-padding: 0.6rem;
  --tng-datepicker-grid-gap: 0.2rem;
  --tng-datepicker-picker-cell-size: 2.1rem;
  --tng-datepicker-brand: var(--tng-semantic-accent-brand);
  --tng-datepicker-focus: var(--tng-semantic-focus-ring);
}
```
