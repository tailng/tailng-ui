---
id: "components/slider/examples"
title: "Slider examples"
description: "Slider examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["slider","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/slider/tng-slider.component.ts","libs/tailng-ui/components/src/lib/form/slider/tng-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/examples/slider-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/examples/slider-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/examples/slider-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/slider/examples"
componentGroup: "form"
symbols: ["TngSliderComponent"]
selectors: ["tng-slider"]
productId: "slider"
section: "examples"
officialCatalog: true
generated: true
---

# Slider examples

Choose the escalation priority as part of a larger notification settings form.

### component-slider-examples-form-plain.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-form-plain',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-form-plain.component.html',
  styleUrl: './component-slider-examples-form-plain.component.css',
})
export class ComponentSliderExamplesFormPlainComponent {
  readonly priority = signal(70);
}
```

### component-slider-examples-form-plain.component.html

```html
<section class="slider-form-example">
  <div class="slider-form-example__header">
    <span class="slider-form-example__kicker">Tune priority</span>
    <p class="slider-form-example__copy">
      Choose the escalation priority as part of a larger notification settings form.
    </p>
  </div>

  <tng-slider
    class="slider-form-example__control"
    [value]="priority()"
    (valueChange)="priority.set($event)"
    [min]="0"
    [max]="100"
    [step]="10"
    aria-label="Escalation priority"
  />

  <div class="slider-form-example__footer">
    <p>Priority: {{ priority() }}%</p>
    <button type="button">Save settings</button>
  </div>
</section>
```

### component-slider-examples-form-plain.component.css

```css
.slider-form-example {
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

.slider-form-example__header {
  display: grid;
  gap: 0.35rem;
}

.slider-form-example__kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.slider-form-example__copy,
.slider-form-example__footer p {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.slider-form-example__control {
  --tng-semantic-accent-brand: #0f766e;
}

.slider-form-example__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.slider-form-example__footer button {
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.5rem;
  background: var(--tng-semantic-background-elevated);
  color: var(--tng-semantic-foreground-primary);
  font: inherit;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}
```

### component-slider-examples-form-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-form-tailwind',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-form-tailwind.component.html',
})
export class ComponentSliderExamplesFormTailwindComponent {
  readonly priority = signal(80);
}
```

### component-slider-examples-form-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Tune priority</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Choose the escalation priority as part of a larger notification settings form.
    </p>
  </div>

  <tng-slider
    class="[--tng-semantic-accent-brand:#0f766e]"
    [value]="priority()"
    (valueChange)="priority.set($event)"
    [min]="0"
    [max]="100"
    [step]="10"
    aria-label="Escalation priority"
  />

  <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">
    <p class="m-0">Priority: {{ priority() }}%</p>
    <button
      class="rounded-md border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] shadow-sm"
      type="button"
    >
      Save settings
    </button>
  </div>
</section>
```

### component-slider-examples-step-plain.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-step-plain',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-step-plain.component.html',
  styleUrl: './component-slider-examples-step-plain.component.css',
})
export class ComponentSliderExamplesStepPlainComponent {
  readonly componentSliderExamplesPlainBuffer = signal(30);
}
```

### component-slider-examples-step-plain.component.html

```html
<section class="docs-component-slider-examples-step-plain-shell">
  <div class="docs-component-slider-examples-step-plain-header">
    <span class="docs-component-slider-examples-step-plain-kicker">Cache buffer</span>
    <p class="docs-component-slider-examples-step-plain-copy">
      Stepped values keep a predictable set of allowed choices.
    </p>
  </div>

  <tng-slider
    class="docs-component-slider-examples-step-plain-control"
    [value]="componentSliderExamplesPlainBuffer()"
    (valueChange)="componentSliderExamplesPlainBuffer.set($event)"
    [min]="0"
    [max]="60"
    [step]="5"
    aria-label="Cache buffer minutes"
  />

  <div class="docs-component-slider-examples-step-plain-footer">
    <span>0m</span>
    <strong>{{ componentSliderExamplesPlainBuffer() }}m</strong>
    <span>60m</span>
  </div>
</section>
```

### component-slider-examples-step-plain.component.css

```css
.docs-component-slider-examples-step-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-component-slider-examples-step-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-slider-examples-step-plain-kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.docs-component-slider-examples-step-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-slider-examples-step-plain-control {
  --tng-semantic-accent-brand: #2563eb;
}

.docs-component-slider-examples-step-plain-footer {
  display: flex;
  justify-content: space-between;
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
}
```

### component-slider-examples-step-tailwind.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-step-tailwind',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-step-tailwind.component.html',
})
export class ComponentSliderExamplesStepTailwindComponent {
  readonly componentSliderExamplesTailwindBuffer = signal(45);
}
```

### component-slider-examples-step-tailwind.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Cache buffer</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Stepped values keep a predictable set of allowed choices.
    </p>
  </div>

  <tng-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    [value]="componentSliderExamplesTailwindBuffer()"
    (valueChange)="componentSliderExamplesTailwindBuffer.set($event)"
    [min]="0"
    [max]="60"
    [step]="5"
    aria-label="Cache buffer minutes"
  />

  <div class="flex justify-between text-xs text-[var(--tng-semantic-foreground-muted)]">
    <span>0m</span>
    <strong>{{ componentSliderExamplesTailwindBuffer() }}m</strong>
    <span>60m</span>
  </div>
</section>
```
