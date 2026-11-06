---
id: "components/autocomplete/styling"
title: "AutoComplete styling"
description: "AutoComplete styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["autocomplete","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/autocomplete/tng-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/styling/autocomplete-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/styling/autocomplete-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/styling/autocomplete-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/autocomplete/styling"
componentGroup: "form"
symbols: ["TngAutocompleteComponent"]
selectors: ["tng-autocomplete"]
productId: "autocomplete"
section: "styling"
officialCatalog: true
generated: true
---

# AutoComplete styling

## CSS token contracts

Style `<tng-autocomplete>` through host-level semantic tokens. The wrapper owns the trigger markup, so the supported surface is the wrapper host plus its CSS custom properties rather than private descendant selectors.

| Selector / token | Applied on | Purpose |
| --- | --- | --- |
| tng-autocomplete | Wrapper host | Width, margins, host-level semantic tokens, and disabled state affordance. |
| tng-autocomplete[data-disabled] | Wrapper host | Optional wrapper-level disabled presentation for surrounding shells. |
| --tng-autocomplete-z-overlay | Wrapper host | Controls the portaled overlay stacking level; falls back to --tng-z-overlay. |
| --tng-semantic-background-canvas | Wrapper host | Trigger input surface background. |
| --tng-semantic-background-surface | Wrapper host | Trigger shell fill and default neutral state. |
| --tng-semantic-border-subtle | Wrapper host | Outer border color for the owned trigger shell. |
| --tng-semantic-border-strong | Wrapper host | Hover and resting border emphasis for the trigger shell. |
| --tng-semantic-foreground-primary | Wrapper host | Input text and selected option text color. |
| --tng-semantic-foreground-secondary | Wrapper host | Supporting copy and option helper color inside the owned theme. |
| --tng-semantic-accent-brand | Wrapper host | Selected row, active row, and icon accent color. |
| --tng-semantic-focus-ring | Wrapper host | Focus ring color around the owned trigger shell. |

## Portal overlay guidance

The wrapper trigger lives in your component tree, but the autocomplete panel is portaled. Use wrapper host tokens for the trigger shell, and move overlay-specific selectors into a global stylesheet when you need to restyle the panel itself.

#### autocomplete.portal-guidance.css

```css
/* Component-scoped CSS reaches the wrapper host and trigger shell. */
tng-autocomplete.release-owner-shell {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-border-strong: #cbd5e1;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
  --tng-autocomplete-z-overlay: 80;
}

/* Overlay rows are portaled. Put overlay-specific selectors in a global stylesheet. */
[data-slot='autocomplete-overlay'] {
  border-radius: 1rem;
}

[data-slot='autocomplete-option'][data-selected] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);
}
```

Host-level token overrides restyle the wrapper without reaching into private child selectors.

Selected:

Host-level semantic tokens restyle the wrapper cleanly from a utility-first shell.

Selected:

## Styling examples

### autocomplete-styling-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-styling-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-styling-plain.component.html',
  styleUrl: './docs-autocomplete-styling-plain.component.css',
})
export class DocsAutocompleteStylingPlainComponent {
  readonly releaseOwners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('mina');
  readonly selectedSummary = computed(
    () => this.releaseOwners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-styling-plain.component.html

```html
<section class="docs-autocomplete-styling-example">
  <div class="docs-autocomplete-styling-example__header">
    <span class="docs-autocomplete-styling-example__eyebrow">Release owner</span>
    <p class="docs-autocomplete-styling-example__copy">
      Host-level token overrides restyle the wrapper without reaching into private child selectors.
    </p>
  </div>

  <div class="docs-autocomplete-styling-example__control">
    <tng-autocomplete
      [options]="releaseOwners"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-styling-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
```

### autocomplete-styling-plain.component.css

```css
.docs-autocomplete-styling-example {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-autocomplete-styling-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-styling-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-styling-example__copy,
.docs-autocomplete-styling-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-autocomplete-styling-example__control {
  display: block;
  width: 100%;
}

.docs-autocomplete-styling-example__control tng-autocomplete {
  display: block;
  width: 100%;
}
```

### autocomplete-styling-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-styling-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-styling-tailwind.component.html',
  styleUrl: './docs-autocomplete-styling-tailwind.component.css',
})
export class DocsAutocompleteStylingTailwindComponent {
  readonly releaseOwners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('abigail');
  readonly selectedSummary = computed(
    () => this.releaseOwners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-styling-tailwind.component.html

```html
<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Release owner</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Host-level semantic tokens restyle the wrapper cleanly from a utility-first shell.
    </p>
  </div>

  <div class="block w-full">
    <tng-autocomplete
      [options]="releaseOwners"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
```

### autocomplete-styling-tailwind.component.css

```css
/* No additional CSS file is required for this Tailwind example. */
```
