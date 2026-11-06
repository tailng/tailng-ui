---
id: "components/switch/api"
title: "Switch API"
description: "Switch API reference for Angular applications."
category: "components"
status: "stable"
tags: ["switch","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/switch/tng-switch.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/api/switch-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/api/switch-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/switch/sections/api/switch-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/switch/api"
componentGroup: "form"
symbols: ["TngSwitchComponent"]
selectors: ["tng-switch"]
productId: "switch"
section: "api"
officialCatalog: true
generated: true
---

# Switch API

Two-state on/off toggle with track/thumb rendering and arrow-key support.

## API reference

`<tng-switch>` is built on the `tngSwitch` primitive. Most component consumers will stay at the wrapper layer, but it helps to understand which primitive inputs are flowing through.

### Underlying primitive: `tngSwitch`

The wrapper forwards `checked`, `disabled`, `required`, and `ariaLabel` to the internal switch button that owns the ARIA role and state attributes.

#### Primitive attachment

```html
<button
  tngSwitch
  [checked]="releaseReady()"
  ariaLabel="Release ready"
  (click)="releaseReady.update(value => !value)"
>
  <span class="switch-thumb" aria-hidden="true"></span>
</button>
```

| Forwarded primitive surface | Notes |
| --- | --- |
| `checked` | Controls the visual state and `aria-checked` value. |
| `disabled` | Blocks interaction and reflects disabled styling hooks on the button. |
| `required` | Reflects `aria-required` for assistive technology. |
| `ariaLabel` | Accessible name when the projected label needs different spoken copy. |

If you need custom thumb markup or direct styling against the primitive button state, move to Headless > Form > Switch or the ownable surface.

### `tng-switch` (styled component)

The wrapper renders the default track and thumb, syncs a hidden checkbox for native form submission, and exposes Angular-friendly `checkedChange` events for controlled usage.

#### Component attachment

```html
<tng-switch
  [checked]="releaseReady()"
  (checkedChange)="releaseReady.set($event)"
>
  Release ready
</tng-switch>
```

| Input | Type | Default | Details |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Committed on/off state when the component is used in controlled mode. |
| `disabled` | `boolean` | `false` | Disables the visible switch button and the hidden checkbox. |
| `required` | `boolean` | `false` | Marks the hidden checkbox as required and forwards ARIA required state. |
| `name` | `string \| null` | `null` | Native form field name for HTML form submission. |
| `value` | `string` | `'on'` | Submitted value for the hidden checkbox when checked. |
| `ariaLabel` | `string \| null` | `null` | Accessible name override for the internal switch button. |

| Surface | Type | Notes |
| --- | --- | --- |
| `checkedChange` | `EventEmitter<boolean>` | Emits the next checked state after click or arrow-key interaction. |
| Projected label content | `<ng-content>` | Visible switch label shown next to the control. |
| Icon slots | `[onIcon]`, `[offIcon]` | Optional projected icons rendered inside the thumb. |
| Keyboard behavior | ArrowLeft, ArrowRight, click | ArrowLeft forces off, ArrowRight forces on, and click handles the regular toggle. |

#### Hidden input in native forms

```html
<form>
  <tng-switch name="autoPublish" value="enabled" [checked]="true">
    Auto publish after review
  </tng-switch>
</form>
```

`tng-switch` exposes the Signal Forms checkbox custom-control contract. Bind it with `checked` / `checkedChange` or `[formField]` for signal-backed forms.

## Source-derived public Angular API

### `TngSwitchComponent` — `tng-switch`

- Inputs: `ariaLabel`, `disabled`, `inputName`, `inputValue`, `invalid`, `required`
- Two-way models: `checked`
