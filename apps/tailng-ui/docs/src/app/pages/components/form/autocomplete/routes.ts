import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const autocompleteItem = group.items.find((item) => item.slug === 'autocomplete');
if (autocompleteItem === undefined) {
  throw new Error('Missing "autocomplete" in components form docs group.');
}

export const COMPONENTS_FORM_AUTOCOMPLETE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, autocompleteItem),
    loadComponent: () =>
      import('./autocomplete-page.component').then((module) => module.AutocompletePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/autocomplete-overview-page.component').then(
            (module) => module.AutocompleteOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/autocomplete-api-page.component').then(
            (module) => module.AutocompleteApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/autocomplete-styling-page.component').then(
            (module) => module.AutocompleteStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/autocomplete-examples-page.component').then(
            (module) => module.AutocompleteExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'autocomplete',
        },
        redirectTo: requireOwnableDocsHref('autocomplete'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
