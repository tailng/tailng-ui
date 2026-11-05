---
id: theme/runtime
title: Runtime themes
description: Apply a built-in TailNG theme preset with provideTailngTheme.
category: theme
status: stable
tags: ["theme", "provider", "presets"]
package: @tailng-ui/theme
sourcePaths: ["libs/tailng-ui/theme/src/index.ts", "libs/tailng-ui/theme/src/lib/adapters/angular/provide-tailng-theme.ts"]
humanDocsUrl: https://tailng.dev/theme/guides/getting-started
---

# Runtime themes

Apply a preset in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { defaultThemePreset, provideTailngTheme } from '@tailng-ui/theme';

export const appConfig: ApplicationConfig = {
  providers: [provideTailngTheme({ theme: defaultThemePreset })],
};
```

Built-in exports include default, minimal, slate, nexus, prism, atlas, sterling, and daybook-classic presets, with light and dark variants where exported by the package.

Use `createTheme` or `mergeTheme` for programmatic theme composition. Use `toCssVars` when CSS variable output is needed outside the Angular provider.
