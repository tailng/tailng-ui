import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const progressSpinnerItem = group.items.find((item) => item.slug === 'progress-spinner');
if (progressSpinnerItem === undefined) {
  throw new Error('Missing "progress-spinner" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_PROGRESS_SPINNER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, progressSpinnerItem),
    loadComponent: () =>
      import('./progress-spinner-page.component').then(
        (module) => module.ProgressSpinnerPageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/progress-spinner-overview-page.component').then(
            (module) => module.ProgressSpinnerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/progress-spinner-api-page.component').then(
            (module) => module.ProgressSpinnerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/progress-spinner-styling-page.component').then(
            (module) => module.ProgressSpinnerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/progress-spinner-examples-page.component').then(
            (module) => module.ProgressSpinnerExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'progress-spinner',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('progress-spinner'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
