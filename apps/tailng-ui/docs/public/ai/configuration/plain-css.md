---
id: configuration/plain-css
title: Plain CSS configuration
description: Load TailNG component contracts and customize semantic variables with plain CSS.
category: configuration
status: stable
tags: ["css", "styles", "tokens"]
package: @tailng-ui/theme
sourcePaths: ["libs/tailng-ui/theme/index.css", "libs/tailng-ui/theme/src/lib/component-contracts/index.css"]
humanDocsUrl: https://tailng.dev/components/getting-started/plain-css-setup
---

# Plain CSS configuration

Import the published theme stylesheet once in `src/styles.css`:

```css
@import '@tailng-ui/theme/index.css';
```

The root stylesheet imports the complete component-contract bundle. To load contracts without the root entry point, use:

```css
@import '@tailng-ui/theme/component-contracts/index.css';
```

Override semantic variables after the import:

```css
:root {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: rgb(37 99 235 / 35%);
}
```

Do not reference `@tailng-ui/theme/css`; that is not a published package export in the current package manifest.
