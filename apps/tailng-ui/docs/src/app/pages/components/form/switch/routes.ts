import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const switchItem = group.items.find((item) => item.slug === 'switch');
if (switchItem === undefined) {
  throw new Error('Missing "switch" in components form docs group.');
}

export const COMPONENTS_FORM_SWITCH_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, switchItem),
    loadComponent: () =>
      import('./switch-page.component').then((module) => module.SwitchPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/switch-overview-page.component').then(
            (module) => module.SwitchOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/switch-api-page.component').then(
            (module) => module.SwitchApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/switch-styling-page.component').then(
            (module) => module.SwitchStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/switch-examples-page.component').then(
            (module) => module.SwitchExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'switch',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('switch'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
