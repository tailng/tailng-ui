---
id: "components/toggle/styling"
title: "Toggle styling"
description: "Toggle styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["toggle","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/toggle/tng-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/styling/toggle-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/styling/toggle-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/styling/toggle-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/toggle/styling"
componentGroup: "form"
symbols: ["TngToggleComponent"]
selectors: ["tng-toggle"]
productId: "toggle"
section: "styling"
officialCatalog: true
generated: true
---

# Toggle styling

## Styling contract

Style the component layer by overriding semantic tokens on the toggle, the group, or an ancestor shell. Avoid depending on internal wrapper DOM beyond the documented state hooks.

| Surface | Recommended contract | Why it is safe |
| --- | --- | --- |
| `tng-toggle` | Set semantic tokens such as `--tng-semantic-accent-brand` and `--tng-semantic-background-surface`. | The rendered internal button inherits those values without exposing private DOM in your app styles. |
| `tng-toggle-group` | Adjust layout, spacing, and supporting shell styles on the host element. | The group host is public, and selection logic stays inside the wrapper. |
| Ancestor shell | Define a token set on a surrounding card to theme several toggles together. | CSS custom properties inherit cleanly into every nested toggle. |

| Token | Typical use |
| --- | --- |
| `--tng-semantic-accent-brand` | Selected toggle background and border. |
| `--tng-semantic-background-surface` | Idle toggle surface. |
| `--tng-semantic-border-strong` | Idle toggle border. |
| `--tng-semantic-foreground-primary` | Icon or glyph color inside the toggle. |
| `--tng-semantic-focus-ring` | Focus-visible ring color. |

#### Host-level token overrides

```css
.release-toggle-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  background: var(--tng-semantic-background-surface);
}
```

### Release checklist

Use token overrides on the wrapper shell so the component keeps its internal DOM private.

### Release checklist

Use token overrides on the wrapper shell so the component keeps its internal DOM private.
