import { Routes } from '@angular/router';

export const navigationRoutes: Routes = [
  {
    path: 'navigation/breadcrumbs',
    loadComponent: () =>
      import('../pages/components/navigation/breadcrumbs/breadcrumbs-docs.component').then(
        (m) => m.BreadcrumbsDocsComponent,
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
          import('../pages/components/navigation/breadcrumbs/overview/breadcrumbs-overview.component').then(
            (m) => m.BreadcrumbsOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/breadcrumbs/api/breadcrumbs-api.component').then(
            (m) => m.BreadcrumbsApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/breadcrumbs/styling/breadcrumbs-styling.component').then(
            (m) => m.BreadcrumbsStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/breadcrumbs/examples/breadcrumbs-examples.component').then(
            (m) => m.BreadcrumbsExamplesComponent,
          ),
      },
    ],
    data: { title: 'Breadcrumbs – tailng', description: 'Breadcrumbs for hierarchical navigation.' },
  },
  {
    path: 'navigation/drawer',
    loadComponent: () =>
      import('../pages/components/navigation/drawer/drawer-docs.component').then((m) => m.DrawerDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/navigation/drawer/overview/drawer-overview.component').then(
            (m) => m.DrawerOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/drawer/api/drawer-api.component').then((m) => m.DrawerApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/drawer/styling/drawer-styling.component').then(
            (m) => m.DrawerStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/drawer/examples/drawer-examples.component').then(
            (m) => m.DrawerExamplesComponent,
          ),
      },
    ],
    data: { title: 'Drawer – tailng', description: 'Drawer component for overlays and navigation.' },
  },
  {
    path: 'navigation/menu',
    loadComponent: () =>
      import('../pages/components/navigation/menu/menu-docs.component').then((m) => m.MenuDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/navigation/menu/overview/menu-overview.component').then(
            (m) => m.MenuOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/menu/api/menu-api.component').then((m) => m.MenuApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/menu/styling/menu-styling.component').then(
            (m) => m.MenuStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/menu/examples/menu-examples.component').then(
            (m) => m.MenuExamplesComponent,
          ),
      },
    ],
    data: { title: 'Menu – tailng', description: 'Menu component for navigation and actions.' },
  },
  {
    path: 'navigation/paginator',
    loadComponent: () =>
      import('../pages/components/navigation/paginator/paginator-docs.component').then(
        (m) => m.PaginatorDocsComponent,
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
          import('../pages/components/navigation/paginator/overview/paginator-overview.component').then(
            (m) => m.PaginatorOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/paginator/api/paginator-api.component').then(
            (m) => m.PaginatorApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/paginator/styling/paginator-styling.component').then(
            (m) => m.PaginatorStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/paginator/examples/paginator-examples.component').then(
            (m) => m.PaginatorExamplesComponent,
          ),
      },
    ],
    data: { title: 'Paginator – tailng', description: 'Paginator component for lists and tables.' },
  },
  {
    path: 'navigation/sidenav',
    loadComponent: () =>
      import('../pages/components/navigation/sidenav/sidenav-docs.component').then(
        (m) => m.SidenavDocsComponent,
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
          import('../pages/components/navigation/sidenav/overview/sidenav-overview.component').then(
            (m) => m.SidenavOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/sidenav/api/sidenav-api.component').then(
            (m) => m.SidenavApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/sidenav/styling/sidenav-styling.component').then(
            (m) => m.SidenavStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/sidenav/examples/sidenav-examples.component').then(
            (m) => m.SidenavExamplesComponent,
          ),
      },
    ],
    data: { title: 'Sidenav – tailng', description: 'Sidenav component for app layouts.' },
  },
  {
    path: 'navigation/stepper',
    loadComponent: () =>
      import('../pages/components/navigation/stepper/stepper-docs.component').then(
        (m) => m.StepperDocsComponent,
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
          import('../pages/components/navigation/stepper/overview/stepper-overview.component').then(
            (m) => m.StepperOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/navigation/stepper/api/stepper-api.component').then(
            (m) => m.StepperApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/navigation/stepper/styling/stepper-styling.component').then(
            (m) => m.StepperStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/navigation/stepper/examples/stepper-examples.component').then(
            (m) => m.StepperExamplesComponent,
          ),
      },
    ],
    data: { title: 'Stepper – tailng', description: 'Stepper component for multi-step flows.' },
  },
];
