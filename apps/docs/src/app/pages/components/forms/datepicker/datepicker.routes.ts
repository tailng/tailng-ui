import { Routes } from '@angular/router';

export const datepickerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/datepicker-overview.component').then((m) => m.DatepickerOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/datepicker-api.component').then((m) => m.DatepickerApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/datepicker-styling.component').then((m) => m.DatepickerStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/datepicker-examples.component').then((m) => m.DatepickerExamplesComponent),
  },
];
