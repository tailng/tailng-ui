import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const toastItem = group.items.find((item) => item.slug === 'toast');
if (toastItem === undefined) {
  throw new Error('Missing "toast" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_TOAST_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, toastItem),
    loadComponent: () =>
      import('./toast-page.component').then((module) => module.ToastPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/toast-overview-page.component').then(
            (module) => module.ToastOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/toast-api-page.component').then(
            (module) => module.ToastApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/toast-styling-page.component').then(
            (module) => module.ToastStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/toast-examples-page.component').then(
            (module) => module.ToastExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'toast',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('toast'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
