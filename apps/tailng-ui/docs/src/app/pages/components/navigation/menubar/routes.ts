import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_NAVIGATION_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_NAVIGATION_GROUP;
const menubarItem = group.items.find((item) => item.slug === 'menubar');
if (menubarItem === undefined) {
  throw new Error('Missing "menubar" in components navigation docs group.');
}

export const COMPONENTS_NAVIGATION_MENUBAR_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, menubarItem),
    loadComponent: () =>
      import('./menubar-page.component').then((module) => module.MenubarPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/menubar-overview-page.component').then(
            (module) => module.MenubarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/menubar-api-page.component').then(
            (module) => module.MenubarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/menubar-styling-page.component').then(
            (module) => module.MenubarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/menubar-examples-page.component').then(
            (module) => module.MenubarExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'menubar',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('menubar'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
