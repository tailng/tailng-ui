---
id: "components/menu/examples"
title: "Menu examples"
description: "Menu examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["menu","navigation","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/navigation/menu/tng-menu-trigger-for.directive.ts","libs/tailng-ui/components/src/lib/navigation/menu/tng-menu.component.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/routes.ts","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/examples/menu-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/examples/menu-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/navigation/menu/sections/examples/menu-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/navigation/menu/examples"
componentGroup: "navigation"
symbols: ["TngMenuComponent"]
selectors: ["tng-menu"]
productId: "menu"
section: "examples"
officialCatalog: true
generated: true
---

# Menu examples

## Examples

Reference patterns for trigger wiring, command groups, nested submenu behavior, and public-state styling hooks.

### menu-examples-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-plain-css-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-plain-css.component.html',
  styleUrl: './menu-examples-plain-css.component.css',
})
export class MenuExamplesPlainCssExampleComponent {
  protected readonly menuExamplesPlainLastCommand = signal('No command yet');

  protected onMenuExamplesPlainSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesPlainLastCommand.set(String(event.value));
  }
}
```

### menu-examples-plain-css.component.html

```html
<div>
  <tng-button
    type="button"
    id="menu-examples-plain-trigger"
    appearance="outline"
    tone="neutral"
    [tngMenuTriggerFor]="menuExamplesPlainMenu"
  >
    Options
  </tng-button>
  <tng-menu
    #menuExamplesPlainMenu="tngMenu"
    ariaLabel="Options menu"
    (tngMenuSelect)="onMenuExamplesPlainSelect($event)"
  >
    <div tngMenuGroupLabel>Options</div>
    <button type="button" tngMenuItem tngMenuItemValue="Pin item">Pin</button>
    <button type="button" tngMenuItem tngMenuItemValue="Mute notifications">Mute</button>
    <button type="button" tngMenuItem tngMenuItemValue="Remove item">Remove</button>
  </tng-menu>
</div>
<p>last command: {{ menuExamplesPlainLastCommand() }}</p>
```

### menu-examples-plain-css.component.css

```css
/* Layout only: tng-button handles the trigger, and tng-menu handles panel, label, and items. */
```

### menu-examples-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-tailwind-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-tailwind.component.html',
})
export class MenuExamplesTailwindExampleComponent {
  protected readonly menuExamplesTailwindLastCommand = signal('No command yet');

  protected onMenuExamplesTailwindSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesTailwindLastCommand.set(String(event.value));
  }
}
```

### menu-examples-tailwind.component.html

```html
<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div>
    <tng-button
      type="button"
      id="menu-examples-tailwind-trigger"
      appearance="outline"
      tone="neutral"
      [tngMenuTriggerFor]="menuExamplesTailwindMenu"
    >
      Open menu
    </tng-button>
    <tng-menu
      #menuExamplesTailwindMenu="tngMenu"
      ariaLabel="Tailwind actions menu"
      (tngMenuSelect)="onMenuExamplesTailwindSelect($event)"
    >
      <div tngMenuGroupLabel>Actions</div>
      <button type="button" tngMenuItem tngMenuItemValue="Export report">Export report</button>
      <button type="button" tngMenuItem tngMenuItemValue="Share link">Share link</button>
      <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>
    </tng-menu>
  </div>
</div>
<p>last command: {{ menuExamplesTailwindLastCommand() }}</p>
```

### menu-examples-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### menu-examples-button-trigger-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-button-trigger-plain-css-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-button-trigger-plain-css.component.html',
  styleUrl: './menu-examples-button-trigger-plain-css.component.css',
})
export class MenuExamplesButtonTriggerPlainCssExampleComponent {
  protected readonly menuExamplesButtonTriggerLastCommand = signal('No command yet');

  protected onMenuExamplesButtonTriggerSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesButtonTriggerLastCommand.set(String(event.value));
  }
}
```

### menu-examples-button-trigger-plain-css.component.html

```html
<div>
  <tng-button
    type="button"
    tone="neutral"
    appearance="outline"
    id="menu-examples-button-trigger"
    [tngMenuTriggerFor]="menuExamplesButtonTriggerMenu"
  >
    Options
  </tng-button>
  <tng-menu
    #menuExamplesButtonTriggerMenu="tngMenu"
    ariaLabel="Button trigger options menu"
    (tngMenuSelect)="onMenuExamplesButtonTriggerSelect($event)"
  >
    <div tngMenuGroupLabel>Options</div>
    <button type="button" tngMenuItem tngMenuItemValue="Pin item">Pin</button>
    <button type="button" tngMenuItem tngMenuItemValue="Mute notifications">Mute</button>
    <button type="button" tngMenuItem tngMenuItemValue="Remove item">Remove</button>
  </tng-menu>
</div>
<p>last command: {{ menuExamplesButtonTriggerLastCommand() }}</p>
```

### menu-examples-button-trigger-plain-css.component.css

```css
/* tng-button provides trigger styling; menu panel uses the shared theme contract. */
```

### menu-examples-button-trigger-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-button-trigger-tailwind-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-button-trigger-tailwind.component.html',
})
export class MenuExamplesButtonTriggerTailwindExampleComponent {
  protected readonly menuExamplesButtonTriggerTailwindLastCommand = signal('No command yet');

  protected onMenuExamplesButtonTriggerTailwindSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesButtonTriggerTailwindLastCommand.set(String(event.value));
  }
}
```

### menu-examples-button-trigger-tailwind.component.html

```html
<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div>
    <tng-button
      type="button"
      tone="primary"
      appearance="solid"
      size="sm"
      id="menu-examples-button-trigger-tailwind"
      [tngMenuTriggerFor]="menuExamplesButtonTriggerTailwindMenu"
    >
      Open menu
    </tng-button>
    <tng-menu
      #menuExamplesButtonTriggerTailwindMenu="tngMenu"
      ariaLabel="Button trigger actions menu"
      (tngMenuSelect)="onMenuExamplesButtonTriggerTailwindSelect($event)"
    >
      <div tngMenuGroupLabel>Actions</div>
      <button type="button" tngMenuItem tngMenuItemValue="Export report">Export report</button>
      <button type="button" tngMenuItem tngMenuItemValue="Share link">Share link</button>
      <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>
    </tng-menu>
  </div>
</div>
<p>last command: {{ menuExamplesButtonTriggerTailwindLastCommand() }}</p>
```

### menu-examples-button-trigger-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### menu-examples-icon-trigger-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-icon-trigger-plain-css-example',
  standalone: true,
  imports: [TngIcon, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-icon-trigger-plain-css.component.html',
})
export class MenuExamplesIconTriggerPlainCssExampleComponent {
  protected readonly menuExamplesIconTriggerLastCommand = signal('No command yet');

  protected onMenuExamplesIconTriggerSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesIconTriggerLastCommand.set(String(event.value));
  }
}
```

### menu-examples-icon-trigger-plain-css.component.html

```html
<div>
  <tng-icon
    id="menu-examples-icon-trigger"
    icon="ellipsis-vertical"
    tabindex="0"
    aria-label="Options"
    [tngMenuTriggerFor]="menuExamplesIconTriggerMenu"
  />
  <tng-menu
    #menuExamplesIconTriggerMenu="tngMenu"
    ariaLabel="Icon trigger options menu"
    (tngMenuSelect)="onMenuExamplesIconTriggerSelect($event)"
  >
    <div tngMenuGroupLabel>Options</div>
    <button type="button" tngMenuItem tngMenuItemValue="Pin item">Pin</button>
    <button type="button" tngMenuItem tngMenuItemValue="Mute notifications">Mute</button>
    <button type="button" tngMenuItem tngMenuItemValue="Remove item">Remove</button>
  </tng-menu>
</div>
<p>last command: {{ menuExamplesIconTriggerLastCommand() }}</p>
```

### menu-examples-icon-trigger-plain-css.component.css

```css
/* Layout only: tng-icon handles the trigger, and tng-menu handles panel, label, and items. */
```

### menu-examples-icon-trigger-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-icon-trigger-tailwind-example',
  standalone: true,
  imports: [TngIcon, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-icon-trigger-tailwind.component.html',
})
export class MenuExamplesIconTriggerTailwindExampleComponent {
  protected readonly menuExamplesIconTriggerTailwindLastCommand = signal('No command yet');

  protected onMenuExamplesIconTriggerTailwindSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesIconTriggerTailwindLastCommand.set(String(event.value));
  }
}
```

### menu-examples-icon-trigger-tailwind.component.html

```html
<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div>
    <tng-icon
      id="menu-examples-icon-trigger-tailwind"
      icon="ellipsis-vertical"
      tabindex="0"
      aria-label="Options"
      [tngMenuTriggerFor]="menuExamplesIconTriggerTailwindMenu"
      class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[color:var(--tng-semantic-foreground-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary)_6%,transparent)] hover:text-[color:var(--tng-semantic-foreground-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)] aria-expanded:text-[color:var(--tng-semantic-foreground-primary)]"
    />
    <tng-menu
      #menuExamplesIconTriggerTailwindMenu="tngMenu"
      ariaLabel="Icon trigger actions menu"
      (tngMenuSelect)="onMenuExamplesIconTriggerTailwindSelect($event)"
    >
      <div tngMenuGroupLabel>Actions</div>
      <button type="button" tngMenuItem tngMenuItemValue="Export report">Export report</button>
      <button type="button" tngMenuItem tngMenuItemValue="Share link">Share link</button>
      <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>
    </tng-menu>
  </div>
</div>
<p>last command: {{ menuExamplesIconTriggerTailwindLastCommand() }}</p>
```

### menu-examples-icon-trigger-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### menu-examples-styled-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-styled-plain-css-example',
  standalone: true,
  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-styled-plain-css.component.html',
  styleUrl: './menu-examples-styled-plain-css.component.css',
})
export class MenuExamplesStyledPlainCssExampleComponent {
  protected readonly menuExamplesStyledPlainLastCommand = signal('No command yet');

  protected onMenuExamplesStyledPlainSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesStyledPlainLastCommand.set(String(event.value));
  }
}
```

### menu-examples-styled-plain-css.component.html

```html
<div class="menu-examples-styled-plain-shell">
  <p class="menu-examples-styled-plain-note">
    Use this example when you want to own the trigger and panel look, while styling from public state
    hooks like <code>aria-expanded</code>, <code>data-state</code>, and <code>data-active</code>.
  </p>
  <button
    type="button"
    id="menu-examples-styled-plain-trigger"
    [tngMenuTriggerFor]="menuExamplesStyledPlainMenu"
    class="menu-examples-styled-plain-trigger"
  >
    Deploy
  </button>
  <tng-menu
    #menuExamplesStyledPlainMenu="tngMenu"
    ariaLabel="Styled deployment menu"
    class="menu-examples-styled-plain-menu"
    (tngMenuSelect)="onMenuExamplesStyledPlainSelect($event)"
  >
    <div tngMenuGroupLabel class="menu-examples-styled-plain-label">Deployment</div>
    <button type="button" tngMenuItem tngMenuItemValue="Run checks" class="menu-examples-styled-plain-item">
      Run checks
    </button>
    <button
      type="button"
      tngMenuItem
      [tngMenuItemSubmenu]="menuExamplesStyledPlainTargetMenu"
      tngMenuItemValue="Choose target"
      class="menu-examples-styled-plain-item"
    >
      Choose target
    </button>
    <button
      type="button"
      tngMenuItem
      tngMenuItemValue="Rollback build"
      disabled
      class="menu-examples-styled-plain-item"
    >
      Rollback
    </button>

    <tng-menu
      #menuExamplesStyledPlainTargetMenu="tngMenu"
      ariaLabel="Deployment target menu"
      class="menu-examples-styled-plain-menu"
      (tngMenuSelect)="onMenuExamplesStyledPlainSelect($event)"
    >
      <button type="button" tngMenuItem tngMenuItemValue="Deploy to staging" class="menu-examples-styled-plain-item">
        Staging cluster
      </button>
      <button type="button" tngMenuItem tngMenuItemValue="Deploy to production" class="menu-examples-styled-plain-item">
        Production cluster
      </button>
    </tng-menu>
  </tng-menu>
</div>
<p>last styled command: {{ menuExamplesStyledPlainLastCommand() }}</p>
```

### menu-examples-styled-plain-css.component.css

```css
.menu-examples-styled-plain-shell {
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  position: relative;
}

.menu-examples-styled-plain-note {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0;
  max-width: 34rem;
}

.menu-examples-styled-plain-note code {
  color: var(--tng-semantic-foreground-primary);
  font-family: inherit;
  font-weight: 700;
}

.menu-examples-styled-plain-trigger {
  appearance: none;
  -webkit-appearance: none;
  align-items: center;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-background-canvas) 82%, var(--tng-semantic-accent-brand) 6%),
    color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-accent-brand) 9%)
  );
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 20%, var(--tng-semantic-border-subtle));
  border-radius: 0.9rem;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--tng-semantic-background-canvas) 65%, transparent),
    0 10px 18px -16px color-mix(in srgb, var(--tng-semantic-foreground-primary) 42%, transparent);
  color: var(--tng-semantic-foreground-primary);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.94rem;
  font-weight: 700;
  gap: 0.5rem;
  justify-content: center;
  letter-spacing: 0.01em;
  min-height: 2.8rem;
  padding: 0 1.15rem;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease,
    color 120ms ease,
    transform 120ms ease;
}

.menu-examples-styled-plain-trigger:hover {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-background-canvas) 74%, var(--tng-semantic-accent-brand) 10%),
    color-mix(in srgb, var(--tng-semantic-background-surface) 86%, var(--tng-semantic-accent-brand) 13%)
  );
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 34%, var(--tng-semantic-border-strong));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, transparent),
    0 12px 20px -16px color-mix(in srgb, var(--tng-semantic-accent-brand) 34%, transparent);
  transform: translateY(-1px);
}

.menu-examples-styled-plain-trigger:focus-visible {
  outline: none;
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 52%, var(--tng-semantic-border-strong));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, transparent),
    0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent),
    0 14px 22px -18px color-mix(in srgb, var(--tng-semantic-accent-brand) 36%, transparent);
}

.menu-examples-styled-plain-trigger[aria-expanded="true"] {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--tng-semantic-background-canvas) 70%, var(--tng-semantic-accent-brand) 15%),
    color-mix(in srgb, var(--tng-semantic-background-surface) 78%, var(--tng-semantic-accent-brand) 18%)
  );
  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 50%, var(--tng-semantic-border-strong));
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent),
    0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent),
    0 14px 24px -18px color-mix(in srgb, var(--tng-semantic-accent-brand) 38%, transparent);
  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 78%, var(--tng-semantic-foreground-primary));
}

.menu-examples-styled-plain-menu[data-state="open"] {
  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 94%, var(--tng-semantic-background-surface));
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 24%, var(--tng-semantic-border-subtle));
  border-radius: 0.95rem;
  box-shadow: 0 18px 36px -22px color-mix(in srgb, var(--tng-semantic-foreground-primary) 28%, transparent);
  padding: 0.45rem;
}

.menu-examples-styled-plain-label {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  padding: 0.35rem 0.55rem 0.2rem;
  text-transform: uppercase;
}

.menu-examples-styled-plain-item {
  border-radius: 0.72rem;
  min-height: 2.15rem;
  padding: 0.5rem 0.72rem;
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}

.menu-examples-styled-plain-item:hover:not([aria-disabled="true"]) {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 8%, transparent);
}

.menu-examples-styled-plain-item[data-active],
.menu-examples-styled-plain-item[aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand) 24%, transparent);
  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 76%, var(--tng-semantic-foreground-primary));
}

.menu-examples-styled-plain-item[aria-disabled="true"] {
  color: var(--tng-semantic-foreground-muted);
  opacity: 0.48;
}
```

### menu-examples-styled-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-styled-tailwind-example',
  standalone: true,
  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-styled-tailwind.component.html',
})
export class MenuExamplesStyledTailwindExampleComponent {
  protected readonly menuExamplesStyledTailwindLastCommand = signal('No command yet');

  protected onMenuExamplesStyledTailwindSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesStyledTailwindLastCommand.set(String(event.value));
  }
}
```

### menu-examples-styled-tailwind.component.html

```html
<div class="rounded-xl border border-[color:var(--tng-semantic-border-subtle)] bg-[color:color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="grid justify-items-start gap-3 relative">
    <p class="m-0 max-w-[34rem] text-[0.88rem] leading-[1.55] text-[color:var(--tng-semantic-foreground-secondary)]">
      Use this example when you want utility-owned styling on the wrapper shell, while reacting to public
      menu state like <code class="font-bold text-[color:var(--tng-semantic-foreground-primary)]">aria-expanded</code>,
      <code class="font-bold text-[color:var(--tng-semantic-foreground-primary)]">data-state</code>, and
      <code class="font-bold text-[color:var(--tng-semantic-foreground-primary)]">data-active</code>.
    </p>
    <button
      type="button"
      id="menu-examples-styled-tailwind-trigger"
      [tngMenuTriggerFor]="menuExamplesStyledTailwindMenu"
      class="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_22%,var(--tng-semantic-border-subtle))] bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,var(--tng-semantic-background-surface))] px-4 text-[0.95rem] font-semibold text-[color:var(--tng-semantic-foreground-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_14%,var(--tng-semantic-background-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] aria-expanded:border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_50%,var(--tng-semantic-border-strong))] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_18%,var(--tng-semantic-background-surface))] aria-expanded:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_78%,var(--tng-semantic-foreground-primary))]"
    >
      Deploy
    </button>
    <tng-menu
      #menuExamplesStyledTailwindMenu="tngMenu"
      ariaLabel="Styled deployment menu"
      class="min-w-[14rem] rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,var(--tng-semantic-border-subtle))] bg-[color:color-mix(in_srgb,var(--tng-semantic-background-canvas)_94%,var(--tng-semantic-background-surface))] p-[0.45rem] shadow-[0_18px_36px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_28%,transparent)] data-[state=open]:gap-[0.18rem]"
      (tngMenuSelect)="onMenuExamplesStyledTailwindSelect($event)"
    >
      <div tngMenuGroupLabel class="px-[0.55rem] pb-[0.2rem] pt-[0.35rem] text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[color:var(--tng-semantic-foreground-secondary)]">Deployment</div>
      <button type="button" tngMenuItem tngMenuItemValue="Run checks" class="flex min-h-[2.15rem] w-full items-center justify-between rounded-[0.72rem] px-[0.72rem] py-[0.5rem] text-left text-[0.88rem] font-medium text-[color:var(--tng-semantic-foreground-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] [&[data-active]]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,var(--tng-semantic-foreground-primary))]">Run checks</button>
      <button type="button" tngMenuItem [tngMenuItemSubmenu]="menuExamplesStyledTailwindTargetMenu" tngMenuItemValue="Choose target" class="flex min-h-[2.15rem] w-full items-center justify-between rounded-[0.72rem] px-[0.72rem] py-[0.5rem] text-left text-[0.88rem] font-medium text-[color:var(--tng-semantic-foreground-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] [&[data-active]]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,var(--tng-semantic-foreground-primary))] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] aria-expanded:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,var(--tng-semantic-foreground-primary))]">Choose target</button>
      <button type="button" tngMenuItem tngMenuItemValue="Rollback build" disabled class="flex min-h-[2.15rem] w-full items-center justify-between rounded-[0.72rem] px-[0.72rem] py-[0.5rem] text-left text-[0.88rem] font-medium text-[color:var(--tng-semantic-foreground-primary)] transition aria-disabled:opacity-50 disabled:cursor-not-allowed">Rollback</button>
      <tng-menu
        #menuExamplesStyledTailwindTargetMenu="tngMenu"
        ariaLabel="Deployment target menu"
        class="min-w-[13rem] rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,var(--tng-semantic-border-subtle))] bg-[color:color-mix(in_srgb,var(--tng-semantic-background-canvas)_94%,var(--tng-semantic-background-surface))] p-[0.45rem] shadow-[0_18px_36px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_28%,transparent)] data-[state=open]:gap-[0.18rem]"
        (tngMenuSelect)="onMenuExamplesStyledTailwindSelect($event)"
      >
        <button type="button" tngMenuItem tngMenuItemValue="Deploy to staging" class="flex min-h-[2.15rem] w-full items-center justify-between rounded-[0.72rem] px-[0.72rem] py-[0.5rem] text-left text-[0.88rem] font-medium text-[color:var(--tng-semantic-foreground-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] [&[data-active]]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,var(--tng-semantic-foreground-primary))]">Staging cluster</button>
        <button type="button" tngMenuItem tngMenuItemValue="Deploy to production" class="flex min-h-[2.15rem] w-full items-center justify-between rounded-[0.72rem] px-[0.72rem] py-[0.5rem] text-left text-[0.88rem] font-medium text-[color:var(--tng-semantic-foreground-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_28%,transparent)] [&[data-active]]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand)_76%,var(--tng-semantic-foreground-primary))]">Production cluster</button>
      </tng-menu>
    </tng-menu>
  </div>
</div>
<p>last styled command: {{ menuExamplesStyledTailwindLastCommand() }}</p>
```

### menu-examples-styled-tailwind.component.css

```css
/* Tailwind utilities style the wrapper through public attrs like aria-expanded, data-state, and data-active. */
```

### menu-examples-cascade-plain-css.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-cascade-plain-css-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuItem],
  templateUrl: './menu-examples-cascade-plain-css.component.html',
  styleUrl: './menu-examples-cascade-plain-css.component.css',
})
export class MenuExamplesCascadePlainCssExampleComponent {
  protected readonly menuExamplesCascadePlainLastCommand = signal('No command yet');

  protected onMenuExamplesCascadePlainSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesCascadePlainLastCommand.set(String(event.value));
  }
}
```

### menu-examples-cascade-plain-css.component.html

```html
<div>
  <tng-button
    type="button"
    id="menu-examples-cascade-plain-root-trigger"
    appearance="outline"
    tone="neutral"
    [tngMenuTriggerFor]="menuExamplesCascadePlainRootMenu"
  >
    Import
  </tng-button>
  <tng-menu
    #menuExamplesCascadePlainRootMenu="tngMenu"
    ariaLabel="Import root menu"
    (tngMenuSelect)="onMenuExamplesCascadePlainSelect($event)"
  >
    <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>
    <button
      type="button"
      tngMenuItem
      [tngMenuItemSubmenu]="menuExamplesCascadePlainGitMenu"
      tngMenuItemValue="Import from git"
    >
      Git repository
    </button>

    <tng-menu
      #menuExamplesCascadePlainGitMenu="tngMenu"
      ariaLabel="Git submenu"
      (tngMenuSelect)="onMenuExamplesCascadePlainSelect($event)"
    >
      <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>
      <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>
    </tng-menu>
  </tng-menu>
</div>
<p>last cascaded command: {{ menuExamplesCascadePlainLastCommand() }}</p>
```

### menu-examples-cascade-plain-css.component.css

```css
/* Layout only: tng-button handles the trigger, and tng-menu handles panel and submenu flyouts. */
```

### menu-examples-cascade-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngButtonComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-cascade-tailwind-example',
  standalone: true,
  imports: [TngButtonComponent, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-cascade-tailwind.component.html',
})
export class MenuExamplesCascadeTailwindExampleComponent {
  protected readonly menuExamplesCascadeTailwindLastCommand = signal('No command yet');

  protected onMenuExamplesCascadeTailwindSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesCascadeTailwindLastCommand.set(String(event.value));
  }
}
```

### menu-examples-cascade-tailwind.component.html

```html
<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="menu-example-trigger-shell">
    <tng-button
      type="button"
      id="menu-examples-cascade-tailwind-root-trigger"
      appearance="outline"
      tone="neutral"
      [tngMenuTriggerFor]="menuExamplesCascadeTailwindRootMenu"
    >
      Import
    </tng-button>
    <tng-menu
      #menuExamplesCascadeTailwindRootMenu="tngMenu"
      ariaLabel="Import root menu"
      (tngMenuSelect)="onMenuExamplesCascadeTailwindSelect($event)"
    >
      <div tngMenuGroupLabel>Import</div>
      <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>
      <button type="button" tngMenuItem [tngMenuItemSubmenu]="menuExamplesCascadeTailwindGitMenu" tngMenuItemValue="Import from git">Git repository</button>
    <tng-menu
      #menuExamplesCascadeTailwindGitMenu="tngMenu"
      ariaLabel="Git submenu"
      (tngMenuSelect)="onMenuExamplesCascadeTailwindSelect($event)"
    >
      <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>
      <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>
    </tng-menu>
    </tng-menu>
  </div>
</div>
<p>last cascaded command: {{ menuExamplesCascadeTailwindLastCommand() }}</p>
```

### menu-examples-cascade-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### menu-examples-sticky-header.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menu-examples-sticky-header-example',
  standalone: true,
  imports: [TngIcon, TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],
  templateUrl: './menu-examples-sticky-header.component.html',
  styleUrl: './menu-examples-sticky-header.component.css',
})
export class MenuExamplesStickyHeaderExampleComponent {
  protected readonly menuExamplesStickyHeaderLastCommand = signal('No command yet');

  protected onMenuExamplesStickyHeaderSelect(event: TngMenuSelectEvent): void {
    this.menuExamplesStickyHeaderLastCommand.set(String(event.value));
  }
}
```

### menu-examples-sticky-header.component.html

```html
<div class="menu-examples-app-shell">
  <header class="menu-examples-app-shell-header">
    <div class="menu-examples-app-shell-title">
      <span>Workspace</span>
      <small>Review queue</small>
    </div>
    <tng-icon
      id="menu-examples-sticky-header-trigger"
      icon="palette"
      tabindex="0"
      aria-label="Theme"
      class="menu-examples-app-shell-trigger"
      [tngMenuTriggerFor]="menuExamplesStickyHeaderMenu"
    />
    <tng-menu
      #menuExamplesStickyHeaderMenu="tngMenu"
      ariaLabel="Theme menu"
      scrollStrategy="reposition"
      (tngMenuSelect)="onMenuExamplesStickyHeaderSelect($event)"
    >
      <div tngMenuGroupLabel>Theme</div>
      <button type="button" tngMenuItem tngMenuItemValue="System theme">System</button>
      <button type="button" tngMenuItem tngMenuItemValue="Light theme">Light</button>
      <button type="button" tngMenuItem tngMenuItemValue="Dark theme">Dark</button>
    </tng-menu>
  </header>
  <div class="menu-examples-app-shell-body" aria-hidden="true">
    <div class="menu-examples-app-shell-row"></div>
    <div class="menu-examples-app-shell-row"></div>
    <div class="menu-examples-app-shell-row"></div>
    <div class="menu-examples-app-shell-row"></div>
    <div class="menu-examples-app-shell-row"></div>
  </div>
</div>
<p>last shell command: {{ menuExamplesStickyHeaderLastCommand() }}</p>
```

### menu-examples-sticky-header.component.css

```css
.menu-examples-app-shell {
  background: var(--tng-semantic-background-surface);
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  max-height: 17rem;
  overflow: auto;
  width: min(100%, 34rem);
}

.menu-examples-app-shell-header {
  align-items: center;
  backdrop-filter: blur(14px);
  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 82%, transparent);
  border-bottom: 1px solid var(--tng-semantic-border-subtle);
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.85rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.menu-examples-app-shell-title {
  display: grid;
  gap: 0.15rem;
}

.menu-examples-app-shell-title span {
  color: var(--tng-semantic-foreground-primary);
  font-weight: 700;
}

.menu-examples-app-shell-title small {
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.78rem;
}

.menu-examples-app-shell-trigger {
  align-items: center;
  border-radius: 0.55rem;
  color: var(--tng-semantic-foreground-secondary);
  cursor: pointer;
  display: inline-flex;
  height: 2.25rem;
  justify-content: center;
  transition: background-color 120ms ease, color 120ms ease;
  width: 2.25rem;
}

.menu-examples-app-shell-trigger:hover,
.menu-examples-app-shell-trigger[aria-expanded="true"] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);
  color: var(--tng-semantic-foreground-primary);
}

.menu-examples-app-shell-trigger:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 28%, transparent);
  outline-offset: 2px;
}

.menu-examples-app-shell-body {
  display: grid;
  gap: 0.75rem;
  padding: 0.85rem;
}

.menu-examples-app-shell-row {
  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 72%, var(--tng-semantic-background-surface));
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.75rem;
  height: 3.25rem;
}
```
