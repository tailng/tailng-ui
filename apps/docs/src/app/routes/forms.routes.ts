import { Routes } from '@angular/router';

export const formsRoutes: Routes = [
  {
    path: 'forms/autocomplete',
    loadComponent: () =>
      import('../pages/components/forms/autocomplete/autocomplete-docs.component').then(
        (m) => m.AutocompleteDocsComponent,
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
          import('../pages/components/forms/autocomplete/overview/overview.component').then(
            (m) => m.AutocompleteOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/autocomplete/api/api.component').then(
            (m) => m.AutocompleteApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/autocomplete/styling/styling.component').then(
            (m) => m.AutocompleteStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/autocomplete/examples/examples.component').then(
            (m) => m.AutocompleteExamplesComponent,
          ),
      },
    ],
    data: { title: 'Autocomplete – tailng', description: 'Autocomplete form control for tailng.' },
  },
  {
    path: 'forms/checkbox',
    loadComponent: () =>
      import('../pages/components/forms/checkbox/checkbox-docs.component').then(
        (m) => m.CheckboxDocsComponent,
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
          import('../pages/components/forms/checkbox/overview/overview.component').then(
            (m) => m.CheckboxOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/checkbox/api/api.component').then(
            (m) => m.CheckboxApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/checkbox/styling/styling.component').then(
            (m) => m.CheckboxStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/checkbox/examples/examples.component').then(
            (m) => m.CheckboxExamplesComponent,
          ),
      },
    ],
    data: { title: 'Checkbox – tailng', description: 'Checkbox form control for tailng.' },
  },
  {
    path: 'forms/chips',
    loadComponent: () =>
      import('../pages/components/forms/chips/chips-docs.component').then((m) => m.ChipsDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/forms/chips/overview/overview.component').then(
            (m) => m.ChipsOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/chips/api/api.component').then((m) => m.ChipsApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/chips/styling/styling.component').then(
            (m) => m.ChipsStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/chips/examples/examples.component').then(
            (m) => m.ChipsExamplesComponent,
          ),
      },
    ],
    data: { title: 'Chips – tailng', description: 'Chips input for tailng.' },
  },
  {
    path: 'forms/datepicker',
    loadComponent: () =>
      import('../pages/components/forms/datepicker/datepicker-docs.component').then(
        (m) => m.DatepickerDocsComponent,
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
          import('../pages/components/forms/datepicker/overview/overview.component').then(
            (m) => m.DatepickerOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/datepicker/api/api.component').then(
            (m) => m.DatepickerApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/datepicker/styling/styling.component').then(
            (m) => m.DatepickerStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/datepicker/examples/examples.component').then(
            (m) => m.DatepickerExamplesComponent,
          ),
      },
    ],
    data: { title: 'Datepicker – tailng', description: 'Datepicker component for tailng.' },
  },
  {
    path: 'forms/timepicker',
    loadComponent: () =>
      import('../pages/components/forms/timepicker/timepicker-docs.component').then(
        (m) => m.TimepickerDocsComponent,
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
          import('../pages/components/forms/timepicker/overview/overview.component').then(
            (m) => m.TimepickerOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/timepicker/api/api.component').then(
            (m) => m.TimepickerApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/timepicker/styling/styling.component').then(
            (m) => m.TimepickerStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/timepicker/examples/examples.component').then(
            (m) => m.TimepickerExamplesComponent,
          ),
      },
    ],
    data: { title: 'Timepicker – tailng', description: 'Timepicker component for tailng.' },
  },
  {
    path: 'forms/form-field',
    loadComponent: () =>
      import('../pages/components/forms/form-field/form-field-docs.component').then(
        (m) => m.FormFieldDocsComponent,
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
          import('../pages/components/forms/form-field/overview/overview.component').then(
            (m) => m.FormFieldOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/form-field/api/api.component').then(
            (m) => m.FormFieldApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/form-field/styling/styling.component').then(
            (m) => m.FormFieldStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/form-field/examples/examples.component').then(
            (m) => m.FormFieldExamplesComponent,
          ),
      },
    ],
    data: {
      title: 'Form Field – tailng',
      description: 'Form field wrapper: label, hint, errors, prefix/suffix.',
    },
  },
  {
    path: 'forms/text-input',
    loadComponent: () =>
      import('../pages/components/forms/text-input/text-input-docs.component').then(
        (m) => m.TextInputDocsComponent,
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
          import('../pages/components/forms/text-input/overview/overview.component').then(
            (m) => m.TextInputOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/text-input/api/api.component').then(
            (m) => m.TextInputApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/text-input/styling/styling.component').then(
            (m) => m.TextInputStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/text-input/examples/examples.component').then(
            (m) => m.TextInputExamplesComponent,
          ),
      },
    ],
    data: { title: 'Text Input – tailng', description: 'Text input control for tailng.' },
  },
  {
    path: 'forms/number-input',
    loadComponent: () =>
      import('../pages/components/forms/number-input/number-input-docs.component').then(
        (m) => m.NumberInputDocsComponent,
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
          import('../pages/components/forms/number-input/overview/overview.component').then(
            (m) => m.NumberInputOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/number-input/api/api.component').then(
            (m) => m.NumberInputApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/number-input/styling/styling.component').then(
            (m) => m.NumberInputStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/number-input/examples/examples.component').then(
            (m) => m.NumberInputExamplesComponent,
          ),
      },
    ],
    data: { title: 'Number Input – tailng', description: 'Number input control for tailng.' },
  },
  {
    path: 'forms/textarea',
    loadComponent: () =>
      import('../pages/components/forms/textarea/textarea-docs.component').then(
        (m) => m.TextareaDocsComponent,
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
          import('../pages/components/forms/textarea/overview/overview.component').then(
            (m) => m.TextareaOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/textarea/api/api.component').then(
            (m) => m.TextareaApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/textarea/styling/styling.component').then(
            (m) => m.TextareaStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/textarea/examples/examples.component').then(
            (m) => m.TextareaExamplesComponent,
          ),
      },
    ],
    data: { title: 'Textarea – tailng', description: 'Textarea control for tailng.' },
  },
  {
    path: 'forms/file-upload',
    loadComponent: () =>
      import('../pages/components/forms/file-upload/file-upload-docs.component').then(
        (m) => m.FileUploadDocsComponent,
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
          import('../pages/components/forms/file-upload/overview/overview.component').then(
            (m) => m.FileUploadOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/file-upload/api/api.component').then(
            (m) => m.FileUploadApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/file-upload/styling/styling.component').then(
            (m) => m.FileUploadStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/file-upload/examples/examples.component').then(
            (m) => m.FileUploadExamplesComponent,
          ),
      },
    ],
    data: { title: 'File Upload – tailng', description: 'File upload control for tailng.' },
  },
  {
    path: 'forms/radio-button',
    loadComponent: () =>
      import('../pages/components/forms/radio-button/radio-button-docs.component').then(
        (m) => m.RadioButtonDocsComponent,
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
          import('../pages/components/forms/radio-button/overview/overview.component').then(
            (m) => m.RadioButtonOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/radio-button/api/api.component').then(
            (m) => m.RadioButtonApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/radio-button/styling/styling.component').then(
            (m) => m.RadioButtonStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/radio-button/examples/examples.component').then(
            (m) => m.RadioButtonExamplesComponent,
          ),
      },
    ],
    data: { title: 'Radio Button – tailng', description: 'Radio button control for tailng.' },
  },
  {
    path: 'forms/select',
    loadComponent: () =>
      import('../pages/components/forms/select/select-docs.component').then((m) => m.SelectDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/forms/select/overview/overview.component').then(
            (m) => m.SelectOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/select/api/api.component').then((m) => m.SelectApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/select/styling/styling.component').then(
            (m) => m.SelectStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/select/examples/examples.component').then(
            (m) => m.SelectExamplesComponent,
          ),
      },
    ],
    data: { title: 'Select – tailng', description: 'Select control for tailng.' },
  },
  {
    path: 'forms/slider',
    loadComponent: () =>
      import('../pages/components/forms/slider/slider-docs.component').then((m) => m.SliderDocsComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../pages/components/forms/slider/overview/overview.component').then(
            (m) => m.SliderOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/slider/api/api.component').then((m) => m.SliderApiComponent),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/slider/styling/styling.component').then(
            (m) => m.SliderStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/slider/examples/examples.component').then(
            (m) => m.SliderExamplesComponent,
          ),
      },
    ],
    data: { title: 'Slider – tailng', description: 'Slider control for tailng.' },
  },
  {
    path: 'forms/slide-toggle',
    loadComponent: () =>
      import('../pages/components/forms/slide-toggle/slide-toggle-docs.component').then(
        (m) => m.SlideToggleDocsComponent,
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
          import('../pages/components/forms/slide-toggle/overview/overview.component').then(
            (m) => m.SlideToggleOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/slide-toggle/api/api.component').then(
            (m) => m.SlideToggleApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/slide-toggle/styling/styling.component').then(
            (m) => m.SlideToggleStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/slide-toggle/examples/examples.component').then(
            (m) => m.SlideToggleExamplesComponent,
          ),
      },
    ],
    data: { title: 'Slide Toggle – tailng', description: 'Slide toggle control for tailng.' },
  },
  // NOTE: category route is /buttons/button-toggle, keep it under /components/buttons/button-toggle
  {
    path: 'buttons/button-toggle',
    loadComponent: () =>
      import('../pages/components/forms/button-toggle/button-toggle-docs.component').then(
        (m) => m.ButtonToggleDocsComponent,
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
          import('../pages/components/forms/button-toggle/overview/overview.component').then(
            (m) => m.ButtonToggleOverviewComponent,
          ),
      },
      {
        path: 'api',
        loadComponent: () =>
          import('../pages/components/forms/button-toggle/api/api.component').then(
            (m) => m.ButtonToggleApiComponent,
          ),
      },
      {
        path: 'styling',
        loadComponent: () =>
          import('../pages/components/forms/button-toggle/styling/styling.component').then(
            (m) => m.ButtonToggleStylingComponent,
          ),
      },
      {
        path: 'examples',
        loadComponent: () =>
          import('../pages/components/forms/button-toggle/examples/examples.component').then(
            (m) => m.ButtonToggleExamplesComponent,
          ),
      },
    ],
    data: { title: 'Button Toggle – tailng', description: 'Button toggle control for tailng.' },
  },
];
