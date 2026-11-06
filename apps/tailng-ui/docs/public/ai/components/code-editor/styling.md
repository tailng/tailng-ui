---
id: "components/code-editor/styling"
title: "Code Editor styling"
description: "Code Editor styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["code-editor","form","styling"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/code-editor/tng-code-editor.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/styling/code-editor-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/styling/code-editor-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/styling/code-editor-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/code-editor/styling"
componentGroup: "form"
symbols: ["TngCodeEditorComponent"]
selectors: ["tng-code-editor"]
productId: "code-editor"
section: "styling"
officialCatalog: true
generated: true
---

# Code Editor styling

## Styling contract

Code Editor is token-first and exposes stable slots and render states without requiring consumers to depend on its overlay DOM order.

### Theme tokens

Surface, border, focus, foreground, caret, selection, typography, and padding can be customized through `--tng-code-editor-*` properties.

### Slot and state hooks

### Overlay invariant

The highlight and textarea layers must keep identical font, letter spacing, line height, padding, tab size, and whitespace behavior. Override the public editor tokens rather than styling only one layer.
