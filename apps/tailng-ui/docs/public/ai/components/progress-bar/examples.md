---
id: "components/progress-bar/examples"
title: "Progress Bar examples"
description: "Progress Bar examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-bar","feedback","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-bar/tng-progress-bar.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/examples/progress-bar-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/examples/progress-bar-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-bar/sections/examples/progress-bar-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-bar/examples"
componentGroup: "feedback"
symbols: ["TngProgressBarComponent"]
selectors: ["tng-progress-bar"]
productId: "progress-bar"
section: "examples"
officialCatalog: true
generated: true
---

# Progress Bar examples

## Examples

Pair determinate and indeterminate states to communicate progress and loading intent clearly.

### progress-bar-examples-upload-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressBarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-examples-upload-plain-css',
  standalone: true,
  imports: [TngProgressBarComponent],
  templateUrl: './progress-bar-examples-upload-plain-css.component.html',
  styleUrl: './progress-bar-examples-upload-plain-css.component.css',
})
export class ProgressBarExamplesUploadPlainCssComponent {
  protected readonly uploadProgress = 68;
  protected readonly qualityProgress = 84;
}
```

### progress-bar-examples-upload-plain-css.component.html

```html
<div class="example-shell">
  <tng-progress-bar [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-bar>
  <tng-progress-bar [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-bar>
</div>
```

### progress-bar-examples-upload-plain-css.component.css

```css
.example-shell {
  display: grid;
  gap: 0.75rem;
}
```

### progress-bar-examples-upload-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressBarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-examples-upload-tailwind',
  standalone: true,
  imports: [TngProgressBarComponent],
  templateUrl: './progress-bar-examples-upload-tailwind.component.html',
  styleUrl: './progress-bar-examples-upload-tailwind.component.css',
})
export class ProgressBarExamplesUploadTailwindComponent {
  protected readonly uploadProgress = 68;
  protected readonly qualityProgress = 84;
}
```

### progress-bar-examples-upload-tailwind.component.html

```html
<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="grid gap-1 text-sm">
    <span class="text-[var(--tng-semantic-foreground-primary)]">Upload progress</span>
    <tng-progress-bar [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-bar>
  </div>
  <div class="grid gap-1 text-sm">
    <span class="text-[var(--tng-semantic-foreground-primary)]">Quality checks</span>
    <tng-progress-bar [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-bar>
  </div>
</section>
```

### progress-bar-examples-upload-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### progress-bar-examples-loading-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressBarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-examples-loading-plain-css',
  standalone: true,
  imports: [TngProgressBarComponent],
  templateUrl: './progress-bar-examples-loading-plain-css.component.html',
  styleUrl: './progress-bar-examples-loading-plain-css.component.css',
})
export class ProgressBarExamplesLoadingPlainCssComponent {
  protected readonly releaseProgress = 42;
}
```

### progress-bar-examples-loading-plain-css.component.html

```html
<div class="loading-shell">
  <tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>
  <tng-progress-bar [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-bar>
</div>
```

### progress-bar-examples-loading-plain-css.component.css

```css
.loading-shell {
  display: grid;
  gap: 0.75rem;
}
```

### progress-bar-examples-loading-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressBarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-bar-examples-loading-tailwind',
  standalone: true,
  imports: [TngProgressBarComponent],
  templateUrl: './progress-bar-examples-loading-tailwind.component.html',
  styleUrl: './progress-bar-examples-loading-tailwind.component.css',
})
export class ProgressBarExamplesLoadingTailwindComponent {
  protected readonly releaseProgress = 42;
}
```

### progress-bar-examples-loading-tailwind.component.html

```html
<section class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="grid gap-1 text-sm">
    <span class="text-[var(--tng-semantic-foreground-primary)]">Preparing release</span>
    <tng-progress-bar [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-bar>
  </div>
  <div class="grid gap-1 text-sm">
    <span class="text-[var(--tng-semantic-foreground-primary)]">Rollout</span>
    <tng-progress-bar [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-bar>
  </div>
</section>
```

### progress-bar-examples-loading-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
