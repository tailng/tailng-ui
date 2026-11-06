---
id: "components/multiselect/api"
title: "MultiSelect API"
description: "MultiSelect API reference for Angular applications."
category: "components"
status: "stable"
tags: ["multiselect","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multiselect/tng-multiselect.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/api/multiselect-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/api/multiselect-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/multiselect/sections/api/multiselect-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multiselect/api"
componentGroup: "form"
symbols: ["TngMultiSelectComponent"]
selectors: ["tng-multiselect"]
productId: "multiselect"
section: "api"
officialCatalog: true
generated: true
---

# MultiSelect API

Multiple-selection dropdown behavior and state handling.

## API reference

MultiSelect exposes composable primitives and a wrapper component for array-based value models.

### `tngMultiSelect` + parts (primitive)

#### Primitive attachment

```html
<section tngMultiSelect [value]="selectedValues" (valueChange)="selectedValues = toValueArray($event)">
  <button tngSelectTrigger type="button">
    <span tngSelectValue>{{ selectedSummary }}</span>
    <span tngSelectIcon aria-hidden="true">▾</span>
  </button>
  <div tngSelectContent>
    <div tngSelectOverlay>
      <ul tngMultiSelectListbox [multiple]="true">
        @for (option of options; track option.value) {
          <li tngMultiSelectOption [tngValue]="option.value">{{ option.label }}</li>
        }
      </ul>
    </div>
  </div>
</section>
```

| Directive / model | Type | Notes |
| --- | --- | --- |
| `tngMultiSelect` | `open`, `openChange` | Controlled overlay visibility. |
| `tngMultiSelect` | `value`, `valueChange` | `readonly T[]` selected values. |
| `tngMultiSelect` | `addSelectedItem`, `removeSelectedItem`, `toggleSelectedItem`, `clear` | Imperative selection helpers. |
| `tngMultiSelectListbox` | `orientation`, `direction`, `loop` | Keyboard traversal configuration. |
| `tngMultiSelectOption` | `tngValue`, `disabled` | Option identity and disabled state. |

### `tng-multiselect` (styled component)

#### Wrapper usage

```html
<tng-multiselect
  [options]="options"
  [value]="selectedValues"
  (valueChange)="selectedValues = toValueArray($event)"
  [getOptionValue]="getOptionValue"
  [getOptionLabel]="getOptionLabel"
  [isOptionDisabled]="isOptionDisabled"
  placeholder="Select items"
></tng-multiselect>
```

| API | Type | Details |
| --- | --- | --- |
| `options` | `readonly O[]` | Option source used for rendering and label mapping. |
| `getOptionValue` | `(option: O) => V` | Maps options into selected value payloads. |
| `getOptionLabel` | `(option: O) => string` | Maps options into trigger/option labels. |
| `isOptionDisabled` | `(option: O) => boolean` | Disables options at render time. |
| `scrollStrategy` | `'block' \| 'close' \| 'reposition'` | Defaults to `reposition`. Explicit `block` preserves the document scrollbar while locking page scroll. |
| Forwarded primitive model | `open`, `value`, `openChange`, `valueChange` | Exposed through host directive wiring. |

`<tng-multiselect>` can bind directly with `[formField]` for readonly array fields.

#### Signal forms wiring

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngMultiSelectComponent } from '@tailng-ui/components';

type ReviewerOption = {
  readonly id: string;
  readonly label: string;
};

@Component({
  selector: 'app-reviewers-signal-form',
  standalone: true,
  imports: [FormField, TngMultiSelectComponent],
  template: \`
    <tng-multiselect
      [formField]="reviewForm.reviewers"
      [options]="reviewers"
      [getOptionValue]="getReviewerValue"
      [getOptionLabel]="getReviewerLabel"
      placeholder="Choose reviewers"
      aria-label="Reviewers"
    ></tng-multiselect>
  \`,
})
export class ReviewersSignalFormComponent {
  readonly reviewModel = signal({
    reviewers: ['alex'] as readonly string[],
  });
  readonly reviewForm = form(this.reviewModel);

  readonly reviewers: readonly ReviewerOption[] = [
    { id: 'alex', label: 'Alex' },
    { id: 'bri', label: 'Bri' },
    { id: 'chen', label: 'Chen' },
  ];

  readonly getReviewerValue = (reviewer: ReviewerOption) => reviewer.id;
  readonly getReviewerLabel = (reviewer: ReviewerOption) => reviewer.label;
}
```

## Source-derived public Angular API

### `TngMultiSelectComponent` — `tng-multiselect`

- Inputs: `getOptionLabel`, `getOptionValue`, `iconText`, `isOptionDisabled`, `options`, `placeholder`, `scrollStrategy`, `trackBy`
- Forwarded inputs: `descriptionId`, `disabled`, `errorId`, `invalid`, `labelId`, `loading`, `open`, `value`
- Forwarded outputs: `openChange`, `valueChange`
