# @tailng-ui/primitives

Headless Angular primitives for TailNG UI, providing accessibility-first behavior and stateful interaction contracts without opinionated styling.

<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>@tailng-ui/primitives</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Unstyled, composable primitives for Angular 21+ built with signals and strong accessibility contracts.
  </p>

  <p>
    <a href="https://github.com/tailng/tailng-ui">GitHub</a>
    ·
    <a href="https://tailng.dev">Documentation</a>
  </p>
</div>

[![PROD - Release & Deploy (Tailng)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/primitives.svg)](https://www.npmjs.com/package/@tailng-ui/primitives)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@tailng-ui/primitives` is the headless interaction layer used by TailNG components.  
Use it when you want full control over markup and styling while keeping robust behavior and accessibility.

## Installation

### pnpm

```bash
pnpm add @tailng-ui/primitives @tailng-ui/cdk
```

### yarn

```bash
yarn add @tailng-ui/primitives @tailng-ui/cdk
```

### npm

```bash
npm install @tailng-ui/primitives @tailng-ui/cdk
```

`@tailng-ui/primitives` no longer bundles the CDK layer transitively. Install
`@tailng-ui/cdk` explicitly alongside the primitives package.

Peer dependencies:

- `@angular/core` `^21.1.0 || ^22.0.0`
- `tslib` `^2.3.0`

## Design principles

- **Headless-first**: no visual styles, tokens, or CSS framework dependency.
- **Composable behavior**: each primitive solves one interaction concern cleanly.
- **A11y as default**: ARIA roles/states and keyboard support are built in.
- **Signals-oriented Angular APIs**: modern Angular patterns with standalone usage.

## Module coverage

The package exports primitives across major UI categories:

- **Navigation**: breadcrumb, context menu, dropdown menu, menu, menubar, navigation menu, tabs, toolbar.
- **Form**: listbox/option, autocomplete, button-toggle, checkbox, chips, combobox, input/input-otp, label, multiselect, multi-autocomplete, radio, select, slider, switch, textarea, toggle, toggle-group.
- **Layout**: accordion, bottom-sheet, card, collapsible, drawer, grid, separator, stepper, tree.
- **Overlay**: dialog, popover, tooltip.
- **Feedback**: empty, progress-bar, progress-spinner, skeleton, toast.
- **Utility**: avatar, badge, code-block, copy, press, tag.

## Quick example (`TngPress`)

`TngPress` enhances native `button` and `a` elements with safer defaults and interaction behavior.

```ts
import { Component } from '@angular/core';
import { TngPress } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  imports: [TngPress],
  template: `
    <button tngPress>Action</button>
    <a tngPress [disabled]="true">Disabled Link Button</a>
  `,
})
export class ExampleComponent {}
```

What it provides:

- Defaults `button[tngPress]` to `type="button"` to prevent accidental form submits.
- Supports ARIA attributes for toggle/disclosure patterns.
- Handles disabled interaction on anchor usage and exposes `data-disabled` hooks.
- Applies expected keyboard behavior to anchor elements used as button-like controls.

## When to use `@tailng-ui/primitives`

Use this package when you want:

- A custom design system with your own CSS architecture.
- Maximum control over template structure and slot composition.
- Behavior parity across plain CSS and Tailwind implementations.

Use `@tailng-ui/components` when you want ready-made styled components on top of these primitives.

## Documentation

- Package docs: [https://tailng.dev](https://tailng.dev)
- Repository: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)

## License

See the repository license at the root of the monorepo.
