---
id: "components/textarea/api"
title: "Textarea API"
description: "Textarea API reference for Angular applications."
category: "components"
status: "stable"
tags: ["textarea","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/textarea/tng-textarea.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/api/textarea-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/api/textarea-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/textarea/sections/api/textarea-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/textarea/api"
componentGroup: "form"
symbols: ["TngTextareaComponent"]
selectors: ["tng-textarea"]
productId: "textarea"
section: "api"
officialCatalog: true
generated: true
---

# Textarea API

Multiline text input patterns with input-first primitives and styled textarea wrappers.

## API reference

The component-side textarea contract has two layers: the headless `textarea[tngTextarea]` primitive and the self-rendering `<tng-textarea>` wrapper.

### Primitive: `textarea[tngTextarea]`

Use the directive when you want a real native textarea plus TailNG’s normalized `rows`, `resize`, and shared input-state contract.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `rows` | `number` | `3` | Normalized to a minimum of `1`. |
| `resize` | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | `'vertical'` | Applied to both `style.resize` and `data-resize`. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` | `string \| null` | `null` | Inherited from the shared input contract with whitespace normalization. |
| `ariaInvalid`, `ariaRequired` | `boolean \| null` | `null` | ARIA pass-through follows nullable coercion rules. |
| `disabled`, `readonly`, `required` | boolean-like | `false` / `null` | Forwarded to the native textarea through the shared input directive. |
| `data-slot="input"`, `data-resize` | output attributes | — | Stable styling hooks emitted on the native textarea element. |

### Component: `<tng-textarea>`

Renders an internal native `<textarea>` that already uses the shared input contract. Use it when you want the default TailNG textarea shell and a controlled-value API.

| Input / Output | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` | Controlled value for the inner native textarea. |
| `valueChange` | `output<string>` | — | Emits on input events when the value changes. |
| `id`, `name`, `placeholder` | `string \| null` | `null` | Forwarded to the internal native textarea. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` | `string \| null` | `null` | Accessible naming and description inputs passed through to the internal control. |
| `ariaInvalid`, `ariaRequired` | `boolean \| null` | `null` | Forwarded to the internal `tngInput` primitive. |
| `disabled`, `readonly`, `required` | boolean-like | `false` | Maps directly to the internal native textarea state. |
| `rows` | `number` | `3` | Normalized to at least `1` before it reaches the internal control. |
| `resize` | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | `'vertical'` | Applied to the internal control style and mirrored as `data-resize`. |

### Composition note

`tngTextarea` composes the shared `tngInput` behavior internally. That means the textarea-specific primitive owns `rows` and `resize`, while accessible naming and state attributes still follow the shared input rules.

## Source-derived public Angular API

### `TngTextareaComponent` — `tng-textarea`

- Inputs: `ariaDescribedBy`, `ariaInvalid`, `ariaLabel`, `ariaLabelledby`, `ariaRequired`, `disabled`, `id`, `inputName`, `placeholder`, `readonly`, `required`, `resize`, `rows`
- Two-way models: `value`
