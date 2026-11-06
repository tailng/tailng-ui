---
id: "components/textarea/examples"
title: "Textarea examples"
description: "Textarea examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["textarea","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/examples/textarea-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/examples/textarea-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/examples/textarea-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/textarea/examples"
componentGroup: "form"
symbols: ["TngTextareaComponent"]
selectors: ["tng-textarea"]
productId: "textarea"
section: "examples"
officialCatalog: true
generated: true
---

# Textarea examples

## Examples

Copy-ready multiline input patterns rendered with the same component behavior in plain CSS and Tailwind shells.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngTextareaComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngTextareaComponent],
  template: `<tng-textarea />`,
})
export class TextareaExample {}
```
