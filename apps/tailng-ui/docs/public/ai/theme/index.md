---
id: theme/index
title: TailNG theme
description: Configure TailNG presets, runtime theme application, tokens, and component contracts.
category: theme
status: stable
tags: ["theme", "tokens", "presets"]
package: @tailng-ui/theme
sourcePaths: ["libs/tailng-ui/theme/src/index.ts", "libs/tailng-ui/theme/index.css"]
humanDocsUrl: https://tailng.dev/theme/guides/getting-started
---

# TailNG theme

The theme package has two complementary responsibilities:

- Runtime theme definitions and presets through `provideTailngTheme`.
- Component styling contracts through published CSS.

Most styled applications need both:

```ts
provideTailngTheme({ theme: defaultDarkThemePreset });
```

```css
@import '@tailng-ui/theme/index.css';
```

Read [runtime themes](https://tailng.dev/ai/theme/runtime.md) for preset application and [theme tokens](https://tailng.dev/ai/theme/tokens.md) for CSS customization.
