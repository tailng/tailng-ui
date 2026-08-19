import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const toggleItem = group.items.find((item) => item.slug === 'toggle');
if (toggleItem === undefined) {
  throw new Error('Missing "toggle" in components form docs group.');
}

export const COMPONENTS_FORM_TOGGLE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, toggleItem),
    loadComponent: () =>
      import('./toggle-page.component').then((module) => module.TogglePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/toggle-overview-page.component').then(
            (module) => module.ToggleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/toggle-api-page.component').then(
            (module) => module.ToggleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/toggle-styling-page.component').then(
            (module) => module.ToggleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/toggle-examples-page.component').then(
            (module) => module.ToggleExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'toggle',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('toggle'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
