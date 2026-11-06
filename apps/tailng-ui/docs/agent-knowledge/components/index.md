---
id: components/index
title: TailNG components
description: Discover the documented TailNG styled components and their Angular imports.
category: components
status: stable
tags: ["components", "angular", "imports"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/src/index.ts", "apps/tailng-ui/docs/src/app/pages/components/component-docs.data.ts"]
humanDocsUrl: https://tailng.dev/components
---

# TailNG components

TailNG component products use standalone Angular components and directives exported from
`@tailng-ui/components`, `@tailng-ui/flow`, and selected `@tailng-ui/primitives` APIs.

The catalog below covers every official styled component product and every additional
top-level component exported by the package. Compound component symbols are documented
with their parent product.

<!-- COMPONENT_CATALOG -->

For every component:

1. Import the component class into the consuming standalone Angular component.
2. Use the documented selector and public inputs.
3. Load the TailNG theme contract stylesheet.
4. Provide an accessible name where the component does not have visible labelling.
5. Run the Angular production build after integration.

Consult the [human component catalog](https://tailng.dev/components) for interactive examples and verify package compatibility in [the version manifest](https://tailng.dev/ai/versions.json) before installation.
