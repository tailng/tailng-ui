---
id: "components/toolbar/examples"
title: "Toolbar examples"
description: "Toolbar examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["toolbar","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/toolbar/tng-toolbar.component.ts"]
componentGroup: "navigation"
symbols: ["TngToolbarComponent"]
selectors: ["tng-toolbar"]
productId: "toolbar"
section: "examples"
officialCatalog: false
generated: true
---

# Toolbar examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngToolbarComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngToolbarComponent],
  template: `<tng-toolbar />`,
})
export class ToolbarExample {}
```
