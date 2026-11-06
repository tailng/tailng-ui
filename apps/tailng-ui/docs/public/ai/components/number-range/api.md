---
id: "components/number-range/api"
title: "Number Range API"
description: "Number Range API reference for Angular applications."
category: "components"
status: "stable"
tags: ["number-range","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/number-range/index.ts","libs/tailng-ui/components/src/lib/form/number-range/tng-number-range.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/api/number-range-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/api/number-range-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/number-range/sections/api/number-range-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/number-range/api"
componentGroup: "form"
symbols: ["TngNumberRangeComponent"]
selectors: ["tng-number-range"]
productId: "number-range"
section: "api"
officialCatalog: true
generated: true
---

# Number Range API

Dual numeric input for min/max range selection with built-in validity checking and form integration.

## API reference

`<tng-number-range>` is the single component entry point for dual numeric range input. All configuration is done through Angular signal inputs and outputs.

### `<tng-number-range>` (component)

A standalone Angular component that renders a min/max numeric input group. The snippet below is ready to paste into a standalone Angular component.

#### doc-cmp-nr-api-example.component.ts

```ts
import { Component, signal } from '@angular/core';
import { TngNumberRangeComponent } from '@tailng-ui/components';
import type { TngNumberRangeValue, TngNumberRangeChangeEvent } from '@tailng-ui/primitives';

@Component({
  selector: 'app-doc-cmp-nr-api-example',
  standalone: true,
  imports: [TngNumberRangeComponent],
  template: `
    <tng-number-range
      [min]="0"
      [max]="1000"
      [step]="10"
      [value]="range()"
      minPlaceholder="Min price"
      maxPlaceholder="Max price"
      ariaLabel="Price range"
      minAriaLabel="Minimum price"
      maxAriaLabel="Maximum price"
      (valueChange)="range.set($event)"
      (rangeChange)="onRangeChange($event)"
    ></tng-number-range>
  `,
})
export class DocCmpNrApiExampleComponent {
  protected readonly range = signal<TngNumberRangeValue>({ min: 100, max: 500 });

  protected onRangeChange(event: TngNumberRangeChangeEvent): void {
    console.log(event.source, event.value, event.valid);
  }
}
```

### Inputs reference

| Input | Type | Default | Details |
| --- | --- | --- | --- |
| `value` | `TngNumberRangeValue \| null` | `null` | Controlled value. When provided, drives the displayed min/max values. Both fields can independently be `null` to represent an empty input. |
| `defaultValue` | `TngNumberRangeValue \| null` | `null` | Initial value for uncontrolled usage. Applied once at initialization; not tracked thereafter. |
| `min` | `number \| string \| null` | `null` | Lower bound for both inputs. Forwarded as the native `min` attribute and used for built-in validity checking. Accepts string input which is normalized to a number. |
| `max` | `number \| string \| null` | `null` | Upper bound for both inputs. Forwarded as the native `max` attribute and used for built-in validity checking. |
| `step` | `number \| string \| null` | `null` | Step interval for both inputs. Forwarded as the native `step` attribute. Pass `"any"` to allow any decimal value. |
| `disabled` | `boolean \| string` | `false` | Disables both inputs. Legacy Angular forms can also set this through the explicit adapter. |
| `readonly` | `boolean \| string` | `false` | Marks both inputs as read-only. Reflects `data-readonly` to the host and group. |
| `required` | `boolean \| string` | `false` | Forwards the `required` attribute to both native inputs. |
| `invalid` | `boolean \| string` | `false` | Explicitly forces the invalid visual state regardless of computed validity. |
| `minPlaceholder` | `string` | `''` | Placeholder text for the min input. |
| `maxPlaceholder` | `string` | `''` | Placeholder text for the max input. |
| `separator` | `string` | `'—'` | Text rendered between the min and max inputs. Can be any string or symbol. |
| `ariaLabel` | `string \| null` | `null` | Accessible label for the outer `role="group"` container. |
| `ariaLabelledby` | `string \| null` | `null` | ID of an external element that labels the group. Alternative to `ariaLabel`. |
| `minAriaLabel` | `string` | `'Minimum'` | Accessible label for the min input. Override for more descriptive screen-reader text. |
| `maxAriaLabel` | `string` | `'Maximum'` | Accessible label for the max input. Override for more descriptive screen-reader text. |
| `slot` | `Partial<Record<TngNumberRangeSlots, string>>` | `` | Additional CSS class names to merge onto internal slot elements. Keys: `root`, `group`, `minInput`, `separator`, `maxInput`. |

The `[slot]` input lets you attach extra classes to any internal element:

#### Slot class customization

```html
<tng-number-range
  ariaLabel="Price range"
  [slot]="{
    root: 'my-range-root',
    group: 'my-range-group',
    minInput: 'my-range-min',
    separator: 'my-range-sep',
    maxInput: 'my-range-max'
  }"
></tng-number-range>
```

### Outputs reference

| Output | Type | Details |
| --- | --- | --- |
| `valueChange` | `output<TngNumberRangeValue>` | Emits on every input event from either field with the current `{ min, max }` value object. Use for two-way binding or controlled state updates. |
| `rangeChange` | `output<TngNumberRangeChangeEvent>` | Emits the full change event including the updated `value`, the `source` field (`'min'` or `'max'`), and the computed `valid` boolean. |

Angular Signal Forms bind the component directly through its value model. Legacy Angular forms require the explicit `tngAngularForms` adapter marker.

| Forms feature | Details |
| --- | --- |
| Angular forms | Signal Forms use `[formField]`. Template-driven (`ngModel`) and reactive forms (`formControlName`, `formControl`) use `tngAngularForms`. |
| Value type | `TngNumberRangeValue` — `{ min: number \| null; max: number \| null }` |
| Disabled state | Controlled by the component input or the optional legacy forms adapter. |

### Types reference

All types are exported from `@tailng-ui/primitives`.

#### Exported types

```ts
/** The value object held and emitted by the component. */
type TngNumberRangeValue = {
  min: number | null;
  max: number | null;
};

/** Which input triggered the change. */
type TngNumberRangeSource = 'min' | 'max';

/** Full change event including source and validity. */
type TngNumberRangeChangeEvent = {
  value: TngNumberRangeValue;
  source: TngNumberRangeSource;
  valid: boolean;
};

/** CSS class override targets. */
type TngNumberRangeSlots = 'root' | 'group' | 'minInput' | 'separator' | 'maxInput';
```

#### Host state attributes

| Attribute | Location | When present |
| --- | --- | --- |
| `data-disabled` | Host element & inner group | When `disabled` is true or the legacy form control is disabled. |
| `data-readonly` | Host element & inner group | When `readonly` is true. |
| `data-invalid` | Host element & inner group | When the range fails built-in validity checks or `[invalid]="true"` is set. |

## Source-derived public Angular API

### `TngNumberRangeComponent` — `tng-number-range`

- Inputs: `ariaLabel`, `ariaLabelledby`, `defaultValue`, `disabled`, `invalid`, `maxAriaLabel`, `maxPlaceholder`, `maxValue`, `minAriaLabel`, `minPlaceholder`, `minValue`, `readonly`, `required`, `separator`, `slot`, `step`
- Two-way models: `value`
- Outputs: `rangeChange`, `touchedChange`
