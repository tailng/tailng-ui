---
id: "components/accordion/api"
title: "Accordion API"
description: "Accordion API reference for Angular applications."
category: "components"
status: "stable"
tags: ["accordion","layout","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/accordion/tng-accordion.component.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/routes.ts","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/api/accordion-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/api/accordion-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/layout/accordion/sections/api/accordion-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/layout/accordion/api"
componentGroup: "layout"
symbols: ["TngAccordionComponent","TngAccordionItemComponent","TngAccordionPanelComponent","TngAccordionTriggerComponent"]
selectors: ["tng-accordion","tng-accordion-item","tng-accordion-panel","tng-accordion-trigger"]
productId: "accordion"
section: "api"
officialCatalog: true
generated: true
---

# Accordion API

Single and multi-expand panel groups with keyboard navigation and aria wiring.

## API reference

Accordion ships as headless directives and styled wrappers. The core behavior contract lives in `tngAccordion`, while wrappers forward the same interaction model.

### Primitive composition

Use root, item, trigger, and panel directives together. This gives full styling control while preserving accessibility and keyboard behavior.

#### Headless accordion

```html
<section tngAccordion [defaultValue]="'overview'" [collapsible]="true">
  <article tngAccordionItem value="overview">
    <button tngAccordionTrigger type="button">Overview</button>
    <div tngAccordionPanel>Overview content</div>
  </article>
  <article tngAccordionItem value="api">
    <button tngAccordionTrigger type="button">API</button>
    <div tngAccordionPanel>API content</div>
  </article>
</section>
```

| Directive | Selector | Purpose |
| --- | --- | --- |
| `TngAccordion` | `[tngAccordion]` | Owns expanded values, focus movement, and keyboard/pointer interactions. |
| `TngAccordionItem` | `[tngAccordionItem]` | Registers a value/disabled item boundary under the root. |
| `TngAccordionTrigger` | `[tngAccordionTrigger]` | Applies trigger ARIA state and keyboard handling. |
| `TngAccordionPanel` | `[tngAccordionPanel]` | Exposes `role="region"` with trigger association and mount policy. |

### Wrapper composition

`tng-accordion` and subcomponents are thin wrappers over the same primitive behavior contract, and `[tngAccordionIndicator]` lets you replace the default chevron with your own projected icon.

#### Component wrapper

```html
<tng-accordion ariaLabel="Documentation" [defaultValue]="'install'">
  <tng-accordion-item value="install">
    <tng-accordion-trigger>Installation</tng-accordion-trigger>
    <tng-accordion-panel>Install instructions.</tng-accordion-panel>
  </tng-accordion-item>
  <tng-accordion-item value="migration">
    <tng-accordion-trigger>Migration</tng-accordion-trigger>
    <tng-accordion-panel>Upgrade notes.</tng-accordion-panel>
  </tng-accordion-item>
</tng-accordion>
```

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | `'Accordion'` | Applies an accessible label to the wrapper host. |
| `type` | `'single' \| 'multiple'` | `'single'` | Single allows one expanded item; multiple allows many. |
| `defaultValue` | `string \| number \| readonly (string \| number)[] \| null` | `undefined` | Initial uncontrolled selection. |
| `value` | `string \| number \| readonly (string \| number)[] \| null` | `undefined` | Controlled selection source. |
| `collapsible` | `boolean` | `true` | When single-mode, allows closing the active item. |
| `disabled` | `boolean` | `false` | Disables interactions for the full accordion. |
| `loop` | `boolean` | `true` | Arrow key traversal wraps from end to start and vice versa. |
| `lazy` | `boolean` | `false` | Mount panels only after first expansion. |
| `keepAlive` | `boolean` | `true` | Keep previously mounted panels in DOM when collapsed. |
| `[tngAccordionIndicator]` | `Directive` | Optional | Project a custom icon into the trigger and suppress the built-in default chevron. |

### Outputs

Listen to state changes from either primitives or wrapper components.

#### Outputs

```html
<section
  tngAccordion
  [type]="'multiple'"
  (valueChange)="onValueChange($event)"
  (expandedChange)="onExpandedChange($event)"
></section>
```

| Output | Payload | When it fires |
| --- | --- | --- |
| `valueChange` | `value \| value[] \| null` | Selection changes from user or imperative toggles. |
| `valuesChange` | `readonly value[]` | Multiple-mode selection updates. |
| `expandedChange` | `{ value, expanded, previousValues, values, trigger }` | Normalized event with previous/next values and trigger source. |
| `openStart`/`opened` | `value` | Open lifecycle phases. |
| `closeStart`/`closed` | `value` | Close lifecycle phases. |

## Source-derived public Angular API

### `TngAccordionComponent` — `tng-accordion`

- Inputs: `ariaLabel`
- Forwarded inputs: `collapsible`, `defaultValue`, `disabled`, `keepAlive`, `lazy`, `loop`, `type`, `value`
- Forwarded outputs: `closed`, `closeStart`, `expandedChange`, `opened`, `openStart`, `valueChange`, `valuesChange`

### `TngAccordionItemComponent` — `tng-accordion-item`

- Forwarded inputs: `disabled`, `value`

### Structural surfaces

These APIs provide composition or projection surfaces without their own bindable signal API:

- `TngAccordionPanelComponent` — `tng-accordion-panel`
- `TngAccordionTriggerComponent` — `tng-accordion-trigger`
