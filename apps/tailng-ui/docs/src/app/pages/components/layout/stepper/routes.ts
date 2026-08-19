import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const stepperItem = group.items.find((item) => item.slug === 'stepper');
if (stepperItem === undefined) {
  throw new Error('Missing "stepper" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_STEPPER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, stepperItem),
    loadComponent: () =>
      import('./stepper-page.component').then((module) => module.StepperPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/stepper-overview-page.component').then(
            (module) => module.StepperOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/stepper-api-page.component').then(
            (module) => module.StepperApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/stepper-styling-page.component').then(
            (module) => module.StepperStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/stepper-examples-page.component').then(
            (module) => module.StepperExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'stepper',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('stepper'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
