---
id: "components/skeleton/styling"
title: "Skeleton styling"
description: "Skeleton styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["skeleton","feedback","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/skeleton/tng-skeleton.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/styling/skeleton-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/styling/skeleton-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/styling/skeleton-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/skeleton/styling"
componentGroup: "feedback"
symbols: ["TngSkeletonComponent"]
selectors: ["tng-skeleton"]
productId: "skeleton"
section: "styling"
officialCatalog: true
generated: true
---

# Skeleton styling

## Styling contract

Skeleton keeps the wrapper surface intentionally small. You can restyle shimmer, radius, and motion through the same public hooks that the primitive exposes.

### Wrapper slot hooks

The wrapper forwards the primitive contract directly, so style `[data-slot="skeleton"]` and branch from `data-rounded` and `data-animated`.

#### Slot contract

```css
[data-slot="skeleton"] {
  background: linear-gradient(
    90deg,
    var(--tng-semantic-foreground-secondary) 0%,
    var(--tng-semantic-border-subtle) 50%,
    var(--tng-semantic-foreground-secondary) 100%
  );
  background-size: 220% 100%;
}

[data-slot="skeleton"][data-rounded="true"] {
  border-radius: 0.6rem;
}

[data-slot="skeleton"][data-rounded="false"] {
  border-radius: 0;
}

[data-slot="skeleton"][data-animated="true"] {
  animation: tng-skeleton-shimmer 1.3s linear infinite;
}
```

### Default shell

The wrapper only adds a block-level host and the minimum shimmer shell. Width and height stay owner-controlled through the component inputs.

#### Wrapper defaults

```css
:host {
  display: block;
}

.tng-skeleton {
  background-size: 220% 100%;
}

/* width and height are applied inline from the wrapper inputs. */
```

### Owner guidance
