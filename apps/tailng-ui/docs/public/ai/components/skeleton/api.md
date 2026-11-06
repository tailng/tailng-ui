---
id: "components/skeleton/api"
title: "Skeleton API"
description: "Skeleton API reference for Angular applications."
category: "components"
status: "stable"
tags: ["skeleton","feedback","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/skeleton/tng-skeleton.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/api/skeleton-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/api/skeleton-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/api/skeleton-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/skeleton/api"
componentGroup: "feedback"
symbols: ["TngSkeletonComponent"]
selectors: ["tng-skeleton"]
productId: "skeleton"
section: "api"
officialCatalog: true
generated: true
---

# Skeleton API

Decorative placeholder blocks for loading layouts and content scaffolding.

## API reference

Skeleton exposes CSS size inputs for block dimensions, toggles for shimmer motion and corner radius, and optional waiting messages for longer loading states.

### Wrapper component

`tng-skeleton` renders the loading block for you, applies the default shimmer shell, and forwards the primitive state hooks underneath.

#### Wrapper usage

```html
<tng-skeleton width="75%" height="1rem"></tng-skeleton>
<tng-skeleton width="100%" height="7rem" [rounded]="false"></tng-skeleton>
<tng-skeleton width="12rem" height="2.25rem" [animated]="false"></tng-skeleton>
<tng-skeleton width="100%" height="1.1rem" message="Preparing your dashboard..."></tng-skeleton>
```

### Sizing and state inputs

Use CSS size strings for layout and boolean toggles to adjust the default shell without replacing the wrapper.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `width` | `string` | `'100%'` | Applied inline to the rendered block. Empty strings fall back to `100%`. |
| `height` | `string` | `'1rem'` | Applied inline to the rendered block. Empty strings fall back to `1rem`. |
| `animated` | `boolean` | `true` | Toggles the shimmer motion hook through `data-animated`. |
| `rounded` | `boolean` | `true` | Toggles the wrapper radius hook through `data-rounded`. |
| `message` | `string \| null \| undefined` | `undefined` | Displays a static status message. Takes precedence over projected content. |
| `messages` | `readonly string[]` | `[]` | Provides the random message pool when auto mode or `random` mode is active. |
| `messageMode` | `'none' \| 'static' \| 'random'` | `undefined` | When omitted, static messages render from `message` or projected content, and arrays render randomly. |
| `messageStrategy` | `'once' \| 'interval'` | `'once'` | Controls whether a random message is chosen once or refreshed on an interval. |
| `messageInterval` | `number` | `5000` | Interval duration in milliseconds. Invalid or non-positive values fall back to `5000`. |

### Primitive foundation

Under the hood, the wrapper uses `tngSkeleton` for the decorative semantics and slot and state attributes. Reach for the headless page when you want to own the element markup directly.

#### Primitive foundation

```html
<div tngSkeleton class="skeleton-line"></div>
<div tngSkeleton [animated]="false" [rounded]="false" class="skeleton-block"></div>
```

## Source-derived public Angular API

### `TngSkeletonComponent` — `tng-skeleton`

- Inputs: `animated`, `height`, `message`, `messageInterval`, `messageMode`, `messages`, `messageStrategy`, `rounded`, `width`
