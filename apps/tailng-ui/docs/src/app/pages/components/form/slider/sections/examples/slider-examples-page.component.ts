import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';
import { TngSlider as TngSliderPrimitive } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../slider.util';

const STEP_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
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
}`;

const STEP_PLAIN_HTML_CODE = String.raw`<section class="docs-component-slider-examples-step-plain-shell">
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
</section>`;

const STEP_PLAIN_CSS_CODE = String.raw`.docs-component-slider-examples-step-plain-shell {
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
}`;

const STEP_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-examples-step-tailwind',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-examples-step-tailwind.component.html',
})
export class ComponentSliderExamplesStepTailwindComponent {
  readonly componentSliderExamplesTailwindBuffer = signal(45);
}`;

const STEP_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
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
</section>`;

const RANGE_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSlider } from '@tailng-ui/primitives';

function readSliderValue(event: Event): number {
  return Number((event.target as HTMLInputElement).value);
}

@Component({
  selector: 'app-component-slider-examples-range-plain',
  standalone: true,
  imports: [TngSlider],
  templateUrl: './component-slider-examples-range-plain.component.html',
  styleUrl: './component-slider-examples-range-plain.component.css',
})
export class ComponentSliderExamplesRangePlainComponent {
  readonly componentSliderExamplesPlainMin = signal(20);
  readonly componentSliderExamplesPlainMax = signal(75);
  readonly componentSliderExamplesPlainMinPercent = computed(() => this.componentSliderExamplesPlainMin() + '%');
  readonly componentSliderExamplesPlainMaxPercent = computed(() => this.componentSliderExamplesPlainMax() + '%');

  onComponentSliderExamplesPlainMinInput(event: Event): void {
    this.componentSliderExamplesPlainMin.set(Math.min(readSliderValue(event), this.componentSliderExamplesPlainMax() - 5));
  }

  onComponentSliderExamplesPlainMaxInput(event: Event): void {
    this.componentSliderExamplesPlainMax.set(Math.max(readSliderValue(event), this.componentSliderExamplesPlainMin() + 5));
  }
}`;

const RANGE_PLAIN_HTML_CODE = String.raw`<section
  class="docs-component-slider-examples-range-plain-shell"
  [style.--slider-range-min]="componentSliderExamplesPlainMinPercent()"
  [style.--slider-range-max]="componentSliderExamplesPlainMaxPercent()"
>
  <div class="docs-component-slider-examples-range-plain-header">
    <span class="docs-component-slider-examples-range-plain-kicker">Price range</span>
    <p class="docs-component-slider-examples-range-plain-copy">
      Two coordinated range inputs provide adjustable minimum and maximum pointers.
    </p>
  </div>

  <div class="docs-component-slider-examples-range-plain-control">
    <div class="docs-component-slider-examples-range-plain-track" aria-hidden="true"></div>
    <input
      tngSlider
      class="docs-component-slider-examples-range-plain-input docs-component-slider-examples-range-plain-input--min"
      [value]="componentSliderExamplesPlainMin()"
      (input)="onComponentSliderExamplesPlainMinInput($event)"
      [min]="0"
      [max]="100"
      [step]="5"
      aria-label="Minimum price"
    />
    <input
      tngSlider
      class="docs-component-slider-examples-range-plain-input docs-component-slider-examples-range-plain-input--max"
      [value]="componentSliderExamplesPlainMax()"
      (input)="onComponentSliderExamplesPlainMaxInput($event)"
      [min]="0"
      [max]="100"
      [step]="5"
      aria-label="Maximum price"
    />
  </div>

  <div class="docs-component-slider-examples-range-plain-values">
    <span>Min: USD {{ componentSliderExamplesPlainMin() }}</span>
    <span>Max: USD {{ componentSliderExamplesPlainMax() }}</span>
  </div>
</section>`;

const RANGE_PLAIN_CSS_CODE = String.raw`.docs-component-slider-examples-range-plain-shell {
  --slider-range-min: 20%;
  --slider-range-max: 75%;
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

.docs-component-slider-examples-range-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-slider-examples-range-plain-kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.docs-component-slider-examples-range-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-slider-examples-range-plain-control {
  position: relative;
  block-size: 2.25rem;
}

.docs-component-slider-examples-range-plain-track {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(50% - 0.25rem);
  block-size: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--tng-semantic-border-subtle) 0 var(--slider-range-min),
    #0f766e var(--slider-range-min) var(--slider-range-max),
    var(--tng-semantic-border-subtle) var(--slider-range-max) 100%
  );
}

.docs-component-slider-examples-range-plain-input {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.docs-component-slider-examples-range-plain-input::-webkit-slider-thumb {
  pointer-events: auto;
}

.docs-component-slider-examples-range-plain-input::-moz-range-thumb {
  pointer-events: auto;
}

.docs-component-slider-examples-range-plain-values {
  display: flex;
  justify-content: space-between;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}`;

function readSliderEventValue(event: Event): number {
  const target = event.target;
  return target instanceof HTMLInputElement ? Number(target.value) : 0;
}

@Component({
  selector: 'app-slider-examples-page',
  imports: [
    TngSliderComponent,
    TngSliderPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
  ],
  templateUrl: './slider-examples-page.component.html',
  styleUrl: './slider-examples-page.component.css',
})
export class SliderExamplesPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly formPriority = signal(70);
  protected readonly stepPlainValue = signal(30);
  protected readonly stepTailwindValue = signal(45);
  protected readonly rangeMinValue = signal(20);
  protected readonly rangeMaxValue = signal(75);
  protected readonly rangeMinPercent = computed(() => `${this.rangeMinValue()}%`);
  protected readonly rangeMaxPercent = computed(() => `${this.rangeMaxValue()}%`);
  protected readonly rangeSummary = computed(() => {
    return `$${this.rangeMinValue()} - $${this.rangeMaxValue()}`;
  });

  protected readonly stepPlainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-examples-step-plain.component.ts',
      code: STEP_PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-examples-step-plain.component.html',
      code: STEP_PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-slider-examples-step-plain.component.css',
      code: STEP_PLAIN_CSS_CODE,
    },
  ];

  protected readonly stepTailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-examples-step-tailwind.component.ts',
      code: STEP_TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-examples-step-tailwind.component.html',
      code: STEP_TAILWIND_HTML_CODE,
    },
  ];

  protected readonly rangePlainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-examples-range-plain.component.ts',
      code: RANGE_PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-examples-range-plain.component.html',
      code: RANGE_PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-slider-examples-range-plain.component.css',
      code: RANGE_PLAIN_CSS_CODE,
    },
  ];

  protected onRangeMinInput(event: Event): void {
    const nextValue = readSliderEventValue(event);
    this.rangeMinValue.set(Math.min(nextValue, this.rangeMaxValue() - 5));
  }

  protected onRangeMaxInput(event: Event): void {
    const nextValue = readSliderEventValue(event);
    this.rangeMaxValue.set(Math.max(nextValue, this.rangeMinValue() + 5));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
