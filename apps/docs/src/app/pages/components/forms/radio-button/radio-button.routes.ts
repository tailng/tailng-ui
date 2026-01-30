import { Routes } from '@angular/router';

export const radioButtonRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/radio-button-overview.component').then((m) => m.RadioButtonOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/radio-button-api.component').then((m) => m.RadioButtonApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/radio-button-styling.component').then((m) => m.RadioButtonStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/radio-button-examples.component').then((m) => m.RadioButtonExamplesComponent),
  },
];
