import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export const categories = [
  {
    name: 'Form Controls',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Autocomplete', route: '/forms/autocomplete', status: 'done', priority: 'high' },
      { name: 'Checkbox', route: '/forms/checkbox', status: 'done', priority: 'high' },
      { name: 'Chips', route: '/forms/chips', status: 'done', priority: 'medium' },

      { name: 'Datepicker', route: '/forms/datepicker', status: 'done', priority: 'high' },
      { name: 'Timepicker', route: '/forms/timepicker', status: 'backlog', priority: 'low' },

      // Core form-field wrapper (label, hint, errors, prefix/suffix)
      { name: 'Form Field', route: '/forms/form-field', status: 'done', priority: 'high' },

      // Split Input
      { name: 'Text Input', route: '/forms/text-input', status: 'done', priority: 'high' },
      { name: 'Number Input', route: '/forms/number-input', status: 'done', priority: 'high' },

      // Essentials
      { name: 'Textarea', route: '/forms/textarea', status: 'done', priority: 'high' },
      { name: 'File Upload', route: '/forms/file-upload', status: 'done', priority: 'medium' },

      { name: 'Radio Button', route: '/forms/radio-button', status: 'done', priority: 'medium' },
      { name: 'Select', route: '/forms/select', status: 'done', priority: 'high' },
      { name: 'Slider', route: '/forms/slider', status: 'done', priority: 'low' },
      { name: 'Slide Toggle', route: '/forms/slide-toggle', status: 'done', priority: 'medium' },
      { name: 'Button Toggle', route: '/buttons/button-toggle', status: 'done', priority: 'medium' },
    ],
  },

  {
    name: 'Buttons & Indicators',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Button', route: '/buttons/button', status: 'done', priority: 'high' },
      { name: 'Badge', route: '/buttons/badge', status: 'done', priority: 'medium' },
      { name: 'Icon', route: '/buttons/icon', status: 'done', priority: 'high' },
      { name: 'Ripples', route: '/buttons/ripples', status: 'done', priority: 'low' },
      { name: 'Progress Bar', route: '/buttons/progress-bar', status: 'done', priority: 'medium' },
      { name: 'Progress Spinner', route: '/buttons/progress-spinner', status: 'done', priority: 'medium' },
      { name: 'Tag', route: '/buttons/tag', status: 'done', priority: 'low' },

      // Missing but essential indicators
      { name: 'Skeleton', route: '/buttons/skeleton', status: 'done', priority: 'medium' },
    ],
  },

  {
    name: 'Layout',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Card', route: '/layout/card', status: 'done', priority: 'high' },
      { name: 'Divider', route: '/layout/divider', status: 'done', priority: 'low' },
      { name: 'Expansion Panel', route: '/layout/expansion-panel', status: 'done', priority: 'medium' },
      { name: 'Tabs', route: '/layout/tabs', status: 'done', priority: 'high' },

      // Missing but essential layout primitives
      { name: 'Accordion', route: '/layout/accordion', status: 'done', priority: 'low' },
    ],
  },

  {
    name: 'Navigation',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Menu', route: '/navigation/menu', status: 'done', priority: 'high' },
      { name: 'Sidenav', route: '/navigation/sidenav', status: 'done', priority: 'high' },
      { name: 'Drawer', route: '/navigation/drawer', status: 'done', priority: 'high' },
      { name: 'Stepper', route: '/navigation/stepper', status: 'done', priority: 'medium' },
      { name: 'Paginator', route: '/navigation/paginator', status: 'done', priority: 'medium' },

      // Missing but essential navigation
      { name: 'Breadcrumbs', route: '/navigation/breadcrumbs', status: 'done', priority: 'low' },
    ],
  },

  {
    name: 'Popups & Overlays',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Dialog', route: '/overlay/dialog', status: 'done', priority: 'high' },
      { name: 'Snackbar', route: '/overlay/snackbar', status: 'done', priority: 'high' },
      { name: 'Tooltip', route: '/overlay/tooltip', status: 'done', priority: 'high' },

      // Missing but essential overlay
      { name: 'Popover', route: '/overlay/popover', status: 'done', priority: 'medium' },
    ],
  },

  {
    name: 'Overlay Primitives',
    package: '@tociva/tailng-ui',
    internal: true,
    components: [
      {
        name: 'Connected Overlay',
        route: '/overlay-primitives/connected-overlay',
        status: 'done',
        priority: 'high',
        internal: true,
      },
      {
        name: 'Option List',
        route: '/overlay-primitives/option-list',
        status: 'done',
        priority: 'high',
        internal: true,
      },
    ],
  },

  {
    name: 'Data Table & Structure',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Table Basic', route: '/data/table', status: 'done', priority: 'high' },
      { name: 'Sort Header', route: '/data/sort-header', status: 'done', priority: 'medium' },
      { name: 'Filter Header', route: '/data/filter-header', status: 'done', priority: 'medium' },
      { name: 'Tree', route: '/data/tree', status: 'backlog', priority: 'low' },

      // Missing but essential data components
      { name: 'Virtual Scroll', route: '/data/virtual-scroll', status: 'backlog', priority: 'medium' },
      { name: 'Empty State', route: '/data/empty-state', status: 'backlog', priority: 'medium' },
    ],
  },

  {
    name: 'Utilities',
    package: '@tociva/tailng-ui',
    components: [
      { name: 'Code Block', route: '/utilities/code-block', status: 'done', priority: 'medium' },
      { name: 'Copy Button', route: '/utilities/copy-button', status: 'done', priority: 'medium' },
    ],
  },
];


@Component({
  selector: 'playground-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  categories = categories;
}

