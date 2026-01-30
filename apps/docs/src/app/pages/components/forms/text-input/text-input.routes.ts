import { Routes } from '@angular/router';

export const textInputRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/text-input-overview.component').then((m) => m.TextInputOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/text-input-api.component').then((m) => m.TextInputApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/text-input-styling.component').then((m) => m.TextInputStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/text-input-examples.component').then((m) => m.TextInputExamplesComponent),
  },
];
