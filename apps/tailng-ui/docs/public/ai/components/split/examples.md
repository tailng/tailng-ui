---
id: "components/split/examples"
title: "Split Layout examples"
description: "Split Layout examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["split","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.engine.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split-layout.types.ts","libs/tailng-ui/components/src/lib/layout/split/tng-split.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/examples/split-examples-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/examples/split-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/examples/split-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/split/sections/examples/split-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/split/examples"
componentGroup: "layout"
symbols: ["TngSplitGroupComponent","TngSplitHandleComponent","TngSplitPaneDirective"]
selectors: ["tng-split-group","tng-split-handle","[tngSplitPane]"]
productId: "split"
section: "examples"
officialCatalog: true
generated: true
---

# Split Layout examples

## Examples

Production split-layout patterns with copy-ready Plain CSS and Tailwind implementations.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngSplitGroupComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngSplitGroupComponent],
  template: `<tng-split-group />`,
})
export class SplitExample {}
```
