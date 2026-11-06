---
id: "components/autocomplete/examples"
title: "AutoComplete examples"
description: "AutoComplete examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["autocomplete","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/autocomplete/tng-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/examples/autocomplete-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/examples/autocomplete-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/examples/autocomplete-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/autocomplete/examples"
componentGroup: "form"
symbols: ["TngAutocompleteComponent"]
selectors: ["tng-autocomplete"]
productId: "autocomplete"
section: "examples"
officialCatalog: true
generated: true
---

# AutoComplete examples

Selected:

### autocomplete-country-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'dk', label: 'Denmark' },
  { code: 'de', label: 'Germany' },
  { code: 'is', label: 'Iceland' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'no', label: 'Norway' },
  { code: 'es', label: 'Spain' },
  { code: 'se', label: 'Sweden' },
  { code: 'ch', label: 'Switzerland' },
]);

@Component({
  selector: 'app-docs-autocomplete-country-example-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-country-example-plain.component.html',
  styleUrl: './docs-autocomplete-country-example-plain.component.css',
})
export class DocsAutocompleteCountryExamplePlainComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('no');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() =>
    this.countries.filter((country) =>
      country.label.toLowerCase().includes(this.countryQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: unknown): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-country-plain.component.html

```html
<section class="docs-autocomplete-country-example">
  <div class="docs-autocomplete-country-example__header">
    <span class="docs-autocomplete-country-example__eyebrow">Country directory</span>
    <p class="docs-autocomplete-country-example__copy">
      Search the release locale list and commit with keyboard or pointer selection.
    </p>
  </div>

  <div class="docs-autocomplete-country-example__control">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type a country"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-country-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
```

### autocomplete-country-plain.component.css

```css
.docs-autocomplete-country-example {
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

.docs-autocomplete-country-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-country-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-country-example__copy,
.docs-autocomplete-country-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-autocomplete-country-example__control {
  display: block;
  width: 100%;
}

.docs-autocomplete-country-example__control tng-autocomplete {
  display: block;
  width: 100%;
}
```

### autocomplete-country-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'dk', label: 'Denmark' },
  { code: 'de', label: 'Germany' },
  { code: 'is', label: 'Iceland' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'no', label: 'Norway' },
  { code: 'es', label: 'Spain' },
  { code: 'se', label: 'Sweden' },
  { code: 'ch', label: 'Switzerland' },
]);

@Component({
  selector: 'app-docs-autocomplete-country-example-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-country-example-tailwind.component.html',
  styleUrl: './docs-autocomplete-country-example-tailwind.component.css',
})
export class DocsAutocompleteCountryExampleTailwindComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('ch');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() =>
    this.countries.filter((country) =>
      country.label.toLowerCase().includes(this.countryQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: unknown): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-country-tailwind.component.html

```html
<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Country directory</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Search the release locale list and commit with keyboard or pointer selection.
    </p>
  </div>

  <div class="block w-full">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type a country"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
```

### autocomplete-country-tailwind.component.css

```css
/* No additional CSS file is required for this Tailwind example. */
```

### autocomplete-owner-plain.component.ts

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
  selector: 'app-docs-autocomplete-owner-example-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-owner-example-plain.component.html',
  styleUrl: './docs-autocomplete-owner-example-plain.component.css',
})
export class DocsAutocompleteOwnerExamplePlainComponent {
  readonly owners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('abigail');
  readonly ownerQuery = signal('');
  readonly filteredOwners = computed(() =>
    this.owners.filter((owner) =>
      owner.name.toLowerCase().includes(this.ownerQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.owners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-owner-plain.component.html

```html
<section class="docs-autocomplete-owner-example">
  <div class="docs-autocomplete-owner-example__header">
    <span class="docs-autocomplete-owner-example__eyebrow">Release owner handoff</span>
    <p class="docs-autocomplete-owner-example__copy">
      Disabled owners stay visible for context while the next available handoff stays searchable.
    </p>
  </div>

  <div class="docs-autocomplete-owner-example__control">
    <tng-autocomplete
      [options]="filteredOwners()"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [query]="ownerQuery()"
      (queryChange)="ownerQuery.set($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner handoff'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-owner-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
```

### autocomplete-owner-plain.component.css

```css
.docs-autocomplete-owner-example {
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

.docs-autocomplete-owner-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-owner-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-owner-example__copy,
.docs-autocomplete-owner-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-autocomplete-owner-example__control {
  display: block;
  width: 100%;
}

.docs-autocomplete-owner-example__control tng-autocomplete {
  display: block;
  width: 100%;
}
```

### autocomplete-owner-tailwind.component.ts

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
  selector: 'app-docs-autocomplete-owner-example-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-owner-example-tailwind.component.html',
  styleUrl: './docs-autocomplete-owner-example-tailwind.component.css',
})
export class DocsAutocompleteOwnerExampleTailwindComponent {
  readonly owners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('mina');
  readonly ownerQuery = signal('');
  readonly filteredOwners = computed(() =>
    this.owners.filter((owner) =>
      owner.name.toLowerCase().includes(this.ownerQuery().toLowerCase().trim()),
    ),
  );
  readonly selectedSummary = computed(
    () => this.owners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
```

### autocomplete-owner-tailwind.component.html

```html
<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Release owner handoff</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Disabled owners stay visible for context while the next available handoff stays searchable.
    </p>
  </div>

  <div class="block w-full">
    <tng-autocomplete
      [options]="filteredOwners()"
      [value]="selectedOwner()"
      (valueChange)="onSelectedOwnerChange($event)"
      [query]="ownerQuery()"
      (queryChange)="ownerQuery.set($event)"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      [isOptionDisabled]="isOwnerDisabled"
      placeholder="Assign a release owner"
      [ariaLabel]="'Release owner handoff'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
```

### autocomplete-owner-tailwind.component.css

```css
/* No additional CSS file is required for this Tailwind example. */
```
