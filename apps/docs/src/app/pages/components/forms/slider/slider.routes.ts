import { Routes } from '@angular/router';

export const sliderRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/slider-overview.component').then((m) => m.SliderOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/slider-api.component').then((m) => m.SliderApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () => import('./styling/slider-styling.component').then((m) => m.SliderStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () => import('./examples/slider-examples.component').then((m) => m.SliderExamplesComponent),
  },
];
