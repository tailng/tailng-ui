import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const badgeItem = group.items.find((item) => item.slug === 'badge');
if (badgeItem === undefined) {
  throw new Error('Missing "badge" in components utility docs group.');
}

export const COMPONENTS_UTILITY_BADGE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, badgeItem),
    loadComponent: () =>
      import('./badge-page.component').then((module) => module.BadgePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/badge-overview-page.component').then(
            (module) => module.BadgeOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/badge-api-page.component').then(
            (module) => module.BadgeApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/badge-styling-page.component').then(
            (module) => module.BadgeStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/badge-examples-page.component').then(
            (module) => module.BadgeExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'badge',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('badge'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
