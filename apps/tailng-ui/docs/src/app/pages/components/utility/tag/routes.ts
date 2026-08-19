import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_UTILITY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_UTILITY_GROUP;
const tagItem = group.items.find((item) => item.slug === 'tag');
if (tagItem === undefined) {
  throw new Error('Missing "tag" in components utility docs group.');
}

export const COMPONENTS_UTILITY_TAG_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, tagItem),
    loadComponent: () => import('./tag-page.component').then((module) => module.TagPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/tag-overview-page.component').then(
            (module) => module.TagOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/tag-api-page.component').then(
            (module) => module.TagApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/tag-styling-page.component').then(
            (module) => module.TagStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/tag-examples-page.component').then(
            (module) => module.TagExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'tag',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('tag'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
