---
id: "components/tag/examples"
title: "Tag examples"
description: "Tag examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["tag","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/tag/tng-tag.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/examples/tag-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/examples/tag-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/tag/sections/examples/tag-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/tag/examples"
componentGroup: "utility"
symbols: ["TngTagComponent"]
selectors: ["tng-tag"]
productId: "tag"
section: "examples"
officialCatalog: true
generated: true
---

# Tag examples

## Examples

Common tag patterns rendered through the wrapper component with Plain-CSS and Tailwind styling.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngTagComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTagComponent],
  template: `<tng-tag />`,
})
export class TagExample {}
```
