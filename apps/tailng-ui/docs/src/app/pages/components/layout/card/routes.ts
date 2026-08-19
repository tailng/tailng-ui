import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const cardItem = group.items.find((item) => item.slug === 'card');
if (cardItem === undefined) {
  throw new Error('Missing "card" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_CARD_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, cardItem),
    loadComponent: () => import('./card-page.component').then((module) => module.CardPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/card-overview-page.component').then(
            (module) => module.CardOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/card-api-page.component').then(
            (module) => module.CardApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/card-styling-page.component').then(
            (module) => module.CardStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/card-examples-page.component').then(
            (module) => module.CardExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'card',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('card'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
