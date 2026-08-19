import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'label');
if (item === undefined) {
  throw new Error('Missing "label" in components form docs group.');
}

export const COMPONENTS_FORM_LABEL_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./label-page.component').then((module) => module.LabelPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/label-overview-page.component').then(
            (module) => module.LabelOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/label-api-page.component').then(
            (module) => module.LabelApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/label-styling-page.component').then(
            (module) => module.LabelStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/label-examples-page.component').then(
            (module) => module.LabelExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'label',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('label'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
