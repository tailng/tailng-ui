import { Routes } from '@angular/router';

export const chipsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then((m) => m.ChipsOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.ChipsApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () => import('./styling/styling.component').then((m) => m.ChipsStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./examples/examples.component').then((m) => m.ChipsExamplesComponent),
  },
];
