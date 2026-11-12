import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';

@Component({
  selector: 'app-icons-overview-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './icons-overview-page.component.html',
})
export class IconsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );

  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly installPnpmCode = 'pnpm add @tailng-ui/icons';
  protected readonly installNpmCode = 'npm install @tailng-ui/icons';
  protected readonly installYarnCode = 'yarn add @tailng-ui/icons';

  protected readonly basicProviderCode = `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideTngIcons } from '@tailng-ui/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTngIcons(), // uses Lucide by default
  ],
};`;

  protected readonly basicUsageCode = `<!-- decorative icon alongside text (aria-hidden by default) -->
<tng-icon icon="home" size="1.25rem" />

<!-- meaningful standalone icon with accessible label -->
<tng-icon icon="search" label="Search" size="1.25rem" />

<!-- kebab-case and camelCase icon names are both supported -->
<tng-icon icon="arrow-right" size="1rem" />
<tng-icon icon="arrowRight" size="1rem" />`;

  protected readonly packRefSyntaxCode = `<!-- no prefix -> uses the default pack (lucide) -->
<tng-icon icon="star" />

<!-- explicit pack:name syntax -->
<tng-icon icon="lucide:star" />
<tng-icon icon="bootstrap:star-fill" />
<tng-icon icon="flags:us" />`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
