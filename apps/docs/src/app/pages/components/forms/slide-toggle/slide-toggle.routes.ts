import { Routes } from '@angular/router';

export const slideToggleRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.SlideToggleOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.SlideToggleApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/styling.component').then((m) => m.SlideToggleStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/examples.component').then((m) => m.SlideToggleExamplesComponent),
  },
];
