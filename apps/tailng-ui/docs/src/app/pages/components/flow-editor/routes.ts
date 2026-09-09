import type { Routes } from '@angular/router';
import {
  COMPONENTS_FLOW_EDITOR_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsItem,
} from '../component-docs.data';

const group = COMPONENTS_FLOW_EDITOR_GROUP;
const items = Object.fromEntries(group.items.map((item) => [item.slug, item]));

function item(slug: string): ComponentsDocsItem {
  const docsItem = items[slug];
  if (docsItem === undefined) {
    throw new Error(`Missing "${slug}" in Flow Editor docs group.`);
  }
  return docsItem;
}

export const COMPONENTS_FLOW_EDITOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./flow-editor-page.component').then((module) => module.FlowEditorPageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        data: toComponentsDocsRouteData(group, item('overview')),
        loadComponent: () =>
          import('./sections/overview/flow-editor-overview-page.component').then(
            (module) => module.FlowEditorOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        data: toComponentsDocsRouteData(group, item('api')),
        loadComponent: () =>
          import('./sections/api/flow-editor-api-page.component').then(
            (module) => module.FlowEditorApiPageComponent,
          ),
      },
      {
        path: 'layout-dagre',
        data: toComponentsDocsRouteData(group, item('layout-dagre')),
        loadComponent: () =>
          import('./sections/layout-dagre/flow-editor-layout-dagre-page.component').then(
            (module) => module.FlowEditorLayoutDagrePageComponent,
          ),
      },
      {
        path: 'styling',
        data: toComponentsDocsRouteData(group, item('styling')),
        loadComponent: () =>
          import('./sections/styling/flow-editor-styling-page.component').then(
            (module) => module.FlowEditorStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        data: toComponentsDocsRouteData(group, item('examples')),
        loadComponent: () =>
          import(
            './sections/examples/flow-editor-examples-page/flow-editor-examples-page.component'
          ).then((module) => module.FlowEditorExamplesPageComponent),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
