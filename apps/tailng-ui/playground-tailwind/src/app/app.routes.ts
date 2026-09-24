import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layout/playground-layout.component').then(
        (module) => module.PlaygroundLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home-page.component').then((module) => module.HomePageComponent),
      },
      {
        path: 'theme',
        loadComponent: () =>
          import('./pages/theme/theme-playground-page.component').then(
            (module) => module.ThemePlaygroundPageComponent,
          ),
      },
      {
        path: 'button',
        loadComponent: () =>
          import('./pages/primitives/button-demo/button-playground-page.component').then(
            (module) => module.ButtonPlaygroundPageComponent,
          ),
      },
      {
        path: 'copy',
        loadComponent: () =>
          import('./pages/primitives/copy-demo/copy-playground-page.component').then(
            (module) => module.CopyPlaygroundPageComponent,
          ),
      },
      {
        path: 'code-block',
        loadComponent: () =>
          import('./pages/primitives/code-block-demo/code-block-playground-page.component').then(
            (module) => module.CodeBlockPlaygroundPageComponent,
          ),
      },
      {
        path: 'accordion',
        loadComponent: () =>
          import('./pages/components/accordion-demo/accordion-playground-page.component').then(
            (module) => module.AccordionPlaygroundPageComponent,
          ),
      },
      {
        path: 'collapsible',
        loadComponent: () =>
          import('./pages/components/collapsible-demo/collapsible-playground-page.component').then(
            (module) => module.CollapsiblePlaygroundPageComponent,
          ),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./pages/components/menu-demo/menu-playground-page.component').then(
            (module) => module.MenuPlaygroundPageComponent,
          ),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () =>
          import(
            './pages/components/dropdown-menu-demo/dropdown-menu-playground-page.component'
          ).then((module) => module.DropdownMenuPlaygroundPageComponent),
      },
      {
        path: 'avatar',
        loadComponent: () =>
          import('./pages/primitives/avatar-demo/avatar-playground-page.component').then(
            (module) => module.AvatarPlaygroundPageComponent,
          ),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./pages/primitives/card-demo/card-playground-page.component').then(
            (module) => module.CardPlaygroundPageComponent,
          ),
      },
      {
        path: 'tag',
        loadComponent: () =>
          import('./pages/primitives/tag-demo/tag-playground-page.component').then(
            (module) => module.TagPlaygroundPageComponent,
          ),
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./pages/primitives/badge-demo/badge-playground-page.component').then(
            (module) => module.BadgePlaygroundPageComponent,
          ),
      },
      {
        path: 'separator',
        loadComponent: () =>
          import('./pages/primitives/separator-demo/separator-playground-page.component').then(
            (module) => module.SeparatorPlaygroundPageComponent,
          ),
      },
      {
        path: 'empty',
        loadComponent: () =>
          import('./pages/primitives/empty-demo/empty-playground-page.component').then(
            (module) => module.EmptyPlaygroundPageComponent,
          ),
      },
      {
        path: 'progress-bar',
        loadComponent: () =>
          import(
            './pages/primitives/progress-bar-demo/progress-bar-playground-page.component'
          ).then((module) => module.ProgressBarPlaygroundPageComponent),
      },
      {
        path: 'confetti',
        loadComponent: () =>
          import('./pages/components/confetti-demo/confetti-playground-page.component').then(
            (module) => module.ConfettiPlaygroundPageComponent,
          ),
      },
      {
        path: 'progress-spinner',
        loadComponent: () =>
          import(
            './pages/primitives/progress-spinner-demo/progress-spinner-playground-page.component'
          ).then((module) => module.ProgressSpinnerPlaygroundPageComponent),
      },
      {
        path: 'skeleton',
        loadComponent: () =>
          import('./pages/primitives/skeleton-demo/skeleton-playground-page.component').then(
            (module) => module.SkeletonPlaygroundPageComponent,
          ),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./pages/primitives/input-demo/input-playground-page.component').then(
            (module) => module.InputPlaygroundPageComponent,
          ),
      },
      {
        path: 'label',
        loadComponent: () =>
          import('./pages/primitives/label-demo/label-playground-page.component').then(
            (module) => module.LabelPlaygroundPageComponent,
          ),
      },
      {
        path: 'input-otp',
        loadComponent: () =>
          import('./pages/components/input-otp-demo/input-otp-playground-page.component').then(
            (module) => module.InputOtpPlaygroundPageComponent,
          ),
      },
      {
        path: 'radio',
        loadComponent: () =>
          import('./pages/primitives/radio-demo/radio-playground-page.component').then(
            (module) => module.RadioPlaygroundPageComponent,
          ),
      },
      {
        path: 'checkbox',
        loadComponent: () =>
          import('./pages/primitives/checkbox-demo/checkbox-playground-page.component').then(
            (module) => module.CheckboxPlaygroundPageComponent,
          ),
      },
      {
        path: 'textarea',
        loadComponent: () =>
          import('./pages/primitives/textarea-demo/textarea-playground-page.component').then(
            (module) => module.TextareaPlaygroundPageComponent,
          ),
      },
      {
        path: 'code-editor',
        loadComponent: () =>
          import('./pages/primitives/code-editor-demo/code-editor-playground-page.component').then(
            (module) => module.CodeEditorPlaygroundPageComponent,
          ),
      },
      {
        path: 'listbox',
        loadComponent: () =>
          import('./pages/primitives/listbox-demo/listbox-playground-page.component').then(
            (module) => module.ListboxPlaygroundPageComponent,
          ),
      },
      {
        path: 'dialog',
        loadComponent: () =>
          import('./pages/components/dialog-demo/dialog-playground-page.component').then(
            (module) => module.DialogPlaygroundPageComponent,
          ),
      },
      {
        path: 'popover',
        loadComponent: () =>
          import('./pages/components/popover-demo/popover-playground-page.component').then(
            (module) => module.PopoverPlaygroundPageComponent,
          ),
      },
      {
        path: 'datepicker',
        loadComponent: () =>
          import('./pages/components/datepicker-demo/datepicker-playground-page.component').then(
            (module) => module.DatepickerPlaygroundPageComponent,
          ),
      },
      {
        path: 'tooltip',
        loadComponent: () =>
          import('./pages/components/tooltip-demo/tooltip-playground-page.component').then(
            (module) => module.TooltipPlaygroundPageComponent,
          ),
      },
      {
        path: 'toast',
        loadComponent: () =>
          import('./pages/components/toast-demo/toast-playground-page.component').then(
            (module) => module.ToastPlaygroundPageComponent,
          ),
      },
      {
        path: 'icons',
        loadComponent: () =>
          import('./pages/icons/icon-demo/icon-playground-page.component').then(
            (module) => module.IconPlaygroundPageComponent,
          ),
      },
      {
        path: 'context-menu',
        loadComponent: () =>
          import(
            './pages/components/context-menu-demo/context-menu-playground-page.component'
          ).then((module) => module.ContextMenuPlaygroundPageComponent),
      },
      {
        path: 'menubar',
        loadComponent: () =>
          import('./pages/components/menubar-demo/menubar-playground-page.component').then(
            (module) => module.MenubarPlaygroundPageComponent,
          ),
      },
      {
        path: 'navigation-menu',
        loadComponent: () =>
          import(
            './pages/components/navigation-menu-demo/navigation-menu-playground-page.component'
          ).then((module) => module.NavigationMenuPlaygroundPageComponent),
      },
      {
        path: 'breadcrumb',
        loadComponent: () =>
          import('./pages/components/breadcrumb-demo/breadcrumb-playground-page.component').then(
            (module) => module.BreadcrumbPlaygroundPageComponent,
          ),
      },
      {
        path: 'toolbar',
        loadComponent: () =>
          import('./pages/components/toolbar-demo/toolbar-playground-page.component').then(
            (module) => module.ToolbarPlaygroundPageComponent,
          ),
      },
      {
        path: 'tabs',
        loadComponent: () =>
          import('./pages/components/tabs-demo/tabs-playground-page.component').then(
            (module) => module.TabsPlaygroundPageComponent,
          ),
      },
      {
        path: 'stepper',
        loadComponent: () =>
          import('./pages/components/stepper-demo/stepper-playground-page.component').then(
            (module) => module.StepperPlaygroundPageComponent,
          ),
      },
      {
        path: 'toggle-group',
        loadComponent: () =>
          import(
            './pages/components/toggle-group-demo/toggle-group-playground-page.component'
          ).then((module) => module.ToggleGroupPlaygroundPageComponent),
      },
      {
        path: 'button-toggle',
        loadComponent: () =>
          import(
            './pages/components/button-toggle-demo/button-toggle-playground-page.component'
          ).then((module) => module.ButtonTogglePlaygroundPageComponent),
      },
      {
        path: 'switch',
        loadComponent: () =>
          import('./pages/components/switch-demo/switch-playground-page.component').then(
            (module) => module.SwitchPlaygroundPageComponent,
          ),
      },
      {
        path: 'toggle',
        loadComponent: () =>
          import('./pages/components/toggle-demo/toggle-playground-page.component').then(
            (module) => module.TogglePlaygroundPageComponent,
          ),
      },
      {
        path: 'slider',
        loadComponent: () =>
          import('./pages/components/slider-demo/slider-playground-page.component').then(
            (module) => module.SliderPlaygroundPageComponent,
          ),
      },
      {
        path: 'chips',
        loadComponent: () =>
          import('./pages/components/chips-demo/chips-playground-page.component').then(
            (module) => module.ChipsPlaygroundPageComponent,
          ),
      },
      {
        path: 'select',
        loadComponent: () =>
          import('./pages/components/select-demo/select-playground-page.component').then(
            (module) => module.SelectPlaygroundPageComponent,
          ),
      },
      {
        path: 'autocomplete',
        loadComponent: () =>
          import(
            './pages/components/autocomplete-demo/autocomplete-playground-page.component'
          ).then((module) => module.AutocompletePlaygroundPageComponent),
      },
      {
        path: 'multi-autocomplete',
        loadComponent: () =>
          import(
            './pages/components/multi-autocomplete-demo/multi-autocomplete-playground-page.component'
          ).then((module) => module.MultiAutocompletePlaygroundPageComponent),
      },
      {
        path: 'multiselect',
        loadComponent: () =>
          import('./pages/components/multiselect-demo/multiselect-playground-page.component').then(
            (module) => module.MultiselectPlaygroundPageComponent,
          ),
      },
      {
        path: 'grid',
        loadComponent: () =>
          import('./pages/components/grid-demo/grid-playground-page.component').then(
            (module) => module.GridPlaygroundPageComponent,
          ),
      },
      {
        path: 'flow-editor',
        loadComponent: () =>
          import('./pages/components/flow-editor-demo/flow-editor-playground-page.component').then(
            (module) => module.FlowEditorPlaygroundPageComponent,
          ),
      },
      {
        path: 'tree',
        loadComponent: () =>
          import('./pages/components/tree-demo/tree-playground-page.component').then(
            (module) => module.TreePlaygroundPageComponent,
          ),
      },
      {
        path: 'drawer',
        loadComponent: () =>
          import('./pages/components/drawer-demo/drawer-playground-page.component').then(
            (module) => module.DrawerPlaygroundPageComponent,
          ),
      },
      {
        path: 'bottom-sheet',
        loadComponent: () =>
          import(
            './pages/components/bottom-sheet-demo/bottom-sheet-playground-page.component'
          ).then((module) => module.BottomSheetPlaygroundPageComponent),
      },
      {
        path: 'charts-country-metrics',
        loadComponent: () =>
          import(
            './pages/charts/country-metrics-demo/country-metrics-chart-playground-page.component'
          ).then((module) => module.CountryMetricsChartPlaygroundPageComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
