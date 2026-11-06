import { DOCUMENT } from '@angular/common';
import { Component, inject, type OnDestroy, signal } from '@angular/core';
import { TngAvatarComponent } from '@tailng-ui/components';
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
  selector: 'app-avatar-examples-page',
  imports: [TngAvatarComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './avatar-examples-page.component.html',
  styleUrl: './avatar-examples-page.component.css',
})
export class AvatarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%231d4ed8'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='37' r='18' fill='%23cbd5e1'/><rect x='24' y='62' width='52' height='22' rx='11' fill='%23cbd5e1'/></svg>",
  )}`;

  protected readonly rosterPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-examples-team-roster-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-avatar-examples-team-roster-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-examples-team-roster-plain-css.component.html',",
        "  styleUrl: './avatar-examples-team-roster-plain-css.component.css',",
        '})',
        'export class AvatarExamplesTeamRosterPlainCssComponent {',
        "  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-examples-team-roster-plain-css.component.html',
      code: [
        '<div class="avatar-team-grid">',
        '  <div class="avatar-team-card">',
        '    <tng-avatar [src]="sampleImage" fallback="Alex" alt="Alex Morgan"></tng-avatar>',
        '    <div>',
        '      <strong>Alex Morgan</strong>',
        '      <p>Design systems</p>',
        '    </div>',
        '  </div>',
        '  <div class="avatar-team-card">',
        '    <tng-avatar [src]="null" fallback="TN" alt="Taylor Nguyen"></tng-avatar>',
        '    <div>',
        '      <strong>Taylor Nguyen</strong>',
        '      <p>Release engineering</p>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-examples-team-roster-plain-css.component.css',
      code: [
        '.avatar-team-grid {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
        '.avatar-team-card {',
        '  align-items: center;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  grid-template-columns: auto 1fr;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly rosterTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-examples-team-roster-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-avatar-examples-team-roster-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-examples-team-roster-tailwind.component.html',",
        "  styleUrl: './avatar-examples-team-roster-tailwind.component.css',",
        '})',
        'export class AvatarExamplesTeamRosterTailwindComponent {',
        "  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-examples-team-roster-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="grid grid-cols-[auto_1fr] items-center gap-3">',
        '    <tng-avatar [src]="sampleImage" fallback="Alex" alt="Alex Morgan" size="lg"></tng-avatar>',
        '    <div>',
        '      <p class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Alex Morgan</p>',
        '      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Design systems</p>',
        '    </div>',
        '  </div>',
        '  <div class="grid grid-cols-[auto_1fr] items-center gap-3">',
        '    <tng-avatar [src]="null" fallback="TN" alt="Taylor Nguyen"></tng-avatar>',
        '    <div>',
        '      <p class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Taylor Nguyen</p>',
        '      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Release engineering</p>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-examples-team-roster-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly presencePlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-examples-presence-strip-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-avatar-examples-presence-strip-plain-css',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-examples-presence-strip-plain-css.component.html',",
        "  styleUrl: './avatar-examples-presence-strip-plain-css.component.css',",
        '})',
        'export class AvatarExamplesPresenceStripPlainCssComponent {',
        "  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-examples-presence-strip-plain-css.component.html',
      code: [
        '<div class="avatar-presence-strip">',
        '  <div class="avatar-presence-item">',
        '    <tng-avatar [src]="sampleImage" fallback="PR" alt="Priya Raman"></tng-avatar>',
        '    <span class="avatar-presence-dot avatar-presence-dot--online"></span>',
        '  </div>',
        '  <div class="avatar-presence-item">',
        '    <tng-avatar [src]="null" fallback="DN" alt="Dev Narang" shape="square"></tng-avatar>',
        '    <span class="avatar-presence-dot avatar-presence-dot--busy"></span>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-examples-presence-strip-plain-css.component.css',
      code: [
        '.avatar-presence-strip {',
        '  display: flex;',
        '  gap: 0.75rem;',
        '}',
        '',
        '.avatar-presence-item {',
        '  position: relative;',
        '}',
        '',
        '.avatar-presence-dot {',
        '  border: 2px solid var(--tng-semantic-background-base);',
        '  border-radius: 9999px;',
        '  bottom: -0.12rem;',
        '  height: 0.85rem;',
        '  position: absolute;',
        '  right: -0.12rem;',
        '  width: 0.85rem;',
        '}',
        '',
        '.avatar-presence-dot--online {',
        '  background: var(--tng-semantic-accent-success);',
        '}',
        '',
        '.avatar-presence-dot--busy {',
        '  background: var(--tng-semantic-accent-warning);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly presenceTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'avatar-examples-presence-strip-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngAvatarComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-avatar-examples-presence-strip-tailwind',",
        '  standalone: true,',
        '  imports: [TngAvatarComponent],',
        "  templateUrl: './avatar-examples-presence-strip-tailwind.component.html',",
        "  styleUrl: './avatar-examples-presence-strip-tailwind.component.css',",
        '})',
        'export class AvatarExamplesPresenceStripTailwindComponent {',
        "  protected readonly sampleImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2360a5fa%22/%3E%3C/svg%3E';",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'avatar-examples-presence-strip-tailwind.component.html',
      code: [
        '<div class="flex gap-3 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="relative">',
        '    <tng-avatar [src]="sampleImage" fallback="PR" alt="Priya Raman"></tng-avatar>',
        '    <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--tng-semantic-background-base)] bg-[var(--tng-semantic-accent-success)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_70%,transparent)]"></span>',
        '  </div>',
        '  <div class="relative">',
        '    <tng-avatar [src]="null" fallback="DN" alt="Dev Narang" shape="square"></tng-avatar>',
        '    <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--tng-semantic-background-base)] bg-[var(--tng-semantic-accent-warning)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_70%,transparent)]"></span>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'avatar-examples-presence-strip-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
