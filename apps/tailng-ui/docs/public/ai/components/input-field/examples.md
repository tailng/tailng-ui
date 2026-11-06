---
id: "components/input-field/examples"
title: "Input Field examples"
description: "Input Field examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["input-field","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-field/tng-input-field.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/examples/input-field-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/examples/input-field-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/examples/input-field-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-field/examples"
componentGroup: "form"
symbols: ["TngInputFieldComponent"]
selectors: ["tng-input-field"]
productId: "input-field"
section: "examples"
officialCatalog: true
generated: true
---

# Input Field examples

## Examples

Common `tng-input-field` patterns with explicit Plain-CSS and Tailwind CSS shell examples.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngInputFieldComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngInputFieldComponent],
  template: `<tng-input-field />`,
})
export class InputFieldExample {}
```
