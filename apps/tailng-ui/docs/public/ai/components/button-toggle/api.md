---
id: "components/button-toggle/api"
title: "Button Toggle API"
description: "Button Toggle API reference for Angular applications."
category: "components"
status: "stable"
tags: ["button-toggle","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle-group.component.ts","libs/tailng-ui/components/src/lib/form/button-toggle/tng-button-toggle.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/api/button-toggle-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/api/button-toggle-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/button-toggle/sections/api/button-toggle-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/button-toggle/api"
componentGroup: "form"
symbols: ["TngButtonToggleComponent","TngButtonToggleGroupComponent"]
selectors: ["tng-button-toggle","tng-button-toggle-group"]
productId: "button-toggle"
section: "api"
officialCatalog: true
generated: true
---

# Button Toggle API

Single and multiple pressed-button groups for toolbars and view switches.

## API reference

The component surface is built on the same headless pair that powers roving focus and selection behavior. Reach for headless when you want DOM ownership; use the component pair when you want the same selection contract hosted directly on the wrapper plus a styled shell already in place.

### Underlying primitives

`tngButtonToggleGroup` and `tngButtonToggle` remain the behavioral baseline underneath the component wrapper. The group wrapper forwards that primitive contract from its host, so grouped items participate in the same focus and selection model as the headless pair.

#### Primitive attachment

```html
<div
  tngButtonToggleGroup
  type="single"
  [tngButtonToggleValue]="density()"
  (valueChange)="onDensityChange($event)"
>
  <button tngButtonToggle tngButtonToggleValue="compact">Compact</button>
  <button tngButtonToggle tngButtonToggleValue="comfortable">Comfortable</button>
</div>
```

### `tng-button-toggle-group`

The group wrapper hosts the primitive group behavior directly. That means selection mode, keyboard traversal, controlled values, and the analytics-focused outputs all come from the same contract you would use in headless composition.

#### Group attachment

```html
<tng-button-toggle-group
  ariaLabel="Density selection"
  [value]="density()"
  (valueChange)="onDensityChange($event)"
>
  <tng-button-toggle [tngButtonToggleValue]="'compact'">Compact</tng-button-toggle>
  <tng-button-toggle [tngButtonToggleValue]="'comfortable'">Comfortable</tng-button-toggle>
</tng-button-toggle-group>
```

| API | Type | Details |
| --- | --- | --- |
| `ariaLabel` | `string` | Accessible name for the group wrapper. |
| `type` | `'single' \| 'multiple'` | Switches between single-select segmented controls and multi-select toolbars. |
| `value`, `values` | `T \| null`, `readonly T[]` | Wrapper-level aliases for controlled single and multiple selection. |
| `tngButtonToggleValue`, `tngButtonToggleValues` | `T \| null`, `readonly T[]` | Explicit TailNG-prefixed aliases forwarded from the primitive group contract. |
| `defaultValue`, `defaultValues` | `T \| null`, `readonly T[]` | Uncontrolled initial selection for single and multiple groups. |
| `allowEmpty`, `disabled`, `loop` | `boolean` | Selection clearing, disabled state, and keyboard wraparound. |
| `orientation`, `dir`, `activation` | Behavior config | Keyboard axis, LTR/RTL direction, and manual versus automatic selection. |
| `valueChange`, `valuesChange` | Angular outputs | Controlled-state updates for single and multiple groups. |
| `toggleChange`, `focusChange` | Angular outputs | Richer event payloads for analytics, instrumentation, and focus tracking. |

### `tng-button-toggle`

The item wrapper can participate in a group or work as a standalone pressed button when the group wrapper is not present. Inside a group, pass item identity with `[tngButtonToggleValue]` or `[value]` and let the group own the selected state.

#### Standalone item

```html
<tng-button-toggle
  [pressed]="isBold()"
  (pressedChange)="isBold.set($event)"
>
  Bold
</tng-button-toggle>
```

| API | Type | Details |
| --- | --- | --- |
| `value`, `tngButtonToggleValue` | `string \| number \| null` | Stable identity for group selection. Prefer `tngButtonToggleValue` in grouped examples. |
| `disabled` | `boolean` | Blocks interaction for standalone usage and forwards to the primitive button. |
| `pressed` | `boolean` | Standalone pressed state when the item is not inside a group. |
| `pressedChange` | `boolean` | Standalone output. Inside a group, selection comes from the wrapper outputs instead. |
| Projected content | Label content | Icons, text, and badges can be projected without changing the group contract. |

## Source-derived public Angular API

### `TngButtonToggleComponent` — `tng-button-toggle`

- Inputs: `disabled`, `pressed`, `toggleValueInput`, `valueInput`
- Outputs: `pressedChange`

### `TngButtonToggleGroupComponent` — `tng-button-toggle-group`

- Inputs: `ariaLabel`
- Forwarded inputs: `activation`, `allowEmpty`, `defaultValue`, `defaultValues`, `dir`, `disabled`, `loop`, `orientation`, `tngButtonToggleDefaultValue`, `tngButtonToggleDefaultValues`, `tngButtonToggleValue`, `tngButtonToggleValues`, `type`, `value`, `values`
- Forwarded outputs: `focusChange`, `toggleChange`, `valueChange`, `valuesChange`
