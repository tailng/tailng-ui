---
id: "components/radio/api"
title: "Radio API"
description: "Radio API reference for Angular applications."
category: "components"
status: "stable"
tags: ["radio","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/radio/tng-radio.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/api/radio-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/api/radio-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/radio/sections/api/radio-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/radio/api"
componentGroup: "form"
symbols: ["TngRadioComponent"]
selectors: ["tng-radio"]
productId: "radio"
section: "api"
officialCatalog: true
generated: true
---

# Radio API

Single-choice grouped selection with native semantics and keyboard behavior.

## API reference

Radio keeps the native radio behavior at the primitive layer and exposes a styled wrapper for product teams that want a ready-to-ship shell.

### `tngRadio` (directive)

Attach to `input[tngRadio]` and rely on native radio grouping through a shared `name`.

#### Primitive attachment

```html
<label class="radio-row">
  <input tngRadio name="plan" value="starter" />
  <span>Starter</span>
</label>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | `boolean \| '' \| string` | `false` | Checked state for controlled usage. |
| `disabled` | `boolean \| '' \| string` | `false` | Blocks user interaction. |
| `readonly` | `boolean \| '' \| string` | `false` | Keeps focusable semantics while preventing value change. |
| `required` | `boolean \| '' \| string` | `false` | Reflects native required attribute. |
| `invalid`, `ariaInvalid` | `boolean \| null \| '' \| 'true' \| 'false'` | `null` | Validation state hooks for ARIA and styling. |
| `name`, `value` | `string \| null` | `null` | Native group and form-submission semantics. |
| `ariaDescribedBy` | `string \| null` | `null` | Associates helper/error text. |

#### Helper text association

```html
<p id="plan-help">Choose one plan.</p>
<label class="radio-row">
  <input tngRadio ariaDescribedBy="plan-help" />
  <span>Starter</span>
</label>
```

### `tng-radio` (styled component)

Styled wrapper forwarding primitive behavior and emitting `checkedChange` only when interaction is allowed.

#### Styled attachment

```html
<tng-radio
  name="plan"
  value="pro"
  [checked]="plan === 'pro'"
  (checkedChange)="onPlanChecked('pro', $event)"
>
  Pro
</tng-radio>
```

| API | Type | Details |
| --- | --- | --- |
| Inputs | `checked`, `disabled`, `readonly`, `required`, `invalid`, `ariaInvalid`, `name`, `value`, `ariaDescribedBy` | Forwarded to the primitive input and internal wrapper state. |
| Output | `checkedChange: boolean` | Emits the checked state of the radio that was interacted with. |
| Default value | `value = 'on'` | Override the value for meaningful form posts or controlled groups. |
| Projected content | Label text/content | The projected content becomes the visible label and accessible name. |

## Source-derived public Angular API

### `TngRadioComponent` — `tng-radio`

- Inputs: `ariaDescribedBy`, `ariaInvalid`, `disabled`, `inputName`, `inputValue`, `invalid`, `readonly`, `required`
- Two-way models: `checked`
