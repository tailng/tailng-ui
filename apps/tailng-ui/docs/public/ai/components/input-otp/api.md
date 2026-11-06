---
id: "components/input-otp/api"
title: "Input OTP API"
description: "Input OTP API reference for Angular applications."
category: "components"
status: "stable"
tags: ["input-otp","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-otp/index.ts","libs/tailng-ui/components/src/lib/form/input-otp/tng-input-otp.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/api/input-otp-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/api/input-otp-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input-otp/sections/api/input-otp-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-otp/api"
componentGroup: "form"
symbols: ["TngInputOtpComponent"]
selectors: ["tng-input-otp"]
productId: "input-otp"
section: "api"
officialCatalog: true
generated: true
---

# Input OTP API

Segmented one-time-password input with keyboard, paste, and form integration.

## API reference

`<tng-input-otp>` is the wrapper surface. It renders the segmented slots, keeps the combined value in sync, and exposes a Signal Forms custom-control model.

### `<tng-input-otp>` wrapper

#### Wrapper usage

```html
<tng-input-otp
  [length]="6"
  [value]="verificationCode()"
  [type]="'numeric'"
  [required]="true"
  [ariaLabel]="'Verification code'"
  (valueChange)="onVerificationCodeChange($event)"
  (complete)="onVerificationCodeComplete($event)"
></tng-input-otp>
```

| Input | Type | Notes |
| --- | --- | --- |
| `length` | `number` | Total slot count. The component normalizes the value to the configured length. |
| `value` / `defaultValue` | `string` | Controlled and uncontrolled starting values for the combined OTP string. |
| `type` / `pattern` | `'numeric' \| 'alphanumeric' \| 'custom'` | Choose the accepted character set, or provide a custom regex when needed. |
| `mask` | `boolean` | Masks slot values while keeping the underlying string value intact. |
| `disabled`, `readonly`, `required`, `invalid` | `boolean` | Maps interaction and validation state into the rendered slots. |
| `autoFocus` / `selectOnFocus` | `boolean` | Controls startup focus and whether existing slot content is selected on focus. |
| `placeholderChar` | `string` | Single-character placeholder shown in empty slots. |
| `name`, `form`, `autocomplete`, `inputMode` | `string` | Hidden-input form submission and mobile keyboard hints. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedby` | `string` | Accessible naming and helper-text wiring for the grouped field. |

### Events

| Output | Payload | Notes |
| --- | --- | --- |
| `valueChange` | `string` | Emits on each valid slot update, paste, deletion, or replacement. |
| `complete` | `string` | Emits when all slots are filled with valid characters. |

### Angular forms integration

Angular Signal Forms can bind the wrapper directly with `[formField]`. Legacy reactive and template-driven forms use the explicit `tngAngularForms` adapter.

#### Reactive forms wiring

```ts
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngInputOtpAngularFormsAdapter, TngInputOtpComponent } from '@tailng-ui/components';

readonly verificationForm = new FormGroup({
  otp: new FormControl('', { nonNullable: true }),
});

<tng-input-otp tngAngularForms formControlName="otp"></tng-input-otp>
```

Bind the wrapper directly with `[formField]` when you want the OTP string to live inside a signal-backed form model.

#### Signal forms wiring

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-verification-code-signal-form',
  standalone: true,
  imports: [FormField, TngInputOtpComponent],
  template: \`
    <tng-input-otp
      [length]="6"
      [formField]="verificationForm.code"
      ariaLabel="Verification code"
    ></tng-input-otp>
  \`,
})
export class VerificationCodeSignalFormComponent {
  readonly verificationModel = signal({ code: '' });
  readonly verificationForm = form(this.verificationModel);
}
```

### Primitive foundation

The wrapper is built on top of the headless `[tngInputOtp]` primitive. When you need to fully own the slot markup and state selectors, use the dedicated headless `Input OTP` docs under `/headless/form/input-otp`.

## Source-derived public Angular API

### `TngInputOtpComponent` — `tng-input-otp`

- Inputs: `ariaDescribedby`, `ariaLabel`, `ariaLabelledby`, `autocomplete`, `autoFocus`, `defaultValue`, `disabledInput`, `form`, `id`, `inputMode`, `inputName`, `invalid`, `length`, `mask`, `pattern`, `placeholderChar`, `readonly`, `required`, `selectOnFocus`, `type`
- Two-way models: `value`
- Outputs: `complete`, `touchedChange`
