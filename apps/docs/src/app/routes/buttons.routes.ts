import { Routes } from '@angular/router';

export const buttonsRoutes: Routes = [
  {
    path: 'buttons/badge',
    loadComponent: () =>
      import('../pages/components/buttons/badge/badge-docs.component').then((m) => m.BadgeDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/badge/overview/overview.component').then(
            (m) => m.BadgeOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/badge/api/api.component').then((m) => m.BadgeApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/badge/styling/styling.component').then(
            (m) => m.BadgeStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/badge/examples/examples.component').then(
            (m) => m.BadgeExamplesComponent,
          ),
      },
    ],
    data: { title: 'Badge – tailng', description: 'Badge component for tailng.' },
  },
  {
    path: 'buttons/button',
    loadComponent: () =>
      import('../pages/components/buttons/button/button-docs.component').then((m) => m.ButtonDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/button/overview/overview.component').then(
            (m) => m.ButtonOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/button/api/api.component').then((m) => m.ButtonApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/button/styling/styling.component').then(
            (m) => m.ButtonStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/button/examples/examples.component').then(
            (m) => m.ButtonExamplesComponent,
          ),
      },
    ],
    data: { title: 'Button – tailng', description: 'Button component: variants, sizes, loading, icons.' },
  },
  {
    path: 'buttons/icon',
    loadComponent: () =>
      import('../pages/components/buttons/icon/icon-docs.component').then((m) => m.IconDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/icon/overview/overview.component').then(
            (m) => m.IconOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/icon/api/api.component').then((m) => m.IconApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/icon/styling/styling.component').then(
            (m) => m.IconStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/icon/examples/examples.component').then(
            (m) => m.IconExamplesComponent,
          ),
      },
    ],
    data: { title: 'Icon – tailng', description: 'Icon component for tailng.' },
  },
  {
    path: 'buttons/ripples',
    loadComponent: () =>
      import('../pages/components/buttons/ripples/ripples-docs.component').then((m) => m.RipplesDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/ripples/overview/overview.component').then(
            (m) => m.RipplesOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/ripples/api/api.component').then((m) => m.RipplesApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/ripples/styling/styling.component').then(
            (m) => m.RipplesStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/ripples/examples/examples.component').then(
            (m) => m.RipplesExamplesComponent,
          ),
      },
    ],
    data: { title: 'Ripples – tailng', description: 'Ripple effect for tailng components.' },
  },
  {
    path: 'buttons/progress-bar',
    loadComponent: () =>
      import('../pages/components/buttons/progress-bar/progress-bar-docs.component').then(
        (m) => m.ProgressBarDocsComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/progress-bar/overview/overview.component').then(
            (m) => m.ProgressBarOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/progress-bar/api/api.component').then(
            (m) => m.ProgressBarApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/progress-bar/styling/styling.component').then(
            (m) => m.ProgressBarStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/progress-bar/examples/examples.component').then(
            (m) => m.ProgressBarExamplesComponent,
          ),
      },
    ],
    data: { title: 'Progress Bar – tailng', description: 'Progress bar indicator for tailng.' },
  },
  {
    path: 'buttons/progress-spinner',
    loadComponent: () =>
      import('../pages/components/buttons/progress-spinner/progress-spinner-docs.component').then(
        (m) => m.ProgressSpinnerDocsComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/progress-spinner/overview/overview.component').then(
            (m) => m.ProgressSpinnerOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/progress-spinner/api/api.component').then(
            (m) => m.ProgressSpinnerApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/progress-spinner/styling/styling.component').then(
            (m) => m.ProgressSpinnerStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/progress-spinner/examples/examples.component').then(
            (m) => m.ProgressSpinnerExamplesComponent,
          ),
      },
    ],
    data: { title: 'Progress Spinner – tailng', description: 'Progress spinner indicator for tailng.' },
  },
  {
    path: 'buttons/skeleton',
    loadComponent: () =>
      import('../pages/components/buttons/skeleton/skeleton-docs.component').then((m) => m.SkeletonDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/buttons/skeleton/overview/overview.component').then(
            (m) => m.SkeletonOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/buttons/skeleton/api/api.component').then((m) => m.SkeletonApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/buttons/skeleton/styling/styling.component').then(
            (m) => m.SkeletonStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/buttons/skeleton/examples/examples.component').then(
            (m) => m.SkeletonExamplesComponent,
          ),
      },
    ],
    data: { title: 'Skeleton – tailng', description: 'Skeleton loading placeholder for tailng.' },
  },
];
