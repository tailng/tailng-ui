---
id: "components/multiselect/examples"
title: "MultiSelect examples"
description: "MultiSelect examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["multiselect","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multiselect/tng-multiselect.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/examples/multiselect-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/examples/multiselect-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/examples/multiselect-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multiselect/examples"
componentGroup: "form"
symbols: ["TngMultiSelectComponent"]
selectors: ["tng-multiselect"]
productId: "multiselect"
section: "examples"
officialCatalog: true
generated: true
---

# MultiSelect examples

Selected:

### status-multiselect-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

@Component({
  selector: 'app-status-multiselect-plain',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './status-multiselect-plain.component.html',
  styleUrl: './status-multiselect-plain.component.css',
})
export class StatusMultiselectPlainComponent {
  readonly statusOptions = STATUS_OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['todo', 'review']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedStatuses();
    const labels = values
      .map((v) => this.statusOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  });
  readonly getStatusValue = (option: StatusOption) => option.value;
  readonly getStatusLabel = (option: StatusOption) => option.label;

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### status-multiselect-plain.component.html

```html
<section class="status-multiselect-plain-shell">
  <div class="status-multiselect-plain-header">
    <span class="status-multiselect-plain-kicker">Status filter</span>
    <p class="status-multiselect-plain-copy">
      Keep a controlled multi-value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <div class="status-multiselect-plain-control">
    <tng-multiselect
      [options]="statusOptions"
      [value]="selectedStatuses()"
      (valueChange)="onValueChange($event)"
      [getOptionValue]="getStatusValue"
      [getOptionLabel]="getStatusLabel"
      placeholder="Select statuses"
      aria-label="Status multiselect"
    ></tng-multiselect>
  </div>

  <p class="status-multiselect-plain-summary">Selected: {{ selectedSummary() }}</p>
</section>
```

### status-multiselect-plain.component.css

```css
.status-multiselect-plain-shell {
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

.status-multiselect-plain-header {
  display: grid;
  gap: 0.35rem;
}

.status-multiselect-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.status-multiselect-plain-copy,
.status-multiselect-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.status-multiselect-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-brand: #2563eb;
  --tng-select-focus-ring: #2563eb;
}

.status-multiselect-plain-control tng-multiselect {
  display: block;
  width: 100%;
  min-width: 0;
}
```

### status-multiselect-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

@Component({
  selector: 'app-status-multiselect-tailwind',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './status-multiselect-tailwind.component.html',
  styleUrl: './status-multiselect-tailwind.component.css',
})
export class StatusMultiselectTailwindComponent {
  readonly statusOptions = STATUS_OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['done']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedStatuses();
    const labels = values
      .map((v) => this.statusOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  });
  readonly getStatusValue = (option: StatusOption) => option.value;
  readonly getStatusLabel = (option: StatusOption) => option.label;

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### status-multiselect-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Status filter</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Keep a controlled multi-value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:#2563eb] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-brand:#2563eb] [--tng-select-focus-ring:#2563eb]">
    <tng-multiselect
      [options]="statusOptions"
      [value]="selectedStatuses()"
      (valueChange)="onValueChange($event)"
      [getOptionValue]="getStatusValue"
      [getOptionLabel]="getStatusLabel"
      placeholder="Select statuses"
      aria-label="Status multiselect"
    ></tng-multiselect>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>
</section>
```

### status-multiselect-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### dual-multiselect-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-dual-multiselect-plain',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './dual-multiselect-plain.component.html',
  styleUrl: './dual-multiselect-plain.component.css',
})
export class DualMultiselectPlainComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));
  readonly getTagValue = (option: TagOption) => option.value;
  readonly getTagLabel = (option: TagOption) => option.label;

  onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  private resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((v) => this.tagOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### dual-multiselect-plain.component.html

```html
<section class="dual-multiselect-plain-shell">
  <div class="dual-multiselect-plain-header">
    <span class="dual-multiselect-plain-kicker">Dual tag groups</span>
    <p class="dual-multiselect-plain-copy">
      Two independent multiselects with Tab-based keyboard handoff between controls.
    </p>
  </div>

  <div class="dual-multiselect-plain-grid">
    <div class="dual-multiselect-plain-card">
      <p class="dual-multiselect-plain-card-title">Tag group A</p>
      <div class="dual-multiselect-plain-control">
        <tng-multiselect
          [options]="tagOptions"
          [value]="tagValueA()"
          (valueChange)="onTagAValueChange($event)"
          [getOptionValue]="getTagValue"
          [getOptionLabel]="getTagLabel"
          placeholder="Select tags"
          aria-label="Tag group A multiselect"
        ></tng-multiselect>
      </div>
      <p class="dual-multiselect-plain-summary">Selected: {{ tagSummaryA() }}</p>
    </div>

    <div class="dual-multiselect-plain-card">
      <p class="dual-multiselect-plain-card-title">Tag group B</p>
      <div class="dual-multiselect-plain-control">
        <tng-multiselect
          [options]="tagOptions"
          [value]="tagValueB()"
          (valueChange)="onTagBValueChange($event)"
          [getOptionValue]="getTagValue"
          [getOptionLabel]="getTagLabel"
          placeholder="Select tags"
          aria-label="Tag group B multiselect"
        ></tng-multiselect>
      </div>
      <p class="dual-multiselect-plain-summary">Selected: {{ tagSummaryB() }}</p>
    </div>
  </div>
</section>
```

### dual-multiselect-plain.component.css

```css
.dual-multiselect-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: 100%;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.dual-multiselect-plain-header {
  display: grid;
  gap: 0.35rem;
}

.dual-multiselect-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.dual-multiselect-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.dual-multiselect-plain-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .dual-multiselect-plain-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.dual-multiselect-plain-card {
  display: grid;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.85rem;
  background: var(--tng-semantic-background-muted);
}

.dual-multiselect-plain-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.dual-multiselect-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.dual-multiselect-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}

.dual-multiselect-plain-control tng-multiselect {
  display: block;
  width: 100%;
  min-width: 0;
}
```

### dual-multiselect-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-dual-multiselect-tailwind',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './dual-multiselect-tailwind.component.html',
  styleUrl: './dual-multiselect-tailwind.component.css',
})
export class DualMultiselectTailwindComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));
  readonly getTagValue = (option: TagOption) => option.value;
  readonly getTagLabel = (option: TagOption) => option.label;

  onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  private resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((v) => this.tagOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
```

### dual-multiselect-tailwind.component.html

```html
<section class="grid w-full gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Dual tag groups</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Two independent multiselects with Tab-based keyboard handoff between controls.
    </p>
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    <div class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-muted)] p-3">
      <p class="m-0 text-sm font-semibold text-[var(--tng-semantic-foreground-secondary)]">Tag group A</p>
      <div class="block w-full min-w-0 [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]">
        <tng-multiselect
          [options]="tagOptions"
          [value]="tagValueA()"
          (valueChange)="onTagAValueChange($event)"
          [getOptionValue]="getTagValue"
          [getOptionLabel]="getTagLabel"
          placeholder="Select tags"
          aria-label="Tag group A multiselect"
        ></tng-multiselect>
      </div>
      <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ tagSummaryA() }}</p>
    </div>

    <div class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-muted)] p-3">
      <p class="m-0 text-sm font-semibold text-[var(--tng-semantic-foreground-secondary)]">Tag group B</p>
      <div class="block w-full min-w-0 [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]">
        <tng-multiselect
          [options]="tagOptions"
          [value]="tagValueB()"
          (valueChange)="onTagBValueChange($event)"
          [getOptionValue]="getTagValue"
          [getOptionLabel]="getTagLabel"
          placeholder="Select tags"
          aria-label="Tag group B multiselect"
        ></tng-multiselect>
      </div>
      <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ tagSummaryB() }}</p>
    </div>
  </div>
</section>
```

### dual-multiselect-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
