import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const emptyItem = group.items.find((item) => item.slug === 'empty');
if (emptyItem === undefined) {
  throw new Error('Missing "empty" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_EMPTY_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, emptyItem),
    loadComponent: () =>
      import('./empty-page.component').then((module) => module.EmptyPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/empty-overview-page.component').then(
            (module) => module.EmptyOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/empty-api-page.component').then(
            (module) => module.EmptyApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/empty-styling-page.component').then(
            (module) => module.EmptyStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/empty-examples-page.component').then(
            (module) => module.EmptyExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'empty',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('empty'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
