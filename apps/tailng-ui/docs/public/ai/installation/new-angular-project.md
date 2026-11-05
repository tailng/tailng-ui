---
id: installation/new-angular-project
title: New Angular project
description: Create a standalone Angular project and add TailNG packages and configuration.
category: installation
status: stable
tags: ["angular-cli", "standalone", "quick-start"]
package: @tailng-ui/components
sourcePaths: ["package.json", "apps/tailng-ui/docs/src/app/pages/components/getting-started/plain-css-setup/plain-css-setup-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/getting-started/plain-css-setup
---

# New Angular project

Create a standalone application with routing and CSS:

```bash
ng new tailng-app --standalone --routing --style css
cd tailng-app
```

Install TailNG:

```bash
pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons
```

Then:

1. Configure the theme provider using the [standalone Angular guide](https://tailng.dev/ai/configuration/standalone-angular.md).
2. Import the TailNG stylesheet using the [plain CSS guide](https://tailng.dev/ai/configuration/plain-css.md).
3. Add the required standalone component imports.
4. Run `ng build` or the project's production build command.

Do not continue to feature development while Angular reports missing peer dependencies, unknown TailNG elements, or unresolved CSS imports.
