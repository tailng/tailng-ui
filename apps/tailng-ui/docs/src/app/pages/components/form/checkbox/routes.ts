import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const checkboxItem = group.items.find((item) => item.slug === 'checkbox');
if (checkboxItem === undefined) {
  throw new Error('Missing "checkbox" in components form docs group.');
}

export const COMPONENTS_FORM_CHECKBOX_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, checkboxItem),
    loadComponent: () =>
      import('./checkbox-page.component').then((module) => module.CheckboxPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/checkbox-overview-page.component').then(
            (module) => module.CheckboxOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/checkbox-api-page.component').then(
            (module) => module.CheckboxApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/checkbox-styling-page.component').then(
            (module) => module.CheckboxStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/checkbox-examples-page.component').then(
            (module) => module.CheckboxExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'checkbox',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('checkbox'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
