import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const radioItem = group.items.find((item) => item.slug === 'radio');
if (radioItem === undefined) {
  throw new Error('Missing "radio" in components form docs group.');
}

export const COMPONENTS_FORM_RADIO_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, radioItem),
    loadComponent: () =>
      import('./radio-page.component').then((module) => module.RadioPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/radio-overview-page.component').then(
            (module) => module.RadioOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/radio-api-page.component').then(
            (module) => module.RadioApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/radio-styling-page.component').then(
            (module) => module.RadioStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/radio-examples-page.component').then(
            (module) => module.RadioExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'radio',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('radio'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
