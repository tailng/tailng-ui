---
id: "components/breadcrumb/examples"
title: "Breadcrumb examples"
description: "Breadcrumb examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["breadcrumb","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-item.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-link.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-list.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator-template.directive.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb-separator.component.ts","libs/tailng-ui/components/src/lib/navigation/breadcrumb/tng-breadcrumb.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/examples/breadcrumb-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/examples/breadcrumb-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/breadcrumb/sections/examples/breadcrumb-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/breadcrumb/examples"
componentGroup: "navigation"
symbols: ["TngBreadcrumbComponent","TngBreadcrumbItemComponent","TngBreadcrumbLinkComponent","TngBreadcrumbListComponent","TngBreadcrumbSeparatorComponent","TngBreadcrumbSeparatorTemplateDirective"]
selectors: ["tng-breadcrumb","tng-breadcrumb-item","tng-breadcrumb-link","tng-breadcrumb-list","tng-breadcrumb-separator","ng-template[tngBreadcrumbSeparatorTemplate]"]
productId: "breadcrumb"
section: "examples"
officialCatalog: true
generated: true
---

# Breadcrumb examples

## Examples

Production breadcrumb paths often require collapse handling and mixed current or disabled states across wrapper compositions.

### breadcrumb-example-collapse-plain.component.ts

```ts
import { Component } from '@angular/core';
import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-breadcrumb-example-collapse-plain',
  standalone: true,
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  templateUrl: './breadcrumb-example-collapse-plain.component.html',
  styleUrl: './breadcrumb-example-collapse-plain.component.css',
})
export class BreadcrumbExampleCollapsePlainComponent {}
```

### breadcrumb-example-collapse-plain.component.html

```html
<div class="example-shell">
  <tng-breadcrumb [maxItems]="4" [itemsBeforeCollapse]="1" [itemsAfterCollapse]="2">
    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Catalog</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Products</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Shoes</tng-breadcrumb-item>
    <tng-breadcrumb-item [current]="true">Running</tng-breadcrumb-item>
  </tng-breadcrumb>
</div>
```

### breadcrumb-example-collapse-plain.component.css

```css
.example-shell {
  border: 1px solid var(--docs-border-subtle);
  border-radius: 16px;
  padding: 1rem;
}
```

### breadcrumb-example-collapse-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-breadcrumb-example-collapse-tailwind',
  standalone: true,
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  templateUrl: './breadcrumb-example-collapse-tailwind.component.html',
  styleUrl: './breadcrumb-example-collapse-tailwind.component.css',
})
export class BreadcrumbExampleCollapseTailwindComponent {}
```

### breadcrumb-example-collapse-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-breadcrumb [maxItems]="4" separator="›">
    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Catalog</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Products</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#">Shoes</tng-breadcrumb-item>
    <tng-breadcrumb-item [current]="true">Running</tng-breadcrumb-item>
  </tng-breadcrumb>
</div>
```

### breadcrumb-example-collapse-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### breadcrumb-example-current-plain.component.ts

```ts
import { Component } from '@angular/core';
import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-breadcrumb-example-current-plain',
  standalone: true,
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  templateUrl: './breadcrumb-example-current-plain.component.html',
  styleUrl: './breadcrumb-example-current-plain.component.css',
})
export class BreadcrumbExampleCurrentPlainComponent {}
```

### breadcrumb-example-current-plain.component.html

```html
<div class="example-shell">
  <tng-breadcrumb>
    <tng-breadcrumb-item href="#">Home</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#" [disabled]="true">Restricted</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#" [current]="true" [currentAsLink]="true">Docs</tng-breadcrumb-item>
  </tng-breadcrumb>
</div>
```

### breadcrumb-example-current-plain.component.css

```css
.example-shell {
  border: 1px solid var(--docs-border-subtle);
  border-radius: 16px;
  padding: 1rem;
}
```

### breadcrumb-example-current-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngBreadcrumbComponent, TngBreadcrumbItemComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-breadcrumb-example-current-tailwind',
  standalone: true,
  imports: [TngBreadcrumbComponent, TngBreadcrumbItemComponent],
  templateUrl: './breadcrumb-example-current-tailwind.component.html',
  styleUrl: './breadcrumb-example-current-tailwind.component.css',
})
export class BreadcrumbExampleCurrentTailwindComponent {}
```

### breadcrumb-example-current-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-breadcrumb>
    <tng-breadcrumb-item href="#">Workspace</tng-breadcrumb-item>
    <tng-breadcrumb-item href="#" [disabled]="true">Restricted</tng-breadcrumb-item>
    <tng-breadcrumb-item [current]="true">Billing</tng-breadcrumb-item>
  </tng-breadcrumb>
</div>
```

### breadcrumb-example-current-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
