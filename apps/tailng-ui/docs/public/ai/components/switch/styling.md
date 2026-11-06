---
id: "components/switch/styling"
title: "Switch styling"
description: "Switch styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["switch","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/styling/switch-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/styling/switch-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/styling/switch-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/switch/styling"
componentGroup: "form"
symbols: ["TngSwitchComponent"]
selectors: ["tng-switch"]
productId: "switch"
section: "styling"
officialCatalog: true
generated: true
---

# Switch styling

## Styling contract

The supported component contract is host-level token overrides on `tng-switch` plus any wrapper layout you apply around it. If you need to style the internal track or thumb markup directly, switch to the headless or ownable surfaces instead.

| Token | Typical use |
| --- | --- |
| `--tng-semantic-accent-brand` | Checked track background. |
| `--tng-semantic-border-subtle` | Unchecked track background. |
| `--tng-semantic-focus-ring` | Focus-visible ring around the visible switch button. |
| `--tng-semantic-foreground-primary` | Projected label text color. |
| `--tng-color-white` | Thumb fill when you need a different neutral token. |

#### switch.tokens.css

```css
tng-switch {
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.25);
  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);
}
```

### Release gate

Require human sign-off before publish.

### Release gate

Require human sign-off before publish.
