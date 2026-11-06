---
id: "components/chips/styling"
title: "Chips styling"
description: "Chips styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["chips","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/chips/tng-chip.component.ts","libs/tailng-ui/components/src/lib/form/chips/tng-chips.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/chips/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/styling/chips-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/styling/chips-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/styling/chips-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/chips/styling"
componentGroup: "form"
symbols: ["TngChipComponent","TngChipsComponent"]
selectors: ["tng-chip","tng-chips"]
productId: "chips"
section: "styling"
officialCatalog: true
generated: true
---

# Chips styling

## Supported contract

Style the wrapper from its host and style projected chip markup directly in your template. No `::ng-deep` is needed because the chip body belongs to you.

| Selector or token | Applied on | Purpose |
| --- | --- | --- |
| .your-wrapper-class | Wrapper host | Apply semantic background, border, and foreground tokens for the root shell. |
| [data-slot="chips"] | Projected root | Stable hook for the primitive list root when you want additional layout or state-driven tweaks. |
| [data-slot="chip"] | Projected chip item | Stable hook for the pill shell when you prefer attribute selectors over explicit classes. |
| [data-slot="chip-remove"] | Projected remove control | Stable hook for remove-button layout, hover, and focus styling. |
| [data-disabled] | Root, chip, remove control | Shared disabled-state hook reflected from the primitive contracts. |
| [data-focused] | Remove control | Focus hook on the remove button so you can draw a local ring without extra scripting. |

## Host tokens

The wrapper shell consumes semantic tokens from the host. Style the pills themselves with your own classes or the stable primitive state hooks.

#### chips.tokens.css

```css
.docs-component-chips-styling-shell {
  /* Optional brand tuning while inheriting semantic surface colors. */
  --tng-semantic-accent-brand: var(--tng-semantic-accent-brand);
  --tng-semantic-focus-ring: var(--tng-semantic-focus-ring);
}

.docs-component-chips-styling-chip {
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 38%, var(--tng-semantic-border-subtle));
  border-radius: 999px;
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-base));
  color: var(--tng-semantic-foreground-primary);
}

.docs-component-chips-styling-chip-remove[data-focused] {
  outline: 2px solid color-mix(in srgb, var(--tng-semantic-focus-ring) 38%, transparent);
  outline-offset: 2px;
}
```

Theme the wrapper at the host, then own the projected pill styling directly in your component stylesheet.

Selected:

Theme the wrapper at the host, then own the projected pill styling directly in the template.

Selected:

## Styling examples

### component-chips-styling-plain-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_STYLING_PLAIN_RELEASE_OWNERS = Object.freeze([
  'Mina Lee',
  'Sanjay Patel',
  'Omar Aziz',
]);

@Component({
  selector: 'app-component-chips-styling-plain-example',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-styling-plain-example.component.html',
  styleUrl: './component-chips-styling-plain-example.component.css',
})
export class ComponentChipsStylingPlainExampleComponent {
  readonly componentChipsStylingPlainReleaseOwners = signal<readonly string[]>(
    COMPONENT_CHIPS_STYLING_PLAIN_RELEASE_OWNERS,
  );
  readonly componentChipsStylingPlainSummary = computed(() => {
    const values = this.componentChipsStylingPlainReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsStylingPlainValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsStylingPlainReleaseOwners.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isComponentChipsStylingPlainLocked(owner: string): boolean {
    return owner === 'Omar Aziz';
  }
}
```

### component-chips-styling-plain-example.component.html

```html
<section class="docs-component-chips-styling-plain-shell-card">
  <div class="docs-component-chips-styling-plain-header">
    <span class="docs-component-chips-styling-plain-kicker">Release owners</span>
    <p class="docs-component-chips-styling-plain-copy">
      Theme the wrapper at the host, then own the projected pill styling directly in your component stylesheet.
    </p>
  </div>

  <div class="docs-component-chips-styling-plain-shell">
    <tng-chips
      [values]="componentChipsStylingPlainReleaseOwners()"
      (valuesChange)="onComponentChipsStylingPlainValuesChange($event)"
      [ariaLabel]="'Release owners'"
    >
      <div class="docs-component-chips-styling-plain-row">
        @for (owner of componentChipsStylingPlainReleaseOwners(); track owner) {
          <span
            tngChip
            [tngChipValue]="owner"
            [tngChipLabel]="owner"
            [tngChipDisabled]="isComponentChipsStylingPlainLocked(owner)"
            class="docs-component-chips-styling-plain-chip"
          >
            <span>{{ owner }}</span>
            <button tngChipRemove type="button" class="docs-component-chips-styling-plain-chip-remove">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="docs-component-chips-styling-plain-summary">Selected: {{ componentChipsStylingPlainSummary() }}</p>
</section>
```

### component-chips-styling-plain-example.component.css

```css
.docs-component-chips-styling-plain-shell-card {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-chips-styling-plain-shell {
  width: 100%;
  min-width: 0;
}

.docs-component-chips-styling-plain-shell tng-chips {
  display: block;
  width: 100%;
  min-width: 0;
}

.docs-component-chips-styling-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.docs-component-chips-styling-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 38%, var(--tng-semantic-border-subtle));
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-base));
  color: var(--tng-semantic-foreground-primary);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.45rem 0.8rem;
}

.docs-component-chips-styling-plain-chip[data-disabled] {
  border-color: var(--tng-semantic-border-subtle);
  background: var(--tng-semantic-background-muted);
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-chips-styling-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0;
}

.docs-component-chips-styling-plain-chip-remove[data-focused] {
  outline: 2px solid color-mix(in srgb, var(--tng-semantic-focus-ring) 38%, transparent);
  outline-offset: 2px;
}
```

### component-chips-styling-tailwind-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_STYLING_TAILWIND_RELEASE_OWNERS = Object.freeze([
  'Abigail Chen',
  'Mina Lee',
  'Sanjay Patel',
]);

@Component({
  selector: 'app-component-chips-styling-tailwind-example',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-styling-tailwind-example.component.html',
  styleUrl: './component-chips-styling-tailwind-example.component.css',
})
export class ComponentChipsStylingTailwindExampleComponent {
  readonly componentChipsStylingTailwindReleaseOwners = signal<readonly string[]>(
    COMPONENT_CHIPS_STYLING_TAILWIND_RELEASE_OWNERS,
  );
  readonly componentChipsStylingTailwindSummary = computed(() => {
    const values = this.componentChipsStylingTailwindReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsStylingTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsStylingTailwindReleaseOwners.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}
```

### component-chips-styling-tailwind-example.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release owners</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Theme the wrapper at the host, then own the projected pill styling directly in the template.
    </p>
  </div>

  <div class="block w-full min-w-0">
    <tng-chips
      [values]="componentChipsStylingTailwindReleaseOwners()"
      (valuesChange)="onComponentChipsStylingTailwindValuesChange($event)"
      [ariaLabel]="'Release owners'"
    >
      <div class="flex flex-wrap gap-2">
        @for (owner of componentChipsStylingTailwindReleaseOwners(); track owner) {
          <span tngChip [tngChipValue]="owner" [tngChipLabel]="owner" class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_38%,var(--tng-semantic-border-subtle))] bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-base))] px-3 py-2 text-sm font-medium text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--tng-semantic-background-surface)_72%,transparent)]">
            <span>{{ owner }}</span>
            <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] text-[0.8rem] leading-none text-[var(--tng-semantic-foreground-secondary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)]">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentChipsStylingTailwindSummary() }}</p>
</section>
```

### component-chips-styling-tailwind-example.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
