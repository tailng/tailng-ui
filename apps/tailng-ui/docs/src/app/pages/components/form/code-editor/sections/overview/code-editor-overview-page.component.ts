import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngCodeEditorComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

const codeTabOrder: Readonly<Record<string, number>> = {
  ts: 0,
  html: 1,
  css: 2,
};

function orderCodeTabs(tabs: readonly DocsExampleCodeTab[]): readonly DocsExampleCodeTab[] {
  return Object.freeze(
    [...tabs].sort(
      (left, right) => (codeTabOrder[left.value] ?? 99) - (codeTabOrder[right.value] ?? 99),
    ),
  );
}

@Component({
  selector: 'app-code-editor-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCodeEditorComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './code-editor-overview-page.component.html',
  styleUrl: './code-editor-overview-page.component.css',
})
export class CodeEditorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeTheme,
  );

  protected readonly plainCssSource = signal(
    [
      'def greet(name: str) -> str:',
      '    return f"Hello, {name}!"',
      '',
      'print(greet("TailNG"))',
    ].join('\n'),
  );
  protected readonly tailwindSource = signal(
    [
      'type User = { name: string };',
      '',
      'export function greet(user: User): string {',
      '  return `Hello, ${user.name}!`;',
      '}',
    ].join('\n'),
  );
  protected readonly importCode = "import { TngCodeEditorComponent } from '@tailng-ui/components';";
  protected readonly providerCode = [
    'provideTngCodeHighlighting({',
    '  adapters: [shikiCodeHighlighterAdapter],',
    "  defaultAdapter: 'shiki',",
    '});',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = orderCodeTabs([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'code-editor-plain-example.component.html',
      code: [
        '<section class="code-editor-example">',
        '  <div class="code-editor-example__heading">',
        '    <label for="python-source">Python source</label>',
        '    <span>{{ source().length }} characters</span>',
        '  </div>',
        '',
        '  <tng-code-editor',
        '    id="python-source"',
        '    language="python"',
        '    adapter="shiki"',
        '    ariaLabel="Python source"',
        '    [theme]="codeTheme()"',
        '    [sanitizeHtml]="false"',
        '    [rows]="9"',
        '    [value]="source()"',
        '    (valueChange)="source.set($event)"',
        '  />',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'code-editor-plain-example.component.css',
      code: [
        '.code-editor-example {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 1rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.875rem;',
        '  background: var(--tng-semantic-background-surface);',
        '}',
        '',
        '.code-editor-example__heading {',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: space-between;',
        '  gap: 1rem;',
        '}',
        '',
        '.code-editor-example__heading label {',
        '  color: var(--tng-semantic-foreground-primary);',
        '  font-weight: 650;',
        '}',
        '',
        '.code-editor-example__heading span {',
        '  color: var(--tng-semantic-foreground-muted);',
        '  font-size: 0.75rem;',
        '}',
      ].join('\n'),
    },
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'code-editor-plain-example.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCodeEditorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-code-editor-plain-example',",
        '  imports: [TngCodeEditorComponent],',
        "  templateUrl: './code-editor-plain-example.component.html',",
        "  styleUrl: './code-editor-plain-example.component.css',",
        '})',
        'export class CodeEditorPlainExampleComponent {',
        '  protected readonly source = signal(',
        "    'def greet(name: str) -> str:\\n    return f\"Hello, {name}!\"',",
        '  );',
        '',
        "  protected readonly codeTheme = signal<'github-dark' | 'github-light'>('github-light');",
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = orderCodeTabs([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'code-editor-tailwind-example.component.html',
      code: [
        '<section class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4">',
        '  <div class="flex items-center justify-between gap-4">',
        '    <label for="typescript-source" class="font-semibold text-[var(--tng-semantic-foreground-primary)]">',
        '      TypeScript source',
        '    </label>',
        '    <span class="text-xs text-[var(--tng-semantic-foreground-muted)]">',
        '      {{ source().length }} characters',
        '    </span>',
        '  </div>',
        '',
        '  <tng-code-editor',
        '    id="typescript-source"',
        '    language="ts"',
        '    adapter="shiki"',
        '    ariaLabel="TypeScript source"',
        '    [theme]="codeTheme()"',
        '    [sanitizeHtml]="false"',
        '    [rows]="9"',
        '    [value]="source()"',
        '    (valueChange)="source.set($event)"',
        '  />',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'code-editor-tailwind-example.component.css',
      code: '/* No component CSS is required; Tailwind utilities style the example shell. */',
    },
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'code-editor-tailwind-example.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCodeEditorComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-code-editor-tailwind-example',",
        '  imports: [TngCodeEditorComponent],',
        "  templateUrl: './code-editor-tailwind-example.component.html',",
        "  styleUrl: './code-editor-tailwind-example.component.css',",
        '})',
        'export class CodeEditorTailwindExampleComponent {',
        '  protected readonly source = signal(',
        "    'export function greet(name: string): string {\\n  return `Hello, ${name}!`;\\n}',",
        '  );',
        '',
        "  protected readonly codeTheme = signal<'github-dark' | 'github-light'>('github-light');",
        '}',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
