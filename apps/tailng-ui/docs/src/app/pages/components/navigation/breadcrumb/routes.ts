import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const breadcrumbItem = group.items.find((item) => item.slug === 'breadcrumb');
if (breadcrumbItem === undefined) {
  throw new Error('Missing "breadcrumb" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_BREADCRUMB_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, breadcrumbItem),
    loadComponent: () =>
      import('./breadcrumb-page.component').then((module) => module.BreadcrumbPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/breadcrumb-overview-page.component').then(
            (module) => module.BreadcrumbOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/breadcrumb-api-page.component').then(
            (module) => module.BreadcrumbApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/breadcrumb-styling-page.component').then(
            (module) => module.BreadcrumbStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/breadcrumb-examples-page.component').then(
            (module) => module.BreadcrumbExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'breadcrumb',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('breadcrumb'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
