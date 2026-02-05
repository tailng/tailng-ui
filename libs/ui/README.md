# @tailng-ui/ui

Modern Angular UI components powered by Tailwind CSS. Built for Angular 21+ with standalone components, signals, and a clean API.

## Overview

`@tailng-ui/ui` is a comprehensive component library for Angular applications. It provides 50+ production-ready components styled with Tailwind CSS, featuring a "Material-like" developer experience without heavy theming overhead.

## Installation

```bash
npm install @tailng-ui/ui
```

## Peer Dependencies

- `@angular/core`: ^21.0.0
- `@angular/common`: ^21.0.0
- `@angular/forms`: ^21.0.0
- `@tailng-ui/cdk`: ^0.1.0

## Features

- **Standalone Components**: All components are standalone, no NgModules required
- **Signal-based API**: Built with Angular signals for reactive, performant components
- **Tailwind CSS**: Styled with utility classes, fully customizable
- **Accessible**: WCAG-compliant components with proper ARIA attributes
- **Type-safe**: Full TypeScript support with comprehensive types
- **Tree-shakable**: Import only what you need
- **CSS Variables**: Theme support via CSS custom properties
- **"klass signal" Pattern**: Consistent styling API across components

## Quick Start

```typescript
import { Component } from '@angular/core';
import { TngButton } from '@tailng-ui/ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TngButton],
  template: `
    <tng-button variant="primary">Click me</tng-button>
  `,
})
export class ExampleComponent {}
```

## Component Categories

### Form Controls

Complete set of form input components with validation support:

- **Autocomplete** - Searchable dropdown with typeahead
- **Checkbox** - Single and multi-select checkboxes
- **Chips** - Multi-value input with tags
- **Datepicker** - Date selection with calendar
- **Timepicker** - Time selection component
- **Form Field** - Wrapper with label, hint, and error states
- **Text Input** - Standard text input
- **Number Input** - Numeric input with validation
- **Textarea** - Multi-line text input
- **File Upload** - File selection and upload
- **Radio Button** - Single selection from options
- **Select** - Dropdown selection
- **Slider** - Range input slider
- **Slide Toggle** - Toggle switch
- **Button Toggle** - Toggle button group

### Buttons & Indicators

Interactive elements and status indicators:

- **Button** - Primary, outline, and text variants
- **Badge** - Status badges and labels
- **Icon** - Icon component (from `@tailng-ui/icons`)
- **Ripples** - Material-style ripple effect
- **Progress Bar** - Linear progress indicator
- **Progress Spinner** - Circular progress indicator
- **Skeleton** - Loading placeholder

### Layout

Structural components for page layout:

- **Card** - Container with header, content, and footer
- **Divider** - Visual separator
- **Expansion Panel** - Collapsible content panel
- **Tabs** - Tabbed interface
- **Accordion** - Collapsible accordion list

### Navigation

Components for app navigation:

- **Menu** - Context and dropdown menus
- **Sidenav** - Side navigation drawer
- **Drawer** - Slide-out drawer panel
- **Stepper** - Multi-step wizard
- **Paginator** - Pagination controls
- **Breadcrumbs** - Navigation breadcrumb trail

### Popups & Overlays

Modal and overlay components:

- **Dialog** - Modal dialog
- **Snackbar** - Toast notifications
- **Tooltip** - Hover tooltips
- **Popover** - Contextual popover

### Data Table & Structure

Data display components:

- **Table** - Data table with sorting and filtering
- **Sort Header** - Sortable table columns
- **Filter Header** - Filterable table columns
- **Tree** - Hierarchical tree view
- **Virtual Scroll** - Efficient scrolling for large lists
- **Empty State** - Empty state placeholder

### Utilities

Helper components:

- **Code Block** - Syntax-highlighted code display
- **Copy Button** - Copy-to-clipboard button

## Usage Examples

### Button

```typescript
import { TngButton } from '@tailng-ui/ui';

@Component({
  template: `
    <tng-button variant="primary">Primary</tng-button>
    <tng-button variant="outline">Outline</tng-button>
    <tng-button variant="text">Text</tng-button>
  `,
  imports: [TngButton],
})
export class MyComponent {}
```

### Form Input

```typescript
import { TngTextInput } from '@tailng-ui/ui';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: `
    <tng-text-input
      [formControl]="email"
      type="email"
      placeholder="Enter email"
    />
  `,
  imports: [TngTextInput, ReactiveFormsModule],
})
export class MyComponent {
  email = new FormControl('');
}
```

### Dialog

```typescript
import { TngDialog } from '@tailng-ui/ui';

@Component({
  template: `
    <tng-dialog>
      <div tngDialogHeader>
        <h2>Confirm Action</h2>
      </div>
      <div tngDialogContent>
        Are you sure you want to proceed?
      </div>
      <div tngDialogFooter>
        <tng-button (click)="close()">Cancel</tng-button>
        <tng-button variant="primary" (click)="confirm()">Confirm</tng-button>
      </div>
    </tng-dialog>
  `,
  imports: [TngDialog, TngButton],
})
export class MyComponent {}
```

## Theming

Components support theming via CSS variables:

```css
:root {
  --color-primary: #2563eb;
  --radius: 0.25rem;
  --surface: #ffffff;
  --surface-2: #f8fafc;
}
```

See [`@tailng-ui/theme`](../theme/README.md) for the complete theming guide.

## "klass signal" Pattern

Many components expose a `klass` signal that composes Tailwind classes from inputs and state:

```typescript
@Component({
  template: `<button [class]="klass()">Click me</button>`,
})
export class MyButton {
  variant = input<'primary' | 'outline'>('primary');
  
  klass = computed(() => {
    const base = 'px-3 py-2 rounded-md';
    const primary = 'bg-blue-500 text-white';
    const outline = 'border border-gray-300';
    
    return [base, this.variant() === 'primary' ? primary : outline].join(' ');
  });
}
```

## Related Packages

- [`@tailng-ui/cdk`](../cdk/README.md) - Component development kit (required)
- [`@tailng-ui/icons`](../icons/README.md) - Icon components
- [`@tailng-ui/theme`](../theme/README.md) - Tailwind CSS theme preset

## Documentation

- [Component Documentation](https://tailng.dev) - Full component docs and examples
- [GitHub Repository](https://github.com/tailng/tailng-ui) - Source code and issues

## License

MIT
