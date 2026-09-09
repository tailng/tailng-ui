import type { Routes } from '@angular/router';
import { COMPONENTS_FLOW_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_FLOW_GROUP;
const layoutDagreItem = group.items.find((item) => item.slug === 'layout-dagre');
if (layoutDagreItem === undefined) {
  throw new Error('Missing "layout-dagre" in components flow docs group.');
}

export const COMPONENTS_FLOW_LAYOUT_DAGRE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, layoutDagreItem),
    loadComponent: () =>
      import('./layout-dagre-page.component').then((module) => module.LayoutDagrePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/layout-dagre-overview-page.component').then(
            (module) => module.LayoutDagreOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/layout-dagre-api-page.component').then(
            (module) => module.LayoutDagreApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/layout-dagre-styling-page.component').then(
            (module) => module.LayoutDagreStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/layout-dagre-examples-page.component').then(
            (module) => module.LayoutDagreExamplesPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
