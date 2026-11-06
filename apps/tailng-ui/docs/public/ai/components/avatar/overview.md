---
id: "components/avatar/overview"
title: "Avatar component"
description: "Identity surfaces with fallback handling, shape, and size variants."
category: "components"
status: "stable"
tags: ["avatar","utility","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/avatar/tng-avatar.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/avatar/overview"
componentGroup: "utility"
symbols: ["TngAvatarComponent"]
selectors: ["tng-avatar"]
productId: "avatar"
section: "overview"
officialCatalog: true
generated: true
---

# Avatar component

Identity surfaces with fallback handling, shape, and size variants.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngAvatarComponent],
  template: `<tng-avatar />`,
})
export class AvatarAgentExample {}
```

## Component family

- `TngAvatarComponent` — selector `tng-avatar`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/utility/avatar/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/avatar/api.md)
- [Styling](https://tailng.dev/ai/components/avatar/styling.md)
- [Examples](https://tailng.dev/ai/components/avatar/examples.md)
