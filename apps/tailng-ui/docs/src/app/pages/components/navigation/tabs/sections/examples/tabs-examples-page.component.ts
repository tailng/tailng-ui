import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTabs as TngTabsRoot } from '@tailng-ui/components';
import {
  TngTab,
  TngTabList,
  TngTabPanel,
  TngTabsScrollButtonNext,
  TngTabsScrollButtonPrev,
  type TngTabsValue,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type DemoVariant = 'plain' | 'tailwind';
type ControlledTabValue = 'overview' | 'activity' | 'settings';

function isControlledTabValue(value: TngTabsValue | null): value is ControlledTabValue {
  return value === 'overview' || value === 'activity' || value === 'settings';
}

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

@Component({
  selector: 'app-tabs-examples-page',
  imports: [
    TngTabsRoot,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngTabsScrollButtonPrev,
    TngTabsScrollButtonNext,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tabs-examples-page.component.html',
  styleUrl: './tabs-examples-page.component.css',
})
export class TabsExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainControlledValue = signal<ControlledTabValue>('overview');
  protected readonly tailwindControlledValue = signal<ControlledTabValue>('overview');

  protected readonly scrollButtonsTabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'setup', label: 'Setup' },
    { value: 'usage', label: 'Usage' },
    { value: 'patterns', label: 'Patterns' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'performance', label: 'Performance' },
    { value: 'testing', label: 'Testing' },
    { value: 'migration', label: 'Migration' },
    { value: 'faq', label: 'FAQ' },
    { value: 'roadmap', label: 'Roadmap' },
  ] as const;

  protected readonly controlledPlainCodeTabs = createCodeTabs(
    'tabs-controlled-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel, type TngTabsValue } from '@tailng-ui/primitives';",
      '',
      "type WorkspaceTab = 'overview' | 'activity' | 'settings';",
      '',
      'function isWorkspaceTab(value: TngTabsValue | null): value is WorkspaceTab {',
      "  return value === 'overview' || value === 'activity' || value === 'settings';",
      '}',
      '',
      '@Component({',
      "  selector: 'app-tabs-controlled-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-controlled-plain-css.component.html',",
      "  styleUrl: './tabs-controlled-plain-css.component.css',",
      '})',
      'export class TabsControlledPlainCssComponent {',
      "  protected readonly current = signal<WorkspaceTab>('overview');",
      '',
      '  protected onValueChange(value: TngTabsValue | null): void {',
      '    if (isWorkspaceTab(value)) {',
      '      this.current.set(value);',
      '    }',
      '  }',
      '}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Workspace sections" [value]="current()" (valueChange)="onValueChange($event)">',
      '  <div tngTabList ariaLabel="Workspace sections">',
      '    <button type="button" tngTab value="overview">Overview</button>',
      '    <button type="button" tngTab value="activity">Activity</button>',
      '    <button type="button" tngTab value="settings">Settings</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="overview">Overview content</section>',
      '  <section tngTabPanel value="activity">Activity content</section>',
      '  <section tngTabPanel value="settings">Settings content</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    '/* No component CSS is required for the stock styled wrapper. */',
  );

  protected readonly controlledTailwindCodeTabs = createCodeTabs(
    'tabs-controlled-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel, type TngTabsValue } from '@tailng-ui/primitives';",
      '',
      "type WorkspaceTab = 'overview' | 'activity' | 'settings';",
      '',
      'function isWorkspaceTab(value: TngTabsValue | null): value is WorkspaceTab {',
      "  return value === 'overview' || value === 'activity' || value === 'settings';",
      '}',
      '',
      '@Component({',
      "  selector: 'app-tabs-controlled-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-controlled-tailwind.component.html',",
      "  styleUrl: './tabs-controlled-tailwind.component.css',",
      '})',
      'export class TabsControlledTailwindComponent {',
      "  protected readonly current = signal<WorkspaceTab>('overview');",
      '',
      '  protected onValueChange(value: TngTabsValue | null): void {',
      '    if (isWorkspaceTab(value)) {',
      '      this.current.set(value);',
      '    }',
      '  }',
      '}',
    ].join('\n'),
    [
      '<tng-tabs',
      '  ariaLabel="Workspace sections"',
      '  [value]="current()"',
      '  (valueChange)="onValueChange($event)"',
      '  class="[--tng-tabs-radius:1.2rem] [--tng-tabs-tab-height:2.7rem] [--tng-tabs-panel-padding:1.15rem]"',
      '>',
      '  <div tngTabList ariaLabel="Workspace sections">',
      '    <button type="button" tngTab value="overview">Overview</button>',
      '    <button type="button" tngTab value="activity">Activity</button>',
      '    <button type="button" tngTab value="settings">Settings</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="overview">Overview content</section>',
      '  <section tngTabPanel value="activity">Activity content</section>',
      '  <section tngTabPanel value="settings">Settings content</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    '/* Tailwind arbitrary properties override public component variables on the host. */',
  );

  protected readonly verticalPlainCodeTabs = createCodeTabs(
    'tabs-vertical-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-vertical-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-vertical-plain-css.component.html',",
      "  styleUrl: './tabs-vertical-plain-css.component.css',",
      '})',
      'export class TabsVerticalPlainCssComponent {}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Settings categories" orientation="vertical" activation="manual" defaultValue="account">',
      '  <div tngTabList ariaLabel="Settings categories">',
      '    <button type="button" tngTab value="account">Account</button>',
      '    <button type="button" tngTab value="team">Team</button>',
      '    <button type="button" tngTab value="security">Security</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="account">Account panel</section>',
      '  <section tngTabPanel value="team">Team panel</section>',
      '  <section tngTabPanel value="security">Security panel</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    '/* Vertical layout is provided by the wrapper contract. */',
  );

  protected readonly verticalTailwindCodeTabs = createCodeTabs(
    'tabs-vertical-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-vertical-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-vertical-tailwind.component.html',",
      "  styleUrl: './tabs-vertical-tailwind.component.css',",
      '})',
      'export class TabsVerticalTailwindComponent {}',
    ].join('\n'),
    [
      '<tng-tabs',
      '  ariaLabel="Settings categories"',
      '  orientation="vertical"',
      '  activation="manual"',
      '  defaultValue="account"',
      '  class="[--tng-tabs-vertical-list-width:11.5rem] [--tng-tabs-panel-padding:1.15rem]"',
      '>',
      '  <div tngTabList ariaLabel="Settings categories">',
      '    <button type="button" tngTab value="account">Account</button>',
      '    <button type="button" tngTab value="team">Team</button>',
      '    <button type="button" tngTab value="security">Security</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="account">Account panel</section>',
      '  <section tngTabPanel value="team">Team panel</section>',
      '  <section tngTabPanel value="security">Security panel</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    '/* Tailwind arbitrary properties override public component variables on the host. */',
  );

  protected readonly scrollButtonsPlainCodeTabs = createCodeTabs(
    'tabs-scroll-buttons-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      'import {',
      '  TngTab,',
      '  TngTabList,',
      '  TngTabPanel,',
      '  TngTabsScrollButtonNext,',
      '  TngTabsScrollButtonPrev,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-scroll-buttons-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],',
      "  templateUrl: './tabs-scroll-buttons-plain-css.component.html',",
      "  styleUrl: './tabs-scroll-buttons-plain-css.component.css',",
      '})',
      'export class TabsScrollButtonsPlainCssComponent {',
      '  protected readonly tabs = [',
      "    { value: 'overview', label: 'Overview' },",
      "    { value: 'setup', label: 'Setup' },",
      "    { value: 'usage', label: 'Usage' },",
      "    { value: 'patterns', label: 'Patterns' },",
      "    { value: 'accessibility', label: 'Accessibility' },",
      "    { value: 'performance', label: 'Performance' },",
      "    { value: 'testing', label: 'Testing' },",
      "    { value: 'migration', label: 'Migration' },",
      "    { value: 'faq', label: 'FAQ' },",
      "    { value: 'roadmap', label: 'Roadmap' },",
      '  ] as const;',
      '}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Documentation sections" scrollButtons="auto" defaultValue="overview">',
      '  <div class="tabs-strip">',
      '    <button type="button" tngTabsScrollButtonPrev aria-label="Scroll tabs left">',
      '      &#x2039;',
      '    </button>',
      '    <div tngTabList ariaLabel="Documentation sections">',
      '      @for (item of tabs; track item.value) {',
      '        <button type="button" tngTab [value]="item.value">{{ item.label }}</button>',
      '      }',
      '    </div>',
      '    <button type="button" tngTabsScrollButtonNext aria-label="Scroll tabs right">',
      '      &#x203A;',
      '    </button>',
      '  </div>',
      '',
      '  @for (item of tabs; track item.value) {',
      '    <section tngTabPanel [value]="item.value">{{ item.label }} content.</section>',
      '  }',
      '</tng-tabs>',
      '',
    ].join('\n'),
    [
      '.tabs-strip {',
      '  align-items: center;',
      '  display: grid;',
      '  gap: 0.45rem;',
      '  grid-template-columns: auto minmax(0, 1fr) auto;',
      '  min-width: 0;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly scrollButtonsTailwindCodeTabs = createCodeTabs(
    'tabs-scroll-buttons-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      'import {',
      '  TngTab,',
      '  TngTabList,',
      '  TngTabPanel,',
      '  TngTabsScrollButtonNext,',
      '  TngTabsScrollButtonPrev,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-scroll-buttons-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],',
      "  templateUrl: './tabs-scroll-buttons-tailwind.component.html',",
      "  styleUrl: './tabs-scroll-buttons-tailwind.component.css',",
      '})',
      'export class TabsScrollButtonsTailwindComponent {',
      '  protected readonly tabs = [',
      "    { value: 'overview', label: 'Overview' },",
      "    { value: 'setup', label: 'Setup' },",
      "    { value: 'usage', label: 'Usage' },",
      "    { value: 'patterns', label: 'Patterns' },",
      "    { value: 'accessibility', label: 'Accessibility' },",
      "    { value: 'performance', label: 'Performance' },",
      "    { value: 'testing', label: 'Testing' },",
      "    { value: 'migration', label: 'Migration' },",
      "    { value: 'faq', label: 'FAQ' },",
      "    { value: 'roadmap', label: 'Roadmap' },",
      '  ] as const;',
      '}',
    ].join('\n'),
    [
      '<tng-tabs',
      '  ariaLabel="Documentation sections"',
      '  scrollButtons="on"',
      '  defaultValue="overview"',
      '  class="min-w-0 [--tng-tabs-scroll-button-size:2.25rem] [--tng-tabs-tab-px:1rem]"',
      '>',
      '    <div class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">',
      '      <button type="button" tngTabsScrollButtonPrev aria-label="Scroll tabs left">&#x2039;</button>',
      '      <div tngTabList ariaLabel="Documentation sections">',
      '        @for (item of tabs; track item.value) {',
      '          <button type="button" tngTab [value]="item.value">{{ item.label }}</button>',
      '        }',
      '      </div>',
      '      <button type="button" tngTabsScrollButtonNext aria-label="Scroll tabs right">&#x203A;</button>',
      '    </div>',
      '',
      '    @for (item of tabs; track item.value) {',
      '      <section tngTabPanel [value]="item.value">{{ item.label }} content.</section>',
      '    }',
      '  </tng-tabs>',
      '',
    ].join('\n'),
    '/* Tailwind provides the strip layout and host-level component variable overrides. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onValueChange(scope: DemoVariant, value: TngTabsValue | null): void {
    if (!isControlledTabValue(value)) {
      return;
    }

    if (scope === 'plain') {
      this.plainControlledValue.set(value);
      return;
    }

    this.tailwindControlledValue.set(value);
  }

  protected currentValue(scope: DemoVariant): ControlledTabValue {
    return scope === 'plain' ? this.plainControlledValue() : this.tailwindControlledValue();
  }
}
