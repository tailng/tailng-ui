---
id: "components/slider/api"
title: "Slider API"
description: "Slider API reference for Angular applications."
category: "components"
status: "stable"
tags: ["slider","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/slider/tng-slider.component.ts","libs/tailng-ui/components/src/lib/form/slider/tng-slider.utils.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/api/slider-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/api/slider-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/slider/sections/api/slider-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/slider/api"
componentGroup: "form"
symbols: ["TngSliderComponent"]
selectors: ["tng-slider"]
productId: "slider"
section: "api"
officialCatalog: true
generated: true
---

# Slider API

Single-value slider for numeric settings and continuous values.

## API reference

`<tng-slider>` wraps the headless slider primitive for controlled numeric input. The wrapper owns the range input and integrates with form-field labeling.

### `tng-slider`

#### Wrapper attachment

```html
<tng-slider
  [value]="brightness()"
  (valueChange)="brightness.set($event)"
  [min]="0"
  [max]="100"
  [step]="5"
  aria-label="Brightness"
></tng-slider>
```

| Property | Type | Details |
| --- | --- | --- |
| value / valueChange | number / output | Controlled numeric model for the committed slider value. |
| min | number | Lower bound forwarded to the inner range input. Defaults to 0. |
| max | number | Upper bound forwarded to the inner range input. Defaults to 100. |
| step | number | Positive increment forwarded to the inner range input. Defaults to 1. |
| disabled | boolean | Disables the slider and reflects disabled state for styling. |
| invalid, required | boolean | Forwarded to form-field integration for validation and labeling state. |
| aria-label, ariaValueText | string \| null | Accessible name and optional human-readable value text for the pointer. |

### `input[tngSlider]`

Use the primitive directive when the visual shell needs direct access to the native range input.

#### Primitive attachment

```html
<input
  tngSlider
  [value]="brightness()"
  (input)="onBrightnessInput($event)"
  [min]="0"
  [max]="100"
  [step]="5"
  aria-label="Brightness"
/>
```

| Hook | Type | Details |
| --- | --- | --- |
| input[tngSlider] | Directive | Headless attachment for custom range markup while preserving normalized range inputs. |
| data-slot="slider" | Attribute | Stable styling hook reflected by the primitive input. |
| data-disabled | Attribute | Presence attribute reflected when the primitive is disabled. |

### Angular Signal Forms

The slider binds directly with `[formField]`. Define `min` and `max` in the form schema instead of binding them on the same element.

#### Signal forms wiring

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, max, min } from '@angular/forms/signals';
import { TngSliderComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-volume-signal-form',
  standalone: true,
  imports: [FormField, TngSliderComponent],
  template: \`
    <tng-slider
      [formField]="settingsForm.volume"
      aria-label="Volume"
    ></tng-slider>
  \`,
})
export class VolumeSignalFormComponent {
  readonly settingsModel = signal({ volume: 25 });
  readonly settingsForm = form(this.settingsModel, (settings) => {
    min(settings.volume, 0);
    max(settings.volume, 100);
  });
}
```

## Source-derived public Angular API

### `TngSliderComponent` — `tng-slider`

- Inputs: `ariaLabel`, `ariaValueText`, `disabled`, `invalid`, `max`, `min`, `required`, `step`
- Two-way models: `value`
