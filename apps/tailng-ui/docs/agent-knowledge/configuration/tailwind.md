---
id: configuration/tailwind
title: Tailwind CSS configuration
description: Combine Tailwind utilities with TailNG component contracts and semantic tokens.
category: configuration
status: stable
tags: ["tailwind", "css", "configuration"]
package: @tailng-ui/theme
sourcePaths: ["apps/tailng-ui/docs/src/app/pages/components/getting-started/tailwind-setup/tailwind-setup-page.component.ts", "apps/tailng-ui/docs/src/tailwind-preflight.layer.css"]
humanDocsUrl: https://tailng.dev/components/getting-started/tailwind-setup
---

# Tailwind CSS configuration

Install Tailwind for the version used by the application. TailNG's current documentation uses Tailwind 3 configuration:

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

Configure template discovery and disable Tailwind preflight when the application owns reset behavior:

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: 'var(--tng-semantic-accent-brand)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Load utilities and TailNG contracts from `src/styles.css`:

```css
@layer tw.preflight, components, tng.tokens, tng.contracts, utilities;
@tailwind components;
@tailwind utilities;

@import '@tailng-ui/theme/component-contracts/index.css';
```

Keep component behavior and semantic contract variables in TailNG; use Tailwind utilities for application-owned layout and presentation.
