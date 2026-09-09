import type { Routes } from '@angular/router';
import {
  COMPONENTS_FLOW_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsItem,
} from '../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const items = Object.fromEntries(group.items.map((item) => [item.slug, item]));

function item(slug: string): ComponentsDocsItem {
  const docsItem = items[slug];
  if (docsItem === undefined) {
    throw new Error(`Missing "${slug}" in components flow docs group.`);
  }
  return docsItem;
}

export const COMPONENTS_FLOW_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'flow-editor',
  },
  {
    path: 'flow-editor',
    data: toComponentsDocsRouteData(group, item('flow-editor')),
    loadChildren: () =>
      import('./flow-editor/routes').then((module) => module.COMPONENTS_FLOW_FLOW_EDITOR_ROUTES),
  },
  {
    path: 'layout-dagre',
    data: toComponentsDocsRouteData(group, item('layout-dagre')),
    loadChildren: () =>
      import('./layout-dagre/routes').then((module) => module.COMPONENTS_FLOW_LAYOUT_DAGRE_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'flow-editor',
  },
];
