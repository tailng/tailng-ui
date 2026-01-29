import { Routes } from '@angular/router';

export const sliderRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then((m) => m.SliderOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/api.component').then((m) => m.SliderApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () => import('./styling/styling.component').then((m) => m.SliderStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./examples/examples.component').then((m) => m.SliderExamplesComponent),
  },
];
