---
id: "components/form-field/examples"
title: "Form Field examples"
description: "Form Field examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["form-field","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adapter.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adornment.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-message.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.component.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.control.ts","apps/tailng-ui/docs/src/app/pages/components/form/form-field/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/form-field/sections/examples/form-field-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/form-field/sections/examples/form-field-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/form-field/sections/examples/form-field-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/form-field/examples"
componentGroup: "form"
symbols: ["TngFormFieldComponent"]
selectors: ["tng-form-field"]
productId: "form-field"
section: "examples"
officialCatalog: true
generated: true
---

# Form Field examples

## Examples

Complete `tng-form-field` patterns that pair labels, controls, hints, and errors with copy-paste ready Plain-CSS and Tailwind CSS variants.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngFormFieldComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngFormFieldComponent],
  template: `<tng-form-field />`,
})
export class FormFieldExample {}
```
