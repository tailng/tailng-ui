---
id: "components/select/styling"
title: "Select styling"
description: "Select styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["select","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/select/tng-select.component.ts","libs/tailng-ui/components/src/lib/form/select/tng-select.slots.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/styling/select-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/styling/select-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/styling/select-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/select/styling"
componentGroup: "form"
symbols: ["TngSelectComponent"]
selectors: ["tng-select"]
productId: "select"
section: "styling"
officialCatalog: true
generated: true
---

# Select styling

## Supported contract

Theme the wrapper from its host. Override semantic and select tokens on `<tng-select>`; drop to headless when you need full trigger or overlay DOM ownership.

| Selector or token | Applied on | Purpose |
| --- | --- | --- |
| <tng-select> + --tng-select-* | Wrapper host | Stable surface for trigger, option, and overlay theming through copied host tokens. |
| --tng-select-z-overlay | Wrapper host | Controls the portaled overlay stacking level; falls back to --tng-z-overlay. |
| --tng-semantic-* | Wrapper host | Feeds the shared light and dark semantic palette used by the select contract. |
| #tngSelectValueTpl | Projected template | Customizes the selected-value markup while preserving trigger semantics. |
| #tngSelectOptionTpl | Projected template | Customizes option rows while preserving listbox behavior and selection state. |

## Host tokens

These host-level variables are the stable styling surface for the wrapper. The same token set feeds the trigger, option rows, and the portaled overlay.

#### select.tokens.css

```css
tng-select.docs-component-select-styling-release-owner-shell {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;

  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #f8fafc;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}

/* Palette tokens stay on the host. */
/* Add slot-level spacing only when you need a more opinionated presentation shell. */
```

Host-level tokens define the palette while a small amount of slot spacing keeps the wrapper presentation tidy.

Selected:

Host-level tokens define the palette while a small amount of slot spacing keeps the wrapper presentation tidy.

Selected:

## Styling examples

### component-select-styling-plain-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectStylingPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_STYLING_PLAIN_RELEASE_OWNER_OPTIONS: readonly ComponentSelectStylingPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-component-select-styling-plain-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-styling-plain-example.component.html',
  styleUrl: './component-select-styling-plain-example.component.css',
})
export class ComponentSelectStylingPlainExampleComponent {
  readonly componentSelectStylingPlainReleaseOwners = COMPONENT_SELECT_STYLING_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly componentSelectStylingPlainSelectedOwnerId = signal<string | null>('mina');
  readonly componentSelectStylingPlainSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectStylingPlainSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectStylingPlainReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectStylingPlainOwnerValue = (owner: ComponentSelectStylingPlainReleaseOwnerOption) => owner.id;
  readonly getComponentSelectStylingPlainOwnerLabel = (owner: ComponentSelectStylingPlainReleaseOwnerOption) => owner.name;
  readonly isComponentSelectStylingPlainOwnerDisabled = (owner: ComponentSelectStylingPlainReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectStylingPlainSelectedOwnerChange(value: unknown): void {
    this.componentSelectStylingPlainSelectedOwnerId.set(this.toComponentSelectStylingPlainSingleValue(value));
  }

  private toComponentSelectStylingPlainSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}
```

### component-select-styling-plain-example.component.html

```html
<section class="docs-component-select-styling-plain-shell">
  <div class="docs-component-select-styling-plain-header">
    <span class="docs-component-select-styling-plain-kicker">Release owners</span>
    <p class="docs-component-select-styling-plain-copy">
      Host-level tokens define the palette while a small amount of slot spacing keeps the wrapper presentation tidy.
    </p>
  </div>

  <div class="docs-component-select-styling-plain-control docs-component-select-styling-release-owner-shell">
    <tng-select
      [options]="componentSelectStylingPlainReleaseOwners"
      [value]="componentSelectStylingPlainSelectedOwnerId()"
      (valueChange)="onComponentSelectStylingPlainSelectedOwnerChange($event)"
      [getOptionValue]="getComponentSelectStylingPlainOwnerValue"
      [getOptionLabel]="getComponentSelectStylingPlainOwnerLabel"
      [isOptionDisabled]="isComponentSelectStylingPlainOwnerDisabled"
      placeholder="Assign release owner"
      [ariaLabel]="'Release owners'"
    ></tng-select>
  </div>

  <p class="docs-component-select-styling-plain-summary">
    Selected: {{ componentSelectStylingPlainSelectedOwnerSummary() }}
  </p>
</section>
```

### component-select-styling-plain-example.component.css

```css
.docs-component-select-styling-plain-shell {
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

.docs-component-select-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-styling-plain-copy,
.docs-component-select-styling-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

/* Host-level tokens – the component base CSS consumes them automatically. */
.docs-component-select-styling-release-owner-shell {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-min-height: 3.2rem;
  --tng-select-trigger-py: 0.72rem;
  --tng-select-trigger-px: 0.9rem;
  --tng-select-trigger-gap: 0.75rem;
  --tng-select-option-py: 0.72rem;
  --tng-select-option-px: 0.9rem;
  --tng-select-option-radius: 0.85rem;
  --tng-select-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  --tng-select-shadow-focus: 0 0 0 3px rgba(15, 118, 110, 0.16);
  --tng-select-icon-margin-inline-start: 0.35rem;
  --tng-select-overlay-max-width: min(92vw, 36rem);
  --tng-select-overlay-radius: 1rem;
  --tng-select-overlay-padding: 0.4rem;
  --tng-select-z-overlay: 80;
  --tng-select-overlay-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}
```

### component-select-styling-tailwind-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectStylingTailwindReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS: readonly ComponentSelectStylingTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-component-select-styling-tailwind-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-styling-tailwind-example.component.html',
  styleUrl: './component-select-styling-tailwind-example.component.css',
})
export class ComponentSelectStylingTailwindExampleComponent {
  readonly componentSelectStylingTailwindReleaseOwners = COMPONENT_SELECT_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly componentSelectStylingTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly componentSelectStylingTailwindSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectStylingTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectStylingTailwindReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectStylingTailwindOwnerValue = (owner: ComponentSelectStylingTailwindReleaseOwnerOption) => owner.id;
  readonly getComponentSelectStylingTailwindOwnerLabel = (owner: ComponentSelectStylingTailwindReleaseOwnerOption) => owner.name;
  readonly isComponentSelectStylingTailwindOwnerDisabled = (owner: ComponentSelectStylingTailwindReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectStylingTailwindSelectedOwnerChange(value: unknown): void {
    this.componentSelectStylingTailwindSelectedOwnerId.set(this.toComponentSelectStylingTailwindSingleValue(value));
  }

  private toComponentSelectStylingTailwindSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}
```

### component-select-styling-tailwind-example.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release owners</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Host-level tokens define the palette while a small amount of slot spacing keeps the wrapper presentation tidy.
    </p>
  </div>

  <div class="docs-component-select-styling-live-control docs-component-select-styling-release-owner-shell block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem]">
    <tng-select
      [options]="componentSelectStylingTailwindReleaseOwners"
      [value]="componentSelectStylingTailwindSelectedOwnerId()"
      (valueChange)="onComponentSelectStylingTailwindSelectedOwnerChange($event)"
      [getOptionValue]="getComponentSelectStylingTailwindOwnerValue"
      [getOptionLabel]="getComponentSelectStylingTailwindOwnerLabel"
      [isOptionDisabled]="isComponentSelectStylingTailwindOwnerDisabled"
      placeholder="Assign release owner"
      [ariaLabel]="'Release owners'"
    ></tng-select>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentSelectStylingTailwindSelectedOwnerSummary() }}</p>
</section>
```

### component-select-styling-tailwind-example.component.css

```css
/* Tokens are applied via Tailwind arbitrary properties in the template. */
/* The component base CSS consumes them automatically. */
```
