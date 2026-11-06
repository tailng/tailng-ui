---
id: "components/card/examples"
title: "Card examples"
description: "Card examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["card","layout","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/card/tng-card.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/examples/card-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/examples/card-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/card/sections/examples/card-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/card/examples"
componentGroup: "layout"
symbols: ["TngCardActionsComponent","TngCardComponent","TngCardContentComponent","TngCardDescriptionComponent","TngCardDividerComponent","TngCardFooterComponent","TngCardHeaderComponent","TngCardLinkComponent","TngCardMediaComponent","TngCardTitleComponent"]
selectors: ["tng-card-actions","tng-card","tng-card-content","tng-card-description","tng-card-divider","tng-card-footer","tng-card-header","tng-card-link","tng-card-media","tng-card-title"]
productId: "card"
section: "examples"
officialCatalog: true
generated: true
---

# Card examples

## Examples

Wrapper-based card patterns for profile summaries and action queues.

### card-examples-media-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardMediaComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-card-examples-media-plain-css',
  standalone: true,
  imports: [
    TngCardComponent,
    TngCardMediaComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
  ],
  templateUrl: './card-examples-media-plain-css.component.html',
  styleUrl: './card-examples-media-plain-css.component.css',
})
export class CardExamplesMediaPlainCssComponent {}
```

### card-examples-media-plain-css.component.html

```html
<div class="card-example-shell card-example-shell--plain">
  <tng-card variant="outline" tone="neutral" interactive>
    <tng-card-media><div class="card-example__media-placeholder" aria-hidden="true">AV</div></tng-card-media>
    <tng-card-header>
      <tng-card-title>Ava Mathews</tng-card-title>
      <tng-card-description>Design systems engineer</tng-card-description>
    </tng-card-header>
    <tng-card-content>
      <p>Building reusable interaction patterns across product teams.</p>
    </tng-card-content>
    <tng-card-footer>
      <tng-card-actions>
        <button type="button">Message</button>
        <button type="button">Follow</button>
      </tng-card-actions>
    </tng-card-footer>
  </tng-card>
</div>
```

### card-examples-media-plain-css.component.css

```css
.card-example-shell--plain {
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.9rem;
  padding: 1rem;
}
```

### card-examples-media-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardMediaComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-card-examples-media-tailwind',
  standalone: true,
  imports: [
    TngCardComponent,
    TngCardMediaComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardActionsComponent,
  ],
  templateUrl: './card-examples-media-tailwind.component.html',
  styleUrl: './card-examples-media-tailwind.component.css',
})
export class CardExamplesMediaTailwindComponent {}
```

### card-examples-media-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-card variant="outline" tone="primary" padding="lg" interactive>
    <tng-card-media><div class="card-example__media-placeholder" aria-hidden="true">AV</div></tng-card-media>
    <tng-card-header>
      <tng-card-title>Ava Mathews</tng-card-title>
      <tng-card-description>Design systems engineer</tng-card-description>
    </tng-card-header>
    <tng-card-content>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Building reusable interaction patterns across product teams.
      </p>
    </tng-card-content>
    <tng-card-footer>
      <tng-card-actions>
        <button type="button">Message</button>
        <button type="button">Follow</button>
      </tng-card-actions>
    </tng-card-footer>
  </tng-card>
</div>
```

### card-examples-media-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### card-examples-actions-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-card-examples-actions-plain-css',
  standalone: true,
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardDividerComponent,
    TngCardFooterComponent,
    TngCardLinkComponent,
    TngCardActionsComponent,
  ],
  templateUrl: './card-examples-actions-plain-css.component.html',
  styleUrl: './card-examples-actions-plain-css.component.css',
})
export class CardExamplesActionsPlainCssComponent {}
```

### card-examples-actions-plain-css.component.html

```html
<div class="card-example-shell card-example-shell--plain">
  <tng-card variant="outline" tone="warning" padding="md">
    <tng-card-header>
      <tng-card-title>Billing reminder</tng-card-title>
      <tng-card-description>Invoice #3912 is due in 2 days.</tng-card-description>
    </tng-card-header>
    <tng-card-content>
      <p>Assign owner and send reminder before due date.</p>
    </tng-card-content>
    <tng-card-divider></tng-card-divider>
    <tng-card-footer>
      <tng-card-link href="#invoice">Open invoice</tng-card-link>
      <tng-card-actions>
        <button type="button">Snooze</button>
        <button type="button">Assign owner</button>
      </tng-card-actions>
    </tng-card-footer>
  </tng-card>
</div>
```

### card-examples-actions-plain-css.component.css

```css
.card-example-shell--plain [data-slot="card-link"] {
  color: var(--tng-semantic-accent-brand);
}
```

### card-examples-actions-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-card-examples-actions-tailwind',
  standalone: true,
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardDividerComponent,
    TngCardFooterComponent,
    TngCardLinkComponent,
    TngCardActionsComponent,
  ],
  templateUrl: './card-examples-actions-tailwind.component.html',
  styleUrl: './card-examples-actions-tailwind.component.css',
})
export class CardExamplesActionsTailwindComponent {}
```

### card-examples-actions-tailwind.component.html

```html
<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
  <tng-card variant="outline" tone="warning" padding="md" interactive>
    <tng-card-header>
      <tng-card-title>Billing reminder</tng-card-title>
      <tng-card-description>Invoice #3912 is due in 2 days.</tng-card-description>
    </tng-card-header>
    <tng-card-content>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Assign owner and send reminder before due date.
      </p>
    </tng-card-content>
    <tng-card-divider></tng-card-divider>
    <tng-card-footer>
      <tng-card-link href="#invoice">Open invoice</tng-card-link>
      <tng-card-actions>
        <button type="button">Snooze</button>
        <button type="button">Assign owner</button>
      </tng-card-actions>
    </tng-card-footer>
  </tng-card>
</div>
```

### card-examples-actions-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
