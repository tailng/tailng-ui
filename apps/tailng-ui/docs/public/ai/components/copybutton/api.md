---
id: "components/copybutton/api"
title: "CopyButton API"
description: "CopyButton API reference for Angular applications."
category: "components"
status: "stable"
tags: ["copybutton","utility","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/utility/copy-button/tng-copy-button.component.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/routes.ts","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/api/copybutton-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/api/copybutton-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/utility/copybutton/sections/api/copybutton-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/utility/copybutton/api"
componentGroup: "utility"
symbols: ["TngCopyButtonComponent"]
selectors: ["tng-copy-button"]
productId: "copybutton"
section: "api"
officialCatalog: true
generated: true
---

# CopyButton API

Clipboard actions, success/error states, and feedback hooks.

## API reference

`<tng-copy-button>` gives you a ready-made copy control on top of the headless clipboard primitive.

### Wrapper component

The wrapper renders a native button, swaps its label and icon state while copying, and exposes a polite live region for success and error feedback. Use it when you want a production-ready copy control without owning the transient state machine yourself.

### Content and feedback inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | `string \| null \| undefined` | `undefined` | Explicit text payload to copy. |
| `from` | `TngCopyFromTarget` | `null` | Fallback source element or selector when `text` is omitted. |
| `ignoreSelectors` | `string \| string[] \| null` | `null` | Removes matched nodes from copied DOM text when copying from another element. |
| `appearance` | `'outline' \| 'solid' \| 'ghost'` | `'outline'` | Controls the default wrapper treatment. |
| `size` | `'sm' \| 'md'` | `'md'` | Changes minimum height and horizontal padding. |
| `showIcon` | `boolean` | `true` | Shows or hides the icon slot. |
| `disabled` | `boolean` | `false` | Disables all copy interaction. |
| `resetDelay` | `number` | `1500` | Milliseconds before the wrapper returns to the idle state. |
| `copyLabel`, `copyingLabel`, `copiedLabel`, `errorLabel` | `string` | built-in defaults | Label text for each wrapper state. |
| `copyIconText`, `copiedIconText` | `string` | `⧉`, `✓` | Fallback icon glyphs when no projected icon content is provided. |

| Output | Payload | Description |
| --- | --- | --- |
| `tngCopied` | `string` | Emits the copied text after success. |
| `tngCopyError` | `Error` | Emits a normalized error when the copy attempt fails. |

### Primitive foundation

Under the hood, the wrapper forwards `text`, `from`, and `ignoreSelectors` into the headless `tngCopy` directive. If you need hotkeys, programmatic copy, or owner-managed live announcements, move to the dedicated headless `CopyButton` page and use `tngCopy` directly.

## Source-derived public Angular API

### `TngCopyButtonComponent` — `tng-copy-button`

- Inputs: `appearance`, `copiedIconText`, `copiedLabel`, `copyIconText`, `copyingLabel`, `copyLabel`, `disabled`, `errorLabel`, `from`, `ignoreSelectors`, `resetDelay`, `showIcon`, `size`, `text`
- Outputs: `tngCopied`, `tngCopyError`
