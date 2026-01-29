import { Routes } from '@angular/router';

export const buttonToggleRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.ButtonToggleOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.ButtonToggleApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/styling.component').then((m) => m.ButtonToggleStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/examples.component').then((m) => m.ButtonToggleExamplesComponent),
  },
];
