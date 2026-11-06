---
id: "components/fileupload/overview"
title: "File Upload component"
description: "Drag-and-drop file selection with MIME type filtering, size limits, multi-file support, and reactive drag-state feedback."
category: "components"
status: "stable"
tags: ["fileupload","form","component"]
package: "@tailng-ui/primitives"
importPath: "@tailng-ui/primitives"
sourcePaths: ["libs/tailng-ui/primitives/src/lib/form/file-upload/index.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.types.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/routes.ts"]
humanDocsUrl: "https://tailng.dev/components/form/fileupload/overview"
componentGroup: "form"
symbols: ["TngFileUploadDirective"]
selectors: ["[tngFileUpload]"]
productId: "fileupload"
section: "overview"
officialCatalog: true
generated: true
---

# File Upload component

Drag-and-drop file selection with MIME type filtering, size limits, multi-file support, and reactive drag-state feedback.

## Package and import

Import the standalone Angular API from `@tailng-ui/primitives`:

```ts
import { Component } from '@angular/core';
import { TngFileUploadDirective } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  imports: [TngFileUploadDirective],
  template: `<div tngFileUpload></div>`,
})
export class FileuploadAgentExample {}
```

## Component family

- `TngFileUploadDirective` — selector `[tngFileUpload]`

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

Use the [human documentation](https://tailng.dev/components/form/fileupload/overview) for visual examples and extended API guidance.

## Documentation sections

- [Api](https://tailng.dev/ai/components/fileupload/api.md)
- [Styling](https://tailng.dev/ai/components/fileupload/styling.md)
- [Examples](https://tailng.dev/ai/components/fileupload/examples.md)
