import { Routes } from '@angular/router';

export const routes: Routes = [
  // -------------------------
  // Project Home (Overview)
  // -------------------------
  {
    path: '',
    loadComponent: () =>
      import('./layout/project-shell/project-shell.component').then((m) => m.ProjectShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/project/home/home.component').then((m) => m.HomeComponent),
        data: {
          title: 'tailng — Scalability of Angular. Simplicity of Tailwind.',
          description: 'tailng is an open-source Angular component library built with Tailwind CSS.',
        },
      },
    ],
  },

  // -------------------------
  // Installation (Guides)
  // -------------------------
  {
    path: 'installation',
    loadComponent: () =>
      import('./layout/docs-shell/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/installation/installation/installation.component').then((m) => m.InstallationComponent),
        data: { title: 'Installation – tailng', description: 'Install tailng and get started quickly.' },
      },
      {
        path: 'tailwind-setup',
        loadComponent: () =>
          import('./pages/installation/tailwind-setup/tailwind-setup.component').then((m) => m.TailwindSetupComponent),
        data: { title: 'Tailwind Setup – tailng', description: 'Configure Tailwind for tailng.' },
      },
      {
        path: 'quick-start',
        loadComponent: () =>
          import('./pages/installation/quick-start/quick-start.component').then((m) => m.QuickStartComponent),
        data: { title: 'Quick Start – tailng', description: 'Use tailng components in minutes.' },
      },
    ],
  },

  // -------------------------
  // Components (Docs Area)
  // -------------------------
  {
    path: 'components',
    loadComponent: () =>
      import('./layout/docs-shell/docs-shell.component').then((m) => m.DocsShellComponent),
    children: [
      // /components (intro + left menu)
      {
        path: '',
        loadComponent: () =>
          import('./pages/components/components-home/components-home.component').then(
            (m) => m.ComponentsHomeComponent,
          ),
        data: {
          title: 'Components – tailng',
          description: 'Browse tailng components, examples, and usage guidelines.',
        },
      },

      // ============================================================
      // Component Routes (all live under ./pages/components/**)
      // ============================================================

      // -------------------------
      // Form Controls
      // -------------------------
      {
        path: 'forms/autocomplete',
        loadComponent: () =>
          import('./pages/components/forms/autocomplete/autocomplete-docs.component').then(
            (m) => m.AutocompleteDocsComponent,
          ),
        data: { title: 'Autocomplete – tailng', description: 'Autocomplete form control for tailng.' },
      },
      {
        path: 'forms/checkbox',
        loadComponent: () =>
          import('./pages/components/forms/checkbox/checkbox-docs.component').then(
            (m) => m.CheckboxDocsComponent,
          ),
        data: { title: 'Checkbox – tailng', description: 'Checkbox form control for tailng.' },
      },
      {
        path: 'forms/chips',
        loadComponent: () =>
          import('./pages/components/forms/chips/chips-docs.component').then((m) => m.ChipsDocsComponent),
        data: { title: 'Chips – tailng', description: 'Chips input for tailng.' },
      },
      {
        path: 'forms/datepicker',
        loadComponent: () =>
          import('./pages/components/forms/datepicker/datepicker-docs.component').then(
            (m) => m.DatepickerDocsComponent,
          ),
        data: { title: 'Datepicker – tailng', description: 'Datepicker component for tailng.' },
      },
      {
        path: 'forms/timepicker',
        loadComponent: () =>
          import('./pages/components/forms/timepicker/timepicker-docs.component').then(
            (m) => m.TimepickerDocsComponent,
          ),
        data: { title: 'Timepicker – tailng', description: 'Timepicker component for tailng.' },
      },
      {
        path: 'forms/form-field',
        loadComponent: () =>
          import('./pages/components/forms/form-field/form-field-docs.component').then(
            (m) => m.FormFieldDocsComponent,
          ),
        data: {
          title: 'Form Field – tailng',
          description: 'Form field wrapper: label, hint, errors, prefix/suffix.',
        },
      },
      {
        path: 'forms/text-input',
        loadComponent: () =>
          import('./pages/components/forms/text-input/text-input-docs.component').then(
            (m) => m.TextInputDocsComponent,
          ),
        data: { title: 'Text Input – tailng', description: 'Text input control for tailng.' },
      },
      {
        path: 'forms/number-input',
        loadComponent: () =>
          import('./pages/components/forms/number-input/number-input-docs.component').then(
            (m) => m.NumberInputDocsComponent,
          ),
        data: { title: 'Number Input – tailng', description: 'Number input control for tailng.' },
      },
      {
        path: 'forms/textarea',
        loadComponent: () =>
          import('./pages/components/forms/textarea/textarea-docs.component').then(
            (m) => m.TextareaDocsComponent,
          ),
        data: { title: 'Textarea – tailng', description: 'Textarea control for tailng.' },
      },
      {
        path: 'forms/file-upload',
        loadComponent: () =>
          import('./pages/components/forms/file-upload/file-upload-docs.component').then(
            (m) => m.FileUploadDocsComponent,
          ),
        data: { title: 'File Upload – tailng', description: 'File upload control for tailng.' },
      },
      {
        path: 'forms/radio-button',
        loadComponent: () =>
          import('./pages/components/forms/radio-button/radio-button-docs.component').then(
            (m) => m.RadioButtonDocsComponent,
          ),
        data: { title: 'Radio Button – tailng', description: 'Radio button control for tailng.' },
      },
      {
        path: 'forms/select',
        loadComponent: () =>
          import('./pages/components/forms/select/select-docs.component').then((m) => m.SelectDocsComponent),
        data: { title: 'Select – tailng', description: 'Select control for tailng.' },
      },
      {
        path: 'forms/slider',
        loadComponent: () =>
          import('./pages/components/forms/slider/slider-docs.component').then((m) => m.SliderDocsComponent),
        data: { title: 'Slider – tailng', description: 'Slider control for tailng.' },
      },
      {
        path: 'forms/slide-toggle',
        loadComponent: () =>
          import('./pages/components/forms/slide-toggle/slide-toggle-docs.component').then(
            (m) => m.SlideToggleDocsComponent,
          ),
        data: { title: 'Slide Toggle – tailng', description: 'Slide toggle control for tailng.' },
      },

      // NOTE: category route is /buttons/button-toggle, keep it under /components/buttons/button-toggle
      {
        path: 'buttons/button-toggle',
        loadComponent: () =>
          import('./pages/components/forms/button-toggle/button-toggle-docs.component').then(
            (m) => m.ButtonToggleDocsComponent,
          ),
        data: { title: 'Button Toggle – tailng', description: 'Button toggle control for tailng.' },
      },

      // -------------------------
      // Buttons & Indicators
      // -------------------------
      {
        path: 'buttons/button',
        loadComponent: () =>
          import('./pages/components/buttons/button/button-docs.component').then((m) => m.ButtonDocsComponent),
        data: { title: 'Button – tailng', description: 'Button component: variants, sizes, loading, icons.' },
      },
      {
        path: 'buttons/badge',
        loadComponent: () =>
          import('./pages/components/buttons/badge/badge-docs.component').then((m) => m.BadgeDocsComponent),
        data: { title: 'Badge – tailng', description: 'Badge component for tailng.' },
      },
      {
        path: 'buttons/icon',
        loadComponent: () =>
          import('./pages/components/buttons/icon/icon-docs.component').then((m) => m.IconDocsComponent),
        data: { title: 'Icon – tailng', description: 'Icon component for tailng.' },
      },
      {
        path: 'buttons/ripples',
        loadComponent: () =>
          import('./pages/components/buttons/ripples/ripples-docs.component').then((m) => m.RipplesDocsComponent),
        data: { title: 'Ripples – tailng', description: 'Ripple effect for tailng components.' },
      },
      {
        path: 'buttons/progress-bar',
        loadComponent: () =>
          import('./pages/components/buttons/progress-bar/progress-bar-docs.component').then((m) => m.ProgressBarDocsComponent),
        data: { title: 'Progress Bar – tailng', description: 'Progress bar indicator for tailng.' },
      },
      {
        path: 'buttons/progress-spinner',
        loadComponent: () =>
          import('./pages/components/buttons/progress-spinner/progress-spinner-docs.component').then(
            (m) => m.ProgressSpinnerDocsComponent,
          ),
        data: { title: 'Progress Spinner – tailng', description: 'Progress spinner indicator for tailng.' },
      },
      {
        path: 'buttons/skeleton',
        loadComponent: () =>
          import('./pages/components/buttons/skeleton/skeleton-docs.component').then((m) => m.SkeletonDocsComponent),
        data: { title: 'Skeleton – tailng', description: 'Skeleton loading placeholder for tailng.' },
      },

      // -------------------------
      // Layout
      // -------------------------
      {
        path: 'layout/card',
        loadComponent: () =>
          import('./pages/components/layout/card/card-docs.component').then((m) => m.CardDocsComponent),
        data: { title: 'Card – tailng', description: 'Card component for layouts.' },
      },
      {
        path: 'layout/divider',
        loadComponent: () =>
          import('./pages/components/layout/divider/divider-docs.component').then((m) => m.DividerDocsComponent),
        data: { title: 'Divider – tailng', description: 'Divider component for layouts.' },
      },
      {
        path: 'layout/expansion-panel',
        loadComponent: () =>
          import('./pages/components/layout/expansion-panel/expansion-panel-docs.component').then(
            (m) => m.ExpansionPanelDocsComponent,
          ),
        data: { title: 'Expansion Panel – tailng', description: 'Expansion panel component.' },
      },
      {
        path: 'layout/tabs',
        loadComponent: () =>
          import('./pages/components/layout/tabs/tabs-docs.component').then((m) => m.TabsDocsComponent),
        data: { title: 'Tabs – tailng', description: 'Tabs component for switching views.' },
      },
      {
        path: 'layout/accordion',
        loadComponent: () =>
          import('./pages/components/layout/accordion/accordion-docs.component').then((m) => m.AccordionDocsComponent),
        data: { title: 'Accordion – tailng', description: 'Accordion component for collapsible content.' },
      },

      // -------------------------
      // Navigation
      // -------------------------
      {
        path: 'navigation/menu',
        loadComponent: () =>
          import('./pages/components/navigation/menu/menu-docs.component').then((m) => m.MenuDocsComponent),
        data: { title: 'Menu – tailng', description: 'Menu component for navigation and actions.' },
      },
      {
        path: 'navigation/sidenav',
        loadComponent: () =>
          import('./pages/components/navigation/sidenav/sidenav-docs.component').then((m) => m.SidenavDocsComponent),
        data: { title: 'Sidenav – tailng', description: 'Sidenav component for app layouts.' },
      },
      {
        path: 'navigation/drawer',
        loadComponent: () =>
          import('./pages/components/navigation/drawer/drawer-docs.component').then((m) => m.DrawerDocsComponent),
        data: { title: 'Drawer – tailng', description: 'Drawer component for overlays and navigation.' },
      },
      {
        path: 'navigation/stepper',
        loadComponent: () =>
          import('./pages/components/navigation/stepper/stepper-docs.component').then((m) => m.StepperDocsComponent),
        data: { title: 'Stepper – tailng', description: 'Stepper component for multi-step flows.' },
      },
      {
        path: 'navigation/paginator',
        loadComponent: () =>
          import('./pages/components/navigation/paginator/paginator-docs.component').then((m) => m.PaginatorDocsComponent),
        data: { title: 'Paginator – tailng', description: 'Paginator component for lists and tables.' },
      },
      {
        path: 'navigation/breadcrumbs',
        loadComponent: () =>
          import('./pages/components/navigation/breadcrumbs/breadcrumbs-docs.component').then((m) => m.BreadcrumbsDocsComponent),
        data: { title: 'Breadcrumbs – tailng', description: 'Breadcrumbs for hierarchical navigation.' },
      },

      // -------------------------
      // Popups & Overlays
      // -------------------------
      {
        path: 'overlay/dialog',
        loadComponent: () =>
          import('./pages/components/overlay/dialog/dialog-docs.component').then((m) => m.DialogDocsComponent),
        data: { title: 'Dialog – tailng', description: 'Dialog component for modal interactions.' },
      },
      {
        path: 'overlay/snackbar',
        loadComponent: () =>
          import('./pages/components/overlay/snackbar/snackbar-docs.component').then((m) => m.SnackbarDocsComponent),
        data: { title: 'Snackbar – tailng', description: 'Snackbar notifications for tailng.' },
      },
      {
        path: 'overlay/tooltip',
        loadComponent: () =>
          import('./pages/components/overlay/tooltip/tooltip-docs.component').then((m) => m.TooltipDocsComponent),
        data: { title: 'Tooltip – tailng', description: 'Tooltip component for contextual hints.' },
      },
      {
        path: 'overlay/popover',
        loadComponent: () =>
          import('./pages/components/overlay/popover/popover-docs.component').then((m) => m.PopoverDocsComponent),
        data: { title: 'Popover – tailng', description: 'Popover component for anchored overlays.' },
      },

      // -------------------------
      // Overlay Primitives (internal)
      // -------------------------
      {
        path: 'overlay-primitives/connected-overlay',
        loadComponent: () =>
          import('./pages/components/overlay-primitives/connected-overlay/connected-overlay-docs.component').then(
            (m) => m.ConnectedOverlayDocsComponent,
          ),
        data: {
          title: 'Connected Overlay – tailng',
          description: 'Internal overlay primitive used by overlay components.',
        },
      },
      {
        path: 'overlay-primitives/option-list',
        loadComponent: () =>
          import('./pages/components/overlay-primitives/option-list/option-list-docs.component').then(
            (m) => m.OptionListDocsComponent,
          ),
        data: { title: 'Option List – tailng', description: 'Internal option list primitive used by selection components.' },
      },

      // -------------------------
      // Data Table & Structure
      // -------------------------
      {
        path: 'data/table',
        loadComponent: () => import('./pages/components/data/table/table-docs.component').then((m) => m.TableDocsComponent),
        data: { title: 'Table – tailng', description: 'Basic data table component.' },
      },
      {
        path: 'data/sort-header',
        loadComponent: () =>
          import('./pages/components/data/sort-header/sort-header-docs.component').then((m) => m.SortHeaderDocsComponent),
        data: { title: 'Sort Header – tailng', description: 'Sortable header for tables.' },
      },
      {
        path: 'data/filter-header',
        loadComponent: () =>
          import('./pages/components/data/filter-header/filter-header-docs.component').then((m) => m.FilterHeaderDocsComponent),
        data: { title: 'Filter Header – tailng', description: 'Filter header for tables and lists.' },
      },
      {
        path: 'data/tree',
        loadComponent: () => import('./pages/components/data/tree/tree-docs.component').then((m) => m.TreeDocsComponent),
        data: { title: 'Tree – tailng', description: 'Tree component for hierarchical data.' },
      },
      {
        path: 'data/virtual-scroll',
        loadComponent: () =>
          import('./pages/components/data/virtual-scroll/virtual-scroll-docs.component').then((m) => m.VirtualScrollDocsComponent),
        data: { title: 'Virtual Scroll – tailng', description: 'Virtual scrolling for large lists.' },
      },
      {
        path: 'data/empty-state',
        loadComponent: () =>
          import('./pages/components/data/empty-state/empty-state-docs.component').then((m) => m.EmptyStateDocsComponent),
        data: { title: 'Empty State – tailng', description: 'Empty state component for no-data situations.' },
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
