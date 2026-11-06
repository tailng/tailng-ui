---
id: "components/button-toggle/styling"
title: "Button Toggle styling"
description: "Button Toggle styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["button-toggle","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle-group.component.ts","libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/styling/button-toggle-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/styling/button-toggle-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/styling/button-toggle-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/button-toggle/styling"
componentGroup: "form"
symbols: ["TngButtonToggleComponent","TngButtonToggleGroupComponent"]
selectors: ["tng-button-toggle","tng-button-toggle-group"]
productId: "button-toggle"
section: "styling"
officialCatalog: true
generated: true
---

# Button Toggle styling

## Styling contract

At the component layer, the supported styling surface is host-level semantic token overrides on `<tng-button-toggle-group>` and `<tng-button-toggle>` plus the shell classes your page owns around them.

| Contract | Apply on | Purpose |
| --- | --- | --- |
| `--tng-semantic-background-surface` | `<tng-button-toggle>` host | Idle background for each toggle item. |
| `--tng-semantic-background-muted` | `<tng-button-toggle>` host | Hover background when the component renders its default shell. |
| `--tng-semantic-border-subtle` | Group or item host | Border color for the segmented container and individual toggles. |
| `--tng-semantic-accent-brand` | `<tng-button-toggle>` host | Selected-state fill and border color. |
| `--tng-semantic-foreground-primary` | `<tng-button-toggle>` host | Projected label color for the idle state. |
| `--tng-color-white` | `<tng-button-toggle>` host | Selected-state foreground color when you need standalone copy-paste safety. |
| Shell classes | App-owned container | Cards, headings, layout spacing, helper text, and any surrounding chrome. |

If you need selector-level access to `data-selected` or `data-focused` on the actual button element, use the headless or ownable surfaces instead of depending on the internal component template.

### Release target

Use host-level semantic tokens when one action needs stronger emphasis.

### Release target

Use host-level semantic tokens when one action needs stronger emphasis.
