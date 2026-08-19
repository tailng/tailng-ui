import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const collapsibleItem = group.items.find((item) => item.slug === 'collapsible');
if (collapsibleItem === undefined) {
  throw new Error('Missing "collapsible" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_COLLAPSIBLE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, collapsibleItem),
    loadComponent: () =>
      import('./collapsible-page.component').then((module) => module.CollapsiblePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/collapsible-overview-page.component').then(
            (module) => module.CollapsibleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/collapsible-api-page.component').then(
            (module) => module.CollapsibleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/collapsible-styling-page.component').then(
            (module) => module.CollapsibleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/collapsible-examples-page.component').then(
            (module) => module.CollapsibleExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'collapsible',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('collapsible'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
