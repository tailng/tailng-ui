---
id: "components/stepper/examples"
title: "Stepper examples"
description: "Stepper examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["stepper","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/stepper/tng-stepper.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/examples/stepper-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/examples/stepper-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/examples/stepper-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/stepper/examples"
componentGroup: "layout"
symbols: ["TngStepperComponent","TngStepperItemComponent"]
selectors: ["tng-stepper","tng-stepper-item"]
productId: "stepper"
section: "examples"
officialCatalog: true
generated: true
---

# Stepper examples

## Examples

Reusable wrapper-based stepper layouts that compose the styled host with headless step items, triggers, and state attributes.

### stepper-examples-horizontal-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent, TngStepperItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-stepper-examples-horizontal-plain-css',
  standalone: true,
  imports: [TngStepperComponent, TngStepperItemComponent],
  templateUrl: './stepper-examples-horizontal-plain-css.component.html',
  styleUrl: './stepper-examples-horizontal-plain-css.component.css',
})
export class StepperExamplesHorizontalPlainCssComponent {}
```

### stepper-examples-horizontal-plain-css.component.html

```html
<div class="stepper-example-shell stepper-example-shell--plain stepper-example-shell--horizontal">
  <tng-stepper orientation="horizontal" defaultValue="plan" ariaLabel="Horizontal onboarding progress">
    <tng-stepper-item value="account" label="Account" completed />
    <tng-stepper-item value="plan" label="Plan" description="Choose workspace limits" />
    <tng-stepper-item value="invite" label="Invite" description="Optional team setup" optional />
  </tng-stepper>
</div>
```

### stepper-examples-horizontal-plain-css.component.css

```css
.stepper-example-shell--horizontal {
  max-width: 48rem;
}
```

### stepper-examples-horizontal-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent, TngStepperItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-stepper-examples-horizontal-tailwind',
  standalone: true,
  imports: [TngStepperComponent, TngStepperItemComponent],
  templateUrl: './stepper-examples-horizontal-tailwind.component.html',
  styleUrl: './stepper-examples-horizontal-tailwind.component.css',
})
export class StepperExamplesHorizontalTailwindComponent {}
```

### stepper-examples-horizontal-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-stepper orientation="horizontal" defaultValue="plan" ariaLabel="Horizontal onboarding progress">
    <tng-stepper-item value="account" label="Account" completed />
    <tng-stepper-item value="plan" label="Plan" description="Workspace limits" />
    <tng-stepper-item value="invite" label="Invite" description="Optional team setup" optional />
  </tng-stepper>
</div>
```

### stepper-examples-horizontal-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### stepper-examples-checkout-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-checkout-plain-css',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-checkout-plain-css.component.html',
  styleUrl: './stepper-examples-checkout-plain-css.component.css',
})
export class StepperExamplesCheckoutPlainCssComponent {}
```

### stepper-examples-checkout-plain-css.component.html

```html
<div class="stepper-example-shell stepper-example-shell--plain">
  <tng-stepper ariaLabel="Checkout progress" defaultValue="shipping" linear>
    <ol class="stepper-example-list">
      <li tngStepperItem value="cart" label="Cart" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Cart</span></button>
      </li>
      <li tngStepperItem value="shipping" label="Shipping" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Shipping</span></button>
      </li>
      <li tngStepperItem value="payment" label="Payment" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Payment</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-checkout-plain-css.component.css

```css
.stepper-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.9rem 1rem;
}
```

### stepper-examples-checkout-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-checkout-tailwind',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-checkout-tailwind.component.html',
  styleUrl: './stepper-examples-checkout-tailwind.component.css',
})
export class StepperExamplesCheckoutTailwindComponent {}
```

### stepper-examples-checkout-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-stepper ariaLabel="Checkout progress" defaultValue="shipping" linear>
    <ol class="stepper-example-list">
      <li tngStepperItem value="cart" label="Cart" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Cart</span></button>
      </li>
      <li tngStepperItem value="shipping" label="Shipping" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Shipping</span></button>
      </li>
      <li tngStepperItem value="payment" label="Payment" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Payment</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-checkout-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### stepper-examples-release-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-release-plain-css',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-release-plain-css.component.html',
  styleUrl: './stepper-examples-release-plain-css.component.css',
})
export class StepperExamplesReleasePlainCssComponent {}
```

### stepper-examples-release-plain-css.component.html

```html
<div class="stepper-example-shell stepper-example-shell--plain">
  <tng-stepper ariaLabel="Release flow" defaultValue="publish">
    <ol class="stepper-example-list">
      <li tngStepperItem value="draft" label="Draft" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Draft</span></button>
      </li>
      <li tngStepperItem value="review" label="Review" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Review</span></button>
      </li>
      <li tngStepperItem value="publish" label="Publish" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Publish</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-release-plain-css.component.css

```css
.stepper-example-item[data-state="completed"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-success) 12%, transparent);
}
```

### stepper-examples-release-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-release-tailwind',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-release-tailwind.component.html',
  styleUrl: './stepper-examples-release-tailwind.component.css',
})
export class StepperExamplesReleaseTailwindComponent {}
```

### stepper-examples-release-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-stepper ariaLabel="Release flow" defaultValue="publish">
    <ol class="stepper-example-list">
      <li tngStepperItem value="draft" label="Draft" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Draft</span></button>
      </li>
      <li tngStepperItem value="review" label="Review" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Review</span></button>
      </li>
      <li tngStepperItem value="publish" label="Publish" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Publish</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-release-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### stepper-examples-error-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-error-plain-css',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-error-plain-css.component.html',
  styleUrl: './stepper-examples-error-plain-css.component.css',
})
export class StepperExamplesErrorPlainCssComponent {}
```

### stepper-examples-error-plain-css.component.html

```html
<div class="stepper-example-shell stepper-example-shell--plain">
  <tng-stepper ariaLabel="Onboarding" defaultValue="billing">
    <ol class="stepper-example-list">
      <li tngStepperItem value="profile" label="Profile" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Profile</span></button>
      </li>
      <li tngStepperItem value="billing" label="Billing" error class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Billing</span></button>
        <span tngStepperDescription class="stepper-example-description">Card declined</span>
      </li>
      <li tngStepperItem value="invite" label="Team invite" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Team invite</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-error-plain-css.component.css

```css
.stepper-example-item[data-state="error"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 10%, transparent);
}
```

### stepper-examples-error-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-error-tailwind',
  standalone: true,
  imports: [TngStepperComponent, TngStepperDescription, TngStepperItem, TngStepperLabel, TngStepperTrigger],
  templateUrl: './stepper-examples-error-tailwind.component.html',
  styleUrl: './stepper-examples-error-tailwind.component.css',
})
export class StepperExamplesErrorTailwindComponent {}
```

### stepper-examples-error-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-stepper ariaLabel="Onboarding" defaultValue="billing">
    <ol class="stepper-example-list">
      <li tngStepperItem value="profile" label="Profile" completed class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">1</span><span tngStepperLabel>Profile</span></button>
      </li>
      <li tngStepperItem value="billing" label="Billing" error class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">2</span><span tngStepperLabel>Billing</span></button>
        <span tngStepperDescription class="stepper-example-description">Card declined</span>
      </li>
      <li tngStepperItem value="invite" label="Team invite" class="stepper-example-item">
        <button tngStepperTrigger class="stepper-example-trigger"><span class="dot">3</span><span tngStepperLabel>Team invite</span></button>
      </li>
    </ol>
  </tng-stepper>
</div>
```

### stepper-examples-error-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
