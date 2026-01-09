import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export const categories = [
  {
    name: 'Form Controls',
    package: '@tailng/forms',
    components: [
      { name: 'Autocomplete', route: '/forms/autocomplete', status: 'done', priority: 'high' },
      { name: 'Checkbox', route: '/forms/checkbox', status: 'done', priority: 'high' },
      { name: 'Chips', route: '/forms/chips', status: 'done', priority: 'medium' },

      { name: 'Datepicker', route: '/forms/datepicker', status: 'backlog', priority: 'high' },
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
    package: '@tailng/primitives',
    components: [
      { name: 'Button', route: '/buttons/button', status: 'done', priority: 'high' },
      { name: 'Badge', route: '/buttons/badge', status: 'done', priority: 'medium' },
      { name: 'Icon', route: '/buttons/icon', status: 'done', priority: 'high' },
      { name: 'Ripples', route: '/buttons/ripples', status: 'done', priority: 'low' },
      { name: 'Progress Bar', route: '/buttons/progress-bar', status: 'done', priority: 'medium' },
      { name: 'Progress Spinner', route: '/buttons/progress-spinner', status: 'done', priority: 'medium' },

      // Missing but essential indicators
      { name: 'Skeleton', route: '/buttons/skeleton', status: 'done', priority: 'medium' },
    ],
  },

  {
    name: 'Layout',
    package: '@tailng/primitives',
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
    package: '@tailng/navigation',
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
    package: '@tailng/overlay',
    components: [
      { name: 'Dialog', route: '/overlay/dialog', status: 'backlog', priority: 'high' },
      { name: 'Bottom Sheet', route: '/overlay/bottom-sheet', status: 'backlog', priority: 'medium' },
      { name: 'Snackbar', route: '/overlay/snackbar', status: 'backlog', priority: 'high' },
      { name: 'Tooltip', route: '/overlay/tooltip', status: 'backlog', priority: 'high' },

      // Missing but essential overlay
      { name: 'Popover', route: '/overlay/popover', status: 'backlog', priority: 'medium' },
    ],
  },

  {
    name: 'Overlay Primitives',
    package: '@tailng/overlay',
    internal: true,
    components: [
      {
        name: 'Connected Overlay',
        route: '/overlay-primitives/connected-overlay',
        status: 'in-progress',
        priority: 'high',
        internal: true,
      },
      {
        name: 'Overlay Panel',
        route: '/overlay-primitives/overlay-panel',
        status: 'backlog',
        priority: 'medium',
        internal: true,
      },
      {
        name: 'Overlay Ref',
        route: '/overlay-primitives/overlay-ref',
        status: 'backlog',
        priority: 'low',
        internal: true,
      },
      {
        name: 'Option List',
        route: '/overlay-primitives/option-list',
        status: 'backlog',
        priority: 'high',
        internal: true,
      },

      // Useful internal primitive for positioning
      {
        name: 'Focus Trap',
        route: '/overlay-primitives/focus-trap',
        status: 'backlog',
        priority: 'medium',
        internal: true,
      },
    ],
  },

  {
    name: 'Data Table & Structure',
    package: '@tailng/data',
    components: [
      { name: 'Table', route: '/data/table', status: 'backlog', priority: 'high' },
      { name: 'Sort Header', route: '/data/sort-header', status: 'backlog', priority: 'medium' },
      { name: 'Tree', route: '/data/tree', status: 'backlog', priority: 'low' },

      // Missing but essential data components
      { name: 'Virtual Scroll', route: '/data/virtual-scroll', status: 'backlog', priority: 'medium' },
      { name: 'Empty State', route: '/data/empty-state', status: 'backlog', priority: 'medium' },
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

