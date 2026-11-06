---
id: "components/collapsible/examples"
title: "Collapsible examples"
description: "Collapsible examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["collapsible","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/collapsible/tng-collapsible.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/examples/collapsible-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/examples/collapsible-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/examples/collapsible-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/collapsible/examples"
componentGroup: "layout"
symbols: ["TngCollapsibleComponent"]
selectors: ["tng-collapsible"]
productId: "collapsible"
section: "examples"
officialCatalog: true
generated: true
---

# Collapsible examples

## Examples

Wrapper-focused collapsible patterns for progress disclosure and compact error recovery panels.

### collapsible-examples-checkout-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-examples-checkout-plain',
  standalone: true,
  imports: [TngCollapsibleComponent],
  templateUrl: './collapsible-examples-checkout-plain-css.component.html',
  styleUrl: './collapsible-examples-checkout-plain-css.component.css',
})
export class CollapsibleExamplesCheckoutPlainComponent {
  readonly open = signal(true);
}
```

### collapsible-examples-checkout-plain-css.component.html

```html
<div class="collapsible-example-shell collapsible-example-shell--plain">
  <tng-collapsible
    title="Checkout progress"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <ol class="collapsible-example-list">
      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>
      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>
      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>
    </ol>
  </tng-collapsible>
</div>
```

### collapsible-examples-checkout-plain-css.component.css

```css
.collapsible-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.9rem 1rem;
}
```

### collapsible-examples-checkout-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-examples-checkout-tailwind',
  standalone: true,
  imports: [TngCollapsibleComponent],
  templateUrl: './collapsible-examples-checkout-tailwind.component.html',
  styleUrl: './collapsible-examples-checkout-tailwind.component.css',
})
export class CollapsibleExamplesCheckoutTailwindComponent {
  readonly open = signal(false);
}
```

### collapsible-examples-checkout-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-collapsible
    title="Checkout progress"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <ol class="collapsible-example-list">
      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Cart</li>
      <li class="collapsible-example-item is-current"><span class="dot">2</span> Shipping</li>
      <li class="collapsible-example-item"><span class="dot">3</span> Payment</li>
    </ol>
  </tng-collapsible>
</div>
```

### collapsible-examples-checkout-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### collapsible-examples-error-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-examples-error-plain',
  standalone: true,
  imports: [TngCollapsibleComponent],
  templateUrl: './collapsible-examples-error-plain-css.component.html',
  styleUrl: './collapsible-examples-error-plain-css.component.css',
})
export class CollapsibleExamplesErrorPlainComponent {
  readonly open = signal(true);
}
```

### collapsible-examples-error-plain-css.component.html

```html
<div class="collapsible-example-shell collapsible-example-shell--plain">
  <tng-collapsible
    title="Onboarding"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <ol class="collapsible-example-list">
      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>
      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>
      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>
    </ol>
  </tng-collapsible>
</div>
```

### collapsible-examples-error-plain-css.component.css

```css
.collapsible-example-item.is-error {
  border-color: var(--tng-semantic-accent-danger);
  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 10%, transparent);
}
```

### collapsible-examples-error-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-examples-error-tailwind',
  standalone: true,
  imports: [TngCollapsibleComponent],
  templateUrl: './collapsible-examples-error-tailwind.component.html',
  styleUrl: './collapsible-examples-error-tailwind.component.css',
})
export class CollapsibleExamplesErrorTailwindComponent {
  readonly open = signal(false);
}
```

### collapsible-examples-error-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-collapsible
    title="Onboarding"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <ol class="collapsible-example-list">
      <li class="collapsible-example-item is-complete"><span class="dot">✓</span> Profile</li>
      <li class="collapsible-example-item is-error"><span class="dot">2</span> Billing</li>
      <li class="collapsible-example-item"><span class="dot">3</span> Team invite</li>
    </ol>
  </tng-collapsible>
</div>
```

### collapsible-examples-error-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
