---
id: "components/separator/examples"
title: "Separator examples"
description: "Separator examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["separator","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/separator/tng-separator.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/examples/separator-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/examples/separator-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/separator/sections/examples/separator-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/separator/examples"
componentGroup: "layout"
symbols: ["TngSeparatorComponent"]
selectors: ["tng-separator"]
productId: "separator"
section: "examples"
officialCatalog: true
generated: true
---

# Separator examples

## Examples

Wrapper-based separator patterns for toolbars, command strips, and grouped list content.

### separator-examples-toolbar-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-separator-examples-toolbar-plain-css',
  standalone: true,
  imports: [TngSeparatorComponent],
  templateUrl: './separator-examples-toolbar-plain-css.component.html',
  styleUrl: './separator-examples-toolbar-plain-css.component.css',
})
export class SeparatorExamplesToolbarPlainCssComponent {}
```

### separator-examples-toolbar-plain-css.component.html

```html
<div class="toolbar-shell toolbar-shell--plain">
  <button type="button">All</button>
  <tng-separator orientation="vertical" class="toolbar-separator"></tng-separator>
  <button type="button">Running</button>
  <tng-separator orientation="vertical" class="toolbar-separator"></tng-separator>
  <button type="button">Archived</button>
</div>
```

### separator-examples-toolbar-plain-css.component.css

```css
.toolbar-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.55rem 0.8rem;
}
```

### separator-examples-toolbar-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-separator-examples-toolbar-tailwind',
  standalone: true,
  imports: [TngSeparatorComponent],
  templateUrl: './separator-examples-toolbar-tailwind.component.html',
  styleUrl: './separator-examples-toolbar-tailwind.component.css',
})
export class SeparatorExamplesToolbarTailwindComponent {}
```

### separator-examples-toolbar-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
  <div class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
    <button type="button">Pipelines</button>
    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>
    <button type="button">Jobs</button>
    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>
    <button type="button">Artifacts</button>
  </div>
</div>
```

### separator-examples-toolbar-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### separator-examples-list-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-separator-examples-list-plain-css',
  standalone: true,
  imports: [TngSeparatorComponent],
  templateUrl: './separator-examples-list-plain-css.component.html',
  styleUrl: './separator-examples-list-plain-css.component.css',
})
export class SeparatorExamplesListPlainCssComponent {}
```

### separator-examples-list-plain-css.component.html

```html
<section class="list-shell list-shell--plain">
  <div class="list-row">Design review</div>
  <tng-separator></tng-separator>
  <div class="list-row">QA signoff</div>
  <tng-separator></tng-separator>
  <div class="list-row">Release freeze</div>
</section>
```

### separator-examples-list-plain-css.component.css

```css
.list-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.8rem;
  padding: 0.8rem 1rem;
}
```

### separator-examples-list-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-separator-examples-list-tailwind',
  standalone: true,
  imports: [TngSeparatorComponent],
  templateUrl: './separator-examples-list-tailwind.component.html',
  styleUrl: './separator-examples-list-tailwind.component.css',
})
export class SeparatorExamplesListTailwindComponent {}
```

### separator-examples-list-tailwind.component.html

```html
<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Canary rollout</div>
  <tng-separator></tng-separator>
  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Regional promotion</div>
  <tng-separator></tng-separator>
  <div class="py-2 text-sm text-slate-700 dark:text-slate-200">Post-release checks</div>
</section>
```

### separator-examples-list-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
