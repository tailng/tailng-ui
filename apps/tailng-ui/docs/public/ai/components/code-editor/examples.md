---
id: "components/code-editor/examples"
title: "Code Editor examples"
description: "Code Editor examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["code-editor","form","examples"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/code-editor/tng-code-editor.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/examples/code-editor-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/examples/code-editor-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/examples/code-editor-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/code-editor/examples"
componentGroup: "form"
symbols: ["TngCodeEditorComponent"]
selectors: ["tng-code-editor"]
productId: "code-editor"
section: "examples"
officialCatalog: true
generated: true
---

# Code Editor examples

## Examples

Use one editor contract across languages, themes, and form states.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';

@Component({
  standalone: true,
  imports: [TngCodeEditorComponent],
  template: `<tng-code-editor />`,
})
export class CodeEditorExample {}
```
