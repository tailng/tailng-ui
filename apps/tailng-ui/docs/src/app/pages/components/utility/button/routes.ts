import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const buttonItem = group.items.find((item) => item.slug === 'button');
if (buttonItem === undefined) {
  throw new Error('Missing "button" in components utility docs group.');
}

export const COMPONENTS_UTILITY_BUTTON_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, buttonItem),
    loadComponent: () =>
      import('./button-page.component').then((module) => module.ButtonPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/button-overview-page.component').then(
            (module) => module.ButtonOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/button-api-page.component').then(
            (module) => module.ButtonApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/button-styling-page.component').then(
            (module) => module.ButtonStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/button-examples-page.component').then(
            (module) => module.ButtonExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'button',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('button'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
