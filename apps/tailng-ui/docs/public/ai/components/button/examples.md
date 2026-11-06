---
id: "components/button/examples"
title: "Button examples"
description: "Button examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["button","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/button/tng-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/examples/button-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/examples/button-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/button/sections/examples/button-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/button/examples"
componentGroup: "utility"
symbols: ["TngButtonComponent"]
selectors: ["tng-button"]
productId: "button"
section: "examples"
officialCatalog: true
generated: true
---

# Button examples

## Examples

These examples stay wrapper-focused: the component owns the button shell while you own the surrounding layout and any projected icon content.

### button-examples-action-row-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-examples-action-row-plain-css',
  standalone: true,
  imports: [TngButtonComponent],
  templateUrl: './button-examples-action-row-plain-css.component.html',
  styleUrl: './button-examples-action-row-plain-css.component.css',
})
export class ButtonExamplesActionRowPlainCssComponent {
  protected readonly count = signal(0);
  protected increment(): void { this.count.update((value) => value + 1); }
}
```

### button-examples-action-row-plain-css.component.html

```html
<div class="button-example-row button-example-row--plain">
  <tng-button tone="primary" appearance="solid" type="button" (click)="increment()">
    Save draft
  </tng-button>
  <tng-button tone="neutral" appearance="outline" type="button">Cancel</tng-button>
  <tng-button tone="danger" appearance="ghost" type="button" [disabled]="true">Delete</tng-button>
</div>
```

### button-examples-action-row-plain-css.component.css

```css
.button-example-row--plain {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
```

### button-examples-action-row-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';

@Component({
  selector: 'app-button-examples-action-row-tailwind',
  standalone: true,
  imports: [TngButtonComponent, TngIcon],
  templateUrl: './button-examples-action-row-tailwind.component.html',
  styleUrl: './button-examples-action-row-tailwind.component.css',
})
export class ButtonExamplesActionRowTailwindComponent {
  protected readonly count = signal(0);
  protected increment(): void { this.count.update((value) => value + 1); }
}
```

### button-examples-action-row-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="flex flex-wrap gap-3">
    <tng-button tone="success" appearance="solid" type="button" (click)="increment()">
      <tng-icon icon="check" class="h-4 w-4"></tng-icon>
      Publish
    </tng-button>
    <tng-button tone="neutral" appearance="outline" type="button">Preview</tng-button>
  </div>
  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">clicked: {{ count() }}</p>
</div>
```

### button-examples-action-row-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### button-examples-menu-trigger-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-examples-menu-trigger-plain-css',
  standalone: true,
  imports: [TngButtonComponent],
  templateUrl: './button-examples-menu-trigger-plain-css.component.html',
  styleUrl: './button-examples-menu-trigger-plain-css.component.css',
})
export class ButtonExamplesMenuTriggerPlainCssComponent {
  protected readonly open = signal(false);
}
```

### button-examples-menu-trigger-plain-css.component.html

```html
<tng-button
  tone="neutral"
  appearance="outline"
  type="button"
  [ariaHasPopup]="'menu'"
  [ariaExpanded]="open()"
  [ariaControls]="'plain-button-menu'"
  (click)="open.set(!open())"
>
  Actions
</tng-button>
<div id="plain-button-menu" class="button-menu-surface" [hidden]="!open()">Menu content</div>
```

### button-examples-menu-trigger-plain-css.component.css

```css
.button-menu-surface {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  margin-top: 0.6rem;
  padding: 0.6rem 0.75rem;
}
```

### button-examples-menu-trigger-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-examples-menu-trigger-tailwind',
  standalone: true,
  imports: [TngButtonComponent],
  templateUrl: './button-examples-menu-trigger-tailwind.component.html',
  styleUrl: './button-examples-menu-trigger-tailwind.component.css',
})
export class ButtonExamplesMenuTriggerTailwindComponent {
  protected readonly open = signal(false);
}
```

### button-examples-menu-trigger-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-button
    tone="neutral"
    appearance="ghost"
    type="button"
    [ariaHasPopup]="'menu'"
    [ariaExpanded]="open()"
    [ariaControls]="'tailwind-button-menu'"
    (click)="open.set(!open())"
  >
    Open menu
  </tng-button>
  <div
    id="tailwind-button-menu"
    class="mt-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-3 text-sm text-[var(--tng-semantic-foreground-primary)]"
    [hidden]="!open()"
  >
    Menu content
  </div>
</div>
```

### button-examples-menu-trigger-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### button-examples-layout-tokens.component.ts

```ts
import { Component } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-examples-layout-tokens',
  standalone: true,
  imports: [TngButtonComponent],
  templateUrl: './button-examples-layout-tokens.component.html',
  styleUrl: './button-examples-layout-tokens.component.css',
})
export class ButtonExamplesLayoutTokensComponent {}
```

### button-examples-layout-tokens.component.html

```html
<div class="button-layout-token-example">
  <tng-button
    class="button-layout-token-example__trigger"
    tone="neutral"
    appearance="outline"
    size="sm"
    type="button"
  >
    <span>Search</span>
    <span class="button-layout-token-example__hint">Ctrl K</span>
  </tng-button>
</div>
```

### button-examples-layout-tokens.component.css

```css
.button-layout-token-example {
  width: min(100%, 16rem);
}

.button-layout-token-example__trigger {
  --tng-button-justify: space-between;
  --tng-button-min-width: 12rem;
  --tng-button-width: 100%;
}
```
