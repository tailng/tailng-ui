import { Routes } from '@angular/router';

export const textareaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.TextareaOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.TextareaApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/styling.component').then((m) => m.TextareaStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/examples.component').then((m) => m.TextareaExamplesComponent),
  },
];
