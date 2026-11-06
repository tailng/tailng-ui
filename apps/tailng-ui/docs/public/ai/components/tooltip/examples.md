---
id: "components/tooltip/examples"
title: "Tooltip examples"
description: "Tooltip examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["tooltip","overlay","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/tooltip/tng-tooltip.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/examples/tooltip-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/examples/tooltip-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/tooltip/sections/examples/tooltip-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/tooltip/examples"
componentGroup: "overlay"
symbols: ["TngTooltipComponent"]
selectors: ["tng-tooltip"]
productId: "tooltip"
section: "examples"
officialCatalog: true
generated: true
---

# Tooltip examples

## Examples

Production tooltip patterns for short helper hints across plain CSS and Tailwind wrapper shells.

### tooltip-examples-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngTooltipComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tooltip-examples-plain-css',
  standalone: true,
  imports: [TngTooltipComponent],
  templateUrl: './tooltip-examples-plain-css.component.html',
  styleUrl: './tooltip-examples-plain-css.component.css',
})
export class TooltipExamplesPlainCssComponent {
  protected readonly open = signal(false);
}
```

### tooltip-examples-plain-css.component.html

```html
<div class="tooltip-example-shell tooltip-example-stage">
  <tng-tooltip
    triggerLabel="Archive release notes"
    text="Moves notes to readonly archive."
    side="bottom"
    [openDelay]="100"
    [closeDelay]="80"
    (openChange)="open.set($event)"
  ></tng-tooltip>
</div>
```

### tooltip-examples-plain-css.component.css

```css
.tooltip-example-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.95rem;
  padding: 1rem;
}
```

### tooltip-examples-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngTooltipComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tooltip-examples-tailwind',
  standalone: true,
  imports: [TngTooltipComponent],
  templateUrl: './tooltip-examples-tailwind.component.html',
  styleUrl: './tooltip-examples-tailwind.component.css',
})
export class TooltipExamplesTailwindComponent {
  protected readonly open = signal(false);
}
```

### tooltip-examples-tailwind.component.html

```html
<div
  class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"
>
  <div class="grid min-h-[8.5rem] content-start justify-items-start gap-3">
    <tng-tooltip
      triggerLabel="Approve deployment"
      side="top"
      [openDelay]="150"
      [closeDelay]="100"
      (openChange)="open.set($event)"
    >
      <span class="block max-w-56 text-sm leading-6 text-[var(--tng-semantic-foreground-primary)]">
        Rollout starts in us-east, then eu-west.
      </span>
    </tng-tooltip>
  </div>
</div>
```

### tooltip-examples-tailwind.component.css

```css
/* Tailwind utilities are applied directly in template. */
```
