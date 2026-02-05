# @tailng-ui/theme

Tailwind CSS preset and design tokens for Tailng components.

## Overview

`@tailng-ui/theme` provides a shared Tailwind CSS configuration used by Tailng components and applications. It defines colors, typography, spacing, border radius, and other design tokens in a reusable preset that ensures consistency across your application.

## Installation

```bash
npm install @tailng-ui/theme
```

## Peer Dependencies

- `tailwindcss`: ^3.4.0

## Features

- CSS variable-based theming
- Consistent design tokens (colors, spacing, radius)
- Tailwind preset for easy integration
- Type-safe design tokens (TypeScript)
- Light and dark mode support ready

## Usage

### Basic Setup

Add the preset to your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@tailng-ui/theme/tailwind/preset'),
  ],
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### With Custom Theme

Extend the preset with your own theme:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@tailng-ui/theme/tailwind/preset'),
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #2563eb)',
      },
      borderRadius: {
        tng: 'var(--radius, 0.25rem)',
      },
    },
  },
};
```

### CSS Variables

Define your theme variables in your global CSS:

```css
:root {
  --color-primary: #2563eb;
  --radius: 0.25rem;
  --surface: #ffffff;
  --surface-2: #f8fafc;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
    --surface: #1e293b;
    --surface-2: #0f172a;
  }
}
```

### Design Tokens

Import and use design tokens in TypeScript:

```typescript
import { tailngTokens } from '@tailng-ui/theme';

// Use tokens programmatically
const radius = tailngTokens.radius.md; // '0.25rem'
```

## Available Tokens

### Border Radius

- `sm`: `0.125rem`
- `md`: `0.25rem`
- `lg`: `0.5rem`

### Colors

The preset uses CSS variables for colors, allowing easy theming:

- `primary`: `var(--color-primary, #2563eb)`
- Custom colors can be added via CSS variables

## Preset Structure

The preset extends Tailwind's default theme with:

- **Colors**: CSS variable-based primary color
- **Border Radius**: Consistent radius values
- **Spacing**: Standard spacing scale (can be extended)

## Customization

### Override Default Values

```javascript
module.exports = {
  presets: [require('@tailng-ui/theme/tailwind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#your-color', // Override default
      },
    },
  },
};
```

### Add Custom Variables

```css
:root {
  --color-primary: #your-primary-color;
  --color-secondary: #your-secondary-color;
  --radius: 0.5rem;
}
```

## Related Packages

- [`@tailng-ui/ui`](../ui/README.md) - UI components that use this theme
- [`@tailng-ui/icons`](../icons/README.md) - Icon components
- [`@tailng-ui/cdk`](../cdk/README.md) - Component development kit

## License

MIT
