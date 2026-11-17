import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const monthpickerItem = group.items.find((item) => item.slug === 'monthpicker');
if (monthpickerItem === undefined) {
  throw new Error('Missing "monthpicker" in components form docs group.');
}

export const COMPONENTS_FORM_MONTHPICKER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, monthpickerItem),
    loadComponent: () =>
      import('./monthpicker-page.component').then((module) => module.MonthpickerPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/monthpicker-overview-page.component').then(
            (module) => module.MonthpickerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/monthpicker-api-page.component').then(
            (module) => module.MonthpickerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/monthpicker-styling-page.component').then(
            (module) => module.MonthpickerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/monthpicker-examples-page.component').then(
            (module) => module.MonthpickerExamplesPageComponent,
          ),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
