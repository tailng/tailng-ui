---
id: "components/bottom-sheet/examples"
title: "Bottom Sheet examples"
description: "Bottom Sheet examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["bottom-sheet","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/bottom-sheet/tng-bottom-sheet.component.ts"]
componentGroup: "layout"
symbols: ["TngBottomSheetComponent"]
selectors: ["tng-bottom-sheet"]
productId: "bottom-sheet"
section: "examples"
officialCatalog: false
generated: true
---

# Bottom Sheet examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngBottomSheetComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngBottomSheetComponent],
  template: `<tng-bottom-sheet />`,
})
export class BottomSheetExample {}
```
