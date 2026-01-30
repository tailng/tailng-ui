import { Routes } from '@angular/router';

export const checkboxRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/checkbox-overview.component').then((m) => m.CheckboxOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/checkbox-api.component').then((m) => m.CheckboxApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/checkbox-styling.component').then((m) => m.CheckboxStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/checkbox-examples.component').then((m) => m.CheckboxExamplesComponent),
  },
];
