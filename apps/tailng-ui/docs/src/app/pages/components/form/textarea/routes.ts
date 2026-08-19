import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const textareaItem = group.items.find((item) => item.slug === 'textarea');
if (textareaItem === undefined) {
  throw new Error('Missing "textarea" in components form docs group.');
}

export const COMPONENTS_FORM_TEXTAREA_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, textareaItem),
    loadComponent: () =>
      import('./textarea-page.component').then((module) => module.TextareaPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/textarea-overview-page.component').then(
            (module) => module.TextareaOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/textarea-api-page.component').then(
            (module) => module.TextareaApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/textarea-styling-page.component').then(
            (module) => module.TextareaStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/textarea-examples-page.component').then(
            (module) => module.TextareaExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'textarea',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('textarea'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
