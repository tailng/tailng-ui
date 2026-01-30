import { Routes } from '@angular/router';

export const fileUploadRoutes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/file-upload-overview.component').then((m) => m.FileUploadOverviewComponent),
  },
  {
    path: 'api',
    loadComponent: () => import('./api/file-upload-api.component').then((m) => m.FileUploadApiComponent),
  },
  {
    path: 'styling',
    loadComponent: () =>
      import('./styling/file-upload-styling.component').then((m) => m.FileUploadStylingComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/file-upload-examples.component').then((m) => m.FileUploadExamplesComponent),
  },
];
