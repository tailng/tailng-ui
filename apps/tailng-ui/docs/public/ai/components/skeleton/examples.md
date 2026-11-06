---
id: "components/skeleton/examples"
title: "Skeleton examples"
description: "Skeleton examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["skeleton","feedback","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/skeleton/tng-skeleton.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/examples/skeleton-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/examples/skeleton-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/skeleton/sections/examples/skeleton-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/skeleton/examples"
componentGroup: "feedback"
symbols: ["TngSkeletonComponent"]
selectors: ["tng-skeleton"]
productId: "skeleton"
section: "examples"
officialCatalog: true
generated: true
---

# Skeleton examples

## Examples

Compose wrapper skeletons for headline stacks, media cards, and action rows while content is still loading.

### skeleton-examples-text-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-examples-text-plain-css',
  standalone: true,
  imports: [TngSkeletonComponent],
  templateUrl: './skeleton-examples-text-plain-css.component.html',
  styleUrl: './skeleton-examples-text-plain-css.component.css',
})
export class SkeletonExamplesTextPlainCssComponent {}
```

### skeleton-examples-text-plain-css.component.html

```html
<section class="text-shell">
  <tng-skeleton width="52%" height="0.85rem"></tng-skeleton>
  <tng-skeleton width="100%" height="1.1rem"></tng-skeleton>
  <tng-skeleton width="88%" height="0.95rem"></tng-skeleton>
  <tng-skeleton width="76%" height="0.95rem"></tng-skeleton>
</section>
```

### skeleton-examples-text-plain-css.component.css

```css
.text-shell {
  display: grid;
  gap: 0.65rem;
}
```

### skeleton-examples-text-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-examples-text-tailwind',
  standalone: true,
  imports: [TngSkeletonComponent],
  templateUrl: './skeleton-examples-text-tailwind.component.html',
  styleUrl: './skeleton-examples-text-tailwind.component.css',
})
export class SkeletonExamplesTextTailwindComponent {}
```

### skeleton-examples-text-tailwind.component.html

```html
<section class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-skeleton width="6rem" height="0.75rem"></tng-skeleton>
  <tng-skeleton width="100%" height="1.15rem"></tng-skeleton>
  <tng-skeleton width="90%" height="0.95rem"></tng-skeleton>
  <tng-skeleton width="72%" height="0.95rem"></tng-skeleton>
</section>
```

### skeleton-examples-text-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### skeleton-examples-card-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-examples-card-plain-css',
  standalone: true,
  imports: [TngSkeletonComponent],
  templateUrl: './skeleton-examples-card-plain-css.component.html',
  styleUrl: './skeleton-examples-card-plain-css.component.css',
})
export class SkeletonExamplesCardPlainCssComponent {}
```

### skeleton-examples-card-plain-css.component.html

```html
<section class="card-shell">
  <tng-skeleton width="100%" height="8rem" [rounded]="false"></tng-skeleton>
  <tng-skeleton width="42%" height="0.8rem"></tng-skeleton>
  <tng-skeleton width="76%" height="1rem"></tng-skeleton>
  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>
  <div class="card-actions">
    <tng-skeleton width="5.5rem" height="2.25rem"></tng-skeleton>
    <tng-skeleton width="4.5rem" height="2.25rem"></tng-skeleton>
  </div>
</section>
```

### skeleton-examples-card-plain-css.component.css

```css
.card-shell {
  display: grid;
  gap: 0.75rem;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
```

### skeleton-examples-card-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-examples-card-tailwind',
  standalone: true,
  imports: [TngSkeletonComponent],
  templateUrl: './skeleton-examples-card-tailwind.component.html',
  styleUrl: './skeleton-examples-card-tailwind.component.css',
})
export class SkeletonExamplesCardTailwindComponent {}
```

### skeleton-examples-card-tailwind.component.html

```html
<section class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-skeleton width="100%" height="8rem" [rounded]="false"></tng-skeleton>
  <tng-skeleton width="7rem" height="0.8rem"></tng-skeleton>
  <tng-skeleton width="82%" height="1rem"></tng-skeleton>
  <tng-skeleton width="100%" height="0.9rem"></tng-skeleton>
  <div class="flex flex-wrap gap-3">
    <tng-skeleton width="6rem" height="2.25rem"></tng-skeleton>
    <tng-skeleton width="4.75rem" height="2.25rem"></tng-skeleton>
  </div>
</section>
```

### skeleton-examples-card-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### skeleton-examples-message.component.ts

```ts
import { Component } from '@angular/core';
import { TngSkeletonComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-examples-message',
  standalone: true,
  imports: [TngSkeletonComponent],
  templateUrl: './skeleton-examples-message.component.html',
  styleUrl: './skeleton-examples-message.component.css',
})
export class SkeletonExamplesMessageComponent {
  protected readonly loadingMessages = [
    'Preparing your dashboard...',
    'Crunching the numbers...',
    'Almost ready...',
    'Loading your workspace...',
  ];
}
```

### skeleton-examples-message.component.html

```html
<section class="message-shell">
  <tng-skeleton
    width="100%"
    height="1.1rem"
    message="Preparing your dashboard..."
  ></tng-skeleton>

  <tng-skeleton width="100%" height="1.1rem">
    Preparing your dashboard...
  </tng-skeleton>

  <tng-skeleton
    width="100%"
    height="1.1rem"
    [messages]="loadingMessages"
  ></tng-skeleton>

  <tng-skeleton
    width="100%"
    height="1.1rem"
    messageMode="random"
    messageStrategy="interval"
    [messageInterval]="5000"
    [messages]="loadingMessages"
  ></tng-skeleton>
</section>
```

### skeleton-examples-message.component.css

```css
.message-shell {
  display: grid;
  gap: 0.65rem;
}
```
