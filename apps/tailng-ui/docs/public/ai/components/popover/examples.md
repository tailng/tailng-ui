---
id: "components/popover/examples"
title: "Popover examples"
description: "Popover examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["popover","overlay","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/popover/tng-popover-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/overlay/popover/tng-popover.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/examples/popover-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/examples/popover-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/popover/sections/examples/popover-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/popover/examples"
componentGroup: "overlay"
symbols: ["TngPopoverComponent"]
selectors: ["tng-popover"]
productId: "popover"
section: "examples"
officialCatalog: true
generated: true
---

# Popover examples

## Examples

Wrapper popover examples focused on compact confirmation flows. Use the headless popover page when the anchored DOM belongs entirely to the feature.

### popover-examples-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';

@Component({
  selector: 'app-popover-examples-plain-css',
  standalone: true,
  imports: [TngPopoverComponent, TngPopoverTriggerFor],
  templateUrl: './popover-examples-plain-css.component.html',
  styleUrl: './popover-examples-plain-css.component.css',
})
export class PopoverExamplesPlainCssComponent {
  protected readonly open = signal(false);
  protected readonly result = signal('No decision yet');

  protected onCancel(): void {
    this.result.set('Canceled');
    this.open.set(false);
  }

  protected onApprove(): void {
    this.result.set('Deleted release branch');
    this.open.set(false);
  }
}
```

### popover-examples-plain-css.component.html

```html
<tng-popover
  #popover="tngPopoverComponent"
  [open]="open()"
  (openChange)="open.set($event)"
>
  <p class="popover-example-copy">This action removes branch automation and cannot be undone.</p>
  <div class="popover-action-row">
    <button type="button" class="popover-example-secondary" (click)="onCancel()">Cancel</button>
    <button type="button" class="popover-example-danger" (click)="onApprove()">Delete</button>
  </div>
</tng-popover>
<button type="button" [tngPopoverTriggerFor]="popover">Delete release branch</button>
```

### popover-examples-plain-css.component.css

```css
.popover-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: flex-end;
}

.popover-example-danger {
  background: #dc2626;
  color: #fff;
}
```

### popover-examples-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';

@Component({
  selector: 'app-popover-examples-tailwind',
  standalone: true,
  imports: [TngPopoverComponent, TngPopoverTriggerFor],
  templateUrl: './popover-examples-tailwind.component.html',
  styleUrl: './popover-examples-tailwind.component.css',
})
export class PopoverExamplesTailwindComponent {
  protected readonly open = signal(false);
  protected readonly result = signal('No decision yet');

  protected onCancel(): void {
    this.result.set('Deployment on hold');
    this.open.set(false);
  }

  protected onApprove(): void {
    this.result.set('Deployment approved');
    this.open.set(false);
  }
}
```

### popover-examples-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-popover
    #popover="tngPopoverComponent"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Rollout will start in us-east and eu-west.</p>
    <div class="mt-3 flex flex-wrap justify-end gap-2">
      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="onCancel()">Hold</button>
      <button type="button" class="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" (click)="onApprove()">Approve</button>
    </div>
  </tng-popover>
  <button type="button" [tngPopoverTriggerFor]="popover">Approve deployment</button>
</div>
```

### popover-examples-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
