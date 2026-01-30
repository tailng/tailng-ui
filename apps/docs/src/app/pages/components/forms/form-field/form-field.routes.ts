import { Routes } from '@angular/router';

export const formFieldRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/form-field-overview.component').then((m) => m.FormFieldOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/form-field-api.component').then((m) => m.FormFieldApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/form-field-styling.component').then((m) => m.FormFieldStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/form-field-examples.component').then((m) => m.FormFieldExamplesComponent),
  },
];
