---
id: "components/stepper/api"
title: "Stepper API"
description: "Stepper API reference for Angular applications."
category: "components"
status: "stable"
tags: ["stepper","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/stepper/tng-stepper.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/api/stepper-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/api/stepper-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/stepper/sections/api/stepper-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/stepper/api"
componentGroup: "layout"
symbols: ["TngStepperComponent","TngStepperItemComponent"]
selectors: ["tng-stepper","tng-stepper-item"]
productId: "stepper"
section: "api"
officialCatalog: true
generated: true
---

# Stepper API

Styled stepper shell powered by headless value, focus, and state management.

## API reference

Stepper provides a headless primitive set for value, focus, and state management, plus a styled wrapper component that hosts the same primitive internally.

### `tngStepper` (directive)

Attach on a container element (`ol`, `section`, etc.) and project stepper items, triggers, labels, descriptions, panels, and connectors inside it.

#### Primitive attachment

```html
<ol tngStepper aria-label="Release flow" defaultValue="review">
  <li tngStepperItem value="draft" label="Draft" completed>
    <button tngStepperTrigger><span tngStepperLabel>Draft</span></button>
  </li>
  <li tngStepperItem value="review" label="Review">
    <button tngStepperTrigger><span tngStepperLabel>Review</span></button>
  </li>
  <li tngStepperItem value="publish" label="Publish" optional>
    <button tngStepperTrigger><span tngStepperLabel>Publish</span></button>
  </li>
</ol>
```

| Surface | Value | Purpose |
| --- | --- | --- |
| Root attributes | `data-slot`, `data-orientation`, `data-linear` | Stable styling hooks for the primitive root. |
| Root inputs | `value`, `defaultValue`, `orientation`, `linear`, `loopFocus` | Control selection, first render state, orientation, linear gating, and focus wrapping. |
| Root outputs | `valueChange`, `stepChange` | Observe selected value changes and activation source metadata. |
| Item selector | `[tngStepperItem]` | Registers each step and emits `data-state`, `data-step-index`, and optional state hooks. |
| Trigger selector | `[tngStepperTrigger]` | Handles click activation, arrow-key focus, `aria-current`, and disabled semantics. |

### `tng-stepper` (component)

Wrapper that applies the baseline shell and attaches the headless `tngStepper` directive to its host. Use `[steps]` for data-driven flows, or project styled `tng-stepper-item` children for declarative markup.

#### Component attachment

```html
protected readonly steps: readonly TngStepperStep[] = [
  { value: 'cart', label: 'Cart', completed: true },
  { value: 'shipping', label: 'Shipping' },
  { value: 'payment', label: 'Payment' },
];

<tng-stepper ariaLabel="Checkout steps" defaultValue="shipping" [steps]="steps" />
```

#### Declarative item composition

```html
<tng-stepper ariaLabel="Checkout steps" defaultValue="shipping" linear>
  <tng-stepper-item value="cart" label="Cart" completed />
  <tng-stepper-item value="shipping" label="Shipping" />
  <tng-stepper-item value="payment" label="Payment" />
</tng-stepper>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | `readonly TngStepperStep[] \| null` | `null` | Generates styled `tng-stepper-item` rows from data. |
| `ordered` | `boolean` | `true` | Uses an ordered list for generated `steps`; set false for an unordered list. |
| `ariaLabel` | `string` | `'Stepper'` | Sets accessible label on the underlying stepper host. |
| `ariaLabelledby` | `string \| null` | `null` | Uses an external label element and suppresses the fallback `ariaLabel`. |
| `value` | `string \| number \| null` | `undefined` | Controls the selected step value when supplied. |
| `defaultValue` | `string \| number \| null` | `undefined` | Sets the initial uncontrolled selected value. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Controls orientation metadata and keyboard direction behavior. |
| `linear` | `boolean` | `false` | Prevents activation of future incomplete steps. |
| `loopFocus` | `boolean` | `true` | Allows arrow-key focus to wrap at the ends. |
| `valueChange` | `EventEmitter<string \| number>` | - | Emits the newly selected value. |
| `stepChange` | `EventEmitter<TngStepperValueChangeEvent>` | - | Emits value, previous value, and activation source. |

### `tng-stepper-item` (component)

Styled child item that hosts `tngStepperItem` internally and renders the trigger, label, description, marker, and state styling.

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number` | generated | Stable step identity used by selection and events. |
| `label` | `string \| null` | `null` | Visible label and accessible label source. |
| `description` | `string \| null` | `null` | Optional supporting text rendered below the label. |
| `completed`, `optional`, `disabled`, `error` | `boolean` | `false` | State flags forwarded to the headless item primitive. |

## Source-derived public Angular API

### `TngStepperComponent` — `tng-stepper`

- Inputs: `ariaLabel`, `ariaLabelledby`, `ordered`, `steps`
- Forwarded inputs: `defaultValue`, `linear`, `loopFocus`, `orientation`, `value`
- Forwarded outputs: `stepChange`, `valueChange`

### `TngStepperItemComponent` — `tng-stepper-item`

- Forwarded inputs: `completed`, `description`, `disabled`, `error`, `label`, `optional`, `value`
