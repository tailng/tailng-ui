---
id: "components/tag/styling"
title: "Tag styling"
description: "Tag styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["tag","utility","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tag/tng-tag.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/styling/tag-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/styling/tag-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/styling/tag-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/tag/styling"
componentGroup: "utility"
symbols: ["TngTagComponent"]
selectors: ["tng-tag"]
productId: "tag"
section: "styling"
officialCatalog: true
generated: true
---

# Tag styling

## Styling contract

Tag exposes stable slot and state hooks so teams can theme headless and wrapper usage without relying on brittle DOM selectors.

### Slot and state hooks

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-slot` | `tag \| tag-icon \| tag-close` | Stable slot selectors for root/icon/close parts. |
| `data-disabled` | `present / absent` | Applied when tag removal should be disabled. |
| `data-removable` | `present / absent` | Applied on root when removable mode is enabled. |
| `data-focused` | `present / absent` | Applied on close trigger while focused. |

### Wrapper data hooks

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-tone` | `neutral \| info \| success \| warning \| danger` | Semantic color system. |
| `data-appearance` | `soft \| solid \| outline` | Variant style mode. |
| `data-shape` | `pill \| rounded` | Corner style mode. |
| `data-size` | `sm \| md` | Tag sizing preset. |

### Example contract overrides

#### tag.contract.css

```css
.tag-chip[data-slot="tag"] {
  border-radius: 9999px;
  display: inline-flex;
  gap: 0.35rem;
}

.tng-tag[data-tone="success"][data-appearance="soft"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);
  color: var(--tng-semantic-accent-success);
}

.tng-tag[data-appearance="outline"] {
  background: var(--tng-semantic-background-base);
  border: 1px solid var(--tng-semantic-border-strong);
}

.tng-tag [data-slot="tag-close"] {
  border-radius: 9999px;
  inline-size: 1rem;
  block-size: 1rem;
}

.tng-tag[data-disabled] {
  opacity: 0.62;
}
```
