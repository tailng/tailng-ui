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
      import('./overview/slide-toggle-overview.component').then((m) => m.SlideToggleOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/slide-toggle-api.component').then((m) => m.SlideToggleApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/slide-toggle-styling.component').then((m) => m.SlideToggleStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/slide-toggle-examples.component').then((m) => m.SlideToggleExamplesComponent),
  },
];
