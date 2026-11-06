---
id: "components/badge/examples"
title: "Badge examples"
description: "Badge examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["badge","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/badge/tng-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/examples/badge-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/examples/badge-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/badge/sections/examples/badge-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/badge/examples"
componentGroup: "utility"
symbols: ["TngBadgeComponent"]
selectors: ["[tngBadge]"]
productId: "badge"
section: "examples"
officialCatalog: true
generated: true
---

# Badge examples

## Examples

Production badge scenarios rendered through the components package with Plain-CSS and Tailwind host styling layers.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngBadgeComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngBadgeComponent],
  template: `<div tngBadge></div>`,
})
export class BadgeExample {}
```
