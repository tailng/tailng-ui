---
id: configuration/index
title: TailNG configuration
description: Configure TailNG providers, global styles, and styling strategy in Angular.
category: configuration
status: stable
tags: ['configuration', 'providers', 'styles']
sourcePaths: ['apps/tailng-ui/docs/src/app/pages/components/getting-started']
humanDocsUrl: https://tailng.dev/components/getting-started/configure-theme
---

# TailNG configuration

For a standalone Angular application:

1. Configure the runtime theme provider with [standalone Angular configuration](https://tailng.dev/ai/configuration/standalone-angular.md).
2. Choose exactly one styling setup:
   - [Plain CSS](https://tailng.dev/ai/configuration/plain-css.md)
   - [Tailwind CSS](https://tailng.dev/ai/configuration/tailwind.md)
3. Configure [icons](https://tailng.dev/ai/icons/index.md) only when the application uses `tng-icon` or components that require registered icons.
4. Import each standalone TailNG component in the Angular component that uses it.
