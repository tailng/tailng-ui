---
id: theme/tokens
title: Theme tokens and contracts
description: Customize TailNG semantic variables and component contract styles.
category: theme
status: stable
tags: ["tokens", "css-variables", "contracts"]
package: @tailng-ui/theme
sourcePaths: ["libs/tailng-ui/theme/README.md", "libs/tailng-ui/theme/src/lib/component-contracts/index.css"]
humanDocsUrl: https://tailng.dev/theme/reference/styling
---

# Theme tokens and contracts

Import the full component contract bundle:

```css
@import '@tailng-ui/theme/component-contracts/index.css';
```

Override shared control variables on `:root`, a theme scope, or a component subtree:

```css
:root {
  --tng-control-bg: var(--tng-semantic-background-surface);
  --tng-control-fg: var(--tng-semantic-foreground-primary);
  --tng-control-border: var(--tng-semantic-border-strong);
  --tng-control-radius: 0.5rem;
  --tng-focus-ring-color: var(--tng-semantic-focus-ring);
}
```

Prefer semantic and shared contract variables over selectors that depend on internal component markup. Scope an override to a component subtree when the change should not affect the whole application.
