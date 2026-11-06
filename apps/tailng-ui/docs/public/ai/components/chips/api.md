---
id: "components/chips/api"
title: "Chips API"
description: "Chips API reference for Angular applications."
category: "components"
status: "stable"
tags: ["chips","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/chips/tng-chip.component.ts","libs/tailng-ui/components/src/lib/form/chips/tng-chips.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/chips/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/api/chips-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/api/chips-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/chips/sections/api/chips-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/chips/api"
componentGroup: "form"
symbols: ["TngChipComponent","TngChipsComponent"]
selectors: ["tng-chip","tng-chips"]
productId: "chips"
section: "api"
officialCatalog: true
generated: true
---

# Chips API

Tokenized input and removable item chip usage patterns.

## API reference

`<tng-chips>` is a lightweight wrapper around the headless chips primitive. The wrapper owns the root shell; you still project `tngChip` and `tngChipRemove` for each pill.

### `tng-chips`

#### Wrapper attachment

```html
<tng-chips
  [values]="selectedTopics()"
  (valuesChange)="onSelectedTopicsChange($event)"
  [ariaLabel]="'Selected topics'"
>
  <div class="topic-chip-row">
    @for (topic of selectedTopics(); track topic) {
      <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic">
        <span>{{ topic }}</span>
        <button tngChipRemove type="button">&times;</button>
      </span>
    }
  </div>
</tng-chips>
```

| Property | Type | Details |
| --- | --- | --- |
| ariaLabel | string \| null | Sets the accessible label on the projected chips list root. |
| disabled | boolean | Disables the whole list and blocks projected remove actions. |
| values | readonly unknown[] \| undefined | Controlled values array used when the wrapper should emit a next array after remove actions. |
| defaultValues | readonly unknown[] | Seeds the primitive root for uncontrolled setups, though most wrapper usage stays controlled. |
| chipRemove | output<unknown> | Emits the removed chip value whenever a projected chip successfully removes itself. |
| valuesChange | output<readonly unknown[]> | Emits the next controlled value array after a successful remove action. |

### Projected chip parts

The wrapper stays small on purpose. Project the chip item and remove control primitives directly so the pill body remains yours.

#### Projected chip parts

```html
<span
  tngChip
  [tngChipValue]="topic"
  [tngChipLabel]="topic"
  [tngChipDisabled]="topic === 'Locked'"
>
  <span>{{ topic }}</span>
  <button tngChipRemove type="button">&times;</button>
</span>
```

| Primitive input | Type | Details |
| --- | --- | --- |
| tngChipValue | unknown | Identity for the chip item and the value emitted when it is removed. |
| tngChipLabel | string \| null | Accessible label used for the auto-generated remove button label. |
| tngChipDisabled | boolean | Marks the chip disabled and blocks pointer or keyboard removal. |
| tngChipRemovable | boolean | Opts a projected chip out of removal without disabling the whole row. |

### Remove control

| Capability | Type | Details |
| --- | --- | --- |
| tngChipRemoveAriaLabel | string \| null | Overrides the default “Remove <label>” aria-label when you need custom copy. |
| Keyboard behavior | Enter / Space | Pressing Enter or Space on the remove control removes the owning chip when removal is allowed. |
| Focus hook | data-focused | Applied while the remove control is focused so you can draw a ring without extra JS. |

### Primitive foundation

| Capability | Availability | Guidance |
| --- | --- | --- |
| Root shell | Wrapper-owned | The wrapper only owns the outer chips container and forwards the primitive state inputs. |
| Chip markup | Projected primitives | You still provide the chip body and the remove button markup through projected content. |
| Headless escape hatch | Available | Drop to headless when you need to own the root element or coordinate chip removal with surrounding inputs. |

## Source-derived public Angular API

### `TngChipComponent` — `tng-chip`

- Inputs: `disabled`, `label`, `removable`, `removeAriaLabel`, `value`
- Outputs: `chipRemove`

### `TngChipsComponent` — `tng-chips`

- Inputs: `ariaLabel`, `defaultValues`, `disabled`, `itemLabel`, `items`, `values`
- Outputs: `chipRemove`, `valuesChange`
