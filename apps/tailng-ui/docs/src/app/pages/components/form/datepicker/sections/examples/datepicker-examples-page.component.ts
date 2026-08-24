import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngDatepickerComponent } from '@tailng-ui/components';
import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';
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
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDatepickerDateAdapter.getMonth(date) + 1)
        .toString()
        .padStart(2, '0');
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${year} · ${month}`;
    }

    return defaultDatepickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDatepickerDateAdapter.createDate(year, month, day);
      return defaultDatepickerDateAdapter.isValid(date) &&
        defaultDatepickerDateAdapter.getYear(date) === year &&
        defaultDatepickerDateAdapter.getMonth(date) === month &&
        defaultDatepickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDatepickerDateAdapter.parse(text, locale);
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
        "import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        'const reportingAdapter: TngDateAdapter<Date> = {',
        '  ...defaultDatepickerDateAdapter,',
        "  format: (date, format, locale) => format === 'month-year' ? '2024 · APR' : defaultDatepickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDatepickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component } from '@angular/core';",
    "import { TngDatepickerComponent } from '@tailng-ui/components';",
    ...adapterImports,
    '@Component({',
    '  imports: [TngDatepickerComponent],',
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
  selector: 'app-datepicker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngDatepickerComponent,
  ],
  templateUrl: './datepicker-examples-page.component.html',
  styleUrl: './datepicker-examples-page.component.css',
})
export class DatepickerExamplesPageComponent implements OnDestroy {
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
    'default-datepicker-plain-css',
    createWrapperTsCode('default-datepicker-plain-css'),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="\'2024-04-22\'"',
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-01\'"',
      '  [maxDate]="\'2026-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Invoice date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly defaultTailwindCodeTabs = createCodeTabs(
    'default-datepicker-tailwind',
    createWrapperTsCode('default-datepicker-tailwind'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-datepicker',
      '    [defaultOpen]="false"',
      '    [defaultValue]="\'2024-04-22\'"',
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Invoice date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly customPlainCodeTabs = createCodeTabs(
    'custom-format-datepicker-plain-css',
    createWrapperTsCode('custom-format-datepicker-plain-css', true),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [adapter]="reportingAdapter"',
      '  [defaultValue]="\'2024-04-22\'"',
      '  [today]="\'2024-04-18\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Reporting date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly customTailwindCodeTabs = createCodeTabs(
    'custom-format-datepicker-tailwind',
    createWrapperTsCode('custom-format-datepicker-tailwind', true),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-datepicker',
      '    [defaultOpen]="false"',
      '    [adapter]="reportingAdapter"',
      '    [defaultValue]="\'2024-04-22\'"',
      '    [today]="\'2024-04-18\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Reporting date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly boundedPlainCodeTabs = createCodeTabs(
    'bounded-datepicker-plain-css',
    createWrapperTsCode('bounded-datepicker-plain-css'),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="\'2024-04-18\'"',
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-10\'"',
      '  [maxDate]="\'2024-04-25\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Bounded shipping date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly boundedTailwindCodeTabs = createCodeTabs(
    'bounded-datepicker-tailwind',
    createWrapperTsCode('bounded-datepicker-tailwind'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-datepicker',
      '    [defaultOpen]="false"',
      '    [defaultValue]="\'2024-04-18\'"',
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-10\'"',
      '    [maxDate]="\'2024-04-25\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Bounded shipping date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly fiscalBoundaryPlainCodeTabs = createCodeTabs(
    'fiscal-boundary-datepicker-plain-css',
    createWrapperTsCode('fiscal-boundary-datepicker-plain-css'),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="\'2026-03-31\'"',
      '  [today]="\'2026-03-31\'"',
      '  [minDate]="\'2025-04-01\'"',
      '  [maxDate]="\'2026-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Fiscal period date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly fiscalBoundaryTailwindCodeTabs = createCodeTabs(
    'fiscal-boundary-datepicker-tailwind',
    createWrapperTsCode('fiscal-boundary-datepicker-tailwind'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-datepicker',
      '    [defaultOpen]="false"',
      '    [defaultValue]="\'2026-03-31\'"',
      '    [today]="\'2026-03-31\'"',
      '    [minDate]="\'2025-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Fiscal period date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly popupPlainCodeTabs = createCodeTabs(
    'popup-width-datepicker-plain-css',
    createWrapperTsCode('popup-width-datepicker-plain-css'),
    [
      '<div class="datepicker-width-examples">',
      '  <section class="datepicker-width-case">',
      '    <h3>Minimum width</h3>',
      '    <div class="datepicker-width-control datepicker-width-control--min">',
      '      <tng-datepicker',
      '        [defaultValue]="\'2024-04-22\'"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Minimum-width date picker"',
      '      ></tng-datepicker>',
      '    </div>',
      '  </section>',
      '',
      '  <section class="datepicker-width-case">',
      '    <h3>Maximum width</h3>',
      '    <div class="datepicker-width-control datepicker-width-control--max">',
      '      <tng-datepicker',
      '        [defaultValue]="\'2024-04-22\'"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Maximum-width date picker"',
      '      ></tng-datepicker>',
      '    </div>',
      '  </section>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.datepicker-width-examples { display: grid; gap: 1.5rem; }',
      '.datepicker-width-case { display: grid; gap: 0.75rem; }',
      '.datepicker-width-case h3 { font-size: 0.875rem; margin: 0; }',
      '.datepicker-width-control--min { inline-size: min(100%, 14rem); }',
      '.datepicker-width-control--max { inline-size: min(100%, 28rem); }',
      '',
    ].join('\n'),
  );

  protected readonly popupTailwindCodeTabs = createCodeTabs(
    'popup-width-datepicker-tailwind',
    createWrapperTsCode('popup-width-datepicker-tailwind'),
    [
      '<div class="grid gap-6">',
      '  <section class="grid gap-3">',
      '    <h3 class="m-0 text-sm font-semibold">Minimum width</h3>',
      '    <div class="w-full max-w-[14rem]">',
      '      <tng-datepicker',
      '        [defaultValue]="\'2024-04-22\'"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Minimum-width date picker"',
      '      ></tng-datepicker>',
      '    </div>',
      '  </section>',
      '',
      '  <section class="grid gap-3">',
      '    <h3 class="m-0 text-sm font-semibold">Maximum width</h3>',
      '    <div class="w-full max-w-[28rem]">',
      '      <tng-datepicker',
      '        [defaultValue]="\'2024-04-22\'"',
      '        [fullWidth]="true"',
      '        [overlayMinSize]="288"',
      '        [overlaySize]="320"',
      '        ariaLabel="Maximum-width date picker"',
      '      ></tng-datepicker>',
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
