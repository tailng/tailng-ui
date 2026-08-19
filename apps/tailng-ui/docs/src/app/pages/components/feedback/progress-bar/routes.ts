import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FEEDBACK_GROUP;
const progressBarItem = group.items.find((item) => item.slug === 'progress-bar');
if (progressBarItem === undefined) {
  throw new Error('Missing "progress-bar" in components feedback docs group.');
}

export const COMPONENTS_FEEDBACK_PROGRESS_BAR_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, progressBarItem),
    loadComponent: () =>
      import('./progress-bar-page.component').then((module) => module.ProgressBarPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/progress-bar-overview-page.component').then(
            (module) => module.ProgressBarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/progress-bar-api-page.component').then(
            (module) => module.ProgressBarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/progress-bar-styling-page.component').then(
            (module) => module.ProgressBarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/progress-bar-examples-page.component').then(
            (module) => module.ProgressBarExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'progress-bar',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('progress-bar'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
