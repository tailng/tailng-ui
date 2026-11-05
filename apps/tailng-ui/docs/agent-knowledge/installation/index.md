---
id: installation/index
title: TailNG installation
description: Choose and verify the correct TailNG installation path for an Angular application.
category: installation
status: stable
tags: ['installation', 'packages', 'ownable']
sourcePaths: ['libs/tailng-ui/components/package.json', 'libs/tailng/cli/README.md']
humanDocsUrl: https://tailng.dev/components/getting-started/installation
---

# TailNG installation

TailNG supports two adoption paths.

## Package installation

Use published packages when the application should receive TailNG fixes through dependency upgrades. Start with [package installation](https://tailng.dev/ai/installation/packages.md).

## Ownable installation

Use the `tailng` CLI when the application should copy component source into the application for local ownership and customization. Start with [ownable installation](https://tailng.dev/ai/installation/ownable.md).

Do not mix the two paths for the same component without a deliberate migration plan. After either path, run the application's production build.
