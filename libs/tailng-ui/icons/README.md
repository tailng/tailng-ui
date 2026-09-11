# @tailng-ui/icons

Icon abstraction layer for TailNG UI, with built-in `lucide` support, custom pack registration, and a consistent `<tng-icon>` API for Angular 21+.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/icons</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Icon pack abstraction and rendering utilities powered by <code>@ng-icons/core</code>.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/icons.svg)](https://www.npmjs.com/package/@tailng-ui/icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/icons` provides the `TngIcon` component and icon-pack utilities such as `provideTngIcons(...)` and `createTngIconPack(...)`.

## Installation

### pnpm

```bash
pnpm add @tailng-ui/icons
```

### yarn

```bash
yarn add @tailng-ui/icons
```

### npm

```bash
npm install @tailng-ui/icons
```

Peer dependencies:

- `@angular/core` `^21.1.0 || ^22.0.0`
- `tslib` `^2.3.0`

## Quick start

```ts
import { ApplicationConfig } from '@angular/core';
import { provideTngIcons } from '@tailng-ui/icons';

export const appConfig: ApplicationConfig = {
  providers: [provideTngIcons()],
};
```

```ts
import { Component } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';

@Component({
  standalone: true,
  imports: [TngIcon],
  template: `<tng-icon icon="bell" size="1.25rem" />`,
})
export class ExampleComponent {}
```

With zero config, `icon="bell"` resolves to `lucide:bell`.

## Tree-shakable core entry point

Use `@tailng-ui/icons/core` when the application should bundle only explicitly registered
icons. The core entry point contains the component, resolver, tokens, and pack utilities, but
does not import the built-in Lucide registry.

```ts
import { ApplicationConfig } from '@angular/core';
import { createTngIconPack, provideTngIcons } from '@tailng-ui/icons/core';
import {
  lucideBuilding,
  lucideLoaderCircle,
  lucideRefreshCw,
  lucideSave,
  lucideSearch,
} from '@ng-icons/lucide';

const adminIcons = createTngIconPack('lucide', {
  building: lucideBuilding,
  'loader-circle': lucideLoaderCircle,
  'refresh-cw': lucideRefreshCw,
  save: lucideSave,
  search: lucideSearch,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideTngIcons({
      defaultPack: 'lucide',
      packs: [adminIcons],
    }),
  ],
};
```

`packs` is required when importing `provideTngIcons` from the core entry point. Static SVG
strings and async SVG loaders can be mixed in the same pack. Avoid importing anything from the
package root in a bundle that must exclude the built-in registry.

## Sizing icons

Use the `size` input for one-off sizing:

```html
<tng-icon icon="home" size="1.25rem" /> <tng-icon icon="home" [size]="20" />
```

Use `--tng-icon-size` when CSS should own the size:

```html
<tng-icon icon="home" class="my-icon" />
```

```css
.my-icon {
  --tng-icon-size: 1.25rem;
}
```

## Core contract

- Built-in pack `lucide` is available by default.
- Default pack is `lucide` unless overridden.
- `defaultPack` is optional in `provideTngIcons(...)`.
- Custom packs can be added without re-registering built-ins.
- Built-ins are loaded via generated loaders from `@ng-icons/lucide`.
- No implicit aliases are provided; use canonical icon names.
- Pack name `lucide` is reserved unless `allowBuiltinOverride: true`.
- Built-in pack references normalize case-insensitively (for example `Lucide:bell` => `lucide:bell`).

## Custom packs

### Custom default pack + extra packs

```ts
import { createTngIconPack, provideTngIcons } from '@tailng-ui/icons';

const customPack1 = createTngIconPack('customPack1', {
  bell: async () => '<svg viewBox="0 0 24 24"></svg>',
});

const customPack2 = createTngIconPack('customPack2', {
  check: async () => '<svg viewBox="0 0 24 24"></svg>',
});

export const appConfig = {
  providers: [
    provideTngIcons({
      defaultPack: 'customPack1',
      packs: [customPack1, customPack2],
    }),
  ],
};
```

### Add Bootstrap as custom pack

```ts
import { createTngIconPack, provideTngIcons } from '@tailng-ui/icons';
import { bootstrapBell } from '@ng-icons/bootstrap-icons';

const bootstrap = createTngIconPack('bootstrap', {
  bell: async () => bootstrapBell,
});

export const appConfig = {
  providers: [provideTngIcons({ packs: [bootstrap] })],
};
```

## Development

Regenerate built-in loader maps:

```bash
pnpm generate:icons
```

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
