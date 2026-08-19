import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const paginationItem = group.items.find((item) => item.slug === 'pagination');
if (paginationItem === undefined) {
  throw new Error('Missing "pagination" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_PAGINATION_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, paginationItem),
    loadComponent: () =>
      import('./pagination-page.component').then((module) => module.PaginationPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/pagination-overview-page.component').then(
            (module) => module.PaginationOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/pagination-api-page.component').then(
            (module) => module.PaginationApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/pagination-styling-page.component').then(
            (module) => module.PaginationStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/pagination-examples-page.component').then(
            (module) => module.PaginationExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: { registrySlug: 'pagination' },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('pagination'),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
