---
id: "components/fileupload/examples"
title: "File Upload examples"
description: "File Upload examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["fileupload","form","examples"]
package: "@tailng-ui/primitives"
importPath: "@tailng-ui/primitives"
sourcePaths: ["libs/tailng-ui/primitives/src/lib/form/file-upload/index.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.types.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/examples/fileupload-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/examples/fileupload-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/examples/fileupload-examples-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/fileupload/examples"
componentGroup: "form"
symbols: ["TngFileUploadDirective"]
selectors: ["[tngFileUpload]"]
productId: "fileupload"
section: "examples"
officialCatalog: true
generated: true
---

# File Upload examples

## Examples

Common file upload patterns using the `tngFileUpload` directive with Plain-CSS and Tailwind styling.

## Minimal example

```ts
import { Component } from '@angular/core';
import { TngFileUploadDirective } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  imports: [TngFileUploadDirective],
  template: `<div tngFileUpload></div>`,
})
export class FileuploadExample {}
```
