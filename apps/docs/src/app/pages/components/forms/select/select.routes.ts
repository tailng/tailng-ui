import { Routes } from '@angular/router';

export const selectRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then((m) => m.SelectOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.SelectApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () => import('./styling/styling.component').then((m) => m.SelectStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./examples/examples.component').then((m) => m.SelectExamplesComponent),
  },
];
