---
id: components/input/overview
title: Input component
description: Import and configure the styled TailNG input component.
category: components
status: stable
tags: ["input", "form", "validation"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input/tng-input.component.ts", "apps/tailng-ui/docs/src/app/pages/components/form/input/sections/overview/input-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/form/input/overview
---

# Input component

Use `TngInputComponent` for the styled wrapper:

```ts
import { Component, signal } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngInputComponent],
  template: `
    <tng-input
      type="email"
      placeholder="team@example.com"
      ariaLabel="Work email"
      autocomplete="email"
      [value]="email()"
      (valueChange)="email.set($event)"
    />
  `,
})
export class EmailInputExample {
  readonly email = signal<string | null>(null);
}
```

The component supports native-style attributes including `type`, `placeholder`, `autocomplete`, `required`, `readonly`, `disabled`, `min`, `max`, `minlength`, `maxlength`, `pattern`, and input events.

Use `ariaLabel` when no visible label is associated with the field. Use `ariaErrormessage` and `ariaInvalid` for validation feedback. For projected prefixes or suffixes, use `TngInputFieldComponent` with the relevant primitives.

## Documentation sections

- [Api](https://tailng.dev/ai/components/input/api.md)
- [Styling](https://tailng.dev/ai/components/input/styling.md)
- [Examples](https://tailng.dev/ai/components/input/examples.md)
