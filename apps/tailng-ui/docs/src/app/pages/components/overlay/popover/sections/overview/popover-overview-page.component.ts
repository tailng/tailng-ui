import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCodeBlockComponent,
  TngPopoverComponent,
  TngPopoverTriggerFor,
} from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type PopoverCloseReason = 'escape' | 'outside-pointer' | 'programmatic' | 'trigger-toggle';

@Component({
  selector: 'app-popover-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngPopoverComponent,
    TngPopoverTriggerFor,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './popover-overview-page.component.html',
  styleUrl: './popover-overview-page.component.css',
})
export class PopoverOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCloseReason = signal<PopoverCloseReason | 'none'>('none');
  protected readonly tailwindCloseReason = signal<PopoverCloseReason | 'none'>('none');

  protected readonly componentImportCode = [
    "import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-popover',
    '  #popover="tngPopoverComponent"',
    '  [open]="open()"',
    '  (openChange)="open.set($event)"',
    '  (closed)="onClosed($event)"',
    '>',
    '  <p>Wrapper popover body content.</p>',
    '</tng-popover>',
    '<button type="button" [tngPopoverTriggerFor]="popover">Project actions</button>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
        '',
        "type PopoverCloseReason = 'escape' | 'outside-pointer' | 'programmatic' | 'trigger-toggle';",
        '',
        '@Component({',
        "  selector: 'app-popover-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent, TngPopoverTriggerFor],',
        "  templateUrl: './popover-overview-plain-css.component.html',",
        "  styleUrl: './popover-overview-plain-css.component.css',",
        '})',
        'export class PopoverOverviewPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<PopoverCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: PopoverCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-overview-plain-css.component.html',
      code: [
        '<tng-popover',
        '  #popover="tngPopoverComponent"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  (closed)="onClosed($event)"',
        '>',
        '  <p class="popover-body-copy">Use the detached panel with TailNG trigger wiring and dismissal behavior.</p>',
        '  <div class="popover-preview-actions">',
        '    <button type="button" class="popover-action-ghost" (click)="popover.close()">Close</button>',
        '    <button type="button" class="popover-action-primary" (click)="popover.close()">Apply</button>',
        '  </div>',
        '</tng-popover>',
        '<button type="button" [tngPopoverTriggerFor]="popover">Project actions</button>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-overview-plain-css.component.css',
      code: [
        '.popover-action-ghost,',
        '.popover-action-primary {',
        '  border-radius: 0.7rem;',
        '  cursor: pointer;',
        '  font-size: 0.88rem;',
        '  font-weight: 600;',
        '  min-height: 2.1rem;',
        '  padding: 0.45rem 0.9rem;',
        '}',
        '',
        '.popover-action-ghost {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 80%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  color: var(--tng-semantic-foreground-primary);',
        '}',
        '',
        '.popover-action-primary {',
        '  background: var(--tng-semantic-accent-brand);',
        '  border: 1px solid var(--tng-semantic-accent-brand);',
        '  color: var(--tng-semantic-background-canvas);',
        '}',
        '',
        '.popover-preview-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.6rem;',
        '  justify-content: flex-end;',
        '}',
        '',
        '.popover-action-ghost:hover {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 64%, transparent);',
        '}',
        '',
        '.popover-action-primary:hover {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 88%, black);',
        '}',
        '',
        '.popover-action-ghost:focus-visible,',
        '.popover-action-primary:focus-visible {',
        '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-focus-ring) 78%, transparent);',
        '  outline: none;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'popover-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngPopoverComponent, TngPopoverTriggerFor } from '@tailng-ui/components';",
        '',
        "type PopoverCloseReason = 'escape' | 'outside-pointer' | 'programmatic' | 'trigger-toggle';",
        '',
        '@Component({',
        "  selector: 'app-popover-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngPopoverComponent, TngPopoverTriggerFor],',
        "  templateUrl: './popover-overview-tailwind.component.html',",
        "  styleUrl: './popover-overview-tailwind.component.css',",
        '})',
        'export class PopoverOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly lastReason = signal<PopoverCloseReason | 'none'>('none');",
        '',
        '  protected onClosed(reason: PopoverCloseReason): void {',
        '    this.lastReason.set(reason);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'popover-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-popover',
        '    #popover="tngPopoverComponent"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '    (closed)="onClosed($event)"',
        '  >',
        '    <p class="m-0 text-sm text-slate-700 dark:text-slate-300">Projected content styled with utilities.</p>',
        '    <div class="mt-3 flex flex-wrap justify-end gap-2">',
        '      <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 dark:border-slate-600 dark:text-slate-200 dark:focus-visible:ring-sky-500/65" (click)="popover.close()">Hold</button>',
        '      <button type="button" class="rounded-lg border border-sky-600 bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 dark:focus-visible:ring-sky-200/80" (click)="popover.close()">Apply</button>',
        '    </div>',
        '  </tng-popover>',
        '  <button type="button" [tngPopoverTriggerFor]="popover">Tailwind actions</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'popover-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainClose(reason: PopoverCloseReason): void {
    this.plainCloseReason.set(reason);
  }

  protected onTailwindClose(reason: PopoverCloseReason): void {
    this.tailwindCloseReason.set(reason);
  }
}
