import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const item = group.items.find((entry) => entry.slug === 'range-slider');
if (item === undefined) {
  throw new Error('Missing "range-slider" in components form docs group.');
}

export const COMPONENTS_FORM_RANGE_SLIDER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, item),
    loadComponent: () =>
      import('./range-slider-page.component').then((module) => module.RangeSliderPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/range-slider-overview-page.component').then(
            (module) => module.RangeSliderOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/range-slider-api-page.component').then(
            (module) => module.RangeSliderApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/range-slider-styling-page.component').then(
            (module) => module.RangeSliderStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/range-slider-examples-page.component').then(
            (module) => module.RangeSliderExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
