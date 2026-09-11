import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const defaultFlowItem = group.items[0];
if (defaultFlowItem === undefined) {
  throw new Error('Components flow docs group must include at least one item.');
}

const flowEditorItem = group.items.find((item) => item.slug === 'flow-editor');
if (flowEditorItem === undefined) {
  throw new Error('Missing "flow-editor" in components flow docs group.');
}

const flowWorkbenchItem = group.items.find((item) => item.slug === 'flow-workbench');
if (flowWorkbenchItem === undefined) {
  throw new Error('Missing "flow-workbench" in components flow docs group.');
}

const flowExecutionGraphItem = group.items.find((item) => item.slug === 'flow-execution-graph');
if (flowExecutionGraphItem === undefined) {
  throw new Error('Missing "flow-execution-graph" in components flow docs group.');
}

const flowNodePropertiesItem = group.items.find((item) => item.slug === 'flow-node-properties');
if (flowNodePropertiesItem === undefined) {
  throw new Error('Missing "flow-node-properties" in components flow docs group.');
}

export const COMPONENTS_FLOW_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultFlowItem.slug,
  },
  {
    path: flowEditorItem.slug,
    data: toComponentsDocsRouteData(group, flowEditorItem),
    loadChildren: () =>
      import('./flow-editor/routes').then((module) => module.COMPONENTS_FLOW_EDITOR_ROUTES),
  },
  {
    path: flowWorkbenchItem.slug,
    data: toComponentsDocsRouteData(group, flowWorkbenchItem),
    loadChildren: () =>
      import('./flow-workbench/routes').then((module) => module.COMPONENTS_FLOW_WORKBENCH_ROUTES),
  },
  {
    path: flowExecutionGraphItem.slug,
    data: toComponentsDocsRouteData(group, flowExecutionGraphItem),
    loadChildren: () =>
      import('./flow-execution-graph/routes').then(
        (module) => module.COMPONENTS_FLOW_EXECUTION_GRAPH_ROUTES,
      ),
  },
  {
    path: flowNodePropertiesItem.slug,
    data: toComponentsDocsRouteData(group, flowNodePropertiesItem),
    loadChildren: () =>
      import('./flow-node-properties/routes').then(
        (module) => module.COMPONENTS_FLOW_NODE_PROPERTIES_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: defaultFlowItem.slug,
  },
];
