# @tailng-ui/registry

Copy-source registry definitions and install metadata for TailNG ownable components.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/registry</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Canonical registry surface for <code>tailng list</code>, <code>tailng add</code>, and ownable-install docs.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/registry.svg)](https://www.npmjs.com/package/@tailng-ui/registry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/registry` is the single source of truth for TailNG ownable install metadata.
Use it when you need the same registry surface that powers:

- `tailng list`
- `tailng add <component>`
- docs `Ownable Install` pages

## Installation

### pnpm

```bash
pnpm add @tailng-ui/registry
```

### yarn

```bash
yarn add @tailng-ui/registry
```

### npm

```bash
npm install @tailng-ui/registry
```

Peer dependencies:

- `tslib` `^2.3.0`

## What the package provides

- canonical registry item names
- generated file metadata for each ownable item
- explicit install/import metadata for generated source
- lookup helpers for CLI and docs integration

## Programmatic usage

```ts
import { getRegistryItem, listRegistryItemNames } from '@tailng-ui/registry';

const names = listRegistryItemNames();
const button = getRegistryItem('button');
```

## Current registry items

The current package version exposes registry items for:

- `accordion`, `autocomplete`, `avatar`, `badge`, `bottom-sheet`, `breadcrumb`
- `button`, `button-toggle`, `card`, `checkbox`, `chips`, `code-block`
- `collapsible`, `combobox`, `confetti`, `context-menu`, `copy`, `dialog`, `drawer`
- `dropdown-menu`, `empty`, `grid`, `input`, `input-otp`, `label`
- `menu`, `menubar`, `multiselect`, `navigation-menu`, `pagination`, `popover`, `progress-bar`
- `progress-spinner`, `radio`, `range-slider`, `select`, `separator`, `skeleton`, `slider`
- `stepper`, `switch`, `table`, `tabs`, `tag`, `textarea`, `toast`
- `toggle`, `toggle-group`, `toolbar`, `tooltip`, `tree`

For the exact installable UX, use:

```bash
pnpm dlx tailng list
```

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
