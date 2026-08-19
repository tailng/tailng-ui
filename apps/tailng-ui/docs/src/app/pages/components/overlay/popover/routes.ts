import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_OVERLAY_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_OVERLAY_GROUP;
const popoverItem = group.items.find((item) => item.slug === 'popover');
if (popoverItem === undefined) {
  throw new Error('Missing "popover" in components overlay docs group.');
}

export const COMPONENTS_OVERLAY_POPOVER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, popoverItem),
    loadComponent: () =>
      import('./popover-page.component').then((module) => module.PopoverPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/popover-overview-page.component').then(
            (module) => module.PopoverOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/popover-api-page.component').then(
            (module) => module.PopoverApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/popover-styling-page.component').then(
            (module) => module.PopoverStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/popover-examples-page.component').then(
            (module) => module.PopoverExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'popover',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('popover'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
