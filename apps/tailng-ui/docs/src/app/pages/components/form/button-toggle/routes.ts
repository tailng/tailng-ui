import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'button-toggle');
if (item === undefined) {
  throw new Error('Missing "button-toggle" in components form docs group.');
}

export const COMPONENTS_FORM_BUTTON_TOGGLE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./button-toggle-page.component').then((module) => module.ButtonTogglePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/button-toggle-overview-page.component').then(
            (module) => module.ButtonToggleOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/button-toggle-api-page.component').then(
            (module) => module.ButtonToggleApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/button-toggle-styling-page.component').then(
            (module) => module.ButtonToggleStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/button-toggle-examples-page.component').then(
            (module) => module.ButtonToggleExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'button-toggle',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('button-toggle'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
