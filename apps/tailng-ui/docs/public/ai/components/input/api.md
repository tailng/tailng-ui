---
id: "components/input/api"
title: "Input API"
description: "Input API reference for Angular applications."
category: "components"
status: "stable"
tags: ["input","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input/tng-input.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/api/input-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/api/input-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input/sections/api/input-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input/api"
componentGroup: "form"
symbols: ["TngInputComponent"]
selectors: ["tng-input"]
productId: "input"
section: "api"
officialCatalog: true
generated: true
---

# Input API

Text input fields, adornments, validation messaging, and layout patterns.

## API reference

Input now exposes a split component contract: `<tng-input>` for the plain self-rendering case, `<tng-input-field>` for projected adornments, and the headless primitives underneath.

### `<tng-input>` (component)

Renders an internal native `<input>` that already uses the `tngInput` primitive. Use it when you just need a single field without projected prefix/suffix content. The snippet below is ready to paste into a standalone Angular component.

#### doc-cmp-input-api-tng-input.component.ts

```ts
import { Component } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-doc-cmp-input-api-tng-input',
  standalone: true,
  imports: [TngInputComponent],
  template: `
    <tng-input
      type="email"
      placeholder="team@tailng.dev"
      ariaLabel="Email"
      inputmode="email"
      enterkeyhint="next"
      autocomplete="email"
      [maxlength]="64"
      (change)="onCommit($event)"
    ></tng-input>
  `,
})
export class DocCmpInputApiTngInputComponent {
  protected onCommit(event: Event): void {
    // Persist on native change/commit.
  }
}
```

| Property | Type | Details |
| --- | --- | --- |
| `type` | `'text' \| 'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'url'` | Maps to the internal native input type. |
| `value` | `string \| null` | Initial/current input value. Use `valueChange` for updates. |
| `placeholder`, `name`, `id`, `autocomplete` | `string \| null` | Forwarded to the internal native input. |
| `maxlength`, `minlength`, `pattern` | `number \| string \| null` / `string \| null` | Forwarded to native validation attributes on the internal input. |
| `inputmode`, `enterkeyhint`, `autocapitalize`, `spellcheck` | `string \| null` / nullable boolean-like | Forwarded for mobile keyboard hints, text entry behavior, and browser spelling UI. |
| `form`, `list` | `string \| null` | Forwarded to associate the internal input with a form or datalist. |
| `appearance`, `size`, `tone`, `fullWidth` | visual inputs | Passed through to the internal `tng-input-field` shell. |
| `disabled`, `readonly`, `required` | boolean-like | Forwarded to the internal native input. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy`, `ariaErrormessage`, `ariaInvalid`, `ariaRequired` | ARIA inputs | Forwarded to the internal `tngInput` primitive or native ARIA attribute. |
| `valueChange` | `output<string>` | Emits on internal input changes. |
| `input`, `change`, `focus`, `blur` | aliased DOM event outputs | Forward a single facade event from the underlying native input. |
| `keydown`, `keyup` | aliased keyboard event outputs | Forward keyboard events from the underlying native input. Number inputs also handle supported stepping keys. |
| Angular forms | `FormValueControl` | Works directly with Signal Forms. Legacy reactive/template-driven forms require the explicit `tngAngularForms` adapter. |

For Angular Signal Forms, bind `[formField]` directly on `<tng-input>`. The primitive `input[tngInput]` path also works when you need projected adornments inside `<tng-input-field>`.

#### Signal forms with tng-input

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngInputComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-profile-name-field',
  standalone: true,
  imports: [FormField, TngInputComponent],
  template: \`
    <tng-input
      ariaLabel="Profile name"
      placeholder="Prince"
      [formField]="profileForm.name"
    ></tng-input>
  \`,
})
export class ProfileNameFieldComponent {
  readonly profileModel = signal({ name: '' });
  readonly profileForm = form(this.profileModel);
}
```

### `<tng-input-field>` (component shell)

Wraps one projected `input[tngInput]` plus optional `tngInputFieldPrefix` / `tngInputFieldSuffix` content. Use it for search fields, fixed domain suffixes, and clear buttons. The snippet below includes the imports needed for a standalone Angular component.

#### doc-cmp-input-api-input-field.component.ts

```ts
import { Component } from '@angular/core';
import { TngInputFieldComponent } from '@tailng-ui/components';
import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';

@Component({
  selector: 'app-doc-cmp-input-api-input-field',
  standalone: true,
  imports: [TngInputFieldComponent, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-input-field>
      <span tngInputFieldPrefix aria-hidden="true">Search</span>
      <input
        tngInput
        type="search"
        placeholder="Search docs"
        aria-label="Search docs"
      />
      <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>
    </tng-input-field>
  `,
})
export class DocCmpInputApiFormFieldComponent {}
```

| Feature | Type | Details |
| --- | --- | --- |
| Projected control contract | `input[tngInput]` | Expects one projected native input using the primitive directive. |
| `appearance`, `size`, `tone`, `fullWidth` | visual inputs | Owns the shared field shell styling and sizing contract. |
| `--tng-input-gap` | CSS custom property | Controls inline spacing between prefix, control area, and suffix. |
| `data-focused`, `data-disabled`, `data-invalid`, `data-readonly` | mirrored state attrs | Reflected from the projected control onto the shell for container styling. |

### `tngInput` (directive)

Attach to a native `input[tngInput]`. Textarea usage is documented on the dedicated Textarea page. The snippet below is a minimal standalone primitive example.

#### doc-cmp-input-api-primitive.component.ts

```ts
import { Component } from '@angular/core';
import { TngInput } from '@tailng-ui/primitives';

@Component({
  selector: 'app-doc-cmp-input-api-primitive',
  standalone: true,
  imports: [TngInput],
  template: `
    <input
      tngInput
      type="text"
      placeholder="Plain primitive input"
      aria-label="Plain primitive input"
    />
  `,
})
export class DocCmpInputApiPrimitiveComponent {}
```

| Property | Type | Details |
| --- | --- | --- |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` | `string \| null` | Reflected to native ARIA attributes with whitespace-normalization. |
| `ariaInvalid`, `ariaRequired` | boolean-like | ARIA/state hooks layered on top of the native control. Initial native `aria-invalid` and `aria-required` are preserved until these inputs override them. |
| `disabled`, `readonly`, `required` | boolean-like | Reflects the native state and emits matching data attributes. |
| `data-slot="input"` | output attribute | Stable styling hook for the control itself. |

### Slot directives

| Directive | Applies to | Adds | Details |
| --- | --- | --- | --- |
| `tngInputFieldPrefix` | Projected leading element | `data-slot="input-leading"` | Marks prefix/adornment content before the control. |
| `tngInputFieldSuffix` | Projected trailing element | `data-slot="input-trailing"` | Marks suffix/action content after the control. |

## Source-derived public Angular API

### `TngInputComponent` — `tng-input`

- Inputs: `appearance`, `ariaDescribedBy`, `ariaErrormessage`, `ariaInvalid`, `ariaLabel`, `ariaLabelledby`, `ariaRequired`, `autocapitalize`, `autocomplete`, `disabled`, `enterkeyhint`, `formAttr`, `fullWidth`, `id`, `inputmode`, `inputName`, `list`, `maxlength`, `maxValue`, `minlength`, `minValue`, `pattern`, `placeholder`, `readonly`, `required`, `size`, `spellcheck`, `step`, `tone`, `type`
- Two-way models: `value`
- Outputs: `blurEvent`, `changeEvent`, `focusEvent`, `inputEvent`, `keydownEvent`, `keyupEvent`, `touchedChange`
