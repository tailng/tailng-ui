---
id: "components/avatar/api"
title: "Avatar API"
description: "Avatar API reference for Angular applications."
category: "components"
status: "stable"
tags: ["avatar","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/avatar/tng-avatar.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/api/avatar-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/api/avatar-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/api/avatar-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/avatar/api"
componentGroup: "utility"
symbols: ["TngAvatarComponent"]
selectors: ["tng-avatar"]
productId: "avatar"
section: "api"
officialCatalog: true
generated: true
---

# Avatar API

Identity surfaces with fallback handling, shape, and size variants.

## API reference

`<tng-avatar>` wraps the headless avatar slots and owns the common avatar lifecycle: image load/error handling, fallback text generation, and a minimum size/shape shell.

### Wrapper component

The wrapper renders a `span.tng-avatar` host, an image slot, and a fallback slot. It automatically toggles which slot is visible based on `src` presence and image load success.

### Wrapper inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string \| null` | `null` | Image source URL. Empty/null resolves to fallback. |
| `fallback` | `string \| null` | `null` | Fallback source text converted into initials when possible. |
| `alt` | `string \| null` | `'Avatar'` | Alt text passed to image node when present. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Controls avatar frame geometry. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls host dimensions and fallback typography scale. |

### Primitive foundation

`<tng-avatar>` is built on the headless `tngAvatar`, `tngAvatarImage`, and `tngAvatarFallback` directives. Use the dedicated headless Avatar page when you need fully custom sizing contracts, nonstandard markup, or owner-managed fallback visibility.

## Source-derived public Angular API

### `TngAvatarComponent` — `tng-avatar`

- Inputs: `alt`, `fallback`, `shape`, `size`, `src`
