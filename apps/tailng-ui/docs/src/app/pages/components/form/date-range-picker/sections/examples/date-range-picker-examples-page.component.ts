import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngDateRangePickerComponent } from '@tailng-ui/components';
import { defaultDateRangePickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';
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

const customFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDateRangePickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDateRangePickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDateRangePickerDateAdapter.getMonth(date) + 1)
        .toString()
        .padStart(2, '0');
      const year = defaultDateRangePickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const month = defaultDateRangePickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      const year = defaultDateRangePickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${year} · ${month}`;
    }

    return defaultDateRangePickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDateRangePickerDateAdapter.createDate(year, month, day);
      return defaultDateRangePickerDateAdapter.isValid(date) &&
        defaultDateRangePickerDateAdapter.getYear(date) === year &&
        defaultDateRangePickerDateAdapter.getMonth(date) === month &&
        defaultDateRangePickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDateRangePickerDateAdapter.parse(text, locale);
  },
});

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

function createWrapperTsCode(componentClassName: string, includeAdapter = false): string {
  const adapterImports = includeAdapter
    ? [
        "import { defaultDateRangePickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        'const reportingAdapter: TngDateAdapter<Date> = {',
        '  ...defaultDateRangePickerDateAdapter,',
        "  format: (date, format, locale) => format === 'month-year' ? '2024 · APR' : defaultDateRangePickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDateRangePickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component } from '@angular/core';",
    "import { TngDateRangePickerComponent } from '@tailng-ui/components';",
    ...adapterImports,
    '@Component({',
    '  imports: [TngDateRangePickerComponent],',
    `  templateUrl: './${componentClassName}.component.html',`,
    `  styleUrl: './${componentClassName}.component.css',`,
    '})',
    `export class ${toPascalCase(componentClassName)}Component {`,
    ...(includeAdapter ? ['  protected readonly reportingAdapter = reportingAdapter;'] : []),
    '}',
    '',
  ].join('\n');
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join('');
}

@Component({
  selector: 'app-date-range-picker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngDateRangePickerComponent,
  ],
  templateUrl: './date-range-picker-examples-page.component.html',
  styleUrl: './date-range-picker-examples-page.component.css',
})
export class DateRangePickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly customFormatAdapter = customFormatAdapter;

  protected readonly defaultPlainCodeTabs = createCodeTabs(
    'default-date-range-picker-plain-css',
    createWrapperTsCode('default-date-range-picker-plain-css'),
    [
      '<tng-date-range-picker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-01\'"',
      '  [maxDate]="\'2026-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Invoice period"',
      '></tng-date-range-picker>',
      '',
    ].join('\n'),
    '.date-range-picker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly defaultTailwindCodeTabs = createCodeTabs(
    'default-date-range-picker-tailwind',
    createWrapperTsCode('default-date-range-picker-tailwind'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-date-range-picker',
      '    [defaultOpen]="false"',
      '    [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Invoice period"',
      '  ></tng-date-range-picker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly customPlainCodeTabs = createCodeTabs(
    'custom-format-date-range-picker-plain-css',
    createWrapperTsCode('custom-format-date-range-picker-plain-css', true),
    [
      '<tng-date-range-picker',
      '  [defaultOpen]="false"',
      '  [adapter]="reportingAdapter"',
      '  [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '  [today]="\'2024-04-18\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Reporting period"',
      '></tng-date-range-picker>',
      '',
    ].join('\n'),
    '.date-range-picker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly customTailwindCodeTabs = createCodeTabs(
    'custom-format-date-range-picker-tailwind',
    createWrapperTsCode('custom-format-date-range-picker-tailwind', true),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-date-range-picker',
      '    [defaultOpen]="false"',
      '    [adapter]="reportingAdapter"',
      '    [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '    [today]="\'2024-04-18\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Reporting period"',
      '  ></tng-date-range-picker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly boundedPlainCodeTabs = createCodeTabs(
    'bounded-date-range-picker-plain-css',
    createWrapperTsCode('bounded-date-range-picker-plain-css'),
    [
      '<tng-date-range-picker',
      '  [defaultOpen]="false"',
      '  [today]="\'2026-06-24\'"',
      '  [minDate]="\'2024-04-01\'"',
      '  [maxDate]="\'2025-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Bounded shipping period"',
      '></tng-date-range-picker>',
      '',
    ].join('\n'),
    '.date-range-picker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly boundedTailwindCodeTabs = createCodeTabs(
    'bounded-date-range-picker-tailwind',
    createWrapperTsCode('bounded-date-range-picker-tailwind'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-date-range-picker',
      '    [defaultOpen]="false"',
      '    [today]="\'2026-06-24\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2025-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Bounded shipping period"',
      '  ></tng-date-range-picker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly popupPlainCodeTabs = createCodeTabs(
    'popup-width-date-range-picker-plain-css',
    createWrapperTsCode('popup-width-date-range-picker-plain-css'),
    [
      '<div class="date-range-picker-width-examples">',
      '  <section class="date-range-picker-width-case">',
      '    <h3>Minimum width</h3>',
      '    <div class="date-range-picker-width-control date-range-picker-width-control--min">',
      '      <tng-date-range-picker',
      '        [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Minimum-width date range picker"',
      '      ></tng-date-range-picker>',
      '    </div>',
      '  </section>',
      '',
      '  <section class="date-range-picker-width-case">',
      '    <h3>Maximum width</h3>',
      '    <div class="date-range-picker-width-control date-range-picker-width-control--max">',
      '      <tng-date-range-picker',
      '        [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Maximum-width date range picker"',
      '      ></tng-date-range-picker>',
      '    </div>',
      '  </section>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.date-range-picker-width-examples { display: grid; gap: 1.5rem; }',
      '.date-range-picker-width-case { display: grid; gap: 0.75rem; }',
      '.date-range-picker-width-case h3 { font-size: 0.875rem; margin: 0; }',
      '.date-range-picker-width-control--min { inline-size: min(100%, 14rem); }',
      '.date-range-picker-width-control--max { inline-size: min(100%, 28rem); }',
      '',
    ].join('\n'),
  );

  protected readonly popupTailwindCodeTabs = createCodeTabs(
    'popup-width-date-range-picker-tailwind',
    createWrapperTsCode('popup-width-date-range-picker-tailwind'),
    [
      '<div class="grid gap-6">',
      '  <section class="grid gap-3">',
      '    <h3 class="m-0 text-sm font-semibold">Minimum width</h3>',
      '    <div class="w-full max-w-[14rem]">',
      '      <tng-date-range-picker',
      '        [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Minimum-width date range picker"',
      '      ></tng-date-range-picker>',
      '    </div>',
      '  </section>',
      '',
      '  <section class="grid gap-3">',
      '    <h3 class="m-0 text-sm font-semibold">Maximum width</h3>',
      '    <div class="w-full max-w-[28rem]">',
      '      <tng-date-range-picker',
      '        [defaultValue]="{ start: \'2024-04-22\', end: \'2024-04-26\' }"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Maximum-width date range picker"',
      '      ></tng-date-range-picker>',
      '    </div>',
      '  </section>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles the example layout and input-shell widths. */\n',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
