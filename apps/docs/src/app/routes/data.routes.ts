import { Routes } from '@angular/router';

export const dataRoutes: Routes = [
  {
    path: 'data/empty-state',
    loadComponent: () =>
      import('../pages/components/data/empty-state/empty-state-docs.component').then((m) => m.EmptyStateDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/empty-state/overview/empty-state-overview.component').then((m) => m.EmptyStateOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/empty-state/api/empty-state-api.component').then((m) => m.EmptyStateApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/empty-state/styling/empty-state-styling.component').then((m) => m.EmptyStateStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/empty-state/examples/empty-state-examples.component').then((m) => m.EmptyStateExamplesComponent),
      },
    ],
    data: { title: 'Empty State – tailng', description: 'Empty state component for no-data situations.' },
  },
  {
    path: 'data/filter-header',
    loadComponent: () =>
      import('../pages/components/data/filter-header/filter-header-docs.component').then((m) => m.FilterHeaderDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/filter-header/overview/filter-header-overview.component').then((m) => m.FilterHeaderOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/filter-header/api/filter-header-api.component').then((m) => m.FilterHeaderApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/filter-header/styling/filter-header-styling.component').then((m) => m.FilterHeaderStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/filter-header/examples/filter-header-examples.component').then((m) => m.FilterHeaderExamplesComponent),
      },
    ],
    data: { title: 'Filter Header – tailng', description: 'Filter header for tables and lists.' },
  },
  {
    path: 'data/sort-header',
    loadComponent: () =>
      import('../pages/components/data/sort-header/sort-header-docs.component').then((m) => m.SortHeaderDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/sort-header/overview/sort-header-overview.component').then((m) => m.SortHeaderOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/sort-header/api/sort-header-api.component').then((m) => m.SortHeaderApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/sort-header/styling/sort-header-styling.component').then((m) => m.SortHeaderStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/sort-header/examples/sort-header-examples.component').then((m) => m.SortHeaderExamplesComponent),
      },
    ],
    data: { title: 'Sort Header – tailng', description: 'Sortable header for tables.' },
  },
  {
    path: 'data/table',
    loadComponent: () =>
      import('../pages/components/data/table/table-docs.component').then((m) => m.TableDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/table/overview/table-overview.component').then((m) => m.TableOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/table/api/table-api.component').then((m) => m.TableApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/table/styling/table-styling.component').then((m) => m.TableStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/table/examples/table-examples.component').then((m) => m.TableExamplesComponent),
      },
    ],
    data: { title: 'Table – tailng', description: 'Basic data table component.' },
  },
  {
    path: 'data/tree',
    loadComponent: () =>
      import('../pages/components/data/tree/tree-docs.component').then((m) => m.TreeDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/tree/overview/tree-overview.component').then((m) => m.TreeOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/tree/api/tree-api.component').then((m) => m.TreeApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/tree/styling/tree-styling.component').then((m) => m.TreeStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/tree/examples/tree-examples.component').then((m) => m.TreeExamplesComponent),
      },
    ],
    data: { title: 'Tree – tailng', description: 'Tree component for hierarchical data.' },
  },
  {
    path: 'data/virtual-scroll',
    loadComponent: () =>
      import('../pages/components/data/virtual-scroll/virtual-scroll-docs.component').then((m) => m.VirtualScrollDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/data/virtual-scroll/overview/virtual-scroll-overview.component').then((m) => m.VirtualScrollOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/data/virtual-scroll/api/virtual-scroll-api.component').then((m) => m.VirtualScrollApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/data/virtual-scroll/styling/virtual-scroll-styling.component').then((m) => m.VirtualScrollStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/data/virtual-scroll/examples/virtual-scroll-examples.component').then((m) => m.VirtualScrollExamplesComponent),
      },
    ],
    data: { title: 'Virtual Scroll – tailng', description: 'Virtual scrolling for large lists.' },
  },
];
