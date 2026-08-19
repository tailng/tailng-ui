import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const inputOtpItem = group.items.find((item) => item.slug === 'input-otp');
if (inputOtpItem === undefined) {
  throw new Error('Missing "input-otp" in components form docs group.');
}

export const COMPONENTS_FORM_INPUT_OTP_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, inputOtpItem),
    loadComponent: () =>
      import('./input-otp-page.component').then((module) => module.InputOtpPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/input-otp-overview-page.component').then(
            (module) => module.InputOtpOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/input-otp-api-page.component').then(
            (module) => module.InputOtpApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/input-otp-styling-page.component').then(
            (module) => module.InputOtpStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/input-otp-examples-page.component').then(
            (module) => module.InputOtpExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: {
          registrySlug: 'input-otp',
        },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('input-otp'),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
