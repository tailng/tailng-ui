import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-button-examples-page',
  imports: [
    TngButtonComponent,
    TngIcon,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-examples-page.component.html',
  styleUrl: './button-examples-page.component.css',
})
export class ButtonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly actionCount = signal<Record<'plain' | 'tailwind', number>>({
    plain: 0,
    tailwind: 0,
  });
  protected readonly menuOpen = signal<Record<'plain' | 'tailwind', boolean>>({
    plain: false,
    tailwind: false,
  });

  protected readonly actionPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-action-row-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-button-examples-action-row-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent],',
        "  templateUrl: './button-examples-action-row-plain-css.component.html',",
        "  styleUrl: './button-examples-action-row-plain-css.component.css',",
        '})',
        'export class ButtonExamplesActionRowPlainCssComponent {',
        '  protected readonly count = signal(0);',
        '  protected increment(): void { this.count.update((value) => value + 1); }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-action-row-plain-css.component.html',
      code: [
        '<div class="button-example-row button-example-row--plain">',
        '  <tng-button tone="primary" appearance="solid" type="button" (click)="increment()">',
        '    Save draft',
        '  </tng-button>',
        '  <tng-button tone="neutral" appearance="outline" type="button">Cancel</tng-button>',
        '  <tng-button tone="danger" appearance="ghost" type="button" [disabled]="true">Delete</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-action-row-plain-css.component.css',
      code: [
        '.button-example-row--plain {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly actionTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-action-row-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        '@Component({',
        "  selector: 'app-button-examples-action-row-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngIcon],',
        "  templateUrl: './button-examples-action-row-tailwind.component.html',",
        "  styleUrl: './button-examples-action-row-tailwind.component.css',",
        '})',
        'export class ButtonExamplesActionRowTailwindComponent {',
        '  protected readonly count = signal(0);',
        '  protected increment(): void { this.count.update((value) => value + 1); }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-action-row-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <tng-button tone="success" appearance="solid" type="button" (click)="increment()">',
        '      <tng-icon icon="check" class="h-4 w-4"></tng-icon>',
        '      Publish',
        '    </tng-button>',
        '    <tng-button tone="neutral" appearance="outline" type="button">Preview</tng-button>',
        '  </div>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-action-row-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly menuPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-menu-trigger-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-button-examples-menu-trigger-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent],',
        "  templateUrl: './button-examples-menu-trigger-plain-css.component.html',",
        "  styleUrl: './button-examples-menu-trigger-plain-css.component.css',",
        '})',
        'export class ButtonExamplesMenuTriggerPlainCssComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-menu-trigger-plain-css.component.html',
      code: [
        '<tng-button',
        '  tone="neutral"',
        '  appearance="outline"',
        '  type="button"',
        '  [ariaHasPopup]="\'menu\'"',
        '  [ariaExpanded]="open()"',
        '  [ariaControls]="\'plain-button-menu\'"',
        '  (click)="open.set(!open())"',
        '>',
        '  Actions',
        '</tng-button>',
        '<div id="plain-button-menu" class="button-menu-surface" [hidden]="!open()">Menu content</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-menu-trigger-plain-css.component.css',
      code: [
        '.button-menu-surface {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  margin-top: 0.6rem;',
        '  padding: 0.6rem 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly menuTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-menu-trigger-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-button-examples-menu-trigger-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent],',
        "  templateUrl: './button-examples-menu-trigger-tailwind.component.html',",
        "  styleUrl: './button-examples-menu-trigger-tailwind.component.css',",
        '})',
        'export class ButtonExamplesMenuTriggerTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-menu-trigger-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-button',
        '    tone="neutral"',
        '    appearance="ghost"',
        '    type="button"',
        '    [ariaHasPopup]="\'menu\'"',
        '    [ariaExpanded]="open()"',
        '    [ariaControls]="\'tailwind-button-menu\'"',
        '    (click)="open.set(!open())"',
        '  >',
        '    Open menu',
        '  </tng-button>',
        '  <div',
        '    id="tailwind-button-menu"',
        '    class="mt-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-3 text-sm text-[var(--tng-semantic-foreground-primary)]"',
        '    [hidden]="!open()"',
        '  >',
        '    Menu content',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-menu-trigger-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly layoutTokenTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-examples-layout-tokens.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-button-examples-layout-tokens',",
        '  standalone: true,',
        '  imports: [TngButtonComponent],',
        "  templateUrl: './button-examples-layout-tokens.component.html',",
        "  styleUrl: './button-examples-layout-tokens.component.css',",
        '})',
        'export class ButtonExamplesLayoutTokensComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-examples-layout-tokens.component.html',
      code: [
        '<div class="button-layout-token-example">',
        '  <tng-button',
        '    class="button-layout-token-example__trigger"',
        '    tone="neutral"',
        '    appearance="outline"',
        '    size="sm"',
        '    type="button"',
        '  >',
        '    <span>Search</span>',
        '    <span class="button-layout-token-example__hint">Ctrl K</span>',
        '  </tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-examples-layout-tokens.component.css',
      code: [
        '.button-layout-token-example {',
        '  width: min(100%, 16rem);',
        '}',
        '',
        '.button-layout-token-example__trigger {',
        '  --tng-button-justify: space-between;',
        '  --tng-button-min-width: 12rem;',
        '  --tng-button-width: 100%;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'plain' | 'tailwind'): void {
    this.actionCount.update((current) => ({
      ...current,
      [scope]: current[scope] + 1,
    }));
  }

  protected count(scope: 'plain' | 'tailwind'): number {
    return this.actionCount()[scope];
  }

  protected toggleMenu(scope: 'plain' | 'tailwind'): void {
    this.menuOpen.update((current) => ({
      ...current,
      [scope]: !current[scope],
    }));
  }

  protected isMenuOpen(scope: 'plain' | 'tailwind'): boolean {
    return this.menuOpen()[scope];
  }
}
