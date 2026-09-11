import type { Routes } from '@angular/router';
import { DEFAULT_COMPONENTS_DOCS_SEGMENT } from './component-docs.data';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/components-page.component').then((m) => m.ComponentsPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_COMPONENTS_DOCS_SEGMENT,
      },
      {
        path: 'getting-started',
        loadChildren: () =>
          import('./getting-started/routes').then((m) => m.COMPONENTS_GETTING_STARTED_ROUTES),
      },
      {
        path: 'form',
        loadChildren: () => import('./form/routes').then((m) => m.COMPONENTS_FORM_ROUTES),
      },
      {
        path: 'layout',
        loadChildren: () => import('./layout/routes').then((m) => m.COMPONENTS_LAYOUT_ROUTES),
      },
      {
        path: 'flow',
        loadChildren: () => import('./flow/routes').then((m) => m.COMPONENTS_FLOW_ROUTES),
      },
      {
        path: 'overlay',
        loadChildren: () => import('./overlay/routes').then((m) => m.COMPONENTS_OVERLAY_ROUTES),
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import('./feedback/routes').then((m) => m.COMPONENTS_FEEDBACK_ROUTES),
      },
      {
        path: 'utility',
        loadChildren: () =>
          import('./utility/routes').then((m) => m.COMPONENTS_UTILITY_ROUTES),
      },
      {
        path: 'navigation',
        loadChildren: () =>
          import('./navigation/routes').then((m) => m.COMPONENTS_NAVIGATION_ROUTES),
      },
      {
        path: '**',
        redirectTo: DEFAULT_COMPONENTS_DOCS_SEGMENT,
      },
    ],
  },
];
