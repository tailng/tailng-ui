import { Routes } from '@angular/router';

export const overlayRoutes: Routes = [
  {
    path: 'overlay/dialog',
    loadComponent: () =>
      import('../pages/components/overlay/dialog/dialog-docs.component').then((m) => m.DialogDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/overview/overview.component').then((m) => m.DialogOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/api/api.component').then((m) => m.DialogApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/styling/styling.component').then((m) => m.DialogStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/examples/examples.component').then((m) => m.DialogExamplesComponent),
      },
    ],
    data: { title: 'Dialog – tailng', description: 'Dialog component for modal interactions.' },
  },
  {
    path: 'overlay/popover',
    loadComponent: () =>
      import('../pages/components/overlay/popover/popover-docs.component').then((m) => m.PopoverDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay/popover/overview/overview.component').then((m) => m.PopoverOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/popover/api/api.component').then((m) => m.PopoverApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/popover/styling/styling.component').then((m) => m.PopoverStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/popover/examples/examples.component').then((m) => m.PopoverExamplesComponent),
      },
    ],
    data: { title: 'Popover – tailng', description: 'Popover component for anchored overlays.' },
  },
  {
    path: 'overlay/snackbar',
    loadComponent: () =>
      import('../pages/components/overlay/snackbar/snackbar-docs.component').then((m) => m.SnackbarDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/overview/overview.component').then((m) => m.SnackbarOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/api/api.component').then((m) => m.SnackbarApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/styling/styling.component').then((m) => m.SnackbarStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/examples/examples.component').then((m) => m.SnackbarExamplesComponent),
      },
    ],
    data: { title: 'Snackbar – tailng', description: 'Snackbar notifications for tailng.' },
  },
  {
    path: 'overlay/tooltip',
    loadComponent: () =>
      import('../pages/components/overlay/tooltip/tooltip-docs.component').then((m) => m.TooltipDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/overview/overview.component').then((m) => m.TooltipOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/api/api.component').then((m) => m.TooltipApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/styling/styling.component').then((m) => m.TooltipStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/examples/examples.component').then((m) => m.TooltipExamplesComponent),
      },
    ],
    data: { title: 'Tooltip – tailng', description: 'Tooltip component for contextual hints.' },
  },
];
