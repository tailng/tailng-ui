---
id: "components/copybutton/styling"
title: "CopyButton styling"
description: "CopyButton styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["copybutton","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/copy-button/tng-copy-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/styling/copybutton-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/styling/copybutton-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/styling/copybutton-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/copybutton/styling"
componentGroup: "utility"
symbols: ["TngCopyButtonComponent"]
selectors: ["tng-copy-button"]
productId: "copybutton"
section: "styling"
officialCatalog: true
generated: true
---

# CopyButton styling

## Styling contract

The wrapper ships with a minimum button shell. Customize the surrounding layout, projected icons, and state treatments by targeting the rendered button’s stable attributes.

### Wrapper slot hooks

### Wrapper state attributes

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-appearance` | `outline \| solid \| ghost` | Switches the default wrapper treatment. |
| `data-size` | `sm \| md` | Adjusts minimum height and padding. |
| `data-state` | `idle \| copying \| copied \| error` | Drives copied and error emphasis after a copy attempt. |

### Owner guidance

Target the rendered button inside `tng-copy-button` when you need custom stateful styling. Keep the live region hidden, and prefer wrapper-level containers for layout and spacing rather than overriding the component’s internal flex alignment.

#### copybutton.contract.css

```css
tng-copy-button > .tng-copy-button[data-appearance="solid"] {
  background: var(--tng-semantic-accent-brand);
  color: var(--tng-color-white);
}

tng-copy-button > .tng-copy-button[data-state="copied"] {
  background: var(--tng-semantic-accent-success);
  border-color: transparent;
}

tng-copy-button > .tng-copy-button[data-state="error"] {
  background: var(--tng-semantic-accent-danger);
  border-color: transparent;
}
```
