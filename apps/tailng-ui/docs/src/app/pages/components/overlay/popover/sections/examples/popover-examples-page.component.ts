/* eslint-disable max-lines-per-function -- Code-tab builders keep complete copy-ready examples together. */
import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngMenuComponent,
  TngMenuTriggerFor,
  TngMultiSelectComponent,
  TngPopoverComponent,
  TngPopoverTriggerFor,
  TngSelectComponent,
} from '@tailng-ui/components';
import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type NestedOverlayOption = Readonly<{
  label: string;
  value: string;
}>;

type ExampleStyle = 'plain-css' | 'tailwind-css';

function createCodeTabs(
  exampleName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${exampleName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${exampleName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${exampleName}.component.css`,
      code: cssCode,
    },
  ]);
}

function createNestedSelectCodeTabs(style: ExampleStyle): readonly DocsExampleCodeTab[] {
  const exampleName = `popover-nested-select-${style}`;
  const tsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngPopoverComponent, TngPopoverTriggerFor, TngSelectComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    `  selector: 'app-${exampleName}',`,
    '  standalone: true,',
    '  imports: [TngPopoverComponent, TngPopoverTriggerFor, TngSelectComponent],',
    `  templateUrl: './${exampleName}.component.html',`,
    `  styleUrl: './${exampleName}.component.css',`,
    '})',
    `export class ${style === 'plain-css' ? 'PopoverNestedSelectPlainCssComponent' : 'PopoverNestedSelectTailwindComponent'} {`,
    "  protected readonly value = signal<string | null>('owner');",
    '  protected readonly options = [',
    "    { label: 'Owner', value: 'owner' },",
    "    { label: 'Maintainer', value: 'maintainer' },",
    "    { label: 'Viewer', value: 'viewer' },",
    '  ];',
    '}',
  ].join('\n');
  const plainHtml = [
    '<div class="popover-nested-demo">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="popover-nested-panel">',
    '      <p class="popover-nested-label">Role</p>',
    '      <tng-select',
    '        [options]="options"',
    '        [placeholder]="\'Choose role\'"',
    '        [value]="value()"',
    '        (valueChange)="value.set($event)"',
    '      />',
    '      <p class="popover-example-state">selected: {{ value() }}</p>',
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="popover-example-secondary" [tngPopoverTriggerFor]="popover">',
    '    Role filter',
    '  </button>',
    '</div>',
  ].join('\n');
  const tailwindHtml = [
    '<div class="grid min-h-32 place-items-start rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="grid min-w-60 gap-3">',
    '      <p class="m-0 text-xs font-bold text-slate-900 dark:text-slate-100">Role</p>',
    '      <tng-select',
    '        [options]="options"',
    '        [placeholder]="\'Choose role\'"',
    '        [value]="value()"',
    '        (valueChange)="value.set($event)"',
    '      />',
    '      <p class="m-0 text-sm text-slate-600 dark:text-slate-300">selected: {{ value() }}</p>',
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100" [tngPopoverTriggerFor]="popover">',
    '    Role filter',
    '  </button>',
    '</div>',
  ].join('\n');
  const plainCss = [
    '.popover-nested-demo {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '  min-height: 8rem;',
    '  padding: 0.9rem;',
    '}',
    '',
    '.popover-nested-panel {',
    '  display: grid;',
    '  gap: 0.7rem;',
    '  min-width: 15rem;',
    '}',
  ].join('\n');

  return createCodeTabs(
    exampleName,
    tsCode,
    style === 'plain-css' ? plainHtml : tailwindHtml,
    style === 'plain-css'
      ? plainCss
      : '/* Tailwind utilities are applied directly in the template. */',
  );
}

function createNestedMultiSelectCodeTabs(style: ExampleStyle): readonly DocsExampleCodeTab[] {
  const exampleName = `popover-nested-multiselect-${style}`;
  const tsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngMultiSelectComponent, TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
    '',
    '@Component({',
    `  selector: 'app-${exampleName}',`,
    '  standalone: true,',
    '  imports: [TngMultiSelectComponent, TngPopoverComponent, TngPopoverTriggerFor],',
    `  templateUrl: './${exampleName}.component.html',`,
    `  styleUrl: './${exampleName}.component.css',`,
    '})',
    `export class ${style === 'plain-css' ? 'PopoverNestedMultiSelectPlainCssComponent' : 'PopoverNestedMultiSelectTailwindComponent'} {`,
    "  protected readonly value = signal<readonly string[]>(['email']);",
    '  protected readonly options = [',
    "    { label: 'Email', value: 'email' },",
    "    { label: 'Slack', value: 'slack' },",
    "    { label: 'PagerDuty', value: 'pagerduty' },",
    '  ];',
    '}',
  ].join('\n');
  const plainHtml = [
    '<div class="popover-nested-demo">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="popover-nested-panel">',
    '      <p class="popover-nested-label">Channels</p>',
    '      <tng-multiselect',
    '        [options]="options"',
    '        [placeholder]="\'Choose channels\'"',
    '        [value]="value()"',
    '        (valueChange)="value.set($event)"',
    '      />',
    "      <p class=\"popover-example-state\">selected: {{ value().join(', ') || 'none' }}</p>",
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="popover-example-secondary" [tngPopoverTriggerFor]="popover">',
    '    Notify channels',
    '  </button>',
    '</div>',
  ].join('\n');
  const tailwindHtml = [
    '<div class="grid min-h-32 place-items-start rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="grid min-w-60 gap-3">',
    '      <p class="m-0 text-xs font-bold text-slate-900 dark:text-slate-100">Channels</p>',
    '      <tng-multiselect',
    '        [options]="options"',
    '        [placeholder]="\'Choose channels\'"',
    '        [value]="value()"',
    '        (valueChange)="value.set($event)"',
    '      />',
    "      <p class=\"m-0 text-sm text-slate-600 dark:text-slate-300\">selected: {{ value().join(', ') || 'none' }}</p>",
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100" [tngPopoverTriggerFor]="popover">',
    '    Notify channels',
    '  </button>',
    '</div>',
  ].join('\n');
  const plainCss = [
    '.popover-nested-demo {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '  min-height: 8rem;',
    '  padding: 0.9rem;',
    '}',
    '',
    '.popover-nested-panel {',
    '  display: grid;',
    '  gap: 0.7rem;',
    '  min-width: 15rem;',
    '}',
  ].join('\n');

  return createCodeTabs(
    exampleName,
    tsCode,
    style === 'plain-css' ? plainHtml : tailwindHtml,
    style === 'plain-css'
      ? plainCss
      : '/* Tailwind utilities are applied directly in the template. */',
  );
}

function createNestedMenuCodeTabs(style: ExampleStyle): readonly DocsExampleCodeTab[] {
  const exampleName = `popover-nested-menu-${style}`;
  const tsCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngMenuComponent, TngMenuTriggerFor, TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
    "import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    `  selector: 'app-${exampleName}',`,
    '  standalone: true,',
    '  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor, TngPopoverComponent, TngPopoverTriggerFor],',
    `  templateUrl: './${exampleName}.component.html',`,
    `  styleUrl: './${exampleName}.component.css',`,
    '})',
    `export class ${style === 'plain-css' ? 'PopoverNestedMenuPlainCssComponent' : 'PopoverNestedMenuTailwindComponent'} {`,
    "  protected readonly result = signal('No command selected');",
    '',
    '  protected onSelect(event: TngMenuSelectEvent): void {',
    "    this.result.set(typeof event.value === 'string' ? event.value : event.itemId);",
    '  }',
    '}',
  ].join('\n');
  const menuMarkup = [
    '      <tng-menu #menu="tngMenu" ariaLabel="Project actions" (tngMenuSelect)="onSelect($event)">',
    '        <button type="button" tngMenuItem [tngMenuItemValue]="\'Duplicate project\'">Duplicate project</button>',
    '        <button type="button" tngMenuItem [tngMenuItemValue]="\'Archive project\'">Archive project</button>',
    '      </tng-menu>',
  ];
  const plainHtml = [
    '<div class="popover-nested-demo">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="popover-nested-panel">',
    '      <p class="popover-nested-label">Project action</p>',
    '      <button type="button" class="popover-example-secondary" [tngMenuTriggerFor]="menu">',
    '        Open menu',
    '      </button>',
    ...menuMarkup,
    '      <p class="popover-example-state">command: {{ result() }}</p>',
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="popover-example-secondary" [tngPopoverTriggerFor]="popover">',
    '    Menu actions',
    '  </button>',
    '</div>',
  ].join('\n');
  const tailwindHtml = [
    '<div class="grid min-h-32 place-items-start rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
    '  <tng-popover #popover="tngPopoverComponent" [autoFocus]="true">',
    '    <div class="grid min-w-60 gap-3">',
    '      <p class="m-0 text-xs font-bold text-slate-900 dark:text-slate-100">Project action</p>',
    '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100" [tngMenuTriggerFor]="menu">',
    '        Open menu',
    '      </button>',
    ...menuMarkup,
    '      <p class="m-0 text-sm text-slate-600 dark:text-slate-300">command: {{ result() }}</p>',
    '    </div>',
    '  </tng-popover>',
    '  <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100" [tngPopoverTriggerFor]="popover">',
    '    Menu actions',
    '  </button>',
    '</div>',
  ].join('\n');
  const plainCss = [
    '.popover-nested-demo {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '  min-height: 8rem;',
    '  padding: 0.9rem;',
    '}',
    '',
    '.popover-nested-panel {',
    '  display: grid;',
    '  gap: 0.7rem;',
    '  min-width: 15rem;',
    '}',
  ].join('\n');

  return createCodeTabs(
    exampleName,
    tsCode,
    style === 'plain-css' ? plainHtml : tailwindHtml,
    style === 'plain-css'
      ? plainCss
      : '/* Tailwind utilities are applied directly in the template. */',
  );
}

@Component({
  selector: 'app-popover-examples-page',
  imports: [
    TngPopoverComponent,
    TngPopoverTriggerFor,
    TngSelectComponent,
    TngMultiSelectComponent,
    TngMenuComponent,
    TngMenuTriggerFor,
    TngMenuItem,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-examples-page.component.html',
  styleUrl: './popover-examples-page.component.css',
})
export class PopoverExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly plainResult = signal('No decision yet');
  protected readonly tailwindResult = signal('No decision yet');
  protected readonly nestedSelectPlainValue = signal<string | null>('owner');
  protected readonly nestedSelectTailwindValue = signal<string | null>('owner');
  protected readonly nestedMultiSelectPlainValue = signal<readonly string[]>(['email']);
  protected readonly nestedMultiSelectTailwindValue = signal<readonly string[]>(['email']);
  protected readonly nestedMenuPlainResult = signal('No command selected');
  protected readonly nestedMenuTailwindResult = signal('No command selected');

  protected readonly nestedRoleOptions: readonly NestedOverlayOption[] = [
    { label: 'Owner', value: 'owner' },
    { label: 'Maintainer', value: 'maintainer' },
    { label: 'Viewer', value: 'viewer' },
  ];
  protected readonly nestedChannelOptions: readonly NestedOverlayOption[] = [
    { label: 'Email', value: 'email' },
    { label: 'Slack', value: 'slack' },
    { label: 'PagerDuty', value: 'pagerduty' },
  ];

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-popover-examples-plain-css',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent, TngPopoverTriggerFor],',
        "  templateUrl: './popover-examples-plain-css.component.html',",
        "  styleUrl: './popover-examples-plain-css.component.css',",
        '})',
        'export class PopoverExamplesPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Canceled');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deleted release branch');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-plain-css.component.html',
      code: [
        '<tng-popover',
        '  #popover="tngPopoverComponent"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '>',
        '  <p class="popover-example-copy">This action removes branch automation and cannot be undone.</p>',
        '  <div class="popover-action-row">',
        '    <button type="button" class="popover-example-secondary" (click)="onCancel()">Cancel</button>',
        '    <button type="button" class="popover-example-danger" (click)="onApprove()">Delete</button>',
        '  </div>',
        '</tng-popover>',
        '<button type="button" [tngPopoverTriggerFor]="popover">Delete release branch</button>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-examples-plain-css.component.css',
      code: [
        '.popover-action-row {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  justify-content: flex-end;',
        '}',
        '',
        '.popover-example-danger {',
        '  background: #dc2626;',
        '  color: #fff;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-popover-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent, TngPopoverTriggerFor],',
        "  templateUrl: './popover-examples-tailwind.component.html',",
        "  styleUrl: './popover-examples-tailwind.component.css',",
        '})',
        'export class PopoverExamplesTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly result = signal('No decision yet');",
        '',
        '  protected onCancel(): void {',
        "    this.result.set('Deployment on hold');",
        '    this.open.set(false);',
        '  }',
        '',
        '  protected onApprove(): void {',
        "    this.result.set('Deployment approved');",
        '    this.open.set(false);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-popover',
        '    #popover="tngPopoverComponent"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Rollout will start in us-east and eu-west.</p>',
        '    <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200" (click)="onCancel()">Hold</button>',
        '      <button type="button" class="rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" (click)="onApprove()">Approve</button>',
        '    </div>',
        '  </tng-popover>',
        '  <button type="button" [tngPopoverTriggerFor]="popover">Approve deployment</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly nestedSelectPlainCodeTabs = createNestedSelectCodeTabs('plain-css');
  protected readonly nestedSelectTailwindCodeTabs = createNestedSelectCodeTabs('tailwind-css');
  protected readonly nestedMultiSelectPlainCodeTabs = createNestedMultiSelectCodeTabs('plain-css');
  protected readonly nestedMultiSelectTailwindCodeTabs =
    createNestedMultiSelectCodeTabs('tailwind-css');
  protected readonly nestedMenuPlainCodeTabs = createNestedMenuCodeTabs('plain-css');
  protected readonly nestedMenuTailwindCodeTabs = createNestedMenuCodeTabs('tailwind-css');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCancel(): void {
    this.plainResult.set('Canceled');
    this.plainOpen.set(false);
  }

  protected onPlainApprove(): void {
    this.plainResult.set('Deleted release branch');
    this.plainOpen.set(false);
  }

  protected onTailwindCancel(): void {
    this.tailwindResult.set('Deployment on hold');
    this.tailwindOpen.set(false);
  }

  protected onTailwindApprove(): void {
    this.tailwindResult.set('Deployment approved');
    this.tailwindOpen.set(false);
  }

  protected onNestedMenuPlainSelect(event: TngMenuSelectEvent): void {
    this.nestedMenuPlainResult.set(typeof event.value === 'string' ? event.value : event.itemId);
  }

  protected onNestedMenuTailwindSelect(event: TngMenuSelectEvent): void {
    this.nestedMenuTailwindResult.set(typeof event.value === 'string' ? event.value : event.itemId);
  }
}
