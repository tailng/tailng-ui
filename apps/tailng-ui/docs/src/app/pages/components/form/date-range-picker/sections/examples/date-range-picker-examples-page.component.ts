import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngDateRangePickerComponent } from '@tailng-ui/components';
import { defaultDateRangePickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
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
      const month = defaultDateRangePickerDateAdapter
        .format(date, 'month-short', locale)
        .toUpperCase();
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

function createFormTsCode(componentClassName: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngDateRangePickerComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    '  imports: [TngDateRangePickerComponent],',
    `  templateUrl: './${componentClassName}.component.html',`,
    `  styleUrl: './${componentClassName}.component.css',`,
    '})',
    `export class ${toPascalCase(componentClassName)}Component {`,
    '  protected save(event: SubmitEvent): void {',
    '    event.preventDefault();',
    '  }',
    '}',
    '',
  ].join('\n');
}

function resolveCodeTab(tabs: readonly DocsExampleCodeTab[], value: 'css' | 'html'): string {
  return tabs.find((tab) => tab.value === value)?.code ?? '';
}

function withDualCalendarLayout(markup: string): string {
  const dualRangeMarkup = markup.replace(/end: '2024-04-26'/g, "end: '2024-05-03'");

  if (dualRangeMarkup.includes('calendarLayout="single"')) {
    return dualRangeMarkup.replace(/calendarLayout="single"/g, 'calendarLayout="dual"');
  }

  return dualRangeMarkup.replace(
    /^(\s*)<tng-date-range-picker$/gm,
    '$1<tng-date-range-picker\n$1  calendarLayout="dual"',
  );
}

function createDualCodeTabs(
  baseName: string,
  sourceTabs: readonly DocsExampleCodeTab[],
  options: Readonly<{
    cssCode?: string;
    htmlTransform?: (markup: string) => string;
    includeAdapter?: boolean;
    useFormComponent?: boolean;
  }> = {},
): readonly DocsExampleCodeTab[] {
  const sourceHtml = withDualCalendarLayout(resolveCodeTab(sourceTabs, 'html'));
  const htmlCode = options.htmlTransform?.(sourceHtml) ?? sourceHtml;
  const tsCode = options.useFormComponent
    ? createFormTsCode(baseName)
    : createWrapperTsCode(baseName, options.includeAdapter);

  return createCodeTabs(
    baseName,
    tsCode,
    htmlCode,
    options.cssCode ?? resolveCodeTab(sourceTabs, 'css'),
  );
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

  protected readonly formPlainCodeTabs = createCodeTabs(
    'form-date-range-picker-plain-css',
    createFormTsCode('form-date-range-picker-plain-css'),
    [
      '<form class="invoice-period-form" (submit)="save($event)">',
      '  <header>',
      '    <span>Invoice settings</span>',
      '    <h3>Choose an invoice period</h3>',
      '    <p>The selected range is submitted as one form value.</p>',
      '  </header>',
      '',
      '  <label for="invoice-period-input">Invoice period</label>',
      '  <tng-date-range-picker',
      '    id="invoice-period"',
      "    [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    ariaLabel="Invoice period"',
      '  ></tng-date-range-picker>',
      '',
      '  <button type="submit">Save range</button>',
      '</form>',
      '',
    ].join('\n'),
    [
      '.invoice-period-form {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 36rem);',
      '  padding: 1.25rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '}',
      '.invoice-period-form header { display: grid; gap: 0.35rem; }',
      '.invoice-period-form h3, .invoice-period-form p { margin: 0; }',
      '.invoice-period-form label { font-size: 0.875rem; font-weight: 600; }',
      '.invoice-period-form button { justify-self: end; padding: 0.625rem 1rem; }',
      '',
    ].join('\n'),
  );

  protected readonly formTailwindCodeTabs = createCodeTabs(
    'form-date-range-picker-tailwind',
    createFormTsCode('form-date-range-picker-tailwind'),
    [
      '<form',
      '  class="grid w-full max-w-[36rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm"',
      '  (submit)="save($event)"',
      '>',
      '  <header class="grid gap-1">',
      '    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Invoice settings</span>',
      '    <h3 class="m-0 text-lg font-semibold">Choose an invoice period</h3>',
      '    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">The selected range is submitted as one form value.</p>',
      '  </header>',
      '',
      '  <label class="text-sm font-semibold" for="invoice-period-input">Invoice period</label>',
      '  <tng-date-range-picker',
      '    id="invoice-period"',
      "    [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    ariaLabel="Invoice period"',
      '  ></tng-date-range-picker>',
      '',
      '  <button class="justify-self-end rounded-md bg-[var(--tng-semantic-accent-brand)] px-4 py-2 text-sm font-semibold text-white" type="submit">Save range</button>',
      '</form>',
      '',
    ].join('\n'),
    '/* Tailwind handles the form layout while TailNG owns picker behavior and theme tokens. */\n',
  );

  protected readonly dualFormPlainCodeTabs = createDualCodeTabs(
    'form-dual-date-range-picker-plain-css',
    this.formPlainCodeTabs,
    {
      cssCode: resolveCodeTab(this.formPlainCodeTabs, 'css').replace('36rem', '50rem'),
      useFormComponent: true,
    },
  );

  protected readonly dualFormTailwindCodeTabs = createDualCodeTabs(
    'form-dual-date-range-picker-tailwind',
    this.formTailwindCodeTabs,
    {
      htmlTransform: (markup) => markup.replace('max-w-[36rem]', 'max-w-[50rem]'),
      useFormComponent: true,
    },
  );

  protected readonly defaultPlainCodeTabs = createCodeTabs(
    'default-date-range-picker-plain-css',
    createWrapperTsCode('default-date-range-picker-plain-css'),
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
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly dualDefaultPlainCodeTabs = createDualCodeTabs(
    'default-dual-date-range-picker-plain-css',
    this.defaultPlainCodeTabs,
    { cssCode: '.date-range-picker-example { inline-size: min(100%, 41rem); }\n' },
  );

  protected readonly dualDefaultTailwindCodeTabs = createDualCodeTabs(
    'default-dual-date-range-picker-tailwind',
    this.defaultTailwindCodeTabs,
    { htmlTransform: (markup) => markup.replace('max-w-[18.5rem]', 'max-w-[41rem]') },
  );

  protected readonly customPlainCodeTabs = createCodeTabs(
    'custom-format-date-range-picker-plain-css',
    createWrapperTsCode('custom-format-date-range-picker-plain-css', true),
    [
      '<tng-date-range-picker',
      '  [defaultOpen]="false"',
      '  [adapter]="reportingAdapter"',
      "  [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
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
      "    [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '    [today]="\'2024-04-18\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Reporting period"',
      '  ></tng-date-range-picker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly dualCustomPlainCodeTabs = createDualCodeTabs(
    'custom-format-dual-date-range-picker-plain-css',
    this.customPlainCodeTabs,
    {
      cssCode: '.date-range-picker-example { inline-size: min(100%, 41rem); }\n',
      includeAdapter: true,
    },
  );

  protected readonly dualCustomTailwindCodeTabs = createDualCodeTabs(
    'custom-format-dual-date-range-picker-tailwind',
    this.customTailwindCodeTabs,
    {
      htmlTransform: (markup) => markup.replace('max-w-[18.5rem]', 'max-w-[41rem]'),
      includeAdapter: true,
    },
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

  protected readonly dualBoundedPlainCodeTabs = createDualCodeTabs(
    'bounded-dual-date-range-picker-plain-css',
    this.boundedPlainCodeTabs,
    { cssCode: '.date-range-picker-example { inline-size: min(100%, 41rem); }\n' },
  );

  protected readonly dualBoundedTailwindCodeTabs = createDualCodeTabs(
    'bounded-dual-date-range-picker-tailwind',
    this.boundedTailwindCodeTabs,
    { htmlTransform: (markup) => markup.replace('max-w-[18.5rem]', 'max-w-[41rem]') },
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
      "        [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '        [fullWidth]="true"',
      '        calendarLayout="single"',
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
      "        [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '        [fullWidth]="true"',
      '        calendarLayout="single"',
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
      "        [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '        [fullWidth]="true"',
      '        calendarLayout="single"',
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
      "        [defaultValue]=\"{ start: '2024-04-22', end: '2024-04-26' }\"",
      '        [fullWidth]="true"',
      '        calendarLayout="single"',
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

  protected readonly dualPopupPlainCodeTabs = createDualCodeTabs(
    'popup-width-dual-date-range-picker-plain-css',
    this.popupPlainCodeTabs,
    {
      cssCode: [
        '.date-range-picker-width-examples { display: grid; gap: 1.5rem; }',
        '.date-range-picker-width-case { display: grid; gap: 0.75rem; }',
        '.date-range-picker-width-case h3 { font-size: 0.875rem; margin: 0; }',
        '.date-range-picker-width-control--min { inline-size: min(100%, 24rem); }',
        '.date-range-picker-width-control--max { inline-size: min(100%, 48rem); }',
        '',
      ].join('\n'),
      htmlTransform: (markup) =>
        markup
          .replace(/\[overlayMinSize\]="288"/g, '[overlayMinSize]="592"')
          .replace(/\[overlaySize\]="320"/g, '[overlaySize]="656"'),
    },
  );

  protected readonly dualPopupTailwindCodeTabs = createDualCodeTabs(
    'popup-width-dual-date-range-picker-tailwind',
    this.popupTailwindCodeTabs,
    {
      htmlTransform: (markup) =>
        markup
          .replace('max-w-[14rem]', 'max-w-[24rem]')
          .replace('max-w-[28rem]', 'max-w-[48rem]')
          .replace(/\[overlayMinSize\]="288"/g, '[overlayMinSize]="592"')
          .replace(/\[overlaySize\]="320"/g, '[overlaySize]="656"'),
    },
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
