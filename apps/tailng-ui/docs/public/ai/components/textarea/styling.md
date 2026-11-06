---
id: "components/textarea/styling"
title: "Textarea styling"
description: "Textarea styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["textarea","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/styling/textarea-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/styling/textarea-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/styling/textarea-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/textarea/styling"
componentGroup: "form"
symbols: ["TngTextareaComponent"]
selectors: ["tng-textarea"]
productId: "textarea"
section: "styling"
officialCatalog: true
generated: true
---

# Textarea styling

## Styling contract

`<tng-textarea>` is token-first. It renders its own internal textarea shell, so the main public styling contract is the semantic token set it consumes plus the host width you apply from your layout.

### Theme tokens

#### textarea.tokens.css

```css
.release-notes-surface {
  --tng-semantic-background-surface: #ffffff;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-muted: #94a3b8;
  --tng-semantic-focus-ring: color-mix(in srgb, #2563eb 18%, transparent);
  --tng-semantic-accent-danger: #dc2626;
}
```

### Host sizing

The component host defaults to `width: min(28rem, 100%)`. When you need the textarea to fill a wider card or form column, size the host from your own wrapper.

#### textarea.layout.css

```css
.release-notes-surface {
  display: grid;
  gap: 0.65rem;
  inline-size: min(100%, 42rem);
  margin-inline: auto;
}

.release-notes-surface tng-textarea {
  inline-size: 100%;
}
```

### State-driven theming

The component already handles focus, invalid, and disabled visuals internally. The most stable way to change those states is by adjusting the semantic tokens on the wrapper that contains the component.

#### textarea.states.css

```css
.release-notes-surface {
  --tng-semantic-background-surface: #ffffff;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-muted: #94a3b8;
  --tng-semantic-focus-ring: color-mix(in srgb, #2563eb 18%, transparent);
  --tng-semantic-accent-danger: #dc2626;
}

.release-notes-surface--invalid {
  --tng-semantic-border-strong: #dc2626;
  --tng-semantic-focus-ring: color-mix(in srgb, #dc2626 16%, transparent);
}

.release-notes-surface--quiet {
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-strong: #cbd5e1;
}
```
