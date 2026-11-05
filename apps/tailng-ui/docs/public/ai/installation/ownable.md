---
id: installation/ownable
title: Ownable installation
description: Copy a TailNG component into an Angular application with the TailNG CLI.
category: installation
status: stable
tags: ['ownable', 'cli', 'registry']
package: tailng
sourcePaths:
  - libs/tailng/cli/README.md
  - libs/tailng/cli/src/index.ts
  - libs/tailng-ui/registry/package.json
humanDocsUrl: https://tailng.dev/ownable/getting-started/quick-start
---

# Ownable installation

List the components supported by the installed CLI version:

```bash
pnpm dlx tailng list
```

Preview an installation:

```bash
pnpm dlx tailng add button --dry-run
```

Install into the current Angular application:

```bash
pnpm dlx tailng add button
```

Use `--cwd <path>` when the Angular application is not the current directory. Generated source is written below `src/app/tailng-ui/<component>/`.

Do not overwrite existing generated files unless the user explicitly wants replacement. The CLI rejects existing files by default; `--force` opts into overwrite behavior.

After generation, follow the CLI's import hints and run the application build.
