---
id: "components/fileupload/styling"
title: "File Upload styling"
description: "File Upload styling reference for Angular applications."
category: "components"
status: "stable"
tags: ["fileupload","form","styling"]
package: "@tailng-ui/primitives"
importPath: "@tailng-ui/primitives"
sourcePaths: ["libs/tailng-ui/primitives/src/lib/form/file-upload/index.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.types.ts","libs/tailng-ui/primitives/src/lib/form/file-upload/tng-file-upload.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/styling/fileupload-styling-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/styling/fileupload-styling-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/fileupload/sections/styling/fileupload-styling-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/fileupload/styling"
componentGroup: "form"
symbols: ["TngFileUploadDirective"]
selectors: ["[tngFileUpload]"]
productId: "fileupload"
section: "styling"
officialCatalog: true
generated: true
---

# File Upload styling

## Styling contract

`tngFileUpload` reflects drag and validation state exclusively through stable `data-*` attributes, leaving all visual decisions to the consuming stylesheet. No class names are applied internally.

### Host attributes

| Attribute | Values | Usage |
| --- | --- | --- |
| `data-file-upload` | Always present | Stable root selector. Use it to scope styles to all file upload zones without coupling to the directive's attribute selector. |
| `data-dragging` | Present / absent | Set while a drag gesture is active over the zone. Drive hover-highlight and border-color transitions from this attribute. |
| `data-rejected` | Present / absent | Reserved for implementations that surface a rejected drag state (e.g., when dragging a file type not in the `accept` list). |
| `data-disabled` | Present / absent | Applied when `[disabled]="true"`. Use to suppress hover styles and show a `not-allowed` cursor. |

### Example contract overrides

#### fileupload.contract.css

```css
/* Base drop zone */

[tngFileUpload] {
  background: var(--tng-control-bg);
  border: 2px dashed var(--tng-control-border);
  border-radius: var(--tng-control-radius);
  padding: 2rem;
  transition: var(--tng-transition-colors);
}

/* Active drag state */

[tngFileUpload][data-dragging] {
  background: color-mix(in srgb, var(--tng-control-accent) 8%, var(--tng-control-bg));
  border-color: var(--tng-control-accent);
}

/* Disabled state */

[tngFileUpload][data-disabled] {
  cursor: not-allowed;
  opacity: 0.55;
}
```

### Tailwind targeting

Use the attribute variant syntax to scope utilities to drag and disabled states directly in the template:
