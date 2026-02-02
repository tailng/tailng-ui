# @tociva/tailng-icons

Angular icon components built on top of `@ng-icons/core` with Tailwind CSS support.

## Overview

`@tociva/tailng-icons` provides a lightweight, tree-shakable icon system for modern Angular applications. Icons are rendered as SVG and styled via `currentColor`, making them fully compatible with Tailwind CSS utility classes.

## Installation

```bash
npm install @tociva/tailng-icons
```

You'll also need to install the icon registry you want to use. For Bootstrap Icons:

```bash
npm install @ng-icons/bootstrap-icons
```

## Peer Dependencies

- `@angular/core`: ^21.0.0
- `@angular/common`: ^21.0.0
- `@ng-icons/core`: ^30.0.0

## Features

- Standalone Angular component
- Signal-based API using Angular signals
- Tree-shakable icon definitions
- `currentColor`-based SVG icons (works with Tailwind)
- Flexible sizing (number, string, or CSS units)
- Built-in accessibility support
- No CSS or styling opinions

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { TngIcon } from '@tociva/tailng-icons';
import { bootstrapCheckCircle } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TngIcon],
  providers: [
    {
      provide: NgIconsToken,
      useValue: { bootstrapCheckCircle },
    },
  ],
  template: `
    <tng-icon name="bootstrapCheckCircle" />
  `,
})
export class ExampleComponent {}
```

### With Size

```typescript
// Number (pixels)
<tng-icon name="bootstrapCheckCircle" [size]="24" />

// String (CSS units)
<tng-icon name="bootstrapCheckCircle" size="1.5rem" />
<tng-icon name="bootstrapCheckCircle" size="2em" />
```

### With Tailwind Classes

Icons use `currentColor`, so you can style them with Tailwind:

```html
<tng-icon 
  name="bootstrapCheckCircle" 
  class="text-green-500" 
/>
```

### Accessibility

```html
<!-- Decorative icon (default) -->
<tng-icon name="bootstrapCheckCircle" />

<!-- Semantic icon with label -->
<tng-icon 
  name="bootstrapCheckCircle" 
  [decorative]="false"
  ariaLabel="Success" 
/>
```

## API Reference

### `TngIcon`

#### Inputs

- **`name`** (required): `string` - Icon name from the `@ng-icons` registry
- **`size`**: `number | string` - Icon size. Number is treated as pixels, string is passed as-is (e.g., '1em', '20px', '1.25rem'). Default: `'1em'`
- **`klass`**: `string` - Additional CSS classes for the host element
- **`decorative`**: `boolean` - Whether the icon is decorative. If `true`, `aria-hidden` is set. Default: `true`
- **`ariaLabel`**: `string` - Accessibility label (used when `decorative` is `false`)

#### Computed Properties

- **`normalizedSize`**: Converts size to CSS string
- **`classes`**: Computed class string including Tailwind utilities
- **`ariaHidden`**: `'true' | null` based on decorative state
- **`computedAriaLabel`**: Computed aria-label based on decorative state

## Supported Icon Sets

This package works with any icon set supported by `@ng-icons/core`, including:

- Bootstrap Icons
- Heroicons
- Material Icons
- Font Awesome
- And many more...

See the [`@ng-icons` documentation](https://ng-icons.github.io/ng-icons/) for a complete list.

## Related Packages

- [`@tociva/tailng-ui`](../ui/README.md) - UI components that use these icons
- [`@tociva/tailng-cdk`](../cdk/README.md) - Component development kit
- [`@tociva/tailng-theme`](../theme/README.md) - Tailwind CSS theme preset

## License

MIT
