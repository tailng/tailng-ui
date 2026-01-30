import { Routes } from '@angular/router';

export const selectRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/select-overview.component').then((m) => m.SelectOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/select-api.component').then((m) => m.SelectApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () => import('./styling/select-styling.component').then((m) => m.SelectStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./examples/select-examples.component').then((m) => m.SelectExamplesComponent),
  },
];
