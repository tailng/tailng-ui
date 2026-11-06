---
id: "components/codeblock/styling"
title: "Codeblock styling"
description: "Codeblock styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["codeblock","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/code-block/highlighting.ts","libs/tailng-ui/components/src/lib/utility/code-block/tng-code-block.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/styling/codeblock-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/styling/codeblock-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/codeblock/sections/styling/codeblock-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/codeblock/styling"
componentGroup: "utility"
symbols: ["TngCodeBlockComponent"]
selectors: ["tng-code-block"]
productId: "codeblock"
section: "styling"
officialCatalog: true
generated: true
---

# Codeblock styling

## Styling contract

Style the wrapper through its public slot and state hooks instead of depending on internal DOM details.

### Wrapper slot hooks

The wrapper forwards the primitive slot contract and adds documented owner-facing parts such as line numbers, rendered lines, captions, and the copy button.

#### Wrapper slot hooks

```css
[data-slot="code-block"] {
  --tng-code-block-radius: 0.9rem;
  --tng-code-block-border: color-mix(in srgb, var(--tng-semantic-border-subtle) 75%, #fff);
}

[data-slot="line-numbers"] {
  min-width: 3.25rem;
}

[data-slot="copy-button"] {
  border-radius: 999px;
}
```

### Wrapper state attributes

### Owner guidance

Set your design tokens on the wrapper slots first, then layer any token-color or line-focus treatment in owner CSS.

#### Owner CSS

```css
.docs-codeblock [data-slot="line"].tng-code-block__line--highlight {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);
}

.docs-codeblock [data-slot="code"] {
  font-family: 'IBM Plex Mono', 'Fira Code', monospace;
}
```
