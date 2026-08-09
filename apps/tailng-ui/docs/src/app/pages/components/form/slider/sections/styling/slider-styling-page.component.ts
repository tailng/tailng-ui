import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSliderComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../slider.util';

type ContractRow = {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
};

const HOST_TOKEN_GUIDANCE_CODE = String.raw`tng-slider.docs-component-slider-styling-brand-shell {
  --tng-semantic-accent-brand: #0f766e;
  --tng-disabled-opacity: 0.5;
}

/* Keep layout, labels, marks, and summaries in your shell. */
.settings-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem;
  gap: 1rem;
}`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
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
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-slider-styling-plain-shell">
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
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-slider-styling-plain-shell {
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
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-styling-tailwind-example',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-styling-tailwind-example.component.html',
})
export class ComponentSliderStylingTailwindExampleComponent {
  readonly componentSliderStylingTailwindDensity = signal(35);
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
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
</section>`;

@Component({
  selector: 'app-slider-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngSliderComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './slider-styling-page.component.html',
  styleUrl: './slider-styling-page.component.css',
})
export class SliderStylingPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly hostTokenGuidanceCode = HOST_TOKEN_GUIDANCE_CODE;
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly stylingPlainValue = signal(55);
  protected readonly stylingTailwindValue = signal(35);
  protected readonly stylingPlainSummary = computed(() => `${this.stylingPlainValue()}%`);
  protected readonly stylingTailwindSummary = computed(() => `${this.stylingTailwindValue()}%`);

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: 'tng-slider',
      appliedOn: 'Wrapper host',
      purpose: 'Own layout width and component-level semantic tokens.',
    },
    {
      selector: '[data-disabled]',
      appliedOn: 'Wrapper root and primitive input',
      purpose: 'Style disabled state without depending on component internals.',
    },
    {
      selector: '--tng-semantic-accent-brand',
      appliedOn: 'Wrapper host or ancestor',
      purpose: 'Sets the native range accent color used by the default slider.',
    },
    {
      selector: 'input[tngSlider]',
      appliedOn: 'Native input',
      purpose: 'Use when you need direct pseudo-element styling for a custom track or thumb.',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-styling-plain-example.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-styling-plain-example.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-slider-styling-plain-example.component.css',
      code: PLAIN_CSS_CODE,
    },
  ];

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-styling-tailwind-example.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-styling-tailwind-example.component.html',
      code: TAILWIND_HTML_CODE,
    },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
