import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';
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
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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

const PLAIN_CSS = String.raw`.code-editor-example-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
}

.code-editor-example-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 0.875rem;
  background: var(--tng-semantic-background-surface);
}

.code-editor-example-card label,
.code-editor-example-card > span {
  color: var(--tng-semantic-foreground-primary);
  font-weight: 650;
}`;

const TAILWIND_CSS =
  '/* No component CSS is required; Tailwind utilities style the example layout. */';
const PLAIN_GRID_CLASS = 'code-editor-example-grid';
const PLAIN_CARD_CLASS = 'code-editor-example-card';
const PLAIN_LABEL_CLASS = '';
const TAILWIND_GRID_CLASS = 'grid gap-4 lg:grid-cols-2';
const TAILWIND_CARD_CLASS =
  'grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4';
const TAILWIND_LABEL_CLASS =
  ' class="font-semibold text-[var(--tng-semantic-foreground-primary)]"';

function languageHtml(gridClass: string, cardClass: string, labelClass: string): string {
  return `<div class="${gridClass}">
  <div class="${cardClass}">
    <label for="json-source"${labelClass}>JSON settings</label>
    <tng-code-editor
      id="json-source"
      language="json"
      adapter="shiki"
      [theme]="codeTheme()"
      [sanitizeHtml]="false"
      [rows]="6"
      [value]="jsonSource()"
      (valueChange)="jsonSource.set($event)"
    />
  </div>

  <div class="${cardClass}">
    <label for="shell-source"${labelClass}>Shell commands</label>
    <tng-code-editor
      id="shell-source"
      language="shell"
      adapter="shiki"
      [theme]="codeTheme()"
      [sanitizeHtml]="false"
      [rows]="6"
      [value]="shellSource()"
      (valueChange)="shellSource.set($event)"
    />
  </div>
</div>`;
}

function formStatesHtml(gridClass: string, cardClass: string, labelClass: string): string {
  return `<div class="${gridClass}">
  <div class="${cardClass}">
    <span${labelClass}>Readonly and selectable</span>
    <tng-code-editor
      ariaLabel="Readonly source"
      language="json"
      adapter="shiki"
      [theme]="codeTheme()"
      [sanitizeHtml]="false"
      [rows]="4"
      [readonly]="true"
      [value]="jsonSource()"
    />
  </div>

  <div class="${cardClass}">
    <span${labelClass}>Disabled</span>
    <tng-code-editor
      ariaLabel="Disabled source"
      language="shell"
      adapter="shiki"
      [theme]="codeTheme()"
      [sanitizeHtml]="false"
      [rows]="4"
      [disabled]="true"
      [value]="shellSource()"
    />
  </div>
</div>`;
}

function fallbackHtml(cardClass: string, labelClass: string, copyClass: string): string {
  return `<div class="${cardClass}">
  <label for="plain-source"${labelClass}>Plain source</label>
  <p${copyClass}>Highlighting is disabled, so no language adapter is loaded.</p>
  <tng-code-editor
    id="plain-source"
    [highlight]="false"
    [rows]="4"
    [value]="plainSource()"
    (valueChange)="plainSource.set($event)"
  />
</div>`;
}

const LANGUAGE_TS = String.raw`import { Component, signal } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-code-editor-language-example',
  standalone: true,
  imports: [TngCodeEditorComponent],
  templateUrl: './code-editor-language-example.component.html',
  styleUrl: './code-editor-language-example.component.css',
})
export class CodeEditorLanguageExampleComponent {
  readonly jsonSource = signal('{\n  "retries": 3,\n  "mode": "safe"\n}');
  readonly shellSource = signal('pnpm run test:components\npnpm run build:docs');
  readonly codeTheme = signal<'github-dark' | 'github-light'>('github-light');
}`;

const FORM_STATES_TS = String.raw`import { Component, signal } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-code-editor-form-states-example',
  standalone: true,
  imports: [TngCodeEditorComponent],
  templateUrl: './code-editor-form-states-example.component.html',
  styleUrl: './code-editor-form-states-example.component.css',
})
export class CodeEditorFormStatesExampleComponent {
  readonly jsonSource = signal('{ "mode": "readonly" }');
  readonly shellSource = signal('echo "Disabled command"');
  readonly codeTheme = signal<'github-dark' | 'github-light'>('github-light');
}`;

const FALLBACK_TS = String.raw`import { Component, signal } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-code-editor-fallback-example',
  standalone: true,
  imports: [TngCodeEditorComponent],
  templateUrl: './code-editor-fallback-example.component.html',
  styleUrl: './code-editor-fallback-example.component.css',
})
export class CodeEditorFallbackExampleComponent {
  readonly plainSource = signal('<unsafe> remains visible as text');
}`;

@Component({
  selector: 'app-code-editor-examples-page',
  imports: [
    TngCodeEditorComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './code-editor-examples-page.component.html',
  styleUrl: './code-editor-examples-page.component.css',
})
export class CodeEditorExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly codeTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeTheme,
  );

  protected readonly jsonSource = signal(
    ['{', '  "retries": 3,', '  "mode": "safe"', '}'].join('\n'),
  );
  protected readonly shellSource = signal('pnpm run test:components\npnpm run build:docs');
  protected readonly plainSource = signal('<unsafe> remains visible as text');

  protected readonly languagePlainCodeTabs = createCodeTabs(
    'code-editor-language-example',
    LANGUAGE_TS,
    languageHtml(PLAIN_GRID_CLASS, PLAIN_CARD_CLASS, PLAIN_LABEL_CLASS),
    PLAIN_CSS,
  );
  protected readonly languageTailwindCodeTabs = createCodeTabs(
    'code-editor-language-example',
    LANGUAGE_TS,
    languageHtml(TAILWIND_GRID_CLASS, TAILWIND_CARD_CLASS, TAILWIND_LABEL_CLASS),
    TAILWIND_CSS,
  );
  protected readonly statesPlainCodeTabs = createCodeTabs(
    'code-editor-form-states-example',
    FORM_STATES_TS,
    formStatesHtml(PLAIN_GRID_CLASS, PLAIN_CARD_CLASS, PLAIN_LABEL_CLASS),
    PLAIN_CSS,
  );
  protected readonly statesTailwindCodeTabs = createCodeTabs(
    'code-editor-form-states-example',
    FORM_STATES_TS,
    formStatesHtml(TAILWIND_GRID_CLASS, TAILWIND_CARD_CLASS, TAILWIND_LABEL_CLASS),
    TAILWIND_CSS,
  );
  protected readonly fallbackPlainCodeTabs = createCodeTabs(
    'code-editor-fallback-example',
    FALLBACK_TS,
    fallbackHtml(PLAIN_CARD_CLASS, PLAIN_LABEL_CLASS, ''),
    PLAIN_CSS,
  );
  protected readonly fallbackTailwindCodeTabs = createCodeTabs(
    'code-editor-fallback-example',
    FALLBACK_TS,
    fallbackHtml(
      TAILWIND_CARD_CLASS,
      TAILWIND_LABEL_CLASS,
      ' class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]"',
    ),
    TAILWIND_CSS,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
