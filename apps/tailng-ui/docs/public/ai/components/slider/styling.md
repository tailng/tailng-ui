---
id: "components/slider/styling"
title: "Slider styling"
description: "Slider styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["slider","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/slider/tng-slider.component.ts","libs/tailng-ui/components/src/lib/form/slider/tng-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/styling/slider-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/styling/slider-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/styling/slider-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/slider/styling"
componentGroup: "form"
symbols: ["TngSliderComponent"]
selectors: ["tng-slider"]
productId: "slider"
section: "styling"
officialCatalog: true
generated: true
---

# Slider styling

## Supported contract

Theme the slider component from its host. Keep labels, marks, and value badges in your surrounding shell.

| Selector or token | Applied on | Purpose |
| --- | --- | --- |
| tng-slider | Wrapper host | Own layout width and component-level semantic tokens. |
| [data-disabled] | Wrapper root and primitive input | Style disabled state without depending on component internals. |
| --tng-slider-range-color | Wrapper host or ancestor | Sets the selected portion of the track. |
| --tng-slider-track-color | Wrapper host or ancestor | Sets the unselected track color. |
| --tng-slider-thumb-color, --tng-slider-thumb-border-color | Wrapper host or ancestor | Sets the pointer surface and border colors. |
| --tng-slider-track-size, --tng-slider-thumb-size | Wrapper host or ancestor | Adjusts the shared track and pointer dimensions. |

## Host tokens

The slider exposes public track, selected-range, pointer, focus, and sizing tokens.

#### slider.tokens.css

```css
tng-slider.docs-component-slider-styling-brand-shell {
  --tng-slider-range-color: #0f766e;
  --tng-slider-thumb-border-color: #0f766e;
  --tng-slider-track-size: 0.5rem;
  --tng-slider-thumb-size: 1.25rem;
  --tng-disabled-opacity: 0.5;
}

/* Keep layout, labels, marks, and summaries in your shell. */
.settings-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem;
  gap: 1rem;
}
```

Host tokens change the slider accent while labels and marks stay in the outer shell.

Utility classes own the shell while the component receives the same accent token.

## Styling examples

### component-slider-styling-plain-example.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-styling-plain-example',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-styling-plain-example.component.html',
  styleUrl: './component-slider-styling-plain-example.component.css',
})
export class ComponentSliderStylingPlainExampleComponent {
  readonly componentSliderStylingPlainDensity = signal(55);
}
```

### component-slider-styling-plain-example.component.html

```html
<section class="docs-component-slider-styling-plain-shell">
  <div class="docs-component-slider-styling-plain-header">
    <span class="docs-component-slider-styling-plain-kicker">Panel density</span>
    <p class="docs-component-slider-styling-plain-copy">
      Host tokens change the slider accent while labels and marks stay in the outer shell.
    </p>
  </div>

  <div class="docs-component-slider-styling-plain-control-row">
    <tng-slider
      class="docs-component-slider-styling-brand-shell"
      [value]="componentSliderStylingPlainDensity()"
      (valueChange)="componentSliderStylingPlainDensity.set($event)"
      [min]="0"
      [max]="100"
      [step]="5"
      aria-label="Panel density"
    />
    <strong>{{ componentSliderStylingPlainDensity() }}%</strong>
  </div>

  <div class="docs-component-slider-styling-plain-marks" aria-hidden="true">
    <span>Loose</span>
    <span>Balanced</span>
    <span>Dense</span>
  </div>
</section>
```

### component-slider-styling-plain-example.component.css

```css
.docs-component-slider-styling-plain-shell {
  display: grid;
  gap: 0.85rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-component-slider-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-slider-styling-plain-kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.docs-component-slider-styling-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-slider-styling-plain-control-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem;
  align-items: center;
  gap: 1rem;
}

.docs-component-slider-styling-brand-shell {
  --tng-semantic-accent-brand: #0f766e;
}

.docs-component-slider-styling-plain-marks {
  display: flex;
  justify-content: space-between;
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.75rem;
}
```

### component-slider-styling-tailwind-example.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-styling-tailwind-example',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-styling-tailwind-example.component.html',
})
export class ComponentSliderStylingTailwindExampleComponent {
  readonly componentSliderStylingTailwindDensity = signal(35);
}
```

### component-slider-styling-tailwind-example.component.html

```html
<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Panel density</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Utility classes own the shell while the component receives the same accent token.
    </p>
  </div>

  <div class="grid grid-cols-[minmax(0,1fr)_4rem] items-center gap-4">
    <tng-slider
      class="[--tng-semantic-accent-brand:#7c3aed]"
      [value]="componentSliderStylingTailwindDensity()"
      (valueChange)="componentSliderStylingTailwindDensity.set($event)"
      [min]="0"
      [max]="100"
      [step]="5"
      aria-label="Panel density"
    />
    <strong>{{ componentSliderStylingTailwindDensity() }}%</strong>
  </div>

  <div class="flex justify-between text-xs text-[var(--tng-semantic-foreground-muted)]" aria-hidden="true">
    <span>Loose</span>
    <span>Balanced</span>
    <span>Dense</span>
  </div>
</section>
```
