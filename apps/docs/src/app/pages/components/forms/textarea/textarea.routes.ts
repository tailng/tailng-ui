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
      import('./overview/textarea-overview.component').then((m) => m.TextareaOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/textarea-api.component').then((m) => m.TextareaApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/textarea-styling.component').then((m) => m.TextareaStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/textarea-examples.component').then((m) => m.TextareaExamplesComponent),
  },
];
