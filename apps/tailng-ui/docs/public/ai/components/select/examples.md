---
id: "components/select/examples"
title: "Select examples"
description: "Select examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["select","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/select/tng-select.component.ts","libs/tailng-ui/components/src/lib/form/select/tng-select.slots.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/examples/select-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/examples/select-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/examples/select-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/select/examples"
componentGroup: "form"
symbols: ["TngSelectComponent"]
selectors: ["tng-select"]
productId: "select"
section: "examples"
officialCatalog: true
generated: true
---

# Select examples

Selected:

### component-select-examples-stage-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesPlainReleaseStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_EXAMPLES_PLAIN_RELEASE_STAGE_OPTIONS: readonly ComponentSelectExamplesPlainReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-component-select-examples-stage-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-stage-plain.component.html',
  styleUrl: './component-select-examples-stage-plain.component.css',
})
export class ComponentSelectExamplesStagePlainComponent {
  readonly componentSelectExamplesPlainReleaseStages = COMPONENT_SELECT_EXAMPLES_PLAIN_RELEASE_STAGE_OPTIONS;
  readonly componentSelectExamplesPlainSelectedStage = signal<string | null>('review');
  readonly componentSelectExamplesPlainSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesPlainSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesPlainReleaseStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectExamplesPlainStageValue = (stage: ComponentSelectExamplesPlainReleaseStageOption) => stage.value;
  readonly getComponentSelectExamplesPlainStageLabel = (stage: ComponentSelectExamplesPlainReleaseStageOption) => stage.label;
  readonly isComponentSelectExamplesPlainStageDisabled = (stage: ComponentSelectExamplesPlainReleaseStageOption) => stage.disabled === true;

  onComponentSelectExamplesPlainSelectedStageChange(value: unknown): void {
    this.componentSelectExamplesPlainSelectedStage.set(this.toComponentSelectExamplesPlainSingleValue(value));
  }

  private toComponentSelectExamplesPlainSingleValue(value: unknown): string | null {
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

### component-select-examples-stage-plain.component.html

```html
<section class="docs-component-select-examples-stage-plain-shell">
  <div class="docs-component-select-examples-stage-plain-header">
    <span class="docs-component-select-examples-stage-plain-kicker">Release stage</span>
    <p class="docs-component-select-examples-stage-plain-copy">
      Keep a controlled release-stage value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <div class="docs-component-select-examples-stage-plain-control">
    <tng-select
      [options]="componentSelectExamplesPlainReleaseStages"
      [value]="componentSelectExamplesPlainSelectedStage()"
      (valueChange)="onComponentSelectExamplesPlainSelectedStageChange($event)"
      [getOptionValue]="getComponentSelectExamplesPlainStageValue"
      [getOptionLabel]="getComponentSelectExamplesPlainStageLabel"
      [isOptionDisabled]="isComponentSelectExamplesPlainStageDisabled"
      placeholder="Choose release stage"
      [ariaLabel]="'Release stage'"
    ></tng-select>
  </div>

  <p class="docs-component-select-examples-stage-plain-summary">Selected: {{ componentSelectExamplesPlainSelectedStageSummary() }}</p>
</section>
```

### component-select-examples-stage-plain.component.css

```css
.docs-component-select-examples-stage-plain-shell {
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

.docs-component-select-examples-stage-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-examples-stage-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-examples-stage-plain-copy,
.docs-component-select-examples-stage-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-select-examples-stage-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
}
```

### component-select-examples-stage-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesTailwindReleaseStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_EXAMPLES_TAILWIND_RELEASE_STAGE_OPTIONS: readonly ComponentSelectExamplesTailwindReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-component-select-examples-stage-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-stage-tailwind.component.html',
  styleUrl: './component-select-examples-stage-tailwind.component.css',
})
export class ComponentSelectExamplesStageTailwindComponent {
  readonly componentSelectExamplesTailwindReleaseStages = COMPONENT_SELECT_EXAMPLES_TAILWIND_RELEASE_STAGE_OPTIONS;
  readonly componentSelectExamplesTailwindSelectedStage = signal<string | null>('qa');
  readonly componentSelectExamplesTailwindSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesTailwindSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesTailwindReleaseStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectExamplesTailwindStageValue = (stage: ComponentSelectExamplesTailwindReleaseStageOption) => stage.value;
  readonly getComponentSelectExamplesTailwindStageLabel = (stage: ComponentSelectExamplesTailwindReleaseStageOption) => stage.label;
  readonly isComponentSelectExamplesTailwindStageDisabled = (stage: ComponentSelectExamplesTailwindReleaseStageOption) => stage.disabled === true;

  onComponentSelectExamplesTailwindSelectedStageChange(value: unknown): void {
    this.componentSelectExamplesTailwindSelectedStage.set(this.toComponentSelectExamplesTailwindSingleValue(value));
  }

  private toComponentSelectExamplesTailwindSingleValue(value: unknown): string | null {
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

### component-select-examples-stage-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release stage</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Keep a controlled release-stage value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem]">
    <tng-select
      [options]="componentSelectExamplesTailwindReleaseStages"
      [value]="componentSelectExamplesTailwindSelectedStage()"
      (valueChange)="onComponentSelectExamplesTailwindSelectedStageChange($event)"
      [getOptionValue]="getComponentSelectExamplesTailwindStageValue"
      [getOptionLabel]="getComponentSelectExamplesTailwindStageLabel"
      [isOptionDisabled]="isComponentSelectExamplesTailwindStageDisabled"
      placeholder="Choose release stage"
      [ariaLabel]="'Release stage'"
    ></tng-select>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentSelectExamplesTailwindSelectedStageSummary() }}</p>
</section>
```

### component-select-examples-stage-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### component-select-examples-primitive-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

type ComponentSelectExamplesPlainOrientationValue = 'ALL' | 'LANDSCAPE' | 'PORTRAIT';

const COMPONENT_SELECT_EXAMPLES_PLAIN_ORIENTATIONS: readonly ComponentSelectExamplesPlainOrientationValue[] = Object.freeze([
  'ALL',
  'LANDSCAPE',
  'PORTRAIT',
]);

@Component({
  selector: 'app-component-select-examples-primitive-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-primitive-plain.component.html',
  styleUrl: './component-select-examples-primitive-plain.component.css',
})
export class ComponentSelectExamplesPrimitivePlainComponent {
  readonly componentSelectExamplesPlainOrientations = COMPONENT_SELECT_EXAMPLES_PLAIN_ORIENTATIONS;
  readonly componentSelectExamplesPlainSelectedOrientation = signal<ComponentSelectExamplesPlainOrientationValue | null>('ALL');
  readonly componentSelectExamplesPlainSelectedOrientationSummary = computed(() => {
    return this.componentSelectExamplesPlainSelectedOrientation() ?? 'none';
  });
  readonly getComponentSelectExamplesPlainOrientationLabel = (orientation: ComponentSelectExamplesPlainOrientationValue) => {
    return orientation.toLowerCase().replace('_', ' ');
  };

  onComponentSelectExamplesPlainSelectedOrientationChange(value: unknown): void {
    this.componentSelectExamplesPlainSelectedOrientation.set(this.toComponentSelectExamplesPlainOrientationValue(value));
  }

  private toComponentSelectExamplesPlainOrientationValue(value: unknown): ComponentSelectExamplesPlainOrientationValue | null {
    return this.componentSelectExamplesPlainOrientations.includes(value as ComponentSelectExamplesPlainOrientationValue)
      ? (value as ComponentSelectExamplesPlainOrientationValue)
      : null;
  }
}
```

### component-select-examples-primitive-plain.component.html

```html
<section class="docs-component-select-examples-primitive-plain-shell">
  <div class="docs-component-select-examples-primitive-plain-header">
    <span class="docs-component-select-examples-primitive-plain-kicker">Primitive options</span>
    <p class="docs-component-select-examples-primitive-plain-copy">
      String options can be used directly. Omit getOptionValue when each option is already the value.
    </p>
  </div>

  <div class="docs-component-select-examples-primitive-plain-control">
    <tng-select
      [options]="componentSelectExamplesPlainOrientations"
      [value]="componentSelectExamplesPlainSelectedOrientation()"
      (valueChange)="onComponentSelectExamplesPlainSelectedOrientationChange($event)"
      [getOptionLabel]="getComponentSelectExamplesPlainOrientationLabel"
      placeholder="Choose orientation"
      [ariaLabel]="'Image orientation'"
    ></tng-select>
  </div>

  <p class="docs-component-select-examples-primitive-plain-summary">Selected: {{ componentSelectExamplesPlainSelectedOrientationSummary() }}</p>
</section>
```

### component-select-examples-primitive-plain.component.css

```css
.docs-component-select-examples-primitive-plain-shell {
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

.docs-component-select-examples-primitive-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-examples-primitive-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-examples-primitive-plain-copy,
.docs-component-select-examples-primitive-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-select-examples-primitive-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
}
```

### component-select-examples-primitive-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

type ComponentSelectExamplesTailwindOrientationValue = 'ALL' | 'LANDSCAPE' | 'PORTRAIT';

const COMPONENT_SELECT_EXAMPLES_TAILWIND_ORIENTATIONS: readonly ComponentSelectExamplesTailwindOrientationValue[] = Object.freeze([
  'ALL',
  'LANDSCAPE',
  'PORTRAIT',
]);

@Component({
  selector: 'app-component-select-examples-primitive-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-primitive-tailwind.component.html',
  styleUrl: './component-select-examples-primitive-tailwind.component.css',
})
export class ComponentSelectExamplesPrimitiveTailwindComponent {
  readonly componentSelectExamplesTailwindOrientations = COMPONENT_SELECT_EXAMPLES_TAILWIND_ORIENTATIONS;
  readonly componentSelectExamplesTailwindSelectedOrientation = signal<ComponentSelectExamplesTailwindOrientationValue | null>('LANDSCAPE');
  readonly componentSelectExamplesTailwindSelectedOrientationSummary = computed(() => {
    return this.componentSelectExamplesTailwindSelectedOrientation() ?? 'none';
  });
  readonly getComponentSelectExamplesTailwindOrientationLabel = (orientation: ComponentSelectExamplesTailwindOrientationValue) => {
    return orientation.toLowerCase().replace('_', ' ');
  };

  onComponentSelectExamplesTailwindSelectedOrientationChange(value: unknown): void {
    this.componentSelectExamplesTailwindSelectedOrientation.set(this.toComponentSelectExamplesTailwindOrientationValue(value));
  }

  private toComponentSelectExamplesTailwindOrientationValue(value: unknown): ComponentSelectExamplesTailwindOrientationValue | null {
    return this.componentSelectExamplesTailwindOrientations.includes(value as ComponentSelectExamplesTailwindOrientationValue)
      ? (value as ComponentSelectExamplesTailwindOrientationValue)
      : null;
  }
}
```

### component-select-examples-primitive-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Primitive options</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      String options can be used directly. Omit getOptionValue when each option is already the value.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem]">
    <tng-select
      [options]="componentSelectExamplesTailwindOrientations"
      [value]="componentSelectExamplesTailwindSelectedOrientation()"
      (valueChange)="onComponentSelectExamplesTailwindSelectedOrientationChange($event)"
      [getOptionLabel]="getComponentSelectExamplesTailwindOrientationLabel"
      placeholder="Choose orientation"
      [ariaLabel]="'Image orientation'"
    ></tng-select>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentSelectExamplesTailwindSelectedOrientationSummary() }}</p>
</section>
```

### component-select-examples-primitive-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### component-select-examples-owner-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_EXAMPLES_PLAIN_RELEASE_OWNER_OPTIONS: readonly ComponentSelectExamplesPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-component-select-examples-owner-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-owner-plain.component.html',
  styleUrl: './component-select-examples-owner-plain.component.css',
})
export class ComponentSelectExamplesOwnerPlainComponent {
  readonly componentSelectExamplesPlainReleaseOwners = COMPONENT_SELECT_EXAMPLES_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly componentSelectExamplesPlainSelectedOwnerId = signal<string | null>('mina');
  readonly componentSelectExamplesPlainSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesPlainSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesPlainReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectExamplesPlainOwnerValue = (owner: ComponentSelectExamplesPlainReleaseOwnerOption) => owner.id;
  readonly getComponentSelectExamplesPlainOwnerLabel = (owner: ComponentSelectExamplesPlainReleaseOwnerOption) => owner.name;
  readonly isComponentSelectExamplesPlainOwnerDisabled = (owner: ComponentSelectExamplesPlainReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectExamplesPlainSelectedOwnerChange(value: unknown): void {
    this.componentSelectExamplesPlainSelectedOwnerId.set(this.toComponentSelectExamplesPlainSingleValue(value));
  }

  private toComponentSelectExamplesPlainSingleValue(value: unknown): string | null {
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

### component-select-examples-owner-plain.component.html

```html
<section class="docs-component-select-examples-owner-plain-shell">
  <div class="docs-component-select-examples-owner-plain-header">
    <span class="docs-component-select-examples-owner-plain-kicker">Release owner roster</span>
    <p class="docs-component-select-examples-owner-plain-copy">
      Custom templates let the wrapper show richer trigger and option content without rebuilding the select primitive.
    </p>
  </div>

  <div class="docs-component-select-examples-owner-plain-control">
    <tng-select
      [options]="componentSelectExamplesPlainReleaseOwners"
      [value]="componentSelectExamplesPlainSelectedOwnerId()"
      (valueChange)="onComponentSelectExamplesPlainSelectedOwnerChange($event)"
      [getOptionValue]="getComponentSelectExamplesPlainOwnerValue"
      [getOptionLabel]="getComponentSelectExamplesPlainOwnerLabel"
      [isOptionDisabled]="isComponentSelectExamplesPlainOwnerDisabled"
      placeholder="Assign release owner"
      [ariaLabel]="'Release owner roster'"
    >
      <ng-template #tngSelectValueTpl let-selected>
        <div class="docs-component-select-examples-owner-plain-value-row">
          <strong>{{ selected.label }}</strong>
          <small>{{ selected.option?.team }}</small>
        </div>
      </ng-template>

      <ng-template #tngSelectOptionTpl let-option>
        <div class="docs-component-select-examples-owner-plain-option-row">
          <span class="docs-component-select-examples-owner-plain-option-label">{{ option.label }}</span>
          <small class="docs-component-select-examples-owner-plain-option-meta">{{ option.option.team }} · {{ option.option.timezone }}</small>
        </div>
      </ng-template>
    </tng-select>
  </div>

  <p class="docs-component-select-examples-owner-plain-summary">Selected: {{ componentSelectExamplesPlainSelectedOwnerSummary() }}</p>
</section>
```

### component-select-examples-owner-plain.component.css

```css
.docs-component-select-examples-owner-plain-shell {
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

.docs-component-select-examples-owner-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-examples-owner-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-examples-owner-plain-copy,
.docs-component-select-examples-owner-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-select-examples-owner-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
}

.docs-component-select-examples-owner-plain-value-row,
.docs-component-select-examples-owner-plain-option-row {
  display: grid;
  gap: 0.15rem;
}

.docs-component-select-examples-owner-plain-value-row strong,
.docs-component-select-examples-owner-plain-option-label {
  font-weight: 600;
}

.docs-component-select-examples-owner-plain-value-row small,
.docs-component-select-examples-owner-plain-option-meta {
  color: var(--tng-semantic-foreground-muted);
}
```

### component-select-examples-owner-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesTailwindReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_EXAMPLES_TAILWIND_RELEASE_OWNER_OPTIONS: readonly ComponentSelectExamplesTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-component-select-examples-owner-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-owner-tailwind.component.html',
  styleUrl: './component-select-examples-owner-tailwind.component.css',
})
export class ComponentSelectExamplesOwnerTailwindComponent {
  readonly componentSelectExamplesTailwindReleaseOwners = COMPONENT_SELECT_EXAMPLES_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly componentSelectExamplesTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly componentSelectExamplesTailwindSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesTailwindReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectExamplesTailwindOwnerValue = (owner: ComponentSelectExamplesTailwindReleaseOwnerOption) => owner.id;
  readonly getComponentSelectExamplesTailwindOwnerLabel = (owner: ComponentSelectExamplesTailwindReleaseOwnerOption) => owner.name;
  readonly isComponentSelectExamplesTailwindOwnerDisabled = (owner: ComponentSelectExamplesTailwindReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectExamplesTailwindSelectedOwnerChange(value: unknown): void {
    this.componentSelectExamplesTailwindSelectedOwnerId.set(this.toComponentSelectExamplesTailwindSingleValue(value));
  }

  private toComponentSelectExamplesTailwindSingleValue(value: unknown): string | null {
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

### component-select-examples-owner-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release owner roster</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Custom templates let the wrapper show richer trigger and option content without rebuilding the select primitive.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem]">
    <tng-select
      [options]="componentSelectExamplesTailwindReleaseOwners"
      [value]="componentSelectExamplesTailwindSelectedOwnerId()"
      (valueChange)="onComponentSelectExamplesTailwindSelectedOwnerChange($event)"
      [getOptionValue]="getComponentSelectExamplesTailwindOwnerValue"
      [getOptionLabel]="getComponentSelectExamplesTailwindOwnerLabel"
      [isOptionDisabled]="isComponentSelectExamplesTailwindOwnerDisabled"
      placeholder="Assign release owner"
      [ariaLabel]="'Release owner roster'"
    >
      <ng-template #tngSelectValueTpl let-selected>
        <div class="grid gap-0.5">
          <strong class="text-sm font-semibold text-slate-900">{{ selected.label }}</strong>
          <small class="text-xs text-slate-500">{{ selected.option?.team }}</small>
        </div>
      </ng-template>

      <ng-template #tngSelectOptionTpl let-option>
        <div class="grid gap-0.5">
          <span class="text-sm font-medium text-slate-900">{{ option.label }}</span>
          <small class="text-xs text-slate-500">{{ option.option.team }} · {{ option.option.timezone }}</small>
        </div>
      </ng-template>
    </tng-select>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentSelectExamplesTailwindSelectedOwnerSummary() }}</p>
</section>
```

### component-select-examples-owner-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```

### component-select-examples-mapped-plain.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesPlainOAuthClientRecord {
  readonly client_id: string;
  readonly client_name: string;
}

interface ComponentSelectExamplesPlainMappedOption {
  readonly value: string;
  readonly label: string;
}

const COMPONENT_SELECT_EXAMPLES_PLAIN_OAUTH_CLIENTS: readonly ComponentSelectExamplesPlainOAuthClientRecord[] = Object.freeze([
  { client_id: 'docs-portal', client_name: 'Docs portal' },
  { client_id: 'admin-console', client_name: 'Admin console' },
  { client_id: 'mobile-app', client_name: 'Mobile app' },
  { client_id: 'partner-api', client_name: 'Partner API' },
]);

@Component({
  selector: 'app-component-select-examples-mapped-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-mapped-plain.component.html',
  styleUrl: './component-select-examples-mapped-plain.component.css',
})
export class ComponentSelectExamplesMappedPlainComponent {
  readonly componentSelectExamplesPlainOauthClients = COMPONENT_SELECT_EXAMPLES_PLAIN_OAUTH_CLIENTS;
  readonly componentSelectExamplesPlainSelectedClientId = signal<string | null>('admin-console');
  readonly componentSelectExamplesPlainRemapCount = signal(0);
  readonly componentSelectExamplesPlainSelectedClientSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesPlainSelectedClientId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesPlainOauthClients.find((client) => client.client_id === selectedValue)?.client_name ?? 'none';
  });
  readonly getComponentSelectExamplesPlainMappedValue = (option: ComponentSelectExamplesPlainMappedOption) => option.value;
  readonly getComponentSelectExamplesPlainMappedLabel = (option: ComponentSelectExamplesPlainMappedOption) => option.label;

  /** New object identities each call — safe because trackBy defaults to getOptionValue. */
  componentSelectExamplesPlainMappedOptions(): ComponentSelectExamplesPlainMappedOption[] {
    this.componentSelectExamplesPlainRemapCount();
    return this.componentSelectExamplesPlainOauthClients.map((client) => ({
      value: client.client_id,
      label: client.client_name,
    }));
  }

  onComponentSelectExamplesPlainSelectedClientChange(value: unknown): void {
    this.componentSelectExamplesPlainSelectedClientId.set(this.toComponentSelectExamplesPlainSingleValue(value));
  }

  remapComponentSelectExamplesPlainOptions(): void {
    this.componentSelectExamplesPlainRemapCount.update((count) => count + 1);
  }

  private toComponentSelectExamplesPlainSingleValue(value: unknown): string | null {
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

### component-select-examples-mapped-plain.component.html

```html
<section class="docs-component-select-examples-mapped-plain-shell">
  <div class="docs-component-select-examples-mapped-plain-header">
    <span class="docs-component-select-examples-mapped-plain-kicker">Mapped options</span>
    <p class="docs-component-select-examples-mapped-plain-copy">
      Options are remapped from OAuth client records on every change detection. Open the menu, use arrow keys or click — the selection holds after remap.
    </p>
  </div>

  <div class="docs-component-select-examples-mapped-plain-control">
    <tng-select
      [options]="componentSelectExamplesPlainMappedOptions()"
      [value]="componentSelectExamplesPlainSelectedClientId()"
      (valueChange)="onComponentSelectExamplesPlainSelectedClientChange($event)"
      [getOptionValue]="getComponentSelectExamplesPlainMappedValue"
      [getOptionLabel]="getComponentSelectExamplesPlainMappedLabel"
      placeholder="Choose OAuth client"
      [ariaLabel]="'OAuth client'"
    ></tng-select>
  </div>

  <div class="docs-component-select-examples-mapped-plain-actions">
    <button
      type="button"
      class="docs-component-select-examples-mapped-plain-remap"
      (click)="remapComponentSelectExamplesPlainOptions()"
    >
      Remap options
    </button>
    <p class="docs-component-select-examples-mapped-plain-summary">
      Selected: {{ componentSelectExamplesPlainSelectedClientSummary() }} · remaps: {{ componentSelectExamplesPlainRemapCount() }}
    </p>
  </div>
</section>
```

### component-select-examples-mapped-plain.component.css

```css
.docs-component-select-examples-mapped-plain-shell {
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

.docs-component-select-examples-mapped-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-examples-mapped-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-examples-mapped-plain-copy,
.docs-component-select-examples-mapped-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-select-examples-mapped-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
}

.docs-component-select-examples-mapped-plain-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.docs-component-select-examples-mapped-plain-remap {
  appearance: none;
  margin: 0;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.65rem;
  background: var(--tng-semantic-background-elevated, transparent);
  color: var(--tng-semantic-foreground-primary);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}
```

### component-select-examples-mapped-tailwind.component.ts

```ts
import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectExamplesTailwindOAuthClientRecord {
  readonly client_id: string;
  readonly client_name: string;
}

interface ComponentSelectExamplesTailwindMappedOption {
  readonly value: string;
  readonly label: string;
}

const COMPONENT_SELECT_EXAMPLES_TAILWIND_OAUTH_CLIENTS: readonly ComponentSelectExamplesTailwindOAuthClientRecord[] = Object.freeze([
  { client_id: 'docs-portal', client_name: 'Docs portal' },
  { client_id: 'admin-console', client_name: 'Admin console' },
  { client_id: 'mobile-app', client_name: 'Mobile app' },
  { client_id: 'partner-api', client_name: 'Partner API' },
]);

@Component({
  selector: 'app-component-select-examples-mapped-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-examples-mapped-tailwind.component.html',
  styleUrl: './component-select-examples-mapped-tailwind.component.css',
})
export class ComponentSelectExamplesMappedTailwindComponent {
  readonly componentSelectExamplesTailwindOauthClients = COMPONENT_SELECT_EXAMPLES_TAILWIND_OAUTH_CLIENTS;
  readonly componentSelectExamplesTailwindSelectedClientId = signal<string | null>('mobile-app');
  readonly componentSelectExamplesTailwindRemapCount = signal(0);
  readonly componentSelectExamplesTailwindSelectedClientSummary = computed(() => {
    const selectedValue = this.componentSelectExamplesTailwindSelectedClientId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectExamplesTailwindOauthClients.find((client) => client.client_id === selectedValue)?.client_name ?? 'none';
  });
  readonly getComponentSelectExamplesTailwindMappedValue = (option: ComponentSelectExamplesTailwindMappedOption) => option.value;
  readonly getComponentSelectExamplesTailwindMappedLabel = (option: ComponentSelectExamplesTailwindMappedOption) => option.label;

  /** New object identities each call — safe because trackBy defaults to getOptionValue. */
  componentSelectExamplesTailwindMappedOptions(): ComponentSelectExamplesTailwindMappedOption[] {
    this.componentSelectExamplesTailwindRemapCount();
    return this.componentSelectExamplesTailwindOauthClients.map((client) => ({
      value: client.client_id,
      label: client.client_name,
    }));
  }

  onComponentSelectExamplesTailwindSelectedClientChange(value: unknown): void {
    this.componentSelectExamplesTailwindSelectedClientId.set(this.toComponentSelectExamplesTailwindSingleValue(value));
  }

  remapComponentSelectExamplesTailwindOptions(): void {
    this.componentSelectExamplesTailwindRemapCount.update((count) => count + 1);
  }

  private toComponentSelectExamplesTailwindSingleValue(value: unknown): string | null {
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

### component-select-examples-mapped-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Mapped options</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Options are remapped from OAuth client records on every change detection. Open the menu, use arrow keys or click — the selection holds after remap.
    </p>
  </div>

  <div class="block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem]">
    <tng-select
      [options]="componentSelectExamplesTailwindMappedOptions()"
      [value]="componentSelectExamplesTailwindSelectedClientId()"
      (valueChange)="onComponentSelectExamplesTailwindSelectedClientChange($event)"
      [getOptionValue]="getComponentSelectExamplesTailwindMappedValue"
      [getOptionLabel]="getComponentSelectExamplesTailwindMappedLabel"
      placeholder="Choose OAuth client"
      [ariaLabel]="'OAuth client'"
    ></tng-select>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <button
      type="button"
      class="rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-elevated,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--tng-semantic-foreground-primary)]"
      (click)="remapComponentSelectExamplesTailwindOptions()"
    >
      Remap options
    </button>
    <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">
      Selected: {{ componentSelectExamplesTailwindSelectedClientSummary() }} · remaps: {{ componentSelectExamplesTailwindRemapCount() }}
    </p>
  </div>
</section>
```

### component-select-examples-mapped-tailwind.component.css

```css
/* Tailwind utilities are applied directly in the template. */
```
