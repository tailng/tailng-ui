import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const flowExecutionViewerItem = group.items.find((item) => item.slug === 'flow-execution-viewer');
if (flowExecutionViewerItem === undefined) {
  throw new Error('Missing "flow-execution-viewer" in components flow docs group.');
}

export const COMPONENTS_FLOW_EXECUTION_VIEWER_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, flowExecutionViewerItem),
    loadComponent: () =>
      import('./flow-execution-viewer-page.component').then(
        (module) => module.FlowExecutionViewerPageComponent,
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
          import('./sections/overview/flow-execution-viewer-overview-page.component').then(
            (module) => module.FlowExecutionViewerOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/flow-execution-viewer-api-page.component').then(
            (module) => module.FlowExecutionViewerApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/flow-execution-viewer-styling-page.component').then(
            (module) => module.FlowExecutionViewerStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/flow-execution-viewer-examples-page.component').then(
            (module) => module.FlowExecutionViewerExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
