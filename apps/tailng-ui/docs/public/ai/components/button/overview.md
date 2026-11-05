---
id: components/button/overview
title: Button component
description: Import and use the styled TailNG button component.
category: components
status: stable
tags: ["button", "utility", "action"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/button/tng-button.component.ts", "apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/overview/button-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/utility/button/overview
---

# Button component

Import `TngButtonComponent` into the consuming standalone component:

```ts
import { Component } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngButtonComponent],
  template: `
    <tng-button tone="primary" appearance="solid" type="button" (click)="save()">
      Save changes
    </tng-button>
  `,
})
export class SaveButtonExample {
  save(): void {}
}
```

Public inputs include:

- `appearance`: `ghost | outline | solid`; default `solid`.
- `tone`: `danger | neutral | primary | success`; default `primary`.
- `size`: `lg | md | sm`; default `md`.
- `type`: native button type; default `button`.
- `disabled`: boolean.
- `ariaLabel`, `ariaLabelledby`, `ariaControls`, `ariaExpanded`, `ariaHasPopup`, and `ariaPressed`.

Prefer visible button text. Use `ariaLabel` for an icon-only button.
