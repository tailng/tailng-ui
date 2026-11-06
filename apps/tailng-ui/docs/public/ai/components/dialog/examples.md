---
id: "components/dialog/examples"
title: "Dialog examples"
description: "Dialog examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["dialog","overlay","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/overlay/dialog/tng-dialog.component.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/routes.ts","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/examples/dialog-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/examples/dialog-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/overlay/dialog/sections/examples/dialog-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/overlay/dialog/examples"
componentGroup: "overlay"
symbols: ["TngDialogComponent"]
selectors: ["tng-dialog"]
productId: "dialog"
section: "examples"
officialCatalog: true
generated: true
---

# Dialog examples

## Examples

Wrapper dialog examples focused on common confirmation flows. Use the headless dialog page when you need to author the overlay DOM yourself.

### dialog-examples-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-dialog-examples-plain-css',
  standalone: true,
  imports: [TngDialogComponent],
  templateUrl: './dialog-examples-plain-css.component.html',
  styleUrl: './dialog-examples-plain-css.component.css',
})
export class DialogExamplesPlainCssComponent {
  protected readonly open = signal(false);
  protected readonly result = signal('No decision yet');

  protected onApprove(): void {
    this.result.set('Deleted release branch');
    this.open.set(false);
  }

  protected onCancel(): void {
    this.result.set('Canceled');
    this.open.set(false);
  }
}
```

### dialog-examples-plain-css.component.html

```html
<button type="button" class="dialog-example-trigger" (click)="open.set(true)">
  Delete release branch
</button>

<tng-dialog
  title="Delete release branch?"
  description="This action removes branch automation and cannot be undone."
  [open]="open()"
  (openChange)="open.set($event)"
>
  <div class="dialog-action-row">
    <button type="button" class="dialog-example-secondary" (click)="onCancel()">Cancel</button>
    <button type="button" class="dialog-example-danger" (click)="onApprove()">Delete</button>
  </div>
</tng-dialog>
```

### dialog-examples-plain-css.component.css

```css
.dialog-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: flex-end;
}

.dialog-example-danger {
  background: #dc2626;
  color: #fff;
}
```

### dialog-content-slot-plain.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-dialog-content-slot-plain',
  standalone: true,
  imports: [TngDialogComponent],
  templateUrl: './dialog-content-slot-plain.component.html',
  styleUrl: './dialog-content-slot-plain.component.css',
})
export class DialogContentSlotPlainComponent {
  protected readonly open = signal(false);
}
```

### dialog-content-slot-plain.component.html

```html
<button type="button" class="dialog-example-trigger" (click)="open.set(true)">
  Open rollout notes
</button>

<tng-dialog
  title="Rollout notes"
  description="Review the deployment summary before approving."
  [open]="open()"
  (openChange)="open.set($event)"
>
  <p>Traffic shifts in us-east first, then eu-west after health checks pass.</p>
  <ul>
    <li>Canary window: 15 minutes</li>
    <li>Rollback owner: platform-oncall</li>
    <li>Feature flags: checkout-v2, billing-sync</li>
  </ul>
</tng-dialog>
```

### dialog-content-slot-plain.component.css

```css
tng-dialog [data-slot="dialog-content"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 8%, var(--tng-semantic-background-surface));
  border: 1px dashed var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  display: grid;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
}
```

### dialog-content-slot-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-dialog-content-slot-tailwind',
  standalone: true,
  imports: [TngDialogComponent],
  templateUrl: './dialog-content-slot-tailwind.component.html',
  styleUrl: './dialog-content-slot-tailwind.component.css',
})
export class DialogContentSlotTailwindComponent {
  protected readonly open = signal(false);
}
```

### dialog-content-slot-tailwind.component.html

```html
<tng-dialog
  title="Rollout notes"
  description="Review the deployment summary before approving."
  [open]="open()"
  (openChange)="open.set($event)"
>
  <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Traffic shifts in us-east first.</p>
  <ul class="m-0 grid list-disc gap-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
    <li>Canary window: 15 minutes</li>
    <li>Rollback owner: platform-oncall</li>
  </ul>
</tng-dialog>
```

### dialog-content-slot-tailwind.component.css

```css
tng-dialog [data-slot="dialog-content"] {
  background: rgb(248 250 252);
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

:host-context(.dark) tng-dialog [data-slot="dialog-content"] {
  background: rgb(15 23 42);
  border-color: rgb(51 65 85);
}
```

### dialog-custom-size.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-dialog-custom-size',
  standalone: true,
  imports: [TngDialogComponent],
  templateUrl: './dialog-custom-size.component.html',
  styleUrl: './dialog-custom-size.component.css',
})
export class DialogCustomSizeComponent {
  protected readonly open = signal(false);
  protected readonly width = signal('42rem');
  protected readonly height = signal('24rem');

  protected onWidthInput(event: Event): void {
    this.width.set((event.target as HTMLInputElement).value);
  }

  protected onHeightInput(event: Event): void {
    this.height.set((event.target as HTMLInputElement).value);
  }
}
```

### dialog-custom-size.component.html

```html
<div class="dialog-size-controls">
  <label>
    Width
    <input type="text" [value]="width()" (input)="onWidthInput($event)" />
  </label>
  <label>
    Height
    <input type="text" [value]="height()" (input)="onHeightInput($event)" />
  </label>
  <button type="button" (click)="open.set(true)">Open custom dialog</button>
</div>

<tng-dialog
  title="Custom dimensions"
  description="Width and height come from CSS variables on the host."
  [style.--tng-dialog-width]="width()"
  [style.--tng-dialog-height]="height()"
  [open]="open()"
  (openChange)="open.set($event)"
>
  <p>Current width: {{ width() }}</p>
  <p>Current height: {{ height() }}</p>
</tng-dialog>
```

### dialog-custom-size.component.css

```css
.dialog-size-controls {
  display: grid;
  gap: 0.75rem;
  max-width: 28rem;
}

.dialog-size-controls label {
  display: grid;
  gap: 0.35rem;
}
```

### dialog-examples-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngDialogComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-dialog-examples-tailwind',
  standalone: true,
  imports: [TngDialogComponent],
  templateUrl: './dialog-examples-tailwind.component.html',
  styleUrl: './dialog-examples-tailwind.component.css',
})
export class DialogExamplesTailwindComponent {
  protected readonly open = signal(false);
  protected readonly result = signal('No decision yet');

  protected onApprove(): void {
    this.result.set('Deployment approved');
    this.open.set(false);
  }

  protected onCancel(): void {
    this.result.set('Canceled');
    this.open.set(false);
  }
}
```

### dialog-examples-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <button
    type="button"
    class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
    (click)="open.set(true)"
  >
    Approve deployment
  </button>

  <tng-dialog
    title="Approve deployment"
    description="Proceed with production rollout for version 2.7.0?"
    [open]="open()"
    (openChange)="open.set($event)"
  >
    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Rollout will start in us-east and eu-west.</p>
    <div class="mt-3 flex flex-wrap justify-end gap-2">
      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="onCancel()">Hold</button>
      <button type="button" class="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" (click)="onApprove()">Approve</button>
    </div>
  </tng-dialog>
</div>
```

### dialog-examples-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
