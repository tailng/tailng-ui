import { Routes } from '@angular/router';

export const autocompleteRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/autocomplete-overview.component').then((m) => m.AutocompleteOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/autocomplete-api.component').then((m) => m.AutocompleteApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/autocomplete-styling.component').then((m) => m.AutocompleteStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/autocomplete-examples.component').then((m) => m.AutocompleteExamplesComponent),
  },
];
