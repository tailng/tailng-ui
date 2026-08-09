import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'slider');
if (item === undefined) {
  throw new Error('Missing "slider" in components form docs group.');
}

export const COMPONENTS_FORM_SLIDER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./slider-page.component').then((module) => module.SliderPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/slider-overview-page.component').then(
            (module) => module.SliderOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/slider-api-page.component').then(
            (module) => module.SliderApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/slider-styling-page.component').then(
            (module) => module.SliderStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/slider-examples-page.component').then(
            (module) => module.SliderExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
