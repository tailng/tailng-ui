---
id: "components/tabs/styling"
title: "Tabs styling"
description: "Tabs styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["tabs","navigation","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/styling/tabs-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/tabs/sections/styling/tabs-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/tabs/styling"
componentGroup: "navigation"
symbols: ["TngTabsComponent"]
selectors: ["tng-tabs"]
productId: "tabs"
section: "styling"
officialCatalog: true
generated: true
---

# Tabs styling

## Styling contract

The wrapper ships with a complete semantic-token-driven presentation for its shell, tablist, triggers, panels, orientations, and interaction states. Stable slot attributes and public CSS variables let you tune that presentation without depending on internal DOM structure.

### Stable hooks

| Hook | Values | Where |
| --- | --- | --- |
| `data-slot` | `tabs`, `tabs-shell`, `tabs-strip`, `tab-list`, `tab`, `tab-panel`, and scroll-button slots | Root wrapper and primitive parts. |
| `data-selected` | `true \| false` | Tab triggers. |
| `data-focused` | `true \| false` | Tab triggers. |
| `data-disabled` | `true \| false` | Root and tab triggers. |
| `data-active` | `true \| false` | Tab panels. |
| `data-orientation`, `data-activation` | orientation / activation mode | Root wrapper. |

### Default shell

The stock wrapper uses an unframed shell with contiguous tab headers and a bordered active panel. The first tab aligns with the panel edge, while the selected tab uses the panel surface and opens its adjacent border so the two areas read as one continuous region. Responsive vertical layout and integrated scroll controls are included without requiring component CSS.

### Component variables

Override sizing and visual decisions on `<tng-tabs>`. Common entry points include `--tng-tabs-radius`, `--tng-tabs-tab-height`, `--tng-tabs-tab-px`, `--tng-tabs-panel-padding`, `--tng-tabs-brand`, `--tng-tabs-tab-selected-bg`, and `--tng-tabs-focus-shadow`.

| Group | Public variables |
| --- | --- |
| Layout | `--tng-tabs-radius`, `--tng-tabs-shell-padding`, `--tng-tabs-gap`, `--tng-tabs-list-gap`, `--tng-tabs-list-padding`, `--tng-tabs-list-radius`, `--tng-tabs-tab-height`, `--tng-tabs-tab-px`, `--tng-tabs-tab-radius`, `--tng-tabs-panel-padding`, `--tng-tabs-panel-radius`, `--tng-tabs-vertical-list-width`, and `--tng-tabs-scroll-button-size` |
| Semantic colors | `--tng-tabs-bg`, `--tng-tabs-surface`, `--tng-tabs-canvas`, `--tng-tabs-fg`, `--tng-tabs-muted`, `--tng-tabs-border`, `--tng-tabs-border-strong`, `--tng-tabs-brand`, and `--tng-tabs-focus` |
| States and effects | `--tng-tabs-tab-hover-bg`, `--tng-tabs-tab-selected-bg`, `--tng-tabs-tab-selected-fg`, `--tng-tabs-tab-selected-border`, `--tng-tabs-panel-bg`, `--tng-tabs-shadow`, `--tng-tabs-selected-shadow`, `--tng-tabs-focus-shadow`, `--tng-tabs-disabled-opacity`, `--tng-tabs-duration`, and `--tng-tabs-ease` |

### Owner guidance

Prefer host-level variables for theme variants. Use slot selectors only when a variant needs a structural change such as an underline tablist; the low-specificity contract is designed to yield to scoped application selectors.

#### tabs.contract.css

```css
.project-tabs {
  --tng-tabs-radius: 1.25rem;
  --tng-tabs-tab-height: 2.75rem;
  --tng-tabs-tab-px: 1.1rem;
  --tng-tabs-panel-padding: 1.25rem;
  --tng-tabs-brand: var(--project-accent);
}
```
