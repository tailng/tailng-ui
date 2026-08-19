import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const treeItem = group.items.find((item) => item.slug === 'tree');
if (treeItem === undefined) {
  throw new Error('Missing "tree" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_TREE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, treeItem),
    loadComponent: () => import('./tree-page.component').then((module) => module.TreePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tree-overview-page.component').then(
            (module) => module.TreeOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tree-api-page.component').then(
            (module) => module.TreeApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tree-styling-page.component').then(
            (module) => module.TreeStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tree-examples-page.component').then(
            (module) => module.TreeExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'tree',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('tree'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
