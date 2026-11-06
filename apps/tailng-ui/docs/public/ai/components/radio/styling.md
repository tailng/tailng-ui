---
id: "components/radio/styling"
title: "Radio styling"
description: "Radio styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["radio","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/radio/tng-radio.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/styling/radio-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/styling/radio-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/styling/radio-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/radio/styling"
componentGroup: "form"
symbols: ["TngRadioComponent"]
selectors: ["tng-radio"]
productId: "radio"
section: "styling"
officialCatalog: true
generated: true
---

# Radio styling

## Styling contract

At the component layer, the supported styling surface is semantic-token overrides on the `<tng-radio>` host plus whatever shell your page owns around it.

| Contract | Apply on | Purpose |
| --- | --- | --- |
| `--tng-semantic-accent-brand` | `<tng-radio>` host | Checked accent color for the native radio control. |
| `--tng-semantic-accent-danger` | `<tng-radio>` host | Invalid outline emphasis when `[invalid]` is present. |
| `--tng-semantic-focus-ring` | `<tng-radio>` host | Focus-visible ring color around the native control. |
| `--tng-semantic-foreground-primary` | `<tng-radio>` host | Projected label text color. |
| Wrapper shell classes | App-owned container | Cards, spacing, headings, helper text, and layout structure. |

If you need to style the native input directly with state selectors such as `data-state` or `data-focus-visible`, use the headless or ownable surfaces instead of depending on internal component markup.

### Release target

### Release target
