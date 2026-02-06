<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>TailNG</h1>

  <p>
    <strong>Scalability of Angular. Simplicity of Tailwind.</strong>
  </p>

  <p>
    A modern Angular 21 component system built with Tailwind CSS —
    designed for large applications and design systems.
  </p>
</div>

# @tailng-ui/icons

Angular icon components built on top of `@ng-icons/core` with Tailwind CSS support.

---

## Overview

`@tailng-ui/icons` provides a lightweight, tree-shakable icon system for modern Angular applications.  
Icons are rendered as SVG and styled via `currentColor`, making them fully compatible with Tailwind CSS and TailNG theming.

---

## Installation

```bash
npm install @tailng-ui/icons @ng-icons/core
# or
yarn add @tailng-ui/icons @ng-icons/core
```

Install an icon set of your choice. For example, Bootstrap Icons:

```bash
npm install @ng-icons/bootstrap-icons
```

---

## Peer Dependencies

- `@angular/core`: ^21.0.0
- `@angular/common`: ^21.0.0
- `@ng-icons/core`: ^30.0.0

> `@ng-icons/core` is a peer dependency to avoid bundling the icon engine and to keep bundles small.

---

## Features

- Standalone Angular component
- Signal-based API (Angular signals)
- Tree-shakable icon definitions
- `currentColor`-based SVG icons
- Flexible sizing (number or string)
- Built-in accessibility support
- No CSS or styling opinions

---

## Usage

### Basic Usage

```ts
import { Component } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import { provideIcons } from '@ng-icons/core';
import { bootstrapCheckCircle } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TngIcon],
  providers: [
    provideIcons({
      bootstrapCheckCircle,
    }),
  ],
  template: `
    <tng-icon name="bootstrapCheckCircle" />
  `,
})
export class ExampleComponent {}
```

---

### With Size

```html
<!-- Number = pixels -->
<tng-icon name="bootstrapCheckCircle" [size]="24" />

<!-- String = CSS units -->
<tng-icon name="bootstrapCheckCircle" size="1.5rem" />
<tng-icon name="bootstrapCheckCircle" size="2em" />
```

---

### With Tailwind / TailNG Classes

Icons use `currentColor`, so they inherit text color.

```html
<!-- Token-safe (recommended) -->
<tng-icon name="bootstrapCheckCircle" class="text-fg" />

<!-- Any Tailwind color also works -->
<tng-icon name="bootstrapCheckCircle" class="text-green-500" />
```

---

### Accessibility

```html
<!-- Decorative icon (default) -->
<tng-icon name="bootstrapCheckCircle" />

<!-- Semantic icon -->
<tng-icon
  name="bootstrapCheckCircle"
  [decorative]="false"
  ariaLabel="Success"
/>
```

---

## API Reference

### `TngIcon`

#### Inputs

- **`name`** *(required)*: `string`  
  Icon name from the `@ng-icons` registry

- **`size`**: `number | string`  
  Number = pixels, string = CSS unit  
  Default: `'1em'`

- **`iconKlass`**: `string`  
  Additional CSS classes for the icon

- **`decorative`**: `boolean`  
  If `true`, sets `aria-hidden`  
  Default: `true`

- **`ariaLabel`**: `string`  
  Required when `decorative` is `false`

---

## Supported Icon Sets

Works with all icon packs supported by `@ng-icons/core`, including:

- Bootstrap Icons
- Heroicons
- Material Icons
- Font Awesome
- and more

See the official docs:  
https://ng-icons.github.io/ng-icons/

---

## Related Packages

- `@tailng-ui/ui` – UI components
- `@tailng-ui/cdk` – Component utilities
- `@tailng-ui/theme` – Tailwind preset & tokens

---

## License

MIT
