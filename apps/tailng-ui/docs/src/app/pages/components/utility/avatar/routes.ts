import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const avatarItem = group.items.find((item) => item.slug === 'avatar');
if (avatarItem === undefined) {
  throw new Error('Missing "avatar" in components utility docs group.');
}

export const COMPONENTS_UTILITY_AVATAR_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, avatarItem),
    loadComponent: () =>
      import('./avatar-page.component').then((module) => module.AvatarPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/avatar-overview-page.component').then(
            (module) => module.AvatarOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/avatar-api-page.component').then(
            (module) => module.AvatarApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/avatar-styling-page.component').then(
            (module) => module.AvatarStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/avatar-examples-page.component').then(
            (module) => module.AvatarExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'avatar',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('avatar'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
