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
      import('./overview/overview.component').then((m) => m.NumberInputOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.NumberInputApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/styling.component').then((m) => m.NumberInputStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/examples.component').then((m) => m.NumberInputExamplesComponent),
  },
];
