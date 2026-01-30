import { Routes } from '@angular/router';

export const timepickerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/timepicker-overview.component').then((m) => m.TimepickerOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/timepicker-api.component').then((m) => m.TimepickerApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/timepicker-styling.component').then((m) => m.TimepickerStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/timepicker-examples.component').then((m) => m.TimepickerExamplesComponent),
  },
];
