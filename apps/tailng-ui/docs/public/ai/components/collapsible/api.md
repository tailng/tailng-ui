---
id: "components/collapsible/api"
title: "Collapsible API"
description: "Collapsible API reference for Angular applications."
category: "components"
status: "stable"
tags: ["collapsible","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/collapsible/tng-collapsible.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/api/collapsible-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/api/collapsible-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/collapsible/sections/api/collapsible-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/collapsible/api"
componentGroup: "layout"
symbols: ["TngCollapsibleComponent"]
selectors: ["tng-collapsible"]
productId: "collapsible"
section: "api"
officialCatalog: true
generated: true
---

# Collapsible API

Expandable disclosure regions with headless and styled integration paths.

## API reference

Collapsible exposes a small headless primitive trio and a wrapper component. The wrapper owns a baseline trigger shell, while the primitive stays available for fully custom markup.

### `tngCollapsible` (directive)

Attach on a container element to reflect root state. Pair it with `tngCollapsibleTrigger` and `tngCollapsibleContent` when you want full control over the markup.

#### Primitive attachment

```html
<section tngCollapsible [open]="open()">
  <button
    tngCollapsibleTrigger
    [open]="open()"
    [contentId]="contentId"
    (click)="open.set(!open())"
  >
    Release flow
  </button>

  <ol
    tngCollapsibleContent
    [id]="contentId"
    [open]="open()"
    aria-label="Release flow"
  >
    <li>Draft</li>
    <li>Review</li>
    <li>Publish</li>
  </ol>
</section>
```

| Surface | Value | Purpose |
| --- | --- | --- |
| Input | `open`, `disabled` | Mirrors into `data-state` and `data-disabled`. |
| Selector | `[tngCollapsible]` | Attach collapsible semantics without imposing markup. |
| Export alias | `tngCollapsible` | Reference directive instance from templates if needed. |

### `tng-collapsible` (component)

Wrapper that renders the trigger button, generated content id wiring, and a baseline shell around projected content.

#### Component state

```ts
import { Component, signal } from '@angular/core';
import { TngCollapsibleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-api-demo',
  standalone: true,
  imports: [TngCollapsibleComponent],
  templateUrl: './collapsible-api-demo.component.html',
})
export class CollapsibleApiDemoComponent {
  readonly open = signal(false);
}
```

#### Component attachment

```html
<tng-collapsible title="Checkout steps" [open]="open()" (openChange)="open.set($event)">
  <ol>
    <li data-state="current"><span>1</span> Shipping</li>
    <li data-state="upcoming"><span>2</span> Payment</li>
    <li data-state="upcoming"><span>3</span> Confirmation</li>
  </ol>
</tng-collapsible>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `contentId` | `string` | Generated id | Overrides the generated content id if you need a stable external hook. |
| `disabled` | `boolean` | `false` | Locks the trigger and keeps the current open state unchanged. |
| `open` | `boolean` | `false` | Controls whether the projected content is visible. |
| `title` | `string` | `'Collapsible'` | Visible trigger label rendered inside the wrapper trigger. |
| `openChange` | `EventEmitter<boolean>` | n/a | Emits the next requested open state when the trigger is activated. |

## Source-derived public Angular API

### `TngCollapsibleComponent` — `tng-collapsible`

- Inputs: `contentId`, `disabled`, `open`, `title`
- Outputs: `openChange`
