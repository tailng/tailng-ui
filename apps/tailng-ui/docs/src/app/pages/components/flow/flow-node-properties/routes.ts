import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const flowNodePropertiesItem = group.items.find((item) => item.slug === 'flow-node-properties');
if (flowNodePropertiesItem === undefined) {
  throw new Error('Missing "flow-node-properties" in components flow docs group.');
}

export const COMPONENTS_FLOW_NODE_PROPERTIES_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, flowNodePropertiesItem),
    loadComponent: () =>
      import('./flow-node-properties-page.component').then(
        (module) => module.FlowNodePropertiesPageComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/flow-node-properties-overview-page.component').then(
            (module) => module.FlowNodePropertiesOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/flow-node-properties-api-page.component').then(
            (module) => module.FlowNodePropertiesApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/flow-node-properties-styling-page.component').then(
            (module) => module.FlowNodePropertiesStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/flow-node-properties-examples-page.component').then(
            (module) => module.FlowNodePropertiesExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
