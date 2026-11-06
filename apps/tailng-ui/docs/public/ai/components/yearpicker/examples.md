---
id: "components/yearpicker/examples"
title: "Yearpicker examples"
description: "Yearpicker examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["yearpicker","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/yearpicker/tng-yearpicker.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/examples/yearpicker-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/examples/yearpicker-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/yearpicker/sections/examples/yearpicker-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/yearpicker/examples"
componentGroup: "form"
symbols: ["TngYearpickerComponent"]
selectors: ["tng-yearpicker"]
productId: "yearpicker"
section: "examples"
officialCatalog: true
generated: true
---

# Yearpicker examples

## Examples

These examples show the styled wrapper in its default plain-CSS presentation and in a theme-aware Tailwind shell across common use cases.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngYearpickerComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngYearpickerComponent],
  template: `<tng-yearpicker />`,
})
export class YearpickerExample {}
```
