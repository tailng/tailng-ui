import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const accordionItem = group.items.find((item) => item.slug === 'accordion');
if (accordionItem === undefined) {
  throw new Error('Missing "accordion" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_ACCORDION_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, accordionItem),
    loadComponent: () =>
      import('./accordion-page.component').then((module) => module.AccordionPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/accordion-overview-page.component').then(
            (module) => module.AccordionOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/accordion-api-page.component').then(
            (module) => module.AccordionApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/accordion-styling-page.component').then(
            (module) => module.AccordionStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/accordion-examples-page.component').then(
            (module) => module.AccordionExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'accordion',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('accordion'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
