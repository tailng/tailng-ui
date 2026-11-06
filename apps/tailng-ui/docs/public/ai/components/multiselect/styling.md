---
id: "components/multiselect/styling"
title: "MultiSelect styling"
description: "MultiSelect styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["multiselect","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multiselect/tng-multiselect.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/styling/multiselect-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/styling/multiselect-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/styling/multiselect-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multiselect/styling"
componentGroup: "form"
symbols: ["TngMultiSelectComponent"]
selectors: ["tng-multiselect"]
productId: "multiselect"
section: "styling"
officialCatalog: true
generated: true
---

# MultiSelect styling

## Supported contract

Theme the wrapper from its host. Override semantic and select tokens on `<tng-multiselect>`; drop to headless when you need full trigger or overlay DOM ownership.

| Selector or token | Applied on | Purpose |
| --- | --- | --- |
| .docs-component-multiselect-styling-shell + --tng-select-* | Wrapper host | Stable surface for trigger, option, and overlay theming through copied host tokens. |
| --tng-select-z-overlay | Wrapper host | Controls the shared select overlay stacking level; falls back to --tng-z-overlay. |
| --tng-semantic-* | Wrapper host | Feeds the shared light and dark semantic palette used by the select contract. |
| #tngMultiSelectValueTpl | Projected template | Customizes the selected-value markup while preserving trigger semantics. |
| #tngMultiSelectOptionTpl | Projected template | Customizes option rows while preserving listbox behavior and selection state. |

## Host tokens

These host-level variables are the stable styling surface for the wrapper. The same token set feeds the trigger, option rows, and the portaled overlay.

#### multiselect.tokens.css

```css
.docs-component-multiselect-styling-shell {
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;

  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-z-overlay: 80;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}

/* Palette tokens stay on the host. */
/* Add slot-level spacing only when you need a more opinionated presentation shell. */
```

Host-level tokens define the palette while the wrapper handles multi-selection plumbing.

Selected:

Host-level tokens define the palette while the wrapper handles multi-selection plumbing.

Selected:

## Styling examples

### component-multiselect-styling-plain-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface ComponentMultiselectStylingPlainCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const COMPONENT_MULTISELECT_STYLING_PLAIN_CATEGORY_OPTIONS: readonly ComponentMultiselectStylingPlainCategoryOption[] = Object.freeze([
  { id: 'a11y', label: 'Accessibility' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'docs', label: 'Documentation', disabled: true },
  { id: 'theming', label: 'Theming' },
]);

@Component({
  selector: 'app-component-multiselect-styling-plain-example',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './component-multiselect-styling-plain-example.component.html',
  styleUrl: './component-multiselect-styling-plain-example.component.css',
})
export class ComponentMultiselectStylingPlainExampleComponent {
  readonly categories = COMPONENT_MULTISELECT_STYLING_PLAIN_CATEGORY_OPTIONS;
  readonly selectedCategories = signal<readonly string[]>(['a11y', 'forms']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedCategories();
    if (ids.length === 0) return 'none';
    return ids
      .map((id) => this.categories.find((c) => c.id === id)?.label ?? id)
      .join(', ');
  });
  readonly getCategoryValue = (c: ComponentMultiselectStylingPlainCategoryOption) => c.id;
  readonly getCategoryLabel = (c: ComponentMultiselectStylingPlainCategoryOption) => c.label;
  readonly isCategoryDisabled = (c: ComponentMultiselectStylingPlainCategoryOption) => c.disabled === true;

  onSelectedCategoriesChange(value: unknown): void {
    this.selectedCategories.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### component-multiselect-styling-plain-example.component.html

```html
<section class="docs-component-multiselect-styling-plain-shell">
  <div class="docs-component-multiselect-styling-plain-header">
    <span class="docs-component-multiselect-styling-plain-kicker">Categories</span>
    <p class="docs-component-multiselect-styling-plain-copy">
      Host-level tokens define the palette while the wrapper handles multi-selection plumbing.
    </p>
  </div>

  <div class="docs-component-multiselect-styling-plain-control docs-component-multiselect-styling-shell">
    <tng-multiselect
      [options]="categories"
      [value]="selectedCategories()"
      (valueChange)="onSelectedCategoriesChange($event)"
      [getOptionValue]="getCategoryValue"
      [getOptionLabel]="getCategoryLabel"
      [isOptionDisabled]="isCategoryDisabled"
      placeholder="Select categories"
      [ariaLabel]="'Categories'"
    ></tng-multiselect>
  </div>

  <p class="docs-component-multiselect-styling-plain-summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
```

### component-multiselect-styling-plain-example.component.css

```css
.docs-component-multiselect-styling-plain-shell {
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

.docs-component-multiselect-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-multiselect-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-multiselect-styling-plain-copy,
.docs-component-multiselect-styling-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

/* Host-level tokens – the component base CSS consumes them automatically. */
.docs-component-multiselect-styling-shell {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;
  --tng-select-radius: 1rem;
  --tng-select-trigger-min-height: 3.2rem;
  --tng-select-trigger-py: 0.72rem;
  --tng-select-trigger-px: 0.9rem;
  --tng-select-trigger-gap: 0.75rem;
  --tng-select-option-py: 0.72rem;
  --tng-select-option-px: 0.9rem;
  --tng-select-option-radius: 0.85rem;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
  --tng-select-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  --tng-select-shadow-focus: 0 0 0 3px rgba(15, 118, 110, 0.16);
  --tng-select-icon-margin-inline-start: 0.35rem;
  --tng-select-overlay-max-width: min(92vw, 36rem);
  --tng-select-overlay-radius: 1rem;
  --tng-select-overlay-padding: 0.4rem;
  --tng-select-overlay-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}

.docs-component-multiselect-styling-shell tng-multiselect {
  display: block;
  width: 100%;
  min-width: 0;
}
```

### component-multiselect-styling-tailwind-example.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface ComponentMultiselectStylingTailwindCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const COMPONENT_MULTISELECT_STYLING_TAILWIND_CATEGORY_OPTIONS: readonly ComponentMultiselectStylingTailwindCategoryOption[] = Object.freeze([
  { id: 'a11y', label: 'Accessibility' },
  { id: 'forms', label: 'Forms' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'docs', label: 'Documentation', disabled: true },
  { id: 'theming', label: 'Theming' },
]);

@Component({
  selector: 'app-component-multiselect-styling-tailwind-example',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './component-multiselect-styling-tailwind-example.component.html',
  styleUrl: './component-multiselect-styling-tailwind-example.component.css',
})
export class ComponentMultiselectStylingTailwindExampleComponent {
  readonly categories = COMPONENT_MULTISELECT_STYLING_TAILWIND_CATEGORY_OPTIONS;
  readonly selectedCategories = signal<readonly string[]>(['overlay']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedCategories();
    if (ids.length === 0) return 'none';
    return ids
      .map((id) => this.categories.find((c) => c.id === id)?.label ?? id)
      .join(', ');
  });
  readonly getCategoryValue = (c: ComponentMultiselectStylingTailwindCategoryOption) => c.id;
  readonly getCategoryLabel = (c: ComponentMultiselectStylingTailwindCategoryOption) => c.label;
  readonly isCategoryDisabled = (c: ComponentMultiselectStylingTailwindCategoryOption) => c.disabled === true;

  onSelectedCategoriesChange(value: unknown): void {
    this.selectedCategories.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### component-multiselect-styling-tailwind-example.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Categories</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Host-level tokens define the palette while the wrapper handles multi-selection plumbing.
    </p>
  </div>

  <div class="docs-component-multiselect-styling-live-control docs-component-multiselect-styling-shell block w-full min-w-0 [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]">
    <tng-multiselect
      [options]="categories"
      [value]="selectedCategories()"
      (valueChange)="onSelectedCategoriesChange($event)"
      [getOptionValue]="getCategoryValue"
      [getOptionLabel]="getCategoryLabel"
      [isOptionDisabled]="isCategoryDisabled"
      placeholder="Select categories"
      [ariaLabel]="'Categories'"
    ></tng-multiselect>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
```

### component-multiselect-styling-tailwind-example.component.css

```css
/* Tokens are applied via Tailwind arbitrary properties in the template. */
/* The component base CSS consumes them automatically. */
```
