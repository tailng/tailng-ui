---
id: installation/packages
title: Package installation
description: Install the TailNG component, primitive, CDK, theme, and icon packages.
category: installation
status: stable
tags: ["installation", "npm", "pnpm", "yarn"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/package.json", "libs/tailng-ui/theme/package.json", "libs/tailng-ui/icons/package.json"]
humanDocsUrl: https://tailng.dev/components/getting-started/installation
---

# Package installation

Check [versions.json](https://tailng.dev/ai/versions.json) before installation. The component package declares its supported Angular range and its TailNG peer dependencies there.

## Styled components with theme and icons

```bash
pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons
```

```bash
npm install @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons
```

```bash
yarn add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons
```

`@tailng-ui/components` ships separately from `@tailng-ui/primitives` and `@tailng-ui/cdk`; install those packages explicitly.

Next, apply the [standalone Angular configuration](https://tailng.dev/ai/configuration/standalone-angular.md), then choose [plain CSS](https://tailng.dev/ai/configuration/plain-css.md) or [Tailwind CSS](https://tailng.dev/ai/configuration/tailwind.md).
