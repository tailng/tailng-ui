# @tailng-ui/theme

Framework-agnostic TailNG theme engine with token contracts, presets, CSS variable generation, and Tailwind preset adapters.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/theme</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Theme contracts, token system, and styling adapters for consistent design-system implementation.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/theme.svg)](https://www.npmjs.com/package/@tailng-ui/theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/theme` provides the contract and runtime tooling to define, merge, resolve, and export TailNG-compatible themes.

## Installation

### pnpm

```bash
pnpm add @tailng-ui/theme
```

### yarn

```bash
yarn add @tailng-ui/theme
```

### npm

```bash
npm install @tailng-ui/theme
```

## Scope

- Theme contracts and token model
- Built-in presets (`defaultThemePreset`, `minimalThemePreset`)
- Theme composition (`createTheme`, `mergeTheme`)
- Token resolution (`resolveToken`, `resolveTokenValue`)
- CSS variables adapter (`toCssVars`, `injectThemeVars`)
- Tailwind adapter (`toTailwindPreset`)
- Component-level style contracts and CSS exports

## Quick usage

```ts
import { createTheme, defaultThemePreset, toCssVars } from '@tailng-ui/theme';

const theme = createTheme(defaultThemePreset);
const cssVars = toCssVars(theme);
```

## Token references

Semantic tokens can reference primitive tokens, for example `{color.primary500}`.

- `toCssVars()` resolves references by default.
- `toCssVars({ resolveReferences: false })` keeps raw token references.
- `toTailwindPreset()` resolves references before generating Tailwind values.

## Component contracts CSS

Package exports include component contract styles:

- `@tailng-ui/theme/component-contracts/index.css`
- `@tailng-ui/theme/component-contracts/*`

### Shared form-control tokens

Form components resolve their defaults through the shared control contract before
falling back to semantic tokens. Override these variables on `:root`, a theme
scope, or a component subtree to tune the whole form family together:

- `--tng-control-bg`, `--tng-control-fg`, `--tng-control-placeholder`
- `--tng-control-border`, `--tng-control-border-hover`, `--tng-control-border-invalid`
- `--tng-control-radius`, `--tng-control-height-sm|md|lg`
- `--tng-control-padding-block`, `--tng-control-padding-inline`, `--tng-control-gap`
- `--tng-control-font-size`, `--tng-control-font-weight`, `--tng-control-line-height`
- `--tng-control-shadow`, `--tng-control-focus-shadow`
- `--tng-overlay-bg`, `--tng-overlay-border`, `--tng-overlay-radius`, `--tng-overlay-shadow`
- `--tng-item-*` and `--tng-group-*` for option rows and grouped controls

Resting controls are flat by default (`--tng-control-shadow: none`). Floating
panels such as select menus, autocomplete results, and calendars use
`--tng-overlay-shadow`, keeping field and overlay elevation visually distinct.

## Build

```bash
pnpm nx build theme
```

## Test

Run tests for `theme`:

```bash
pnpm nx run theme:vite:test
```

Run in watch mode:

```bash
pnpm nx run theme:vite:test --watch
```

Run with coverage:

```bash
pnpm nx run theme:vite:test --coverage
```

Run directly with Vitest (without Nx):

```bash
pnpm exec vitest run --config libs/tailng-ui/theme/vitest.config.ts
```

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
