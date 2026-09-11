import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const flowExecutionGraphItem = group.items.find((item) => item.slug === 'flow-execution-graph');
if (flowExecutionGraphItem === undefined) {
  throw new Error('Missing "flow-execution-graph" in components flow docs group.');
}

export const COMPONENTS_FLOW_EXECUTION_GRAPH_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, flowExecutionGraphItem),
    loadComponent: () =>
      import('./flow-execution-graph-page.component').then(
        (module) => module.FlowExecutionGraphPageComponent,
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
          import('./sections/overview/flow-execution-graph-overview-page.component').then(
            (module) => module.FlowExecutionGraphOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/flow-execution-graph-api-page.component').then(
            (module) => module.FlowExecutionGraphApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/flow-execution-graph-styling-page.component').then(
            (module) => module.FlowExecutionGraphStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/flow-execution-graph-examples-page.component').then(
            (module) => module.FlowExecutionGraphExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
