---
id: "components/command-palette/styling"
title: "Command Palette styling"
description: "Command Palette styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["command-palette","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/command-palette/tng-command-palette.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/styling/command-palette-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/styling/command-palette-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/command-palette/sections/styling/command-palette-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/command-palette/styling"
componentGroup: "utility"
symbols: ["TngCommandPaletteComponent"]
selectors: ["tng-command-palette"]
productId: "command-palette"
section: "styling"
officialCatalog: true
generated: true
---

# Command Palette styling

## Styling contract

Style the palette through its host tokens, stable classes, and listbox state attributes. The component owns the modal shell while option content can be fully templated.

### Layout tokens

| Token | Default | Usage |
| --- | --- | --- |
| `--tng-command-palette-width` | `min(40rem, calc(100vw - 2rem))` | Controls modal panel width. |
| `--tng-command-palette-max-height` | `min(35rem, calc(100vh - 4rem))` | Constrains the full panel. |
| `--tng-command-palette-list-max-height` | `min(22rem, calc(100vh - 15rem))` | Constrains the scrolling result area. |

### State hooks

### Inner component styles

Add a class on `<tng-command-palette>` and target the stable inner classes to customize backdrop, panel shell, search row, options, and footer without changing component behavior.

### Template guidance

Combine host tokens for layout/stacking with scoped inner-class selectors for shell details. Prefer templates for app-specific row content and metadata layout.

#### command-palette.contract.css

```css
.docs-command-palette {
  --tng-command-palette-width: min(44rem, calc(100vw - 2rem));
  --tng-command-palette-max-height: min(38rem, calc(100vh - 4rem));
  --tng-command-palette-list-max-height: 24rem;
  --tng-z-overlay: 1200;
}

.docs-command-palette .tng-command-palette-backdrop {
  background: color-mix(in srgb, #020617 55%, transparent);
}

.docs-command-palette .tng-command-palette-panel {
  border-radius: 1rem;
  box-shadow: 0 2rem 4rem color-mix(in srgb, #000 35%, transparent);
}

.docs-command-palette .tng-command-palette-search {
  padding: 1rem;
}

.docs-command-palette .tng-command-palette-option[data-active] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 40%, transparent);
}

.docs-command-palette .tng-command-palette-footer {
  font-size: 0.8rem;
}
```
