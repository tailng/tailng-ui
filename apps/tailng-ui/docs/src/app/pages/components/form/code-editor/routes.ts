import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const codeEditorItem = group.items.find((item) => item.slug === 'code-editor');
if (codeEditorItem === undefined) {
  throw new Error('Missing "code-editor" in components form docs group.');
}

export const COMPONENTS_FORM_CODE_EDITOR_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, codeEditorItem),
    loadComponent: () =>
      import('./code-editor-page.component').then((module) => module.CodeEditorPageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/code-editor-overview-page.component').then(
            (module) => module.CodeEditorOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/code-editor-api-page.component').then(
            (module) => module.CodeEditorApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/code-editor-styling-page.component').then(
            (module) => module.CodeEditorStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/code-editor-examples-page.component').then(
            (module) => module.CodeEditorExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: { registrySlug: 'code-editor' },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('code-editor'),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
