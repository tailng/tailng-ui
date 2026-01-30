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
          import('../pages/components/overlay/dialog/overview/dialog-overview.component').then((m) => m.DialogOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/api/dialog-api.component').then((m) => m.DialogApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/styling/dialog-styling.component').then((m) => m.DialogStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/dialog/examples/dialog-examples.component').then((m) => m.DialogExamplesComponent),
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
          import('../pages/components/overlay/popover/overview/popover-overview.component').then((m) => m.PopoverOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/popover/api/popover-api.component').then((m) => m.PopoverApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/popover/styling/popover-styling.component').then((m) => m.PopoverStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/popover/examples/popover-examples.component').then((m) => m.PopoverExamplesComponent),
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
          import('../pages/components/overlay/snackbar/overview/snackbar-overview.component').then((m) => m.SnackbarOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/api/snackbar-api.component').then((m) => m.SnackbarApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/styling/snackbar-styling.component').then((m) => m.SnackbarStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/snackbar/examples/snackbar-examples.component').then((m) => m.SnackbarExamplesComponent),
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
          import('../pages/components/overlay/tooltip/overview/tooltip-overview.component').then((m) => m.TooltipOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/api/tooltip-api.component').then((m) => m.TooltipApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/styling/tooltip-styling.component').then((m) => m.TooltipStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/overlay/tooltip/examples/tooltip-examples.component').then((m) => m.TooltipExamplesComponent),
      },
    ],
    data: { title: 'Tooltip – tailng', description: 'Tooltip component for contextual hints.' },
  },
];
