import { Routes } from '@angular/router';

export const numberInputRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/number-input-overview.component').then((m) => m.NumberInputOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/number-input-api.component').then((m) => m.NumberInputApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/number-input-styling.component').then((m) => m.NumberInputStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/number-input-examples.component').then((m) => m.NumberInputExamplesComponent),
  },
];
