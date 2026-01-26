import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
  {
    path: 'layout/accordion',
    loadComponent: () =>
      import('../pages/components/layout/accordion/accordion-docs.component').then(
        (m) => m.AccordionDocsComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/layout/accordion/overview/overview.component').then(
            (m) => m.AccordionOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/layout/accordion/api/api.component').then(
            (m) => m.AccordionApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/layout/accordion/styling/styling.component').then(
            (m) => m.AccordionStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/layout/accordion/examples/examples.component').then(
            (m) => m.AccordionExamplesComponent,
          ),
      },
    ],
    data: { title: 'Accordion – tailng', description: 'Accordion component for collapsible content.' },
  },
  {
    path: 'layout/card',
    loadComponent: () =>
      import('../pages/components/layout/card/card-docs.component').then((m) => m.CardDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/layout/card/overview/overview.component').then(
            (m) => m.CardOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/layout/card/api/api.component').then((m) => m.CardApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/layout/card/styling/styling.component').then(
            (m) => m.CardStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/layout/card/examples/examples.component').then(
            (m) => m.CardExamplesComponent,
          ),
      },
    ],
    data: { title: 'Card – tailng', description: 'Card component for layouts.' },
  },
  {
    path: 'layout/divider',
    loadComponent: () =>
      import('../pages/components/layout/divider/divider-docs.component').then((m) => m.DividerDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/layout/divider/overview/overview.component').then(
            (m) => m.DividerOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/layout/divider/api/api.component').then((m) => m.DividerApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/layout/divider/styling/styling.component').then(
            (m) => m.DividerStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/layout/divider/examples/examples.component').then(
            (m) => m.DividerExamplesComponent,
          ),
      },
    ],
    data: { title: 'Divider – tailng', description: 'Divider component for layouts.' },
  },
  {
    path: 'layout/expansion-panel',
    loadComponent: () =>
      import('../pages/components/layout/expansion-panel/expansion-panel-docs.component').then(
        (m) => m.ExpansionPanelDocsComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/layout/expansion-panel/overview/overview.component').then(
            (m) => m.ExpansionPanelOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/layout/expansion-panel/api/api.component').then(
            (m) => m.ExpansionPanelApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/layout/expansion-panel/styling/styling.component').then(
            (m) => m.ExpansionPanelStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/layout/expansion-panel/examples/examples.component').then(
            (m) => m.ExpansionPanelExamplesComponent,
          ),
      },
    ],
    data: { title: 'Expansion Panel – tailng', description: 'Expansion panel component.' },
  },
  {
    path: 'layout/tabs',
    loadComponent: () =>
      import('../pages/components/layout/tabs/tabs-docs.component').then((m) => m.TabsDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/layout/tabs/overview/overview.component').then(
            (m) => m.TabsOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/layout/tabs/api/api.component').then((m) => m.TabsApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/layout/tabs/styling/styling.component').then(
            (m) => m.TabsStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/layout/tabs/examples/examples.component').then(
            (m) => m.TabsExamplesComponent,
          ),
      },
    ],
    data: { title: 'Tabs – tailng', description: 'Tabs component for switching views.' },
  },
];
