---
id: "components/input-otp/styling"
title: "Input OTP styling"
description: "Input OTP styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["input-otp","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-otp/index.ts","libs/tailng-ui/components/src/lib/form/input-otp/tng-input-otp.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/styling/input-otp-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/styling/input-otp-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/styling/input-otp-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-otp/styling"
componentGroup: "form"
symbols: ["TngInputOtpComponent"]
selectors: ["tng-input-otp"]
productId: "input-otp"
section: "styling"
officialCatalog: true
generated: true
---

# Input OTP styling

## Styling

The component does not expose a separate OTP-only token contract. Style it the same way the wrapper does internally: by setting semantic foreground, border, background, and accent tokens on a wrapper around `<tng-input-otp>` (custom properties inherit into the component).

### Theming surface

A wrapper class is the stable public styling hook. The projected slots inherit the semantic tokens you set on that ancestor.

#### Wrapper-level theming

```css
/* Scope semantic tokens on a wrapper around <tng-input-otp>; they inherit into the component. */
.project-otp-shell {
  --tng-semantic-background-surface: var(--tng-semantic-background-surface);
  --tng-semantic-background-muted: color-mix(
    in srgb,
    var(--tng-semantic-accent-brand) 10%,
    var(--tng-semantic-background-base)
  );
  --tng-semantic-border-default: var(--tng-semantic-border-subtle);
  --tng-semantic-foreground-primary: var(--tng-semantic-foreground-primary);
  --tng-semantic-foreground-muted: var(--tng-semantic-foreground-muted);
  --tng-semantic-accent-brand: var(--tng-semantic-accent-brand);
  --tng-semantic-accent-danger: var(--tng-semantic-accent-danger);
}
```

The wrapper keeps the OTP behavior stable while your host class supplies the visual theme.

Apply semantic tokens directly on the wrapper host while keeping the OTP behavior untouched.

### Guidance
