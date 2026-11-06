---
id: "components/button/styling"
title: "Button styling"
description: "Button styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["button","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/button/tng-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/styling/button-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/styling/button-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/styling/button-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/button/styling"
componentGroup: "utility"
symbols: ["TngButtonComponent"]
selectors: ["tng-button"]
productId: "button"
section: "styling"
officialCatalog: true
generated: true
---

# Button styling

## Styling contract

Style the wrapper through the stable attributes on the rendered button host rather than relying on page-level utility classes or brittle DOM assumptions.

### Wrapper state hooks

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-appearance` | `solid \| outline \| ghost` | Selects visual button style. |
| `data-tone` | `primary \| neutral \| success \| danger` | Maps semantic color intent. |
| `data-size` | `sm \| md \| lg` | Controls component dimensions. |
| `data-disabled` | `""` when disabled | Use for styling disabled affordance. |

### Wrapper shell

### Layout tokens

Use custom properties on the `tng-button` host to control width and content alignment without deep selectors or global overrides.

| Token | Default | Usage |
| --- | --- | --- |
| `--tng-button-width` | `auto` | Sets explicit inline width for the rendered button. |
| `--tng-button-min-width` | `auto` | Provides minimum width without affecting host layout helpers. |
| `--tng-button-max-width` | `none` | Constrains button growth in flexible rows. |
| `--tng-button-justify` | `center` | Controls content alignment inside the internal button. |
| `--tng-button-gap` | `0.5rem` | Adjusts spacing between projected icon and label. |
| `--tng-button-padding-inline-sm/md/lg` | `0.75rem / 1rem / 1.25rem` | Size-aware horizontal padding tokens. |
| `--tng-button-padding-block` | `0` | Optional vertical padding shared across sizes. |

### Owner guidance

Override the wrapper by targeting the internal button under `tng-button`. For fully custom hosts or anchor-button patterns, move to the headless `Button` page and use `tngPress` directly.

#### button.contract.css

```css
.docs-search-trigger-button {
  --tng-button-min-width: 10rem;
  --tng-button-width: 100%;
  --tng-button-justify: space-between;
}

.docs-search-trigger-button > .tng-button[data-size="sm"] {
  --tng-button-padding-inline-sm: 0.875rem;
}

tng-button > .tng-button[data-tone="danger"][data-appearance="solid"] {
  background: var(--tng-semantic-accent-danger);
  color: var(--tng-color-white);
}

tng-button > .tng-button[data-disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
```
