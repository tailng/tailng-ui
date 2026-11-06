---
id: "components/context-menu/examples"
title: "Context Menu examples"
description: "Context Menu examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["context-menu","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/context-menu/tng-context-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/examples/context-menu-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/examples/context-menu-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/context-menu/sections/examples/context-menu-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/context-menu/examples"
componentGroup: "navigation"
symbols: ["TngContextMenuComponent"]
selectors: ["tng-context-menu"]
productId: "context-menu"
section: "examples"
officialCatalog: true
generated: true
---

# Context Menu examples

## Examples

Production context-menu flows for file rows, deployments, and operational surfaces across plain CSS and Tailwind wrapper shells. These demos anchor panels under the target for readability.

### context-menu-examples-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngContextMenuComponent } from '@tailng-ui/components';
import {
  TngContextMenuTrigger,
  TngMenuGroupLabel,
  TngMenuItem,
  type TngMenuSelectEvent,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-context-menu-examples-plain-css',
  standalone: true,
  imports: [
    TngContextMenuComponent,
    TngContextMenuTrigger,
    TngMenuGroupLabel,
    TngMenuItem,
  ],
  templateUrl: './context-menu-examples-plain-css.component.html',
  styleUrl: './context-menu-examples-plain-css.component.css',
})
export class ContextMenuExamplesPlainCssComponent {
  readonly lastAction = signal('No action yet');

onSelect(event: TngMenuSelectEvent): void {
  this.lastAction.set(String(event.value));
}
}
```

### context-menu-examples-plain-css.component.html

```html
<div class="context-menu-shell context-menu-shell--anchored">
  <div tabindex="0" [tngContextMenuTrigger]="menu">Right-click deployment row</div>
  <tng-context-menu
    #menu="tngContextMenu"
    ariaLabel="Deployment actions"
    (tngMenuSelect)="onSelect($event)"
  >
    <div tngMenuGroupLabel>Deployment</div>
    <button type="button" tngMenuItem tngMenuItemValue="Retry deployment">Retry</button>
    <button type="button" tngMenuItem tngMenuItemValue="Rollback deployment">Rollback</button>
    <button type="button" tngMenuItem tngMenuItemValue="View logs">View logs</button>
  </tng-context-menu>
</div>
<p>last action: {{ lastAction() }}</p>
```

### context-menu-examples-plain-css.component.css

```css
.context-menu-shell {
  position: relative;
}

.context-menu-shell [data-slot="menu"] {
  position: absolute;
  left: 0;
  top: calc(100% + 0.42rem);
}

/* Wrapper host already brings the panel surface; add slot styling for item spacing only. */
```

### context-menu-examples-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngContextMenuComponent } from '@tailng-ui/components';
import { TngContextMenuTrigger, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-context-menu-examples-tailwind',
  standalone: true,
  imports: [TngContextMenuComponent, TngContextMenuTrigger, TngMenuItem],
  templateUrl: './context-menu-examples-tailwind.component.html',
  styleUrl: './context-menu-examples-tailwind.component.css',
})
export class ContextMenuExamplesTailwindComponent {
  readonly lastAction = signal('No action yet');

onSelect(event: TngMenuSelectEvent): void {
  this.lastAction.set(String(event.value));
}
}
```

### context-menu-examples-tailwind.component.html

```html
<div class="relative grid gap-3 [&_[data-slot=menu]]:absolute [&_[data-slot=menu]]:left-0 [&_[data-slot=menu]]:top-[calc(100%+0.42rem)] [&_[data-slot=menu]]:shadow-lg [&_[data-slot=menu-item]]:w-full [&_[data-slot=menu-item]]:rounded-lg [&_[data-slot=menu-item]]:px-3 [&_[data-slot=menu-item]]:py-2 [&_[data-slot=menu-item][data-active]]:bg-sky-100">
  <div class="rounded-xl border px-4 py-3" tabindex="0" [tngContextMenuTrigger]="menu">
    Right-click node card
  </div>
  <tng-context-menu
    #menu="tngContextMenu"
    ariaLabel="Node actions"
    (tngMenuSelect)="onSelect($event)"
  >
    <button type="button" tngMenuItem tngMenuItemValue="Inspect node">Inspect</button>
    <button type="button" tngMenuItem tngMenuItemValue="Copy node id">Copy ID</button>
    <button type="button" tngMenuItem tngMenuItemValue="Delete node">Delete node</button>
  </tng-context-menu>
</div>
<p>last action: {{ lastAction() }}</p>
```

### context-menu-examples-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
