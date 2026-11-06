---
id: "components/multi-autocomplete/examples"
title: "MultiAutocomplete examples"
description: "MultiAutocomplete examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["multi-autocomplete","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multi-autocomplete/tng-multi-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/examples/multi-autocomplete-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/examples/multi-autocomplete-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/examples/multi-autocomplete-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multi-autocomplete/examples"
componentGroup: "form"
symbols: ["TngMultiAutocompleteComponent"]
selectors: ["tng-multi-autocomplete"]
productId: "multi-autocomplete"
section: "examples"
officialCatalog: true
generated: true
---

# MultiAutocomplete examples

Selected:

### docs-multi-autocomplete-launch-markets-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentExamplesPlainLaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const COMPONENT_EXAMPLES_PLAIN_LAUNCH_MARKET_OPTIONS: readonly ComponentExamplesPlainLaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-launch-markets-plain',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-launch-markets-plain.component.html',
  styleUrl: './docs-multi-autocomplete-launch-markets-plain.component.css',
})
export class DocsMultiAutocompleteLaunchMarketsPlainComponent {
  readonly componentExamplesPlainLaunchMarkets = COMPONENT_EXAMPLES_PLAIN_LAUNCH_MARKET_OPTIONS;
  readonly componentExamplesPlainSelectedMarketCodes = signal<readonly string[]>(['in', 'jp']);
  readonly componentExamplesPlainMarketQuery = signal('');
  readonly componentExamplesPlainFilteredLaunchMarkets = computed(() =>
    this.componentExamplesPlainLaunchMarkets.filter((market) =>
      market.label.toLowerCase().includes(this.componentExamplesPlainMarketQuery().toLowerCase().trim()),
    ),
  );
  readonly componentExamplesPlainSelectedMarketSummary = computed(() => {
    if (this.componentExamplesPlainSelectedMarketCodes().length === 0) {
      return 'none';
    }

    return this.componentExamplesPlainSelectedMarketCodes()
      .map((code) => this.componentExamplesPlainLaunchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });
  readonly getComponentExamplesPlainMarketValue = (market: ComponentExamplesPlainLaunchMarketOption) => market.code;
  readonly getComponentExamplesPlainMarketLabel = (market: ComponentExamplesPlainLaunchMarketOption) => market.label;

  onComponentExamplesPlainSelectedMarketsChange(value: unknown): void {
    this.componentExamplesPlainSelectedMarketCodes.set(this.toComponentExamplesPlainValueArray(value));
  }

  private toComponentExamplesPlainValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
```

### docs-multi-autocomplete-launch-markets-plain.component.html

```html
<section class="docs-multi-autocomplete-launch-markets-plain-shell">
  <div class="docs-multi-autocomplete-launch-markets-plain-header">
    <span class="docs-multi-autocomplete-launch-markets-plain-kicker">Launch markets</span>
    <p class="docs-multi-autocomplete-launch-markets-plain-copy">
      Keep a controlled array of launch regions while the parent owns filtering and the wrapper renders chips.
    </p>
  </div>

  <div class="docs-multi-autocomplete-launch-markets-plain-control">
    <tng-multi-autocomplete
      [options]="componentExamplesPlainFilteredLaunchMarkets()"
      [value]="componentExamplesPlainSelectedMarketCodes()"
      (valueChange)="onComponentExamplesPlainSelectedMarketsChange($event)"
      [query]="componentExamplesPlainMarketQuery()"
      (queryChange)="componentExamplesPlainMarketQuery.set($event)"
      [getOptionValue]="getComponentExamplesPlainMarketValue"
      [getOptionLabel]="getComponentExamplesPlainMarketLabel"
      placeholder="Search launch markets"
      [ariaLabel]="'Launch markets'"
    ></tng-multi-autocomplete>
  </div>

  <p class="docs-multi-autocomplete-launch-markets-plain-summary">Selected: {{ componentExamplesPlainSelectedMarketSummary() }}</p>
</section>
```

### docs-multi-autocomplete-launch-markets-plain.component.css

```css
.docs-multi-autocomplete-launch-markets-plain-shell {
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

.docs-multi-autocomplete-launch-markets-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-multi-autocomplete-launch-markets-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-multi-autocomplete-launch-markets-plain-copy,
.docs-multi-autocomplete-launch-markets-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-multi-autocomplete-launch-markets-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-multi-autocomplete-radius: 1rem;
  --tng-multi-autocomplete-padding: 0.5rem;
  --tng-multi-autocomplete-trigger-py: 0.45rem;
  --tng-multi-autocomplete-trigger-px: 0.5rem;
  --tng-multi-autocomplete-chip-py: 0.375rem;
  --tng-multi-autocomplete-chip-px: 0.75rem;
  --tng-multi-autocomplete-option-py: 0.625rem;
  --tng-multi-autocomplete-option-px: 0.875rem;
}
```

### docs-multi-autocomplete-launch-markets-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentExamplesTailwindLaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const COMPONENT_EXAMPLES_TAILWIND_LAUNCH_MARKET_OPTIONS: readonly ComponentExamplesTailwindLaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-launch-markets-tailwind',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-launch-markets-tailwind.component.html',
  styleUrl: './docs-multi-autocomplete-launch-markets-tailwind.component.css',
})
export class DocsMultiAutocompleteLaunchMarketsTailwindComponent {
  readonly componentExamplesTailwindLaunchMarkets = COMPONENT_EXAMPLES_TAILWIND_LAUNCH_MARKET_OPTIONS;
  readonly componentExamplesTailwindSelectedMarketCodes = signal<readonly string[]>(['ca', 'es']);
  readonly componentExamplesTailwindMarketQuery = signal('');
  readonly componentExamplesTailwindFilteredLaunchMarkets = computed(() =>
    this.componentExamplesTailwindLaunchMarkets.filter((market) =>
      market.label.toLowerCase().includes(this.componentExamplesTailwindMarketQuery().toLowerCase().trim()),
    ),
  );
  readonly componentExamplesTailwindSelectedMarketSummary = computed(() => {
    if (this.componentExamplesTailwindSelectedMarketCodes().length === 0) {
      return 'none';
    }

    return this.componentExamplesTailwindSelectedMarketCodes()
      .map((code) => this.componentExamplesTailwindLaunchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });
  readonly getComponentExamplesTailwindMarketValue = (market: ComponentExamplesTailwindLaunchMarketOption) => market.code;
  readonly getComponentExamplesTailwindMarketLabel = (market: ComponentExamplesTailwindLaunchMarketOption) => market.label;

  onComponentExamplesTailwindSelectedMarketsChange(value: unknown): void {
    this.componentExamplesTailwindSelectedMarketCodes.set(this.toComponentExamplesTailwindValueArray(value));
  }

  private toComponentExamplesTailwindValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
```

### docs-multi-autocomplete-launch-markets-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Launch markets</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Keep a controlled array of launch regions while the parent owns filtering and the wrapper renders chips.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-multi-autocomplete-radius:1rem] [--tng-multi-autocomplete-padding:0.5rem] [--tng-multi-autocomplete-trigger-py:0.45rem] [--tng-multi-autocomplete-trigger-px:0.5rem] [--tng-multi-autocomplete-chip-py:0.375rem] [--tng-multi-autocomplete-chip-px:0.75rem] [--tng-multi-autocomplete-option-py:0.625rem] [--tng-multi-autocomplete-option-px:0.875rem]">
    <tng-multi-autocomplete
      [options]="componentExamplesTailwindFilteredLaunchMarkets()"
      [value]="componentExamplesTailwindSelectedMarketCodes()"
      (valueChange)="onComponentExamplesTailwindSelectedMarketsChange($event)"
      [query]="componentExamplesTailwindMarketQuery()"
      (queryChange)="componentExamplesTailwindMarketQuery.set($event)"
      [getOptionValue]="getComponentExamplesTailwindMarketValue"
      [getOptionLabel]="getComponentExamplesTailwindMarketLabel"
      placeholder="Search launch markets"
      [ariaLabel]="'Launch markets'"
    ></tng-multi-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentExamplesTailwindSelectedMarketSummary() }}</p>
</section>
```

### docs-multi-autocomplete-launch-markets-tailwind.component.css

```css
/* No additional CSS file is required for this Tailwind example. */
```

### docs-multi-autocomplete-reviewer-roster-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentExamplesPlainReviewerRosterOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_EXAMPLES_PLAIN_REVIEWER_ROSTER_OPTIONS: readonly ComponentExamplesPlainReviewerRosterOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-reviewer-roster-plain',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-reviewer-roster-plain.component.html',
  styleUrl: './docs-multi-autocomplete-reviewer-roster-plain.component.css',
})
export class DocsMultiAutocompleteReviewerRosterPlainComponent {
  readonly componentExamplesPlainReviewerRoster = COMPONENT_EXAMPLES_PLAIN_REVIEWER_ROSTER_OPTIONS;
  readonly componentExamplesPlainSelectedReviewerIds = signal<readonly string[]>(['abigail', 'sanjay']);
  readonly componentExamplesPlainReviewerQuery = signal('');
  readonly componentExamplesPlainFilteredReviewerRoster = computed(() =>
    this.componentExamplesPlainReviewerRoster.filter((reviewer) =>
      reviewer.name.toLowerCase().includes(this.componentExamplesPlainReviewerQuery().toLowerCase().trim()),
    ),
  );
  readonly componentExamplesPlainReviewerSummary = computed(() => {
    if (this.componentExamplesPlainSelectedReviewerIds().length === 0) {
      return 'none';
    }

    return this.componentExamplesPlainSelectedReviewerIds()
      .map((id) => this.componentExamplesPlainReviewerRoster.find((reviewer) => reviewer.id === id)?.name ?? id)
      .join(', ');
  });
  readonly getComponentExamplesPlainReviewerValue = (reviewer: ComponentExamplesPlainReviewerRosterOption) => reviewer.id;
  readonly getComponentExamplesPlainReviewerLabel = (reviewer: ComponentExamplesPlainReviewerRosterOption) => reviewer.name;
  readonly isComponentExamplesPlainReviewerDisabled = (reviewer: ComponentExamplesPlainReviewerRosterOption) => reviewer.disabled === true;

  onComponentExamplesPlainSelectedReviewersChange(value: unknown): void {
    this.componentExamplesPlainSelectedReviewerIds.set(this.toComponentExamplesPlainReviewerValueArray(value));
  }

  private toComponentExamplesPlainReviewerValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
```

### docs-multi-autocomplete-reviewer-roster-plain.component.html

```html
<section class="docs-multi-autocomplete-reviewer-roster-plain-shell">
  <div class="docs-multi-autocomplete-reviewer-roster-plain-header">
    <span class="docs-multi-autocomplete-reviewer-roster-plain-kicker">Release owner roster</span>
    <p class="docs-multi-autocomplete-reviewer-roster-plain-copy">
      Custom templates let the wrapper show richer chips and option metadata without rebuilding the primitive stack.
    </p>
  </div>

  <div class="docs-multi-autocomplete-reviewer-roster-plain-control">
    <tng-multi-autocomplete
      [options]="componentExamplesPlainFilteredReviewerRoster()"
      [value]="componentExamplesPlainSelectedReviewerIds()"
      (valueChange)="onComponentExamplesPlainSelectedReviewersChange($event)"
      [query]="componentExamplesPlainReviewerQuery()"
      (queryChange)="componentExamplesPlainReviewerQuery.set($event)"
      [getOptionValue]="getComponentExamplesPlainReviewerValue"
      [getOptionLabel]="getComponentExamplesPlainReviewerLabel"
      [isOptionDisabled]="isComponentExamplesPlainReviewerDisabled"
      placeholder="Assign release owners"
      [ariaLabel]="'Release owner roster'"
    >
      <ng-template #tngMultiAutocompleteChipTpl let-chip>
        <span class="docs-multi-autocomplete-reviewer-roster-plain-chip-label">{{ chip.label }}</span>
        <button
          class="docs-multi-autocomplete-reviewer-roster-plain-chip-action"
          type="button"
          (click)="chip.removeItem(chip.value); $event.preventDefault(); $event.stopPropagation()"
          [attr.aria-label]="'Remove ' + chip.label"
        >
          ×
        </button>
      </ng-template>

      <ng-template #tngMultiAutocompleteOptionTpl let-option>
        <div class="docs-multi-autocomplete-reviewer-roster-plain-option-row">
          <span class="docs-multi-autocomplete-reviewer-roster-plain-option-label">{{ option.label }}</span>
          <small class="docs-multi-autocomplete-reviewer-roster-plain-option-meta">{{ option.option.team }}</small>
        </div>
      </ng-template>
    </tng-multi-autocomplete>
  </div>

  <p class="docs-multi-autocomplete-reviewer-roster-plain-summary">Selected: {{ componentExamplesPlainReviewerSummary() }}</p>
</section>
```

### docs-multi-autocomplete-reviewer-roster-plain.component.css

```css
.docs-multi-autocomplete-reviewer-roster-plain-shell {
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

.docs-multi-autocomplete-reviewer-roster-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-multi-autocomplete-reviewer-roster-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-multi-autocomplete-reviewer-roster-plain-copy,
.docs-multi-autocomplete-reviewer-roster-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-multi-autocomplete-reviewer-roster-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-multi-autocomplete-radius: 1rem;
  --tng-multi-autocomplete-padding: 0.5rem;
  --tng-multi-autocomplete-trigger-py: 0.45rem;
  --tng-multi-autocomplete-trigger-px: 0.5rem;
  --tng-multi-autocomplete-chip-py: 0.375rem;
  --tng-multi-autocomplete-chip-px: 0.75rem;
  --tng-multi-autocomplete-option-py: 0.625rem;
  --tng-multi-autocomplete-option-px: 0.875rem;
}

.docs-multi-autocomplete-reviewer-roster-plain-chip-label {
  font-weight: 600;
}

.docs-multi-autocomplete-reviewer-roster-plain-chip-action {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 999px;
  padding: 0;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}

.docs-multi-autocomplete-reviewer-roster-plain-chip-action:hover {
  background: rgba(15, 23, 42, 0.08);
}

.docs-multi-autocomplete-reviewer-roster-plain-chip-action:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.18);
}

.docs-multi-autocomplete-reviewer-roster-plain-option-row {
  display: grid;
  gap: 0.2rem;
}

.docs-multi-autocomplete-reviewer-roster-plain-option-label {
  font-weight: 600;
}

.docs-multi-autocomplete-reviewer-roster-plain-option-meta {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.75rem;
}
```

### docs-multi-autocomplete-reviewer-roster-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentExamplesTailwindReviewerRosterOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_EXAMPLES_TAILWIND_REVIEWER_ROSTER_OPTIONS: readonly ComponentExamplesTailwindReviewerRosterOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-reviewer-roster-tailwind',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './docs-multi-autocomplete-reviewer-roster-tailwind.component.html',
  styleUrl: './docs-multi-autocomplete-reviewer-roster-tailwind.component.css',
})
export class DocsMultiAutocompleteReviewerRosterTailwindComponent {
  readonly componentExamplesTailwindReviewerRoster = COMPONENT_EXAMPLES_TAILWIND_REVIEWER_ROSTER_OPTIONS;
  readonly componentExamplesTailwindSelectedReviewerIds = signal<readonly string[]>(['mina']);
  readonly componentExamplesTailwindReviewerQuery = signal('');
  readonly componentExamplesTailwindFilteredReviewerRoster = computed(() =>
    this.componentExamplesTailwindReviewerRoster.filter((reviewer) =>
      reviewer.name.toLowerCase().includes(this.componentExamplesTailwindReviewerQuery().toLowerCase().trim()),
    ),
  );
  readonly componentExamplesTailwindReviewerSummary = computed(() => {
    if (this.componentExamplesTailwindSelectedReviewerIds().length === 0) {
      return 'none';
    }

    return this.componentExamplesTailwindSelectedReviewerIds()
      .map((id) => this.componentExamplesTailwindReviewerRoster.find((reviewer) => reviewer.id === id)?.name ?? id)
      .join(', ');
  });
  readonly getComponentExamplesTailwindReviewerValue = (reviewer: ComponentExamplesTailwindReviewerRosterOption) => reviewer.id;
  readonly getComponentExamplesTailwindReviewerLabel = (reviewer: ComponentExamplesTailwindReviewerRosterOption) => reviewer.name;
  readonly isComponentExamplesTailwindReviewerDisabled = (reviewer: ComponentExamplesTailwindReviewerRosterOption) => reviewer.disabled === true;

  onComponentExamplesTailwindSelectedReviewersChange(value: unknown): void {
    this.componentExamplesTailwindSelectedReviewerIds.set(this.toComponentExamplesTailwindReviewerValueArray(value));
  }

  private toComponentExamplesTailwindReviewerValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}
```

### docs-multi-autocomplete-reviewer-roster-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release owner roster</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Custom templates keep the wrapper ergonomics while showing richer chips and option metadata.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-multi-autocomplete-radius:1rem] [--tng-multi-autocomplete-padding:0.5rem] [--tng-multi-autocomplete-trigger-py:0.45rem] [--tng-multi-autocomplete-trigger-px:0.5rem] [--tng-multi-autocomplete-chip-py:0.375rem] [--tng-multi-autocomplete-chip-px:0.75rem] [--tng-multi-autocomplete-option-py:0.625rem] [--tng-multi-autocomplete-option-px:0.875rem]">
    <tng-multi-autocomplete
      [options]="componentExamplesTailwindFilteredReviewerRoster()"
      [value]="componentExamplesTailwindSelectedReviewerIds()"
      (valueChange)="onComponentExamplesTailwindSelectedReviewersChange($event)"
      [query]="componentExamplesTailwindReviewerQuery()"
      (queryChange)="componentExamplesTailwindReviewerQuery.set($event)"
      [getOptionValue]="getComponentExamplesTailwindReviewerValue"
      [getOptionLabel]="getComponentExamplesTailwindReviewerLabel"
      [isOptionDisabled]="isComponentExamplesTailwindReviewerDisabled"
      placeholder="Assign release owners"
      [ariaLabel]="'Release owner roster'"
    >
      <ng-template #tngMultiAutocompleteChipTpl let-chip>
        <span class="font-medium">{{ chip.label }}</span>
        <button
          type="button"
          class="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20"
          (click)="chip.removeItem(chip.value); $event.preventDefault(); $event.stopPropagation()"
          [attr.aria-label]="'Remove ' + chip.label"
        >
          ×
        </button>
      </ng-template>

      <ng-template #tngMultiAutocompleteOptionTpl let-option>
        <div class="grid gap-1">
          <span class="font-medium">{{ option.label }}</span>
          <small class="text-xs text-slate-500">{{ option.option.team }}</small>
        </div>
      </ng-template>
    </tng-multi-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentExamplesTailwindReviewerSummary() }}</p>
</section>
```

### docs-multi-autocomplete-reviewer-roster-tailwind.component.css

```css
/* No additional CSS file is required for this Tailwind example. */
```
