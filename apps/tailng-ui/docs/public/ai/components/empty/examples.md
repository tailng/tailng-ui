---
id: "components/empty/examples"
title: "Empty examples"
description: "Empty examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["empty","feedback","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/feedback/empty/tng-empty.component.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/routes.ts","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/examples/empty-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/examples/empty-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/feedback/empty/sections/examples/empty-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/feedback/empty/examples"
componentGroup: "feedback"
symbols: ["TngEmptyActionsComponent","TngEmptyComponent","TngEmptyDescriptionComponent","TngEmptyIconComponent","TngEmptyTitleComponent"]
selectors: ["tng-empty-actions","tng-empty","tng-empty-description","tng-empty-icon","tng-empty-title"]
productId: "empty"
section: "examples"
officialCatalog: true
generated: true
---

# Empty examples

## Examples

Wrapper empty states are a good fit when you want the default shell but still need product copy, icons, and action content authored in the consuming screen.

### empty-examples-no-results-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-empty-examples-no-results-plain-css',
  standalone: true,
  imports: [
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
  ],
  templateUrl: './empty-examples-no-results-plain-css.component.html',
  styleUrl: './empty-examples-no-results-plain-css.component.css',
})
export class EmptyExamplesNoResultsPlainCssComponent {}
```

### empty-examples-no-results-plain-css.component.html

```html
<section class="empty-example-shell">
  <tng-empty align="start">
    <tng-empty-icon>🧭</tng-empty-icon>
    <tng-empty-title>No environments selected</tng-empty-title>
    <tng-empty-description>Select one or more environments to continue.</tng-empty-description>
    <tng-empty-actions>
      <button type="button">Select environments</button>
    </tng-empty-actions>
  </tng-empty>
</section>
```

### empty-examples-no-results-plain-css.component.css

```css
.empty-example-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.9rem;
  padding: 0.95rem;
}
```

### empty-examples-no-results-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-empty-examples-no-results-tailwind',
  standalone: true,
  imports: [
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
  ],
  templateUrl: './empty-examples-no-results-tailwind.component.html',
  styleUrl: './empty-examples-no-results-tailwind.component.css',
})
export class EmptyExamplesNoResultsTailwindComponent {}
```

### empty-examples-no-results-tailwind.component.html

```html
<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-empty>
    <tng-empty-icon>🛰️</tng-empty-icon>
    <tng-empty-title>No telemetry yet</tng-empty-title>
    <tng-empty-description>Connect your first agent to stream runtime metrics.</tng-empty-description>
    <tng-empty-actions>
      <button
        type="button"
        class="rounded-md border border-[var(--tng-semantic-border-default)] px-3 py-1 text-sm font-medium text-[var(--tng-semantic-foreground-primary)]"
      >
        Connect agent
      </button>
    </tng-empty-actions>
  </tng-empty>
</section>
```

### empty-examples-no-results-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### empty-examples-onboarding-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-empty-examples-onboarding-plain-css',
  standalone: true,
  imports: [
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
  ],
  templateUrl: './empty-examples-onboarding-plain-css.component.html',
  styleUrl: './empty-examples-onboarding-plain-css.component.css',
})
export class EmptyExamplesOnboardingPlainCssComponent {}
```

### empty-examples-onboarding-plain-css.component.html

```html
<section class="empty-example-shell">
  <tng-empty>
    <tng-empty-icon>📁</tng-empty-icon>
    <tng-empty-title>No documents uploaded</tng-empty-title>
    <tng-empty-description>Drop files here or choose upload to start indexing.</tng-empty-description>
    <tng-empty-actions>
      <button type="button">Upload files</button>
      <button type="button">Use template</button>
    </tng-empty-actions>
  </tng-empty>
</section>
```

### empty-examples-onboarding-plain-css.component.css

```css
.empty-example-shell {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.9rem;
  padding: 0.95rem;
}
```

### empty-examples-onboarding-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-empty-examples-onboarding-tailwind',
  standalone: true,
  imports: [
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
  ],
  templateUrl: './empty-examples-onboarding-tailwind.component.html',
  styleUrl: './empty-examples-onboarding-tailwind.component.css',
})
export class EmptyExamplesOnboardingTailwindComponent {}
```

### empty-examples-onboarding-tailwind.component.html

```html
<section class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <tng-empty align="start">
    <tng-empty-icon>📦</tng-empty-icon>
    <tng-empty-title>No release artifacts</tng-empty-title>
    <tng-empty-description>Build your project to publish the first release bundle.</tng-empty-description>
    <tng-empty-actions>
      <button
        type="button"
        class="rounded-md border border-[var(--tng-semantic-border-default)] px-3 py-1 text-sm font-medium text-[var(--tng-semantic-foreground-primary)]"
      >
        Run build
      </button>
      <button
        type="button"
        class="rounded-md border border-[var(--tng-semantic-border-default)] px-3 py-1 text-sm font-medium text-[var(--tng-semantic-foreground-primary)]"
      >
        Open pipeline
      </button>
    </tng-empty-actions>
  </tng-empty>
</section>
```

### empty-examples-onboarding-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
