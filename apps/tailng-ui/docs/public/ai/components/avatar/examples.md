---
id: "components/avatar/examples"
title: "Avatar examples"
description: "Avatar examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["avatar","utility","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/avatar/tng-avatar.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/examples/avatar-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/examples/avatar-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/avatar/sections/examples/avatar-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/avatar/examples"
componentGroup: "utility"
symbols: ["TngAvatarComponent"]
selectors: ["tng-avatar"]
productId: "avatar"
section: "examples"
officialCatalog: true
generated: true
---

# Avatar examples

## Examples

These examples stay wrapper-focused: the component owns fallback display and slot markup while you compose surrounding roster and status layouts.

### avatar-examples-team-roster-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-avatar-examples-team-roster-plain-css',
  standalone: true,
  imports: [TngAvatarComponent],
  templateUrl: './avatar-examples-team-roster-plain-css.component.html',
  styleUrl: './avatar-examples-team-roster-plain-css.component.css',
})
export class AvatarExamplesTeamRosterPlainCssComponent {
  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
}
```

### avatar-examples-team-roster-plain-css.component.html

```html
<div class="avatar-team-grid">
  <div class="avatar-team-card">
    <tng-avatar [src]="sampleImage" fallback="Alex" alt="Alex Morgan"></tng-avatar>
    <div>
      <strong>Alex Morgan</strong>
      <p>Design systems</p>
    </div>
  </div>
  <div class="avatar-team-card">
    <tng-avatar [src]="null" fallback="TN" alt="Taylor Nguyen"></tng-avatar>
    <div>
      <strong>Taylor Nguyen</strong>
      <p>Release engineering</p>
    </div>
  </div>
</div>
```

### avatar-examples-team-roster-plain-css.component.css

```css
.avatar-team-grid {
  display: grid;
  gap: 0.75rem;
}

.avatar-team-card {
  align-items: center;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: auto 1fr;
}
```

### avatar-examples-team-roster-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-avatar-examples-team-roster-tailwind',
  standalone: true,
  imports: [TngAvatarComponent],
  templateUrl: './avatar-examples-team-roster-tailwind.component.html',
  styleUrl: './avatar-examples-team-roster-tailwind.component.css',
})
export class AvatarExamplesTeamRosterTailwindComponent {
  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
}
```

### avatar-examples-team-roster-tailwind.component.html

```html
<div class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="grid grid-cols-[auto_1fr] items-center gap-3">
    <tng-avatar [src]="sampleImage" fallback="Alex" alt="Alex Morgan" size="lg"></tng-avatar>
    <div>
      <p class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Alex Morgan</p>
      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Design systems</p>
    </div>
  </div>
  <div class="grid grid-cols-[auto_1fr] items-center gap-3">
    <tng-avatar [src]="null" fallback="TN" alt="Taylor Nguyen"></tng-avatar>
    <div>
      <p class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Taylor Nguyen</p>
      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Release engineering</p>
    </div>
  </div>
</div>
```

### avatar-examples-team-roster-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### avatar-examples-presence-strip-plain-css.component.ts

```ts
import { Component } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-avatar-examples-presence-strip-plain-css',
  standalone: true,
  imports: [TngAvatarComponent],
  templateUrl: './avatar-examples-presence-strip-plain-css.component.html',
  styleUrl: './avatar-examples-presence-strip-plain-css.component.css',
})
export class AvatarExamplesPresenceStripPlainCssComponent {
  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
}
```

### avatar-examples-presence-strip-plain-css.component.html

```html
<div class="avatar-presence-strip">
  <div class="avatar-presence-item">
    <tng-avatar [src]="sampleImage" fallback="PR" alt="Priya Raman"></tng-avatar>
    <span class="avatar-presence-dot avatar-presence-dot--online"></span>
  </div>
  <div class="avatar-presence-item">
    <tng-avatar [src]="null" fallback="DN" alt="Dev Narang" shape="square"></tng-avatar>
    <span class="avatar-presence-dot avatar-presence-dot--busy"></span>
  </div>
</div>
```

### avatar-examples-presence-strip-plain-css.component.css

```css
.avatar-presence-strip {
  display: flex;
  gap: 0.75rem;
}

.avatar-presence-item {
  position: relative;
}

.avatar-presence-dot {
  border: 2px solid var(--tng-semantic-background-base);
  border-radius: 9999px;
  bottom: -0.12rem;
  height: 0.85rem;
  position: absolute;
  right: -0.12rem;
  width: 0.85rem;
}

.avatar-presence-dot--online {
  background: var(--tng-semantic-accent-success);
}

.avatar-presence-dot--busy {
  background: var(--tng-semantic-accent-warning);
}
```

### avatar-examples-presence-strip-tailwind.component.ts

```ts
import { Component } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-avatar-examples-presence-strip-tailwind',
  standalone: true,
  imports: [TngAvatarComponent],
  templateUrl: './avatar-examples-presence-strip-tailwind.component.html',
  styleUrl: './avatar-examples-presence-strip-tailwind.component.css',
})
export class AvatarExamplesPresenceStripTailwindComponent {
  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';
}
```

### avatar-examples-presence-strip-tailwind.component.html

```html
<div class="flex gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">
  <div class="relative">
    <tng-avatar [src]="sampleImage" fallback="PR" alt="Priya Raman"></tng-avatar>
    <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--tng-semantic-background-base)] bg-[var(--tng-semantic-accent-success)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_70%,transparent)]"></span>
  </div>
  <div class="relative">
    <tng-avatar [src]="null" fallback="DN" alt="Dev Narang" shape="square"></tng-avatar>
    <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--tng-semantic-background-base)] bg-[var(--tng-semantic-accent-warning)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_70%,transparent)]"></span>
  </div>
</div>
```

### avatar-examples-presence-strip-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
