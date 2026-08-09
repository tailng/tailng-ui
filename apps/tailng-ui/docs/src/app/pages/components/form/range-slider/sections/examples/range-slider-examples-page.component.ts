import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngRangeSliderComponent, type TngRangeSliderValue } from '@tailng-ui/components';
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

const SIGNAL_FORMS_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-price-filter-plain',
  standalone: true,
  imports: [FormField, TngRangeSliderComponent],
  templateUrl: './price-filter-plain.component.html',
  styleUrl: './price-filter-plain.component.css',
})
export class PriceFilterPlainComponent {
  readonly filtersModel = signal<{ priceRange: TngRangeSliderValue }>({
    priceRange: { min: 20, max: 80 },
  });
  readonly filtersForm = form(this.filtersModel);
}`;

const SIGNAL_FORMS_PLAIN_HTML_CODE = String.raw`<div class="range-slider-example">
  <tng-range-slider
    [formField]="filtersForm.priceRange"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    aria-label="Price range"
    minAriaLabel="Minimum price"
    maxAriaLabel="Maximum price"
  />

  <div class="range-slider-values">
    <span>${DOLLAR}{{ filtersModel().priceRange.min }}</span>
    <span>${DOLLAR}{{ filtersModel().priceRange.max }}</span>
  </div>
</div>`;

const SIGNAL_FORMS_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-price-filter-tailwind',
  standalone: true,
  imports: [FormField, TngRangeSliderComponent],
  templateUrl: './price-filter-tailwind.component.html',
})
export class PriceFilterTailwindComponent {
  readonly filtersModel = signal<{ priceRange: TngRangeSliderValue }>({
    priceRange: { min: 25, max: 85 },
  });
  readonly filtersForm = form(this.filtersModel);
}`;

const SIGNAL_FORMS_TAILWIND_HTML_CODE = String.raw`<div class="grid w-full max-w-[38rem] gap-3 rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4">
  <tng-range-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    [formField]="filtersForm.priceRange"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    aria-label="Price range"
    minAriaLabel="Minimum price"
    maxAriaLabel="Maximum price"
  />

  <div class="flex justify-between gap-4 text-sm text-[var(--tng-semantic-foreground-muted)]">
    <span>${DOLLAR}{{ filtersModel().priceRange.min }}</span>
    <span>${DOLLAR}{{ filtersModel().priceRange.max }}</span>
  </div>
</div>`;

const MINIMUM_GAP_PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-booking-window-plain',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './booking-window-plain.component.html',
  styleUrl: './booking-window-plain.component.css',
})
export class BookingWindowPlainComponent {
  readonly bookingWindow = signal<TngRangeSliderValue>({ min: 25, max: 70 });
}`;

const MINIMUM_GAP_PLAIN_HTML_CODE = String.raw`<div class="range-slider-example">
  <tng-range-slider
    [value]="bookingWindow()"
    (valueChange)="bookingWindow.set($event)"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    [minGap]="20"
    aria-label="Booking window"
    minAriaLabel="Start day"
    maxAriaLabel="End day"
  />

  <strong>Day {{ bookingWindow().min }} to {{ bookingWindow().max }}</strong>
</div>`;

const MINIMUM_GAP_TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import {
  TngRangeSliderComponent,
  type TngRangeSliderValue,
} from '@tailng-ui/components';

@Component({
  selector: 'app-booking-window-tailwind',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './booking-window-tailwind.component.html',
})
export class BookingWindowTailwindComponent {
  readonly bookingWindow = signal<TngRangeSliderValue>({ min: 30, max: 75 });
}`;

const MINIMUM_GAP_TAILWIND_HTML_CODE = String.raw`<div class="grid w-full max-w-[38rem] gap-3 rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4">
  <tng-range-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    [value]="bookingWindow()"
    (valueChange)="bookingWindow.set($event)"
    [lowerBound]="0"
    [upperBound]="100"
    [step]="5"
    [minGap]="20"
    aria-label="Booking window"
    minAriaLabel="Start day"
    maxAriaLabel="End day"
  />

  <strong class="text-sm text-[var(--tng-semantic-foreground-primary)]">
    Day {{ bookingWindow().min }} to {{ bookingWindow().max }}
  </strong>
</div>`;

const DISABLED_PLAIN_TS_CODE = String.raw`import { Component } from '@angular/core';
import { TngRangeSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-locked-budget-plain',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './locked-budget-plain.component.html',
  styleUrl: './locked-budget-plain.component.css',
})
export class LockedBudgetPlainComponent {}`;

const DISABLED_PLAIN_HTML_CODE = String.raw`<div class="range-slider-example">
  <tng-range-slider
    disabled
    [value]="{ min: 25, max: 70 }"
    [lowerBound]="0"
    [upperBound]="100"
    aria-label="Locked budget"
  />
</div>`;

const DISABLED_TAILWIND_TS_CODE = String.raw`import { Component } from '@angular/core';
import { TngRangeSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-locked-budget-tailwind',
  standalone: true,
  imports: [TngRangeSliderComponent],
  templateUrl: './locked-budget-tailwind.component.html',
})
export class LockedBudgetTailwindComponent {}`;

const DISABLED_TAILWIND_HTML_CODE = String.raw`<div class="grid w-full max-w-[38rem] gap-3 rounded-lg border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4">
  <tng-range-slider
    class="[--tng-semantic-accent-brand:#2563eb]"
    disabled
    [value]="{ min: 25, max: 70 }"
    [lowerBound]="0"
    [upperBound]="100"
    aria-label="Locked budget"
  />
</div>`;

const PLAIN_CSS_CODE = String.raw`.range-slider-example {
  display: grid;
  gap: 0.8rem;
  inline-size: min(100%, 38rem);
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.5rem;
  background: var(--tng-semantic-background-surface);
}

.range-slider-values {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.85rem;
}`;

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode?: string,
): readonly DocsExampleCodeTab[] {
  const tabs: DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
  ];

  if (cssCode !== undefined) {
    tabs.push({
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    });
  }

  return tabs;
}

@Component({
  selector: 'app-range-slider-examples-page',
  imports: [
    FormField,
    TngRangeSliderComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './range-slider-examples-page.component.html',
  styleUrl: '../../range-slider-docs.css',
})
export class RangeSliderExamplesPageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  protected readonly codeBlockTheme = signal(resolveDocsCodeBlockTheme(this.document));
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.document,
    this.codeBlockTheme,
  );

  protected readonly plainFiltersModel = signal<{ priceRange: TngRangeSliderValue }>({
    priceRange: { min: 20, max: 80 },
  });
  protected readonly plainFiltersForm = form(this.plainFiltersModel);
  protected readonly tailwindFiltersModel = signal<{ priceRange: TngRangeSliderValue }>({
    priceRange: { min: 25, max: 85 },
  });
  protected readonly tailwindFiltersForm = form(this.tailwindFiltersModel);
  protected readonly plainBookingWindow = signal<TngRangeSliderValue>({ min: 25, max: 70 });
  protected readonly tailwindBookingWindow = signal<TngRangeSliderValue>({ min: 30, max: 75 });

  protected readonly signalFormsPlainCodeTabs = createCodeTabs(
    'price-filter-plain',
    SIGNAL_FORMS_PLAIN_TS_CODE,
    SIGNAL_FORMS_PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly signalFormsTailwindCodeTabs = createCodeTabs(
    'price-filter-tailwind',
    SIGNAL_FORMS_TAILWIND_TS_CODE,
    SIGNAL_FORMS_TAILWIND_HTML_CODE,
  );
  protected readonly minimumGapPlainCodeTabs = createCodeTabs(
    'booking-window-plain',
    MINIMUM_GAP_PLAIN_TS_CODE,
    MINIMUM_GAP_PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly minimumGapTailwindCodeTabs = createCodeTabs(
    'booking-window-tailwind',
    MINIMUM_GAP_TAILWIND_TS_CODE,
    MINIMUM_GAP_TAILWIND_HTML_CODE,
  );
  protected readonly disabledPlainCodeTabs = createCodeTabs(
    'locked-budget-plain',
    DISABLED_PLAIN_TS_CODE,
    DISABLED_PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'locked-budget-tailwind',
    DISABLED_TAILWIND_TS_CODE,
    DISABLED_TAILWIND_HTML_CODE,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
