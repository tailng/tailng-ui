---
id: "components/range-slider/examples"
title: "Range Slider examples"
description: "Range Slider examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["range-slider","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.component.ts","libs/tailng-ui/components/src/lib/form/range-slider/tng-range-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/sections/examples/range-slider-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/range-slider/sections/examples/range-slider-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/range-slider/examples"
componentGroup: "form"
symbols: ["TngRangeSliderComponent"]
selectors: ["tng-range-slider"]
productId: "range-slider"
section: "examples"
officialCatalog: true
generated: true
---

# Range Slider examples

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngRangeSliderComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngRangeSliderComponent],
  template: `<tng-range-slider />`,
})
export class RangeSliderExample {}
```
