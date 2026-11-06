---
id: "components/checkbox/api"
title: "Checkbox API"
description: "Checkbox API reference for Angular applications."
category: "components"
status: "stable"
tags: ["checkbox","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/checkbox/tng-checkbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/api/checkbox-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/api/checkbox-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/checkbox/sections/api/checkbox-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/checkbox/api"
componentGroup: "form"
symbols: ["TngCheckboxComponent"]
selectors: ["tng-checkbox"]
productId: "checkbox"
section: "api"
officialCatalog: true
generated: true
---

# Checkbox API

Binary and tri-state selection patterns with headless and styled usage.

## API reference

`<tng-checkbox>` is built on the `tngCheckbox` primitive. Most component consumers do not need to attach the directive directly, but it helps to know what the wrapper is forwarding under the hood.

### Underlying primitive: `tngCheckbox`

The wrapper forwards `checked`, `indeterminate`, `disabled`, `readonly`, `required`, `invalid`, `name`, `value`, and `ariaDescribedBy` to a native `input[type="checkbox"]` that owns ARIA and state attributes.

#### Primitive attachment

```html
<input tngCheckbox [checked]="true" [indeterminate]="false" />
```

| Forwarded primitive surface | Notes |
| --- | --- |
| `checked`, `indeterminate` | Drive binary and mixed state on the native checkbox control. |
| `disabled`, `readonly`, `required` | Preserve native form semantics while controlling interaction. |
| `invalid` | Feeds error emphasis and `aria-invalid` through the primitive. |
| `name`, `value` | Support native form submission without extra wrapper logic. |
| `ariaDescribedBy` | Connect helper or error copy to the internal input element. |

If you need direct access to primitive state hooks such as `data-state` or want to render a custom checkbox box, move to Headless > Form > Checkbox .

### `tng-checkbox` (styled component)

The component wraps the primitive in a ready-to-ship label layout, exposes Angular outputs, and implements Angular Signal Forms' checkbox custom-control contract.

#### Component attachment

```html
<tng-checkbox [checked]="releaseReady" (checkedChange)="releaseReady = $event">
  Release checklist complete
</tng-checkbox>
```

| Input | Type | Default | Details |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Committed checked state when the component is used in controlled mode. |
| `indeterminate` | `boolean` | `false` | Mixed presentation for parent checklist or partial-completion states. |
| `disabled`, `readonly`, `required` | `boolean` | `false` | Forwarded to the primitive input and reflected in the rendered behavior. |
| `invalid` | `boolean` | `false` | Highlights a mandatory or failed checkbox state. |
| `name` | `string \| null` | `null` | Native form submission name for checkbox groups or standalone forms. |
| `value` | `string` | `'on'` | Submitted checkbox value when the control is checked. |
| `ariaDescribedBy` | `string \| null` | `null` | Associates helper text or validation copy with the internal input. |

| Surface | Type | Notes |
| --- | --- | --- |
| `checkedChange` | `EventEmitter<boolean>` | Emits the committed checked state after a user interaction. |
| `indeterminateChange` | `EventEmitter<boolean>` | Emits whether the control is still mixed after the user interaction. |
| Projected label content | `<ng-content>` | Provides the visible checkbox label and accessible name. |
| Forms model | `boolean \| 'mixed'` | The optional legacy adapter maps tri-state values for reactive or template-driven forms. |

#### Reactive forms

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TngCheckboxAngularFormsAdapter, TngCheckboxComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-release-checklist',
  standalone: true,
  imports: [ReactiveFormsModule, TngCheckboxComponent, TngCheckboxAngularFormsAdapter],
  templateUrl: './release-checklist.component.html',
})
export class ReleaseChecklistComponent {
  readonly form = new FormGroup({
    releaseReady: new FormControl<boolean | 'mixed'>(false, { nonNullable: true }),
  });
}

<form [formGroup]="form">
  <tng-checkbox tngAngularForms formControlName="releaseReady">
    Release checklist complete
  </tng-checkbox>
</form>
```

Angular Signal Forms can bind the component directly with `[formField]`. The checked state flows as `boolean`; use `indeterminate` for mixed presentation.

#### Signal forms

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngCheckboxComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-release-checklist-signal-form',
  standalone: true,
  imports: [FormField, TngCheckboxComponent],
  template: \`
    <tng-checkbox [formField]="releaseForm.releaseReady">
      Release checklist complete
    </tng-checkbox>
  \`,
})
export class ReleaseChecklistSignalFormComponent {
  readonly releaseModel = signal<{ releaseReady: boolean }>({
    releaseReady: false,
  });
  readonly releaseForm = form(this.releaseModel);
}
```

## Source-derived public Angular API

### `TngCheckboxComponent` — `tng-checkbox`

- Inputs: `ariaDescribedBy`, `disabled`, `inputName`, `inputValue`, `invalid`, `readonly`, `required`
- Two-way models: `checked`, `indeterminate`
- Outputs: `touchedChange`
