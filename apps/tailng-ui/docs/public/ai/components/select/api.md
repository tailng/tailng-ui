---
id: "components/select/api"
title: "Select API"
description: "Select API reference for Angular applications."
category: "components"
status: "stable"
tags: ["select","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/select/tng-select.component.ts","libs/tailng-ui/components/src/lib/form/select/tng-select.slots.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/api/select-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/api/select-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/select/sections/api/select-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/select/api"
componentGroup: "form"
symbols: ["TngSelectComponent"]
selectors: ["tng-select"]
productId: "select"
section: "api"
officialCatalog: true
generated: true
---

# Select API

Single-choice select surfaces and trigger/content composition.

## API reference

`<tng-select>` wraps the headless select primitive for the common single-select workflow. You pass options and accessors; the wrapper owns the trigger, overlay, and default listbox wiring.

### `tng-select`

#### Wrapper attachment

```html
<tng-select
  [options]="workflowStages"
  [value]="selectedStage()"
  (valueChange)="onSelectedStageChange($event)"
  [getOptionValue]="getWorkflowStageValue"
  [getOptionLabel]="getWorkflowStageLabel"
  [isOptionDisabled]="isWorkflowStageDisabled"
  placeholder="Choose workflow stage"
  [ariaLabel]="'Workflow stage'"
></tng-select>
```

| Property | Type | Details |
| --- | --- | --- |
| options | readonly O[] | Full option collection rendered by the wrapper inside the portaled listbox overlay. |
| value / valueChange | V \| null / output | Controlled single-select model for the committed option value. |
| open / openChange | boolean / output | Optional controlled overlay state when a parent needs to observe or drive the menu. |
| scrollStrategy | 'block' \| 'close' \| 'reposition' | Controls external scrolling. Defaults to reposition; block locks scrolling while preserving the document scrollbar. |
| disabled, loading, invalid | boolean | Forwarded primitive state inputs reflected onto the wrapper host for visuals and interaction guards. |
| placeholder | string | Fallback trigger text when no committed value is present. |
| iconText | string | Overrides the default chevron text in the trigger icon slot when you want a custom glyph. |
| labelId / descriptionId / errorId | string | Forwarded accessibility ids for external labels, helper copy, and error messaging. |

### Option accessors

The wrapper stays generic by delegating option identity, labels, disabled state, and tracking to small accessor functions.

#### Common accessors

```ts
interface WorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

readonly getWorkflowStageValue = (stage: WorkflowStageOption) => stage.value;
readonly getWorkflowStageLabel = (stage: WorkflowStageOption) => stage.label;
readonly isWorkflowStageDisabled = (stage: WorkflowStageOption) => stage.disabled === true;
readonly trackWorkflowStage = (_index: number, stage: WorkflowStageOption) => stage.value;
```

| Accessor | Type | Details |
| --- | --- | --- |
| getOptionValue | (option: O) => V | Maps each option object to the committed selection value stored in the model. |
| getOptionLabel | (option: O) => string | Maps each option object to the text used in the default trigger value and option rows. |
| isOptionDisabled | (option: O) => boolean | Disables individual options while keeping them visible in the listbox. |
| trackBy | (index: number, option: O) => unknown | Optional identity for option rows. Defaults to getOptionValue(option) so remapped option objects stay stable across change detection. |

### Angular Signal Forms

`<tng-select>` can bind directly with `[formField]`. The wrapper host exposes a model-backed selection value, so you can keep the committed option inside a signal form without a separate CVA adapter.

#### Signal forms wiring

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngSelectComponent } from '@tailng-ui/components';

type ReleaseOwner = {
  readonly id: string;
  readonly label: string;
};

@Component({
  selector: 'app-release-owner-signal-form',
  standalone: true,
  imports: [FormField, TngSelectComponent],
  template: \`
    <tng-select
      [formField]="releaseForm.owner"
      [options]="owners"
      [getOptionValue]="getOwnerValue"
      [getOptionLabel]="getOwnerLabel"
      placeholder="Choose release owner"
      aria-label="Release owner"
    ></tng-select>
  \`,
})
export class ReleaseOwnerSignalFormComponent {
  readonly releaseModel = signal({ owner: 'alex' });
  readonly releaseForm = form(this.releaseModel);

  readonly owners: readonly ReleaseOwner[] = [
    { id: 'alex', label: 'Alex' },
    { id: 'bri', label: 'Bri' },
  ];

  readonly getOwnerValue = (owner: ReleaseOwner) => owner.id;
  readonly getOwnerLabel = (owner: ReleaseOwner) => owner.label;
}
```

### Template hooks

You can replace the trigger value markup and option rows through content templates while the wrapper keeps the primitive selection logic intact.

#### Template hooks

```html
<tng-select
  [options]="releaseOwners"
  [value]="selectedOwner()"
  (valueChange)="onSelectedOwnerChange($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
>
  <ng-template #tngSelectValueTpl let-selected>
    <div>
      <strong>{{ selected.label }}</strong>
      <small>{{ selected.option?.team }}</small>
    </div>
  </ng-template>

  <ng-template #tngSelectOptionTpl let-option>
    <div>
      <strong>{{ option.label }}</strong>
      <small>{{ option.option.team }}</small>
    </div>
  </ng-template>
</tng-select>
```

| Template | Context | Details |
| --- | --- | --- |
| #tngSelectValueTpl | TemplateRef<{ value, option, label }> | Replaces the default trigger value markup while the wrapper keeps trigger semantics and selection state. |
| #tngSelectOptionTpl | TemplateRef<{ option, value, label, disabled, selected, active }> | Replaces each option row for richer metadata layouts without rebuilding the wrapper shell. |

### Primitive foundation

The wrapper is intentionally opinionated around the common trigger + menu select experience. Use the headless primitive when you need full trigger or overlay markup control.

| Capability | Availability | Guidance |
| --- | --- | --- |
| Trigger + overlay shell | Wrapper-owned | The wrapper owns the trigger button, icon, portaled overlay, and listbox plumbing for the common select pattern. |
| Markup ownership | Template hooks only | Use templates for richer content, or drop to headless when you need full trigger or overlay DOM ownership. |
| Primitive escape hatch | Available | Use headless select when you need custom trigger composition, overlay structure, or direct primitive coordination. |

## Source-derived public Angular API

### `TngSelectComponent` — `tng-select`

- Inputs: `getOptionLabel`, `getOptionValue`, `iconText`, `isOptionDisabled`, `options`, `placeholder`, `scrollStrategy`, `trackBy`
- Forwarded inputs: `descriptionId`, `disabled`, `errorId`, `invalid`, `labelId`, `loading`, `open`, `value`
- Forwarded outputs: `openChange`, `valueChange`
