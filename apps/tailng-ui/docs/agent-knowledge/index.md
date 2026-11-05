---
id: index
title: TailNG agent guide
description: Entry point for installing, configuring, and using TailNG in Angular applications.
category: overview
status: stable
tags: ['tailng', 'angular', 'agents']
sourcePaths: ['package.json', 'apps/tailng-ui/docs/src/app/pages']
humanDocsUrl: https://tailng.dev/
---

# TailNG agent guide

Use this documentation when creating or modifying an Angular application with TailNG.

## Required workflow

1. Read the [package versions](https://tailng.dev/ai/versions.json).
2. Choose package installation or ownable installation from the [installation guide](https://tailng.dev/ai/installation/index.md).
3. Apply the [Angular configuration](https://tailng.dev/ai/configuration/index.md).
4. Import only the components used by the application.
5. Configure [theme](https://tailng.dev/ai/theme/index.md) and [icons](https://tailng.dev/ai/icons/index.md) when required.
6. Run the application's production build and fix integration errors before adding more UI.

Do not guess package names, exports, selectors, providers, or CSS entry points. Use the documents in the machine-readable [index](https://tailng.dev/ai/index.json).
