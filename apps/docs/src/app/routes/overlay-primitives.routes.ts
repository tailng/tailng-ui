import { Routes } from '@angular/router';

export const overlayPrimitivesRoutes: Routes = [
  {
    path: 'overlay-primitives/connected-overlay',
    loadComponent: () =>
      import('../pages/components/overlay-primitives/connected-overlay/connected-overlay-docs.component').then((m) => m.ConnectedOverlayDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/connected-overlay/overview/connected-overlay-overview.component').then((m) => m.ConnectedOverlayOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/connected-overlay/api/connected-overlay-api.component').then((m) => m.ConnectedOverlayApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/connected-overlay/styling/connected-overlay-styling.component').then((m) => m.ConnectedOverlayStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/connected-overlay/examples/connected-overlay-examples.component').then((m) => m.ConnectedOverlayExamplesComponent),
      },
    ],
    data: { title: 'Connected Overlay – tailng', description: 'Internal overlay primitive used by overlay components.' },
  },
  {
    path: 'overlay-primitives/option-list',
    loadComponent: () =>
      import('../pages/components/overlay-primitives/option-list/option-list-docs.component').then((m) => m.OptionListDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/option-list/overview/option-list-overview.component').then((m) => m.OptionListOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/option-list/api/option-list-api.component').then((m) => m.OptionListApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/option-list/styling/option-list-styling.component').then((m) => m.OptionListStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay-primitives/option-list/examples/option-list-examples.component').then((m) => m.OptionListExamplesComponent),
      },
    ],
    data: { title: 'Option List – tailng', description: 'Internal option list primitive used by selection components.' },
  },
];
