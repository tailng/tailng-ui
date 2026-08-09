import type { Routes } from '@angular/router';
import { COMPONENTS_FORM_GROUP, toComponentsDocsRouteData } from '../component-docs.data';

const group = COMPONENTS_FORM_GROUP;
const defaultItem = group.items[0];
if (defaultItem === undefined) {
  throw new Error('Components form docs are empty.');
}

const inputItem = group.items.find((item) => item.slug === 'input');
if (inputItem === undefined) {
  throw new Error('Missing "input" in components form docs group.');
}
const numberRangeItem = group.items.find((item) => item.slug === 'number-range');
if (numberRangeItem === undefined) {
  throw new Error('Missing "number-range" in components form docs group.');
}
const inputFieldItem = group.items.find((item) => item.slug === 'input-field');
if (inputFieldItem === undefined) {
  throw new Error('Missing "input-field" in components form docs group.');
}
const formFieldItem = group.items.find((item) => item.slug === 'form-field');
if (formFieldItem === undefined) {
  throw new Error('Missing "form-field" in components form docs group.');
}
const datepickerItem = group.items.find((item) => item.slug === 'datepicker');
if (datepickerItem === undefined) {
  throw new Error('Missing "datepicker" in components form docs group.');
}
const dateRangePickerItem = group.items.find((item) => item.slug === 'date-range-picker');
if (dateRangePickerItem === undefined) {
  throw new Error('Missing "date-range-picker" in components form docs group.');
}
const textareaItem = group.items.find((item) => item.slug === 'textarea');
if (textareaItem === undefined) {
  throw new Error('Missing "textarea" in components form docs group.');
}
const inputOtpItem = group.items.find((item) => item.slug === 'input-otp');
if (inputOtpItem === undefined) {
  throw new Error('Missing "input-otp" in components form docs group.');
}
const labelItem = group.items.find((item) => item.slug === 'label');
if (labelItem === undefined) {
  throw new Error('Missing "label" in components form docs group.');
}
const checkboxItem = group.items.find((item) => item.slug === 'checkbox');
if (checkboxItem === undefined) {
  throw new Error('Missing "checkbox" in components form docs group.');
}
const toggleItem = group.items.find((item) => item.slug === 'toggle');
if (toggleItem === undefined) {
  throw new Error('Missing "toggle" in components form docs group.');
}
const radioItem = group.items.find((item) => item.slug === 'radio');
if (radioItem === undefined) {
  throw new Error('Missing "radio" in components form docs group.');
}
const buttonToggleItem = group.items.find((item) => item.slug === 'button-toggle');
if (buttonToggleItem === undefined) {
  throw new Error('Missing "button-toggle" in components form docs group.');
}
const listboxItem = group.items.find((item) => item.slug === 'listbox');
if (listboxItem === undefined) {
  throw new Error('Missing "listbox" in components form docs group.');
}
const autocompleteItem = group.items.find((item) => item.slug === 'autocomplete');
if (autocompleteItem === undefined) {
  throw new Error('Missing "autocomplete" in components form docs group.');
}
const multiAutocompleteItem = group.items.find((item) => item.slug === 'multi-autocomplete');
if (multiAutocompleteItem === undefined) {
  throw new Error('Missing "multi-autocomplete" in components form docs group.');
}
const selectItem = group.items.find((item) => item.slug === 'select');
if (selectItem === undefined) {
  throw new Error('Missing "select" in components form docs group.');
}
const multiselectItem = group.items.find((item) => item.slug === 'multiselect');
if (multiselectItem === undefined) {
  throw new Error('Missing "multiselect" in components form docs group.');
}
const sliderItem = group.items.find((item) => item.slug === 'slider');
if (sliderItem === undefined) {
  throw new Error('Missing "slider" in components form docs group.');
}
const rangeSliderItem = group.items.find((item) => item.slug === 'range-slider');
if (rangeSliderItem === undefined) {
  throw new Error('Missing "range-slider" in components form docs group.');
}
const chipsItem = group.items.find((item) => item.slug === 'chips');
if (chipsItem === undefined) {
  throw new Error('Missing "chips" in components form docs group.');
}
const switchItem = group.items.find((item) => item.slug === 'switch');
if (switchItem === undefined) {
  throw new Error('Missing "switch" in components form docs group.');
}
const monthDaypickerItem = group.items.find((item) => item.slug === 'month-daypicker');
if (monthDaypickerItem === undefined) {
  throw new Error('Missing "month-daypicker" in components form docs group.');
}
const yearpickerItem = group.items.find((item) => item.slug === 'yearpicker');
if (yearpickerItem === undefined) {
  throw new Error('Missing "yearpicker" in components form docs group.');
}
const fileuploadItem = group.items.find((item) => item.slug === 'fileupload');
if (fileuploadItem === undefined) {
  throw new Error('Missing "fileupload" in components form docs group.');
}

const landingSlugs = new Set([
  inputItem.slug,
  numberRangeItem.slug,
  inputFieldItem.slug,
  formFieldItem.slug,
  datepickerItem.slug,
  dateRangePickerItem.slug,
  textareaItem.slug,
  inputOtpItem.slug,
  labelItem.slug,
  checkboxItem.slug,
  toggleItem.slug,
  radioItem.slug,
  buttonToggleItem.slug,
  listboxItem.slug,
  autocompleteItem.slug,
  multiAutocompleteItem.slug,
  selectItem.slug,
  multiselectItem.slug,
  sliderItem.slug,
  rangeSliderItem.slug,
  chipsItem.slug,
  switchItem.slug,
  monthDaypickerItem.slug,
  yearpickerItem.slug,
  fileuploadItem.slug,
]);

export const COMPONENTS_FORM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: defaultItem.slug,
  },
  {
    path: inputItem.slug,
    loadChildren: () =>
      import('./input/routes').then((module) => module.COMPONENTS_FORM_INPUT_ROUTES),
  },
  {
    path: numberRangeItem.slug,
    loadChildren: () =>
      import('./number-range/routes').then((module) => module.COMPONENTS_FORM_NUMBER_RANGE_ROUTES),
  },
  {
    path: inputFieldItem.slug,
    loadChildren: () =>
      import('./input-field/routes').then((module) => module.COMPONENTS_FORM_INPUT_FIELD_ROUTES),
  },
  {
    path: formFieldItem.slug,
    loadChildren: () =>
      import('./form-field/routes').then((module) => module.COMPONENTS_FORM_FORM_FIELD_ROUTES),
  },
  {
    path: datepickerItem.slug,
    loadChildren: () =>
      import('./datepicker/routes').then((module) => module.COMPONENTS_FORM_DATEPICKER_ROUTES),
  },
  {
    path: dateRangePickerItem.slug,
    loadChildren: () =>
      import('./date-range-picker/routes').then(
        (module) => module.COMPONENTS_FORM_DATE_RANGE_PICKER_ROUTES,
      ),
  },
  {
    path: textareaItem.slug,
    loadChildren: () =>
      import('./textarea/routes').then((module) => module.COMPONENTS_FORM_TEXTAREA_ROUTES),
  },
  {
    path: inputOtpItem.slug,
    loadChildren: () =>
      import('./input-otp/routes').then((module) => module.COMPONENTS_FORM_INPUT_OTP_ROUTES),
  },
  {
    path: labelItem.slug,
    loadChildren: () =>
      import('./label/routes').then((module) => module.COMPONENTS_FORM_LABEL_ROUTES),
  },
  {
    path: checkboxItem.slug,
    loadChildren: () =>
      import('./checkbox/routes').then((module) => module.COMPONENTS_FORM_CHECKBOX_ROUTES),
  },
  {
    path: toggleItem.slug,
    loadChildren: () =>
      import('./toggle/routes').then((module) => module.COMPONENTS_FORM_TOGGLE_ROUTES),
  },
  {
    path: radioItem.slug,
    loadChildren: () =>
      import('./radio/routes').then((module) => module.COMPONENTS_FORM_RADIO_ROUTES),
  },
  {
    path: buttonToggleItem.slug,
    loadChildren: () =>
      import('./button-toggle/routes').then(
        (module) => module.COMPONENTS_FORM_BUTTON_TOGGLE_ROUTES,
      ),
  },
  {
    path: listboxItem.slug,
    loadChildren: () =>
      import('./listbox/routes').then((module) => module.COMPONENTS_FORM_LISTBOX_ROUTES),
  },
  {
    path: autocompleteItem.slug,
    loadChildren: () =>
      import('./autocomplete/routes').then((module) => module.COMPONENTS_FORM_AUTOCOMPLETE_ROUTES),
  },
  {
    path: multiAutocompleteItem.slug,
    loadChildren: () =>
      import('./multi-autocomplete/routes').then(
        (module) => module.COMPONENTS_FORM_MULTI_AUTOCOMPLETE_ROUTES,
      ),
  },
  {
    path: selectItem.slug,
    loadChildren: () =>
      import('./select/routes').then((module) => module.COMPONENTS_FORM_SELECT_ROUTES),
  },
  {
    path: multiselectItem.slug,
    loadChildren: () =>
      import('./multiselect/routes').then((module) => module.COMPONENTS_FORM_MULTISELECT_ROUTES),
  },
  {
    path: sliderItem.slug,
    loadChildren: () =>
      import('./slider/routes').then((module) => module.COMPONENTS_FORM_SLIDER_ROUTES),
  },
  {
    path: rangeSliderItem.slug,
    loadChildren: () =>
      import('./range-slider/routes').then((module) => module.COMPONENTS_FORM_RANGE_SLIDER_ROUTES),
  },
  {
    path: chipsItem.slug,
    loadChildren: () =>
      import('./chips/routes').then((module) => module.COMPONENTS_FORM_CHIPS_ROUTES),
  },
  {
    path: switchItem.slug,
    loadChildren: () =>
      import('./switch/routes').then((module) => module.COMPONENTS_FORM_SWITCH_ROUTES),
  },
  {
    path: monthDaypickerItem.slug,
    loadChildren: () =>
      import('./month-daypicker/routes').then(
        (module) => module.COMPONENTS_FORM_MONTH_DAYPICKER_ROUTES,
      ),
  },
  {
    path: yearpickerItem.slug,
    loadChildren: () =>
      import('./yearpicker/routes').then((module) => module.COMPONENTS_FORM_YEARPICKER_ROUTES),
  },
  {
    path: fileuploadItem.slug,
    loadChildren: () =>
      import('./fileupload/routes').then((module) => module.COMPONENTS_FORM_FILEUPLOAD_ROUTES),
  },
  ...group.items
    .filter((item) => !landingSlugs.has(item.slug))
    .map((item) => ({
      path: item.slug,
      data: toComponentsDocsRouteData(group, item),
      loadComponent: () =>
        import('./landing/form-landing-page.component').then(
          (module) => module.FormLandingPageComponent,
        ),
    })),
];
