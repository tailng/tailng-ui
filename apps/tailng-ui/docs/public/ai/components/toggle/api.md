---
id: "components/toggle/api"
title: "Toggle API"
description: "Toggle API reference for Angular applications."
category: "components"
status: "stable"
tags: ["toggle","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/toggle/tng-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/api/toggle-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/api/toggle-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/toggle/sections/api/toggle-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/toggle/api"
componentGroup: "form"
symbols: ["TngToggleComponent"]
selectors: ["tng-toggle"]
productId: "toggle"
section: "api"
officialCatalog: true
generated: true
---

# Toggle API

Pressed button semantics for compact on/off actions and toolbar commands.

## API reference

The component layer keeps the primitive pressed-button semantics. The underlying rendered button still exposes the same `aria-pressed`, `data-state`, and focus hooks that power the headless directive.

#### Primitive bridge

```html
<button tngToggle [pressed]="isPinned()" (pressedChange)="isPinned.set($event)">
  Pin sidebar
</button>
```

| Hook | Appears on | Purpose |
| --- | --- | --- |
| `aria-pressed` | Rendered button | Announces the pressed state for assistive technologies. |
| `data-state="on\|off"` | Rendered button | Primary styling hook for selected and idle states. |
| `data-disabled` | Rendered button | Applied when the toggle or its parent group is disabled. |
| `data-focused`, `data-focus-visible` | Rendered button | Lets component themes express focus and keyboard focus separately. |
| `data-slot="toggle"` | Rendered button | Stable selector for tests and internal wrapper styling. |

### `<tng-toggle>` and `<tng-toggle-group>`

`<tng-toggle>` is the styled, icon-slot wrapper for the primitive directive. Add `<tng-toggle-group>` when the selected value should be coordinated across multiple toggles.

#### Standalone component usage

```html
<tng-toggle
  [pressed]="isPinned()"
  pressedLabel="Unpin sidebar"
  unpressedLabel="Pin sidebar"
  (pressedChange)="isPinned.set($event)"
>
  <span offIcon>P</span>
  <span onIcon>P</span>
</tng-toggle>
```

#### Grouped selection usage

```html
<tng-toggle-group
  selectionMode="single"
  ariaLabel="Editor density"
  [value]="density()"
  (valueChange)="onDensityChange($event)"
>
  <tng-toggle
    [value]="'compact'"
    pressedLabel="Compact density selected"
    unpressedLabel="Select compact density"
  >
    <span offIcon>C</span>
    <span onIcon>C</span>
  </tng-toggle>
  <tng-toggle
    [value]="'comfortable'"
    pressedLabel="Comfortable density selected"
    unpressedLabel="Select comfortable density"
  >
    <span offIcon>M</span>
    <span onIcon>M</span>
  </tng-toggle>
</tng-toggle-group>
```

#### `<tng-toggle>` component contract

| Input / Output | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` | Item identity inside `<tng-toggle-group>`. Set this for grouped selection. |
| `pressed` | `boolean \| null` | `null` | Controlled pressed state for standalone usage. |
| `defaultPressed` | `boolean` | `false` | Initial value for uncontrolled standalone toggles. |
| `disabled` | `boolean` | `false` | Disables the item directly. Group-level disabled also flows through. |
| `pressedLabel` | `string` | `'Enabled'` | Fallback `aria-label` when the toggle is pressed. |
| `unpressedLabel` | `string` | `'Disabled'` | Fallback `aria-label` when the toggle is not pressed. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` | `string \| null` | `null` | Explicit accessibility hooks. `ariaLabel` overrides the pressed/unpressed labels. |
| `pressedChange` | `boolean` | Output | Emits on user activation as a compatibility alias for the canonical `checked` model. |
| `[offIcon]`, `[onIcon]` | Projected slots | Optional | The component renders the matching slot based on the current state. |

#### `<tng-toggle-group>` component contract

| Input / Output | Type | Default | Notes |
| --- | --- | --- | --- |
| `selectionMode` | `'multiple' \| 'single'` | `'multiple'` | Choose one value with `value`, or several with `values`. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Reflected to `data-orientation` for styling and testing. |
| `value`, `defaultValue`, `valueChange` | `string \| null` | `null` | Single-selection contract. |
| `values`, `defaultValues`, `valuesChange` | `readonly string[]` | `[]` | Multiple-selection contract. |
| `disabled` | `boolean` | `false` | Disables every nested toggle and applies group-level disabled hooks. |
| `ariaLabel`, `ariaLabelledby` | `string \| null` | `null` | Accessible name for the selection region. |

#### Reactive forms with standalone toggle

```ts
readonly pinSidebarControl = new FormControl(false, { nonNullable: true });

<tng-toggle tngAngularForms formControlName="pinSidebar">
  <span offIcon>P</span>
  <span onIcon>P</span>
</tng-toggle>
```

Angular Signal Forms can bind `<tng-toggle>` directly with `[formField]` for standalone boolean fields. Keep `<tng-toggle-group>` on its existing controlled value/values contract for now.

#### Signal forms with standalone toggle

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngToggleComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-pin-sidebar-signal-form',
  standalone: true,
  imports: [FormField, TngToggleComponent],
  template: \`
    <tng-toggle
      pressedLabel="Unpin sidebar"
      unpressedLabel="Pin sidebar"
      [formField]="preferencesForm.pinSidebar"
    >
      <span offIcon>P</span>
      <span onIcon>P</span>
    </tng-toggle>
  \`,
})
export class PinSidebarSignalFormComponent {
  readonly preferencesModel = signal({ pinSidebar: false });
  readonly preferencesForm = form(this.preferencesModel);
}
```

## Source-derived public Angular API

### `TngToggleComponent` — `tng-toggle`

- Inputs: `ariaDescribedBy`, `ariaLabel`, `ariaLabelledby`, `defaultPressed`, `disabled`, `invalid`, `pressed`, `pressedLabel`, `required`, `toggleValue`, `unpressedLabel`
- Two-way models: `checked`
- Outputs: `pressedChange`, `touchedChange`
