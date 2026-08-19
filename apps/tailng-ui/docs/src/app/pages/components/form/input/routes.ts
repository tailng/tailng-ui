import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const inputItem = group.items.find((item) => item.slug === 'input');
if (inputItem === undefined) {
  throw new Error('Missing "input" in components form docs group.');
}

export const COMPONENTS_FORM_INPUT_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, inputItem),
    loadComponent: () =>
      import('./input-page.component').then((module) => module.InputPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/input-overview-page.component').then(
            (module) => module.InputOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/input-api-page.component').then(
            (module) => module.InputApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/input-styling-page.component').then(
            (module) => module.InputStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/input-examples-page.component').then(
            (module) => module.InputExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'input',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('input'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
