import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const copybuttonItem = group.items.find((item) => item.slug === 'copybutton');
if (copybuttonItem === undefined) {
  throw new Error('Missing "copybutton" in components utility docs group.');
}

export const COMPONENTS_UTILITY_COPYBUTTON_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, copybuttonItem),
    loadComponent: () =>
      import('./copybutton-page.component').then((module) => module.CopybuttonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/copybutton-overview-page.component').then(
            (module) => module.CopybuttonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/copybutton-api-page.component').then(
            (module) => module.CopybuttonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/copybutton-styling-page.component').then(
            (module) => module.CopybuttonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/copybutton-examples-page.component').then(
            (module) => module.CopybuttonExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'copy',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('copy'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
