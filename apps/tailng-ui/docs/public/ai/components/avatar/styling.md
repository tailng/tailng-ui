---
id: "components/avatar/styling"
title: "Avatar styling"
description: "Avatar styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["avatar","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/avatar/tng-avatar.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/styling/avatar-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/styling/avatar-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/styling/avatar-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/avatar/styling"
componentGroup: "utility"
symbols: ["TngAvatarComponent"]
selectors: ["tng-avatar"]
productId: "avatar"
section: "styling"
officialCatalog: true
generated: true
---

# Avatar styling

## Styling contract

Style the wrapper through the stable attributes on the rendered avatar shell and slot nodes, rather than depending on extra local classes on `<tng-avatar>` itself.

### Wrapper state hooks

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-shape` | `circle \| square` | Controls shell geometry on the internal `.tng-avatar` element. |
| `data-size` | `sm \| md \| lg` | Controls wrapper dimensions and fallback text scale. |
| `data-slot` | `avatar \| avatar-image \| avatar-fallback` | Targets shell, image, and fallback nodes. |
| `hidden` | Applied to image or fallback | Reflects which visual layer is currently active. |

### Wrapper shell

### Owner guidance

Override the wrapper by targeting the internal shell under `tng-avatar`. If you need custom host structure or owner-managed fallback visibility, move to the headless Avatar page.

#### avatar.contract.css

```css
tng-avatar > .tng-avatar[data-size="lg"] {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);
}

tng-avatar > .tng-avatar[data-shape="square"] {
  border-radius: 1rem;
}

tng-avatar > .tng-avatar [data-slot="avatar-fallback"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);
}
```
