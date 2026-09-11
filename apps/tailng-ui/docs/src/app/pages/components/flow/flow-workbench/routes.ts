import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const flowWorkbenchItem = group.items.find((item) => item.slug === 'flow-workbench');
if (flowWorkbenchItem === undefined) {
  throw new Error('Missing "flow-workbench" in components flow docs group.');
}

export const COMPONENTS_FLOW_WORKBENCH_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, flowWorkbenchItem),
    loadComponent: () =>
      import('./flow-workbench-page.component').then((module) => module.FlowWorkbenchPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/flow-workbench-overview-page.component').then(
            (module) => module.FlowWorkbenchOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/flow-workbench-api-page.component').then(
            (module) => module.FlowWorkbenchApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/flow-workbench-styling-page.component').then(
            (module) => module.FlowWorkbenchStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/flow-workbench-examples-page.component').then(
            (module) => module.FlowWorkbenchExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
