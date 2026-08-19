import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const tabsItem = group.items.find((item) => item.slug === 'tabs');
if (tabsItem === undefined) {
  throw new Error('Missing "tabs" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_TABS_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, tabsItem),
    loadComponent: () => import('./tabs-page.component').then((module) => module.TabsPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tabs-overview-page.component').then(
            (module) => module.TabsOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tabs-api-page.component').then(
            (module) => module.TabsApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tabs-styling-page.component').then(
            (module) => module.TabsStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tabs-examples-page.component').then(
            (module) => module.TabsExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'tabs',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('tabs'),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
