---
id: configuration/standalone-angular
title: Standalone Angular configuration
description: Register the TailNG runtime theme in an Angular ApplicationConfig.
category: configuration
status: stable
tags: ["angular", "application-config", "provider"]
package: @tailng-ui/theme
sourcePaths: ["libs/tailng-ui/theme/src/lib/adapters/angular/provide-tailng-theme.ts", "apps/tailng-ui/docs/src/app/pages/components/getting-started/plain-css-setup/plain-css-setup-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/getting-started/configure-theme
---

# Standalone Angular configuration

Register the TailNG theme provider once near the application root:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { defaultDarkThemePreset, provideTailngTheme } from '@tailng-ui/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideTailngTheme({ theme: defaultDarkThemePreset })],
};
```

`provideTailngTheme` applies the selected theme through TailNG's Angular adapter. Import it from `@tailng-ui/theme`; do not use an invented `provideTheme` helper.

Configure icon providers separately when required.
