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

const COMPONENT_IMPORT_CODE = String.raw`import { TngSliderComponent } from '@tailng-ui/components';`;

const BASIC_USAGE_CODE = String.raw`<tng-slider
  [value]="volume()"
  (valueChange)="volume.set($event)"
  [min]="0"
  [max]="100"
  [step]="1"
  aria-label="Volume"
></tng-slider>`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-overview-plain-example',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-overview-plain-example.component.html',
  styleUrl: './component-slider-overview-plain-example.component.css',
})
export class ComponentSliderOverviewPlainExampleComponent {
  readonly componentSliderOverviewPlainVolume = signal(42);
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-slider-overview-plain-shell">
  <div class="docs-component-slider-overview-plain-header">
    <span class="docs-component-slider-overview-plain-kicker">Volume</span>
    <p class="docs-component-slider-overview-plain-copy">
      Controlled value with a compact summary beside the slider.
    </p>
  </div>

  <div class="docs-component-slider-overview-plain-control-row">
    <tng-slider
      class="docs-component-slider-overview-plain-control"
      [value]="componentSliderOverviewPlainVolume()"
      (valueChange)="componentSliderOverviewPlainVolume.set($event)"
      [min]="0"
      [max]="100"
      aria-label="Volume"
    />
    <strong>{{ componentSliderOverviewPlainVolume() }}%</strong>
  </div>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-slider-overview-plain-shell {
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

.docs-component-slider-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-slider-overview-plain-kicker {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.docs-component-slider-overview-plain-copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-component-slider-overview-plain-control-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem;
  align-items: center;
  gap: 1rem;
}

.docs-component-slider-overview-plain-control {
  --tng-semantic-accent-brand: #0f766e;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-slider-overview-tailwind-example',
  standalone: true,
  imports: [TngSliderComponent],
  templateUrl: './component-slider-overview-tailwind-example.component.html',
})
export class ComponentSliderOverviewTailwindExampleComponent {
  readonly componentSliderOverviewTailwindVolume = signal(68);
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.25rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Volume</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Utility shell with the same controlled slider contract.
    </p>
  </div>

  <div class="grid grid-cols-[minmax(0,1fr)_4rem] items-center gap-4">
    <tng-slider
      class="[--tng-semantic-accent-brand:#2563eb]"
      [value]="componentSliderOverviewTailwindVolume()"
      (valueChange)="componentSliderOverviewTailwindVolume.set($event)"
      [min]="0"
      [max]="100"
      aria-label="Volume"
    />
    <strong>{{ componentSliderOverviewTailwindVolume() }}%</strong>
  </div>
</section>`;

@Component({
  selector: 'app-slider-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSliderComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './slider-overview-page.component.html',
  styleUrl: './slider-overview-page.component.css',
})
export class SliderOverviewPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly overviewPlainValue = signal(42);
  protected readonly overviewTailwindValue = signal(68);
  protected readonly overviewPlainSummary = computed(() => `${this.overviewPlainValue()}%`);
  protected readonly overviewTailwindSummary = computed(() => `${this.overviewTailwindValue()}%`);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-overview-plain-example.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-overview-plain-example.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-slider-overview-plain-example.component.css',
      code: PLAIN_CSS_CODE,
    },
  ];

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-slider-overview-tailwind-example.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-slider-overview-tailwind-example.component.html',
      code: TAILWIND_HTML_CODE,
    },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
