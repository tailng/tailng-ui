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
      import('./overview/button-toggle-overview.component').then((m) => m.ButtonToggleOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/button-toggle-api.component').then((m) => m.ButtonToggleApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/button-toggle-styling.component').then((m) => m.ButtonToggleStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/button-toggle-examples.component').then((m) => m.ButtonToggleExamplesComponent),
  },
];
