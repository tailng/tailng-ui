import type { Routes } from '@angular/router';
import { requireOwnableDocsHref } from '../../../ownable/ownable-docs.data';
import { COMPONENTS_LAYOUT_GROUP, toComponentsDocsRouteData } from '../../component-docs.data';

const group = COMPONENTS_LAYOUT_GROUP;
const tableItem = group.items.find((item) => item.slug === 'table');
if (tableItem === undefined) {
  throw new Error('Missing "table" in components layout docs group.');
}

export const COMPONENTS_LAYOUT_TABLE_ROUTES: Routes = [
  {
    path: '',
    data: toComponentsDocsRouteData(group, tableItem),
    loadComponent: () =>
      import('./table-page.component').then((module) => module.TablePageComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./sections/overview/table-overview-page.component').then(
            (module) => module.TableOverviewPageComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('./sections/api/table-api-page.component').then(
            (module) => module.TableApiPageComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('./sections/styling/table-styling-page.component').then(
            (module) => module.TableStylingPageComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('./sections/examples/table-examples-page.component').then(
            (module) => module.TableExamplesPageComponent,
          ),
      },
      {
        path: 'ownable-install',
        data: { registrySlug: 'table' },
        pathMatch: 'full',
        redirectTo: requireOwnableDocsHref('table'),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
