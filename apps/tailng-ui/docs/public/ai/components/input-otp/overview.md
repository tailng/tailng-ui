---
id: "components/input-otp/overview"
title: "Input OTP component"
description: "Segmented one-time-password input with keyboard, paste, and form integration."
category: "components"
status: "stable"
tags: ["input-otp","form","component"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-otp/index.ts","libs/tailng-ui/components/src/lib/form/input-otp/tng-input-otp.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-otp/overview"
componentGroup: "form"
symbols: ["TngInputOtpComponent"]
selectors: ["tng-input-otp"]
productId: "input-otp"
section: "overview"
officialCatalog: true
generated: true
---

# Input OTP component

Segmented one-time-password input with keyboard, paste, and form integration.

## Package and import

Import the standalone Angular API from `@tailng-ui/components`:

```ts
import { Component } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngInputOtpComponent],
  template: `<tng-input-otp />`,
})
export class InputOtpAgentExample {}
```

## Component family

- `TngInputOtpComponent` — selector `tng-input-otp`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/input-otp/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/input-otp/api.md)
- [Styling](https://tailng.dev/ai/components/input-otp/styling.md)
- [Examples](https://tailng.dev/ai/components/input-otp/examples.md)
