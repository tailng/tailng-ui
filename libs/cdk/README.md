# @tociva/tailng-cdk

Headless Angular utilities and primitives for building accessible, interactive components.

## Overview

`@tociva/tailng-cdk` provides logic-only building blocks for Angular applications. This package contains utilities for accessibility, keyboard navigation, focus management, and component primitives that power the Tailng UI component library.

## Installation

```bash
npm install @tociva/tailng-cdk
```

## Peer Dependencies

- `@angular/core`: ^21.0.0
- `@angular/common`: ^21.0.0

## Features

- **Accessibility (a11y)**: Focus trap directive and utilities for managing focus in modals and overlays
- **Keyboard Navigation**: Utilities for handling keyboard interactions in lists, menus, and interactive components
- **Scroll Management**: Utilities for scrolling elements into view
- **Component Utilities**: Helper functions for common component patterns like option lists

## Usage

### Focus Trap Directive

Manage focus trapping in modals, dialogs, and overlays:

```typescript
import { Component } from '@angular/core';
import { TngFocusTrap } from '@tociva/tailng-cdk';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [TngFocusTrap],
  template: `
    <div tngFocusTrap>
      <h2>Modal Content</h2>
      <button>Close</button>
    </div>
  `,
})
export class ModalComponent {}
```

### Keyboard Navigation

Handle keyboard navigation in lists and menus:

```typescript
import { keyboardNavigation } from '@tociva/tailng-cdk';

// Use in your component to handle arrow key navigation
const state = keyboardNavigation({
  // Configuration for keyboard navigation
});
```

### Option List Utilities

Utilities for managing option list state and context:

```typescript
import { OptionTplContext } from '@tociva/tailng-cdk';

// Type for option template context
type MyOption = { id: string; label: string };
const context: OptionTplContext<MyOption> = {
  $implicit: { id: '1', label: 'Option 1' },
  index: 0,
  active: true,
  selected: false,
};
```

### Scroll Utilities

Scroll elements into view:

```typescript
import { scrollActiveIntoView } from '@tociva/tailng-cdk';

scrollActiveIntoView({
  container: elementRef.nativeElement,
  activeIndex: 2,
  itemSelector: '[data-index]',
  behavior: 'smooth',
});
```

## API Reference

### Directives

- **`TngFocusTrap`**: Standalone directive for trapping focus within an element

### Utilities

- **`createTngFocusTrap`**: Create a focus trap instance
- **`keyboardNavigation`**: Keyboard navigation state management
- **`scrollActiveIntoView`**: Scroll an element into view
- **`OptionTplContext`**: Type for option template context

## Related Packages

- [`@tociva/tailng-ui`](../ui/README.md) - UI components built on top of this CDK
- [`@tociva/tailng-icons`](../icons/README.md) - Icon components
- [`@tociva/tailng-theme`](../theme/README.md) - Tailwind CSS theme preset

## License

MIT
