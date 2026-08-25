import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngDateRangePickerComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
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
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-date-range-picker-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngDateRangePickerComponent,
  ],
  templateUrl: './date-range-picker-overview-page.component.html',
  styleUrl: './date-range-picker-overview-page.component.css',
})
export class DateRangePickerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngDateRangePickerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly primitiveImportCode = [
    "import { TngIcon } from '@tailng-ui/icons';",
    'import {',
    '  bindTngDateRangePicker,',
    '  createDateRangePickerController,',
    '  TngDateRangePickerDayCell,',
    '  TngDateRangePickerDayGrid,',
    '  TngDateRangePickerHost,',
    '  TngDateRangePickerInput,',
    '  TngDateRangePickerMonthGrid,',
    '  TngDateRangePickerMonthOption,',
    '  TngDateRangePickerNextButton,',
    '  TngDateRangePickerOverlay,',
    '  TngDateRangePickerPeriodButton,',
    '  TngDateRangePickerPrevButton,',
    '  TngDateRangePickerTrigger,',
    '  TngDateRangePickerYearGrid,',
    '  TngDateRangePickerYearOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-date-range-picker',
    '  calendarLayout="dual"',
    "  [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
    '  [today]="\'2024-04-18\'"',
    '  [minDate]="\'2024-04-01\'"',
    '  [maxDate]="\'2026-03-31\'"',
    '  ariaLabel="Invoice period"',
    '></tng-date-range-picker>',
    '',
  ].join('\n');

  protected readonly headlessControllerCode = [
    'readonly controller = createDateRangePickerController<Date>({',
    '  ownerDocument: document,',
    "  value: { start: '2024-04-22', end: '2024-04-26' },",
    "  today: '2024-04-18',",
    "  minDate: '2024-04-01',",
    "  maxDate: '2026-03-31',",
    '  closeOnSelect: true,',
    '  trapFocus: true,',
    '  showOutsideDays: true,',
    '});',
    '',
    'readonly dateRangePicker = bindTngDateRangePicker(this.controller);',
    '',
  ].join('\n');

  protected readonly simplePlainCodeTabs = createCodeTabs(
    'overview-date-range-picker-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngDateRangePickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngDateRangePickerComponent],',
      "  templateUrl: './overview-date-range-picker-plain-css.component.html',",
      "  styleUrl: './overview-date-range-picker-plain-css.component.css',",
      '})',
      'export class OverviewDateRangePickerPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-date-range-picker',
      '  [defaultOpen]="false"',
      "  [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-01\'"',
      '  [maxDate]="\'2026-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Invoice period"',
      '></tng-date-range-picker>',
      '',
    ].join('\n'),
    '.date-range-picker-overview-example { inline-size: 18.5rem; }\n',
  );

  protected readonly simpleTailwindCodeTabs = createCodeTabs(
    'overview-date-range-picker-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngDateRangePickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngDateRangePickerComponent],',
      "  templateUrl: './overview-date-range-picker-tailwind.component.html',",
      '})',
      'export class OverviewDateRangePickerTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-date-range-picker',
      '    [defaultOpen]="false"',
      "    [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Invoice period"',
      '  ></tng-date-range-picker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles layout while semantic tokens keep the shell in sync with theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
