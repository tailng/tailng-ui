---
id: "components/copybutton/examples"
title: "CopyButton examples"
description: "CopyButton examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["copybutton","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/copy-button/tng-copy-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/examples/copybutton-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/examples/copybutton-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/examples/copybutton-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/copybutton/examples"
componentGroup: "utility"
symbols: ["TngCopyButtonComponent"]
selectors: ["tng-copy-button"]
productId: "copybutton"
section: "examples"
officialCatalog: true
generated: true
---

# CopyButton examples

## Examples

These examples stay wrapper-focused: the component owns copy state and feedback, while you own the surrounding shell and any projected icon slots.

### copybutton-examples-install-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';

@Component({
  selector: 'app-copybutton-examples-install-plain-css',
  standalone: true,
  imports: [TngCopyButtonComponent, TngIcon],
  templateUrl: './copybutton-examples-install-plain-css.component.html',
  styleUrl: './copybutton-examples-install-plain-css.component.css',
})
export class CopybuttonExamplesInstallPlainCssComponent {
  protected readonly installCommand = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  protected readonly status = signal('No copy action yet.');

  protected onCopied(payload: string): void {
    this.status.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(): void {
    this.status.set('Copy failed.');
  }
}
```

### copybutton-examples-install-plain-css.component.html

```html
<div class="copybutton-example-shell copybutton-example-shell--plain">
  <tng-copy-button
    [text]="installCommand"
    appearance="outline"
    (tngCopied)="onCopied($event)"
    (tngCopyError)="onCopyError()"
  >
    <tng-icon copyIcon icon="copy"></tng-icon>
    <tng-icon copiedIcon icon="check"></tng-icon>
  </tng-copy-button>
  <p class="copybutton-example-status">{{ status() }}</p>
</div>
```

### copybutton-examples-install-plain-css.component.css

```css
.copybutton-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.85rem;
  padding: 1rem;
}
```

### copybutton-examples-install-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';

@Component({
  selector: 'app-copybutton-examples-install-tailwind',
  standalone: true,
  imports: [TngCopyButtonComponent, TngIcon],
  templateUrl: './copybutton-examples-install-tailwind.component.html',
  styleUrl: './copybutton-examples-install-tailwind.component.css',
})
export class CopybuttonExamplesInstallTailwindComponent {
  protected readonly installCommand = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  protected readonly status = signal('No copy action yet.');

  protected onCopied(payload: string): void {
    this.status.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(): void {
    this.status.set('Copy failed.');
  }
}
```

### copybutton-examples-install-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-copy-button
    [text]="installCommand"
    appearance="outline"
    (tngCopied)="onCopied($event)"
    (tngCopyError)="onCopyError()"
  >
    <tng-icon copyIcon icon="copy" class="h-4 w-4"></tng-icon>
    <tng-icon copiedIcon icon="check" class="h-4 w-4"></tng-icon>
  </tng-copy-button>
  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">{{ status() }}</p>
</div>
```

### copybutton-examples-install-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### copybutton-examples-target-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-copybutton-examples-target-plain-css',
  standalone: true,
  imports: [TngCopyButtonComponent],
  templateUrl: './copybutton-examples-target-plain-css.component.html',
  styleUrl: './copybutton-examples-target-plain-css.component.css',
})
export class CopybuttonExamplesTargetPlainCssComponent {
  protected readonly status = signal('No copy action yet.');

  protected onCopied(payload: string): void {
    this.status.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(): void {
    this.status.set('Copy failed.');
  }
}
```

### copybutton-examples-target-plain-css.component.html

```html
<div class="copybutton-example-shell copybutton-example-shell--plain">
  <pre #snippet class="copybutton-snippet">
<span class="copybutton-snippet-line"><span class="copybutton-snippet-line-no" data-copy-ignore>1</span>pnpm nx run docs:serve</span>
<span class="copybutton-snippet-line"><span class="copybutton-snippet-line-no" data-copy-ignore>2</span>pnpm nx run docs:build</span>
  </pre>
  <tng-copy-button
    [from]="snippet"
    [ignoreSelectors]="['[data-copy-ignore]']"
    (tngCopied)="onCopied($event)"
    (tngCopyError)="onCopyError()"
  >
    Copy snippet without line numbers
  </tng-copy-button>
  <p class="copybutton-example-status">{{ status() }}</p>
</div>
```

### copybutton-examples-target-plain-css.component.css

```css
.copybutton-snippet {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  padding: 0.75rem;
}
```

### copybutton-examples-target-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-copybutton-examples-target-tailwind',
  standalone: true,
  imports: [TngCopyButtonComponent],
  templateUrl: './copybutton-examples-target-tailwind.component.html',
  styleUrl: './copybutton-examples-target-tailwind.component.css',
})
export class CopybuttonExamplesTargetTailwindComponent {
  protected readonly status = signal('No copy action yet.');

  protected onCopied(payload: string): void {
    this.status.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(): void {
    this.status.set('Copy failed.');
  }
}
```

### copybutton-examples-target-tailwind.component.html

```html
<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <pre #snippet class="m-0 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-3 text-sm text-[var(--tng-semantic-foreground-primary)]">
<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>1</span>pnpm nx run docs:serve</span>
<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>2</span>pnpm nx run docs:build</span>
  </pre>
  <tng-copy-button
    class="mt-3"
    [from]="snippet"
    [ignoreSelectors]="['[data-copy-ignore]']"
    (tngCopied)="onCopied($event)"
    (tngCopyError)="onCopyError()"
  >
    Copy snippet without line numbers
  </tng-copy-button>
  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">{{ status() }}</p>
</div>
```

### copybutton-examples-target-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
