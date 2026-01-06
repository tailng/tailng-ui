import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export const categories = [
  {
    name: 'Form Controls',
    package: '@tailng/forms',
    components: [
      { name: 'Autocomplete', route: '/forms/autocomplete', status: 'backlog', priority: 'high' },
      { name: 'Checkbox', route: '/forms/checkbox', status: 'backlog', priority: 'high' },
      { name: 'Chips', route: '/forms/chips', status: 'backlog', priority: 'medium' },
      { name: 'Datepicker', route: '/forms/datepicker', status: 'backlog', priority: 'high' },
      { name: 'Form Field', route: '/forms/form-field', status: 'backlog', priority: 'high' },
      { name: 'Input', route: '/forms/input', status: 'in-progress', priority: 'high' },
      { name: 'Radio Button', route: '/forms/radio-button', status: 'backlog', priority: 'medium' },
      { name: 'Select', route: '/forms/select', status: 'backlog', priority: 'high' },
      { name: 'Slider', route: '/forms/slider', status: 'backlog', priority: 'low' },
      { name: 'Slide Toggle', route: '/forms/slide-toggle', status: 'backlog', priority: 'medium' },
      { name: 'Timepicker', route: '/forms/timepicker', status: 'backlog', priority: 'low' },
    ],
  },

  {
    name: 'Buttons & Indicators',
    package: '@tailng/primitives',
    components: [
      { name: 'Button', route: '/buttons/button', status: 'in-progress', priority: 'high' },
      { name: 'Button Toggle', route: '/buttons/button-toggle', status: 'backlog', priority: 'medium' },
      { name: 'Badge', route: '/buttons/badge', status: 'backlog', priority: 'medium' },
      { name: 'Icon', route: '/buttons/icon', status: 'backlog', priority: 'high' },
      { name: 'Ripples', route: '/buttons/ripples', status: 'backlog', priority: 'low' },
      { name: 'Progress Bar', route: '/buttons/progress-bar', status: 'backlog', priority: 'medium' },
      { name: 'Progress Spinner', route: '/buttons/progress-spinner', status: 'backlog', priority: 'medium' },
    ],
  },

  {
    name: 'Layout',
    package: '@tailng/primitives',
    components: [
      { name: 'Card', route: '/layout/card', status: 'in-progress', priority: 'high' },
      { name: 'Divider', route: '/layout/divider', status: 'backlog', priority: 'low' },
      { name: 'Expansion Panel', route: '/layout/expansion-panel', status: 'backlog', priority: 'medium' },
      { name: 'Grid List', route: '/layout/grid-list', status: 'backlog', priority: 'low' },
      { name: 'List', route: '/layout/list', status: 'backlog', priority: 'medium' },
      { name: 'Tabs', route: '/layout/tabs', status: 'backlog', priority: 'high' },
      { name: 'Toolbar', route: '/layout/toolbar', status: 'backlog', priority: 'medium' },
    ],
  },

  {
    name: 'Navigation',
    package: '@tailng/navigation',
    components: [
      { name: 'Menu', route: '/navigation/menu', status: 'backlog', priority: 'high' },
      { name: 'Sidenav', route: '/navigation/sidenav', status: 'backlog', priority: 'high' },
      { name: 'Stepper', route: '/navigation/stepper', status: 'backlog', priority: 'medium' },
      { name: 'Paginator', route: '/navigation/paginator', status: 'backlog', priority: 'medium' },
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
    ],
  },

  {
    name: 'Data Table & Structure',
    package: '@tailng/data',
    components: [
      { name: 'Table', route: '/data/table', status: 'backlog', priority: 'high' },
      { name: 'Sort Header', route: '/data/sort-header', status: 'backlog', priority: 'medium' },
      { name: 'Tree', route: '/data/tree', status: 'backlog', priority: 'low' },
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

