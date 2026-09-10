<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="120"
    alt="TailNG logo"
  />

  <h1>TailNG</h1>

  <p>
    <strong>Accessible Angular UI, built to be owned.</strong>
  </p>

  <p>
    Angular 21+ components, headless primitives, theme contracts, and ownable source installs
    for teams building design systems and application UI.
  </p>
</div>

---

[![Build Status](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml/badge.svg)](https://github.com/tailng/tailng-ui/actions/workflows/prod-build-deploy.yml)
[![NPM Version](https://img.shields.io/npm/v/@tailng-ui/components.svg)](https://www.npmjs.com/package/@tailng-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is TailNG?

TailNG is an open-source Angular UI system for applications and design systems that need accessible behavior, strict type safety, and implementation ownership.

The monorepo provides:

- Ready-to-use styled Angular components.
- Headless primitives for custom UI systems.
- Low-level accessibility, collection, overlay, and runtime utilities.
- Theme contracts, CSS variable tooling, and Tailwind adapters.
- A copy-source registry and CLI for shadcn-style local component ownership.
- Documentation and playground apps for package, Tailwind, plain CSS, and registry workflows.

TailNG is built with Angular 21+, standalone APIs, signals, Nx, Vitest, and strict ESLint boundaries.

## Packages

| Package                 | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `@tailng-ui/components` | Styled Angular components built on TailNG primitives.                                |
| `@tailng-ui/primitives` | Headless, accessibility-first Angular primitives.                                    |
| `@tailng-ui/cdk`        | Behavior, accessibility, collection, overlay, and runtime utilities.                 |
| `@tailng-ui/theme`      | Theme contracts, presets, CSS variables, component contracts, and Tailwind adapters. |
| `@tailng-ui/icons`      | Angular icon wrappers backed by `@ng-icons`.                                         |
| `@tailng-ui/charts`     | Apache ECharts wrappers for Angular.                                                 |
| `@tailng-ui/flow`       | Optional workflow editor for AI agents, powered by Foblex Flow.                      |
| `@tailng-ui/registry`   | Metadata for ownable component installs.                                             |
| `tailng`                | CLI for listing and copying ownable components into Angular apps.                    |

## Installation

Install styled components:

```bash
pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk
```

Install headless primitives:

```bash
pnpm add @tailng-ui/primitives @tailng-ui/cdk
```

Install the theme package:

```bash
pnpm add @tailng-ui/theme
```

Install the optional Flow Editor package and its graph-engine peers:

```bash
pnpm add @tailng-ui/flow @tailng-ui/components @tailng-ui/icons \
  @foblex/flow @foblex/2d @foblex/mediator @foblex/platform @foblex/utils
```

Use the ownable-source CLI without adding it permanently:

```bash
pnpm dlx tailng list
pnpm dlx tailng add button
```

Primary peer dependencies:

- `@angular/core` `^21.1.0`
- `@angular/common` `^21.1.0`
- `@angular/forms` `^21.1.0`
- `@angular/platform-browser` `^21.1.0`
- `@angular/router` `^21.1.0`
- `tslib` `^2.3.0`

Package-specific peer dependencies are listed in each package README.

## Quick Example

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

For headless usage:

```ts
import { Component } from '@angular/core';
import { TngPress } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  imports: [TngPress],
  template: `<button tngPress>Action</button>`,
})
export class ExampleComponent {}
```

## Architecture

TailNG is organized as an Nx workspace with layered packages:

```text
apps/
  tailng-ui/
    docs/                  Documentation site
    playground-plain-css/  Plain CSS playground
    playground-registry/   Ownable install playground
    playground-tailwind/   Tailwind playground

libs/
  tailng/
    cli/                   tailng command-line tool
  tailng-ui/
    cdk/                   Headless behavior and runtime utilities
    primitives/            Headless Angular primitives
    components/            Styled Angular components
    theme/                 Theme engine and CSS contracts
    icons/                 Icon wrappers
    charts/                Chart wrappers
    flow/                  Optional workflow editor and Foblex integration
    registry/              Ownable install metadata
```

Layering rules:

- Components depend on primitives and CDK contracts.
- Primitives depend on CDK behavior utilities.
- Styling is separated from behavior.
- Heavy third-party integrations such as Foblex are isolated from the core component package.
- Public APIs are exported from package entry points.
- Deep imports are avoided.
- Accessibility and keyboard behavior are treated as package contracts.

## Product Direction

TailNG is moving toward a component platform that supports both package installs and source ownership.

Current priorities:

- Accessibility-first primitives and components.
- Wrapper abstractions that keep app usage simple.
- Component style contracts for slots, states, tokens, and hooks.
- No hard dependency on Tailwind or any single CSS framework.
- Copy-source installation through the `tailng` CLI.
- Stable package boundaries across CDK, primitives, components, theme, registry, and docs.

## Development

Requirements:

- Node.js `>=20.20.0`
- pnpm `>=10.30.0`

Install dependencies:

```bash
pnpm install
```

Run the documentation site:

```bash
pnpm start:docs
```

Run playgrounds:

```bash
pnpm start:vanilla
pnpm start:tailwind
```

Build packages and apps:

```bash
pnpm run build
```

Build selected targets:

```bash
pnpm run build:docs
pnpm run build:theme
pnpm run build:cli
pnpm run build:vanilla
pnpm run build:tailwind
```

Build and publish docs locally (Cloudflare Pages):

```bash
CF_DOCS_PROJECT_NAME=taling-dev \
CLOUDFLARE_API_TOKEN=xxxxxx \
CLOUDFLARE_ACCOUNT_ID=xxxxxxx \
./tools/build-deploy-docs.sh
```

Notes:

- `CF_DOCS_PROJECT_NAME` maps to the Cloudflare Pages project name.
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are required by `wrangler`.
- If needed, you can override branch and output behavior with `CF_PAGES_BRANCH` and `DOCS_DIST`.

Generate static output:

```bash
pnpm run seo:docs
pnpm run seo:vanilla
pnpm run seo:tailwind
```

If prerendering fails because Chrome is missing, install the browser once:

```bash
pnpm exec puppeteer browsers install chrome
```

## Testing and Quality

Run all package tests:

```bash
pnpm run test:packages
```

Run the full Vitest suite:

```bash
pnpm run test:all
```

Run targeted tests:

```bash
pnpm run test:cdk
pnpm run test:primitives
pnpm run test:components
pnpm run test:theme
pnpm run test:icons
pnpm run test:charts
pnpm run test:flow
pnpm run test:registry
pnpm run test:cli
pnpm run test:docs
```

Lint and format:

```bash
pnpm run lint
pnpm run format:nx
pnpm run format:prettier

pnpm nx lint docs
pnpm nx lint cdk
pnpm nx lint primitives

```

Typecheck key package surfaces:

```bash
pnpm run typecheck:registry
pnpm run typecheck:cli
pnpm run typecheck:docs
```

Run the ownable install contract checks:

```bash
pnpm run verify:ownable-contracts
```

## TailNG CLI

Build and run the local CLI:

```bash
pnpm run build:cli
pnpm run run:tailng -- list
```

Preview generated files:

```bash
pnpm run run:tailng -- add button --cwd apps/tailng-ui/playground-registry --dry-run
```

Generate files:

```bash
pnpm run run:tailng -- add button --cwd apps/tailng-ui/playground-registry
```

Overwrite existing generated files:

```bash
pnpm run run:tailng -- add button --cwd apps/tailng-ui/playground-registry --force
```

`tailng add <component-name>` writes source under:

```text
<cwd>/src/app/tailng-ui/<component>/
```

Import generated components from the local app path:

```ts
import { TngButton } from './tailng-ui/button';
```

Common aliases supported by `tailng add`:

| Alias                                     | Canonical item     |
| ----------------------------------------- | ------------------ |
| `slide-toggle`                            | `switch`           |
| `sidenav`, `sidebar`, `side-nav`, `sheet` | `drawer`           |
| `expansion-panel`                         | `accordion`        |
| `spinner`                                 | `progress-spinner` |
| `snackbar`, `sonner`                      | `toast`            |

## Component Guidelines

- Use standalone Angular APIs.
- Prefer signals and `input()` for component inputs.
- Keep behavior and styling separate.
- Avoid default exports.
- Use explicit return types.
- Keep public APIs intentional and documented.
- Preserve accessibility semantics, roles, states, and keyboard behavior.
- Add or update tests when changing behavior.

## Documentation

- Website: [https://tailng.dev](https://tailng.dev)
- GitHub: [https://github.com/tailng/tailng-ui](https://github.com/tailng/tailng-ui)
- npm components: [@tailng-ui/components](https://www.npmjs.com/package/@tailng-ui/components)
- npm CLI: [tailng](https://www.npmjs.com/package/tailng)

## Contributing

Contributions are welcome.

Before submitting a PR:

- Run relevant tests and lint checks.
- Respect Nx boundaries and package layering.
- Avoid deep imports.
- Keep typing strict.
- Include docs or playground coverage for user-facing changes.

## License

MIT © 2026 TailNG
