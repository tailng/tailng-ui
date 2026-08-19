import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const contextMenuItem = group.items.find((item) => item.slug === 'context-menu');
if (contextMenuItem === undefined) {
  throw new Error('Missing "context-menu" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_CONTEXT_MENU_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, contextMenuItem),
    loadComponent: () =>
      import('./context-menu-page.component').then((module) => module.ContextMenuPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/context-menu-overview-page.component').then(
            (module) => module.ContextMenuOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/context-menu-api-page.component').then(
            (module) => module.ContextMenuApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/context-menu-styling-page.component').then(
            (module) => module.ContextMenuStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/context-menu-examples-page.component').then(
            (module) => module.ContextMenuExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'context-menu',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('context-menu'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
