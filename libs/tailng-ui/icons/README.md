# @tailng-ui/icons

Icon abstraction layer for TailNG UI, with built-in `lucide` support, custom pack registration, and a consistent `<tng-icon>` API for Angular 21+.

Runtime baseline: ES2022. Browser support follows the baseline supported by the package's Angular
peer range.

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
    Icon pack abstraction with a constrained, Trusted Types-compatible SVG renderer.
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
- SVG strings are parsed as XML, validated against a constrained element and attribute allowlist,
  and rendered with namespace-aware DOM operations. The renderer does not use `innerHTML`,
  `DOMParser`, `SafeHtml`, or a Trusted Types bypass policy.
- Icon definitions are code assets. Do not pass user-provided or remotely sourced SVG strings to
  `createTngIconPack(...)`.
- No implicit aliases are provided; use canonical icon names.
- Pack name `lucide` is reserved unless `allowBuiltinOverride: true`.
- Built-in pack references normalize case-insensitively (for example `Lucide:bell` => `lucide:bell`).

## Custom packs

Custom pack SVGs are parsed as strict XML and validated before rendering. Keep icon definitions in
source control or trusted package code; the pack API is not an HTML sanitization boundary for SVG
received from users, databases, CMS entries, or remote APIs.

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

## Security and SVG compatibility

`TngIcon` never assigns SVG markup to `innerHTML` and does not use `DOMParser`, Angular
`SafeHtml`, `bypassSecurityTrustHtml()`, or a Trusted Types policy. It parses definitions with a
non-DOM XML parser, validates a constrained SVG subset, and creates every element and attribute
through namespace-aware Angular renderer operations. Applications can keep
`require-trusted-types-for 'script'` enabled without adding an icon-specific policy.

The allowlist includes the shapes and composition features used by Lucide and common static icon
packs: `svg`, `g`, `path`, basic shapes, `defs`, gradients, masks, clip paths, symbols, `use`,
`title`, and `desc`. Presentation attributes are allowlisted. Supported inline presentation styles
are converted to equivalent SVG attributes instead of being emitted as a `style` attribute.

The following content is intentionally rejected:

- scripts, event-handler attributes, `foreignObject`, embedded HTML, and processing instructions;
- external, protocol-relative, `data:`, or JavaScript URLs;
- non-allowlisted elements, attributes, namespaces, and CSS properties;
- documents exceeding the parser's source-size, depth, node-count, or attribute-count limits.

References such as `url(#gradient)` and `href="#symbol"` are allowed only within the same icon.
Their IDs are prefixed per component instance so repeated icons do not create duplicate document
IDs. An icon that cannot be parsed or validated renders the standard fallback glyph.

Because the SVG subtree is created outside Angular's compiled template instructions, `TngIcon`
skips hydration for its own component host and recreates that small subtree on the client. This
keeps application hydration deterministic at the cost of rerendering each icon during hydration.

Adding support for a new SVG feature must be an explicit library change accompanied by parser,
renderer, CSP, SSR, and hydration coverage. Do not broaden the allowlist merely to accept an
unreviewed icon file.

## Development

Regenerate built-in loader maps:

```bash
pnpm generate:icons
```

Run the unit and Chromium sink-enforcement suites independently:

```bash
pnpm test:icons
pnpm test:icons:browser
```

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
