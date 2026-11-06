---
id: "components/progress-spinner/examples"
title: "Progress Spinner examples"
description: "Progress Spinner examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["progress-spinner","feedback","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/progress-spinner/tng-progress-spinner.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/examples/progress-spinner-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/examples/progress-spinner-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/progress-spinner/sections/examples/progress-spinner-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/progress-spinner/examples"
componentGroup: "feedback"
symbols: ["TngProgressSpinnerComponent"]
selectors: ["tng-progress-spinner"]
productId: "progress-spinner"
section: "examples"
officialCatalog: true
generated: true
---

# Progress Spinner examples

## Examples

Pair determinate and indeterminate states to communicate completion and loading intent clearly.

### progress-spinner-examples-upload-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-examples-upload-plain-css',
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  templateUrl: './progress-spinner-examples-upload-plain-css.component.html',
  styleUrl: './progress-spinner-examples-upload-plain-css.component.css',
})
export class ProgressSpinnerExamplesUploadPlainCssComponent {
  protected readonly uploadProgress = 68;
  protected readonly qualityProgress = 84;
}
```

### progress-spinner-examples-upload-plain-css.component.html

```html
<div class="example-shell">
  <tng-progress-spinner [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-spinner>
  <tng-progress-spinner [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-spinner>
</div>
```

### progress-spinner-examples-upload-plain-css.component.css

```css
.example-shell {
  display: flex;
  gap: 0.75rem;
}
```

### progress-spinner-examples-upload-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-examples-upload-tailwind',
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  templateUrl: './progress-spinner-examples-upload-tailwind.component.html',
  styleUrl: './progress-spinner-examples-upload-tailwind.component.css',
})
export class ProgressSpinnerExamplesUploadTailwindComponent {
  protected readonly uploadProgress = 68;
  protected readonly qualityProgress = 84;
}
```

### progress-spinner-examples-upload-tailwind.component.html

```html
<section class="flex flex-wrap gap-4 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-progress-spinner [value]="uploadProgress" ariaLabel="Upload progress"></tng-progress-spinner>
  <tng-progress-spinner [value]="qualityProgress" ariaLabel="Quality checks"></tng-progress-spinner>
</section>
```

### progress-spinner-examples-upload-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### progress-spinner-examples-loading-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-examples-loading-plain-css',
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  templateUrl: './progress-spinner-examples-loading-plain-css.component.html',
  styleUrl: './progress-spinner-examples-loading-plain-css.component.css',
})
export class ProgressSpinnerExamplesLoadingPlainCssComponent {
  protected readonly releaseProgress = 42;
}
```

### progress-spinner-examples-loading-plain-css.component.html

```html
<div class="loading-shell">
  <tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>
  <tng-progress-spinner [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-spinner>
</div>
```

### progress-spinner-examples-loading-plain-css.component.css

```css
.loading-shell {
  display: flex;
  gap: 0.75rem;
}
```

### progress-spinner-examples-loading-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngProgressSpinnerComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-examples-loading-tailwind',
  standalone: true,
  imports: [TngProgressSpinnerComponent],
  templateUrl: './progress-spinner-examples-loading-tailwind.component.html',
  styleUrl: './progress-spinner-examples-loading-tailwind.component.css',
})
export class ProgressSpinnerExamplesLoadingTailwindComponent {
  protected readonly releaseProgress = 42;
}
```

### progress-spinner-examples-loading-tailwind.component.html

```html
<section class="flex flex-wrap gap-4 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-progress-spinner [indeterminate]="true" ariaLabel="Preparing release"></tng-progress-spinner>
  <tng-progress-spinner [value]="releaseProgress" ariaLabel="Release rollout"></tng-progress-spinner>
</section>
```

### progress-spinner-examples-loading-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
