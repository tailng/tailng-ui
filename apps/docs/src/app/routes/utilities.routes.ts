import { Routes } from '@angular/router';

export const utilitiesRoutes: Routes = [
  {
    path: 'utilities/code-block',
    loadComponent: () =>
      import('../pages/components/utilities/code-block/code-block-docs.component').then((m) => m.CodeBlockDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/utilities/code-block/overview/code-block-overview.component').then((m) => m.CodeBlockOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/utilities/code-block/api/code-block-api.component').then((m) => m.CodeBlockApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/utilities/code-block/styling/code-block-styling.component').then((m) => m.CodeBlockStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/utilities/code-block/examples/code-block-examples.component').then((m) => m.CodeBlockExamplesComponent),
      },
    ],
    data: { title: 'Code Block – tailng', description: 'Code block component with syntax highlighting support.' },
  },
  {
    path: 'utilities/copy-button',
    loadComponent: () =>
      import('../pages/components/utilities/copy-button/copy-button-docs.component').then((m) => m.CopyButtonDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/utilities/copy-button/overview/copy-button-overview.component').then((m) => m.CopyButtonOverviewComponent),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/utilities/copy-button/api/copy-button-api.component').then((m) => m.CopyButtonApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/utilities/copy-button/styling/copy-button-styling.component').then((m) => m.CopyButtonStylingComponent),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/utilities/copy-button/examples/copy-button-examples.component').then((m) => m.CopyButtonExamplesComponent),
      },
    ],
    data: { title: 'Copy Button – tailng', description: 'Copy-to-clipboard button component.' },
  },
];
