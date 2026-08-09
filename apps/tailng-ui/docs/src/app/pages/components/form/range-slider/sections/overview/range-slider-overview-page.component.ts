import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCodeBlockComponent,
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

const DOLLAR = '$';

const IMPORT_CODE = String.raw`import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-price-range-plain',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './price-range-plain.component.html',
  styleUrl: './price-range-plain.component.css',
})
export class PriceRangePlainComponent {
  readonly priceRange = signal<TngRangeSliderValue>({ min: 20, max: 75 });
}`;

const PLAIN_HTML_CODE = String.raw`<div class="price-range-card">
  <tng-range-slider
    [value]="priceRange()"
    (valueChange)="priceRange.set($event)"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    [minGap]="10"
    aria-label="Price range"
    minAriaLabel="Minimum price"
    maxAriaLabel="Maximum price"
  />

  <div class="price-range-values">
    <span>Minimum: ${DOLLAR}{{ priceRange().min }}</span>
    <span>Maximum: ${DOLLAR}{{ priceRange().max }}</span>
  </div>
</div>`;

const PLAIN_CSS_CODE = String.raw`.price-range-card {
  display: grid;
  gap: 0.8rem;
  inline-size: min(100%, 38rem);
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.5rem;
  background: var(--tng-semantic-background-surface);
}

.price-range-values {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.85rem;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-price-range-tailwind',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './price-range-tailwind.component.html',
})
export class PriceRangeTailwindComponent {
  readonly priceRange = signal<TngRangeSliderValue>({ min: 25, max: 85 });
}`;

const TAILWIND_HTML_CODE = String.raw`<div class="grid w-full max-w-[38rem] gap-3 rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4">
  <tng-range-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    [value]="priceRange()"
    (valueChange)="priceRange.set($event)"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    [minGap]="10"
    aria-label="Price range"
    minAriaLabel="Minimum price"
    maxAriaLabel="Maximum price"
  />

  <div class="flex justify-between gap-4 text-sm text-[var(--tng-semantic-foreground-muted)]">
    <span>Minimum: ${DOLLAR}{{ priceRange().min }}</span>
    <span>Maximum: ${DOLLAR}{{ priceRange().max }}</span>
  </div>
</div>`;

@Component({
  selector: 'app-range-slider-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngRangeSliderComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './range-slider-overview-page.component.html',
  styleUrl: '../../range-slider-docs.css',
})
export class RangeSliderOverviewPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly importCode = IMPORT_CODE;
  protected readonly plainPriceRange = signal<TngRangeSliderValue>({ min: 20, max: 75 });
  protected readonly tailwindPriceRange = signal<TngRangeSliderValue>({ min: 25, max: 85 });
  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'price-range-plain.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'price-range-plain.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'price-range-plain.component.css',
      code: PLAIN_CSS_CODE,
    },
  ];
  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'price-range-tailwind.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'price-range-tailwind.component.html',
      code: TAILWIND_HTML_CODE,
    },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
