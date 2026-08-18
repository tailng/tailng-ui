import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTabs as TngTabsRoot } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
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

@Component({
  selector: 'app-tabs-overview-page',
  imports: [
    TngTabsRoot,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tabs-overview-page.component.html',
  styleUrl: './tabs-overview-page.component.css',
})
export class TabsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = "import { TngTabs } from '@tailng-ui/components';";
  protected readonly primitivePartsImportCode =
    "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';";
  protected readonly structureCode = [
    '<tng-tabs ariaLabel="Project sections" defaultValue="overview">',
    '  <div tngTabList ariaLabel="Project sections">',
    '    <button type="button" tngTab value="overview">Overview</button>',
    '    <button type="button" tngTab value="activity">Activity</button>',
    '  </div>',
    '',
    '  <section tngTabPanel value="overview">Overview content</section>',
    '  <section tngTabPanel value="activity">Activity content</section>',
    '</tng-tabs>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'tabs-overview-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-overview-plain-css.component.html',",
      "  styleUrl: './tabs-overview-plain-css.component.css',",
      '})',
      'export class TabsOverviewPlainCssComponent {}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Workspace sections" defaultValue="overview">',
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

  protected readonly tailwindCodeTabs = createCodeTabs(
    'tabs-overview-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-overview-tailwind.component.html',",
      "  styleUrl: './tabs-overview-tailwind.component.css',",
      '})',
      'export class TabsOverviewTailwindComponent {}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Workspace sections" defaultValue="overview">',
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
