---
id: "components/code-editor/api"
title: "Code Editor API"
description: "Code Editor API reference for Angular applications."
category: "components"
status: "stable"
tags: ["code-editor","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/code-editor/tng-code-editor.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/api/code-editor-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/api/code-editor-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/code-editor/sections/api/code-editor-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/code-editor/api"
componentGroup: "form"
symbols: ["TngCodeEditorComponent"]
selectors: ["tng-code-editor"]
productId: "code-editor"
section: "api"
officialCatalog: true
generated: true
---

# Code Editor API

Editable source code with adapter-based highlighting, native textarea semantics, and synchronized overlay rendering.

## API reference

`<tng-code-editor>` is a model-backed form component with an optional highlighting adapter.

### Value and form state

| Input / output | Type | Default |
| --- | --- | --- |
| `value` / `valueChange` | `string` / output<string> | `''` |
| `disabled`, `readonly`, `required` | boolean-like | `false` |
| `rows` | `number` | `10` |
| `placeholder`, `id`, `name` | `string \| null` | `null` |

### Highlighting

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `language`, `adapter`, `theme` | `string \| null` | `null` | Passed to the registered highlighting adapter. |
| `highlight` | `boolean` | `true` | Disable to keep the escaped plain-text overlay. |
| `highlightDebounceMs` | `number` | `75` | Delays adapter work during rapid editing. |
| `sanitizeHtml` | `boolean \| 'auto'` | `'auto'` | Trusted adapter HTML is bypassed only when explicitly false. |
| `renderStateChange` | output | — | Emits highlighting, highlighted, idle, and error transitions. |

### Native textarea contract

`tabSize` defaults to `4`. Accessible naming accepts `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy`, `ariaInvalid`, and `ariaRequired`. Autocomplete, autocorrect, autocapitalization, spellcheck, and wrapping use code-oriented defaults.

### Render lifecycle

The editor paints escaped source immediately, debounces adapter work, ignores stale async results, and retains plain source when an adapter is unsupported or fails.

## Source-derived public Angular API

### `TngCodeEditorComponent` — `tng-code-editor`

- Inputs: `adapter`, `ariaDescribedBy`, `ariaInvalid`, `ariaLabel`, `ariaLabelledby`, `ariaRequired`, `disabled`, `highlight`, `highlightDebounceMs`, `id`, `inputName`, `language`, `placeholder`, `readonly`, `required`, `rows`, `sanitizeHtml`, `tabSize`, `theme`
- Two-way models: `value`
- Outputs: `renderStateChange`
