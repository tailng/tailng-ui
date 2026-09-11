# @tailng-ui/components

Ready-to-use styled Angular components for TailNG UI, built on top of `@tailng-ui/primitives` with accessibility-first behavior and clean APIs.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/components</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Installable component wrappers for Angular 21+ applications and design systems.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/components.svg)](https://www.npmjs.com/package/@tailng-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/components` provides styled components across navigation, form, layout, overlay, feedback, and utility categories.

## Installation

### pnpm

```bash
pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk
```

### yarn

```bash
yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk
```

### npm

```bash
npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk
```

`@tailng-ui/components` now ships separately from both the primitives and CDK layers, so install
`@tailng-ui/primitives` and `@tailng-ui/cdk` explicitly alongside it.

Peer dependencies:

- `@angular/core` `^21.1.0 || ^22.0.0`
- `tslib` `^2.3.0`

## Quick example

```ts
import { Component } from '@angular/core';
import { TngButton } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngButton],
  template: `<tng-button tone="success">Continue</tng-button>`,
})
export class ExampleComponent {}
```

## What you get

- **Styled wrappers** over TailNG primitives with production-ready defaults.
- **Accessible behavior** inherited from headless primitive contracts.
- **Composable APIs** that remain flexible for app-specific customization.
- **Consistent package surface** across component groups.

## Package surface

The root package exports component groups:

- `navigation`
- `form`
- `layout`
- `overlay`
- `feedback`
- `utility`

## When to use components vs primitives

- Use `@tailng-ui/components` when you want ready-made styled building blocks.
- Use `@tailng-ui/primitives` when you need full control over markup and styling.

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
