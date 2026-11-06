---
id: "components/fileupload/api"
title: "File Upload API"
description: "File Upload API reference for Angular applications."
category: "components"
status: "stable"
tags: ["fileupload","form","api"]
package: "@tailng-ui/primitives"
importPath: "@tailng-ui/primitives"
sourcePaths: ["libs/tailng-ui/primitives/src/lib/form/file-upload/index.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.types.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/api/fileupload-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/api/fileupload-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/api/fileupload-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/fileupload/api"
componentGroup: "form"
symbols: ["TngFileUploadDirective"]
selectors: ["[tngFileUpload]"]
productId: "fileupload"
section: "api"
officialCatalog: true
generated: true
---

# File Upload API

Drag-and-drop file selection with MIME type filtering, size limits, multi-file support, and reactive drag-state feedback.

## API reference

`TngFileUploadDirective` is a headless behavior directive — no wrapper component is required. Apply it to any element and wire the inputs and outputs directly on the host.

### Directive

Selector: `[tngFileUpload]` · Export: `tngFileUpload`

### Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `accept` | `string \| string[]` | `[]` | Accepted file types as extensions (`.png`), exact MIME types (`image/png`), or wildcard MIME groups (`image/*`). A string value is split on commas. An empty array allows all types. |
| `multiple` | `boolean` | `false` | Permits selecting more than one file at once. Extra files dropped when `false` are rejected with reason `multiple`. |
| `maxSize` | `number \| null` | `null` | Maximum allowed file size in bytes. `null` disables size checking. Files exceeding this limit are rejected with reason `size`. |
| `disabled` | `boolean` | `false` | Makes the drop zone fully passive — drag events are ignored and no outputs are emitted. Reflects `data-disabled` on the host element. |

### Outputs

| Output | Payload type | Notes |
| --- | --- | --- |
| `filesSelected` | `TngFileUploadSelectedEvent` | Emitted when one or more files pass validation. Payload contains `files: readonly File[]` and `source: 'drop' \| 'input'`. |
| `filesRejected` | `TngFileUploadRejectedEvent` | Emitted when one or more files fail validation. Payload contains `rejected: readonly TngFileUploadRejectedFile[]` (each with `file`, `reason`, and `message`) and the co-emitted `accepted` files for correlation. |
| `dragStateChange` | `TngFileUploadDragState` | Emitted whenever the drag interaction state transitions between `'idle'`, `'dragging'`, and `'rejected'`. |

### Public state

| Member | Type | Notes |
| --- | --- | --- |
| `dragState` | `Signal<TngFileUploadDragState>` | Reactive drag state readable via the `tngFileUpload` template reference. Useful when template-driven feedback is preferred over the output event. |

### Drag and drop behavior

### Type reference

| Type | Definition |
| --- | --- |
| `TngFileUploadDragState` | `'idle' \| 'dragging' \| 'rejected'` |
| `TngFileUploadSource` | `'drop' \| 'input'` |
| `TngFileUploadRejectReason` | `'disabled' \| 'multiple' \| 'type' \| 'size' \| 'empty'` |
| `TngFileUploadRejectedFile` | `{ file: File; reason: TngFileUploadRejectReason; message: string }` |
| `TngFileUploadSelectedEvent` | `{ files: readonly File[]; source: TngFileUploadSource }` |
| `TngFileUploadRejectedEvent` | `{ rejected: readonly TngFileUploadRejectedFile[]; accepted: readonly File[]; source: TngFileUploadSource }` |

## Source-derived public Angular API

### `TngFileUploadDirective` — `[tngFileUpload]`

- Inputs: `accept`, `disabled`, `maxSize`, `multiple`
- Outputs: `dragStateChange`, `filesRejected`, `filesSelected`
