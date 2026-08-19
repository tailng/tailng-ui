import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FEEDBACK_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';
const item = COMPONENTS_FEEDBACK_GROUP.items.find((candidate) => candidate.slug === 'confetti');
if (item === undefined) throw new Error('Missing "confetti" in components feedback docs group.');
export const COMPONENTS_FEEDBACK_CONFETTI_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(COMPONENTS_FEEDBACK_GROUP, item),
    loadComponent: () => import('./confetti-page.component').then((m) => m.ConfettiPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/confetti-overview-page.component').then(
            (m) => m.ConfettiOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/confetti-api-page.component').then(
            (m) => m.ConfettiApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/confetti-styling-page.component').then(
            (m) => m.ConfettiStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/confetti-examples-page.component').then(
            (m) => m.ConfettiExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: { registrySlug: 'confetti' },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('confetti'),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
