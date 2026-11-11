import { DOCUMENT } from '@angular/common';
import { computed, Component, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { map } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const fallbackItem = COMPONENTS_GETTING_STARTED_GROUP.items[0];
if (fallbackItem === undefined) {
  throw new Error('Components getting-started docs are empty.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  fallbackItem,
);

@Component({
  selector: 'app-getting-started-landing-page',
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
    RouterLink,
  ],
  templateUrl: './getting-started-landing-page.component.html',
  styleUrl: './getting-started-landing-page.component.css',
})
export class GettingStartedLandingPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly quickStartInstallPnpmCode =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
  protected readonly quickStartInstallNpmCode =
    'npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
  protected readonly quickStartInstallYarnCode =
    'yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
  protected readonly quickStartAiInstallCode = 'pnpm add @tailng-ui/ai @ag-ui/core';

  protected readonly quickStartThemeConfigCode = [
    "import { ApplicationConfig } from '@angular/core';",
    "import { provideRouter } from '@angular/router';",
    "import { defaultDarkThemePreset, provideTailngTheme } from '@tailng-ui/theme';",
    "import { routes } from './app.routes';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideRouter(routes),',
    '    provideTailngTheme({ theme: defaultDarkThemePreset }),',
    '  ],',
    '};',
    '',
  ].join('\n');

  protected readonly quickStartButtonExampleCode = [
    "import { Component } from '@angular/core';",
    "import { TngButtonComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-quick-start-example',",
    '  imports: [TngButtonComponent],',
    '  template: `',
    '    <button tngButton variant="primary">Save changes</button>',
    '  `,',
    '})',
    'export class QuickStartExampleComponent {}',
    '',
  ].join('\n');

  protected readonly quickStartInputExampleCode = [
    '<tng-input',
    '  type="email"',
    '  placeholder="you@example.com"',
    '  ariaLabel="Email"',
    '  required',
    '></tng-input>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
