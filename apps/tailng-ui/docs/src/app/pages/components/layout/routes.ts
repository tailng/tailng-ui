import type { Routes } from '@angular/router';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const defaultLayoutItem = group.items[0];
if (defaultLayoutItem === undefined) {
  throw new Error('Components layout docs group must include at least one item.');
}

const collapsibleItem = group.items.find((item) => item.slug === 'collapsible');
if (collapsibleItem === undefined) {
  throw new Error('Missing "collapsible" in components layout docs group.');
}

const accordionItem = group.items.find((item) => item.slug === 'accordion');
if (accordionItem === undefined) {
  throw new Error('Missing "accordion" in components layout docs group.');
}

const stepperItem = group.items.find((item) => item.slug === 'stepper');
if (stepperItem === undefined) {
  throw new Error('Missing "stepper" in components layout docs group.');
}

const splitItem = group.items.find((item) => item.slug === 'split');
if (splitItem === undefined) {
  throw new Error('Missing "split" in components layout docs group.');
}

const flowEditorItem = group.items.find((item) => item.slug === 'flow-editor');
if (flowEditorItem === undefined) {
  throw new Error('Missing "flow-editor" in components layout docs group.');
}

const flowExecutionViewerItem = group.items.find((item) => item.slug === 'flow-execution-viewer');
if (flowExecutionViewerItem === undefined) {
  throw new Error('Missing "flow-execution-viewer" in components layout docs group.');
}

const cardItem = group.items.find((item) => item.slug === 'card');
if (cardItem === undefined) {
  throw new Error('Missing "card" in components layout docs group.');
}

const drawerItem = group.items.find((item) => item.slug === 'drawer');
if (drawerItem === undefined) {
  throw new Error('Missing "drawer" in components layout docs group.');
}

const separatorItem = group.items.find((item) => item.slug === 'separator');
if (separatorItem === undefined) {
  throw new Error('Missing "separator" in components layout docs group.');
}

const tableItem = group.items.find((item) => item.slug === 'table');
if (tableItem === undefined) {
  throw new Error('Missing "table" in components layout docs group.');
}

const treeTableItem = group.items.find((item) => item.slug === 'tree-table');
if (treeTableItem === undefined) {
  throw new Error('Missing "tree-table" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultLayoutItem.slug,
  },
  {
    path: collapsibleItem.slug,
    data: toComponentsDocsRouteData(group, collapsibleItem),
    loadChildren: () =>
      import('./collapsible/routes').then((module) => module.COMPONENTS_LAYOUT_COLLAPSIBLE_ROUTES),
  },
  {
    path: accordionItem.slug,
    data: toComponentsDocsRouteData(group, accordionItem),
    loadChildren: () =>
      import('./accordion/routes').then((module) => module.COMPONENTS_LAYOUT_ACCORDION_ROUTES),
  },
  {
    path: stepperItem.slug,
    data: toComponentsDocsRouteData(group, stepperItem),
    loadChildren: () =>
      import('./stepper/routes').then((module) => module.COMPONENTS_LAYOUT_STEPPER_ROUTES),
  },
  {
    path: splitItem.slug,
    data: toComponentsDocsRouteData(group, splitItem),
    loadChildren: () =>
      import('./split/routes').then((module) => module.COMPONENTS_LAYOUT_SPLIT_ROUTES),
  },
  {
    path: flowEditorItem.slug,
    data: toComponentsDocsRouteData(group, flowEditorItem),
    loadChildren: () =>
      import('./flow-editor/routes').then((module) => module.COMPONENTS_LAYOUT_FLOW_EDITOR_ROUTES),
  },
  {
    path: flowExecutionViewerItem.slug,
    data: toComponentsDocsRouteData(group, flowExecutionViewerItem),
    loadChildren: () =>
      import('./flow-execution-viewer/routes').then(
        (module) => module.COMPONENTS_LAYOUT_FLOW_EXECUTION_VIEWER_ROUTES,
      ),
  },
  {
    path: cardItem.slug,
    data: toComponentsDocsRouteData(group, cardItem),
    loadChildren: () =>
      import('./card/routes').then((module) => module.COMPONENTS_LAYOUT_CARD_ROUTES),
  },
  {
    path: drawerItem.slug,
    data: toComponentsDocsRouteData(group, drawerItem),
    loadChildren: () =>
      import('./drawer/routes').then((module) => module.COMPONENTS_LAYOUT_DRAWER_ROUTES),
  },
  {
    path: separatorItem.slug,
    data: toComponentsDocsRouteData(group, separatorItem),
    loadChildren: () =>
      import('./separator/routes').then((module) => module.COMPONENTS_LAYOUT_SEPARATOR_ROUTES),
  },
  {
    path: tableItem.slug,
    data: toComponentsDocsRouteData(group, tableItem),
    loadChildren: () =>
      import('./table/routes').then((module) => module.COMPONENTS_LAYOUT_TABLE_ROUTES),
  },
  {
    path: treeTableItem.slug,
    data: toComponentsDocsRouteData(group, treeTableItem),
    loadChildren: () =>
      import('./tree-table/routes').then((module) => module.COMPONENTS_LAYOUT_TREE_TABLE_ROUTES),
  },
];
