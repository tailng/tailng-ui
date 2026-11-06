---
id: "components/input-field/api"
title: "Input Field API"
description: "Input Field API reference for Angular applications."
category: "components"
status: "stable"
tags: ["input-field","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/input-field/tng-input-field.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/api/input-field-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/input-field/sections/api/input-field-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/input-field/api"
componentGroup: "form"
symbols: ["TngInputFieldComponent"]
selectors: ["tng-input-field"]
productId: "input-field"
section: "api"
officialCatalog: true
generated: true
---

# Input Field API

Projected input shell with prefix and suffix slots for icons, helper text, and inline actions.

## API reference

`<tng-input-field>` owns the shared shell chrome for one projected `input[tngInput]` or `textarea[tngInput]` and optional slot content.

### `<tng-input-field>` (component)

Use this wrapper when the field needs projected prefix or suffix content and you want the standard TailNG input shell without composing the headless primitive yourself.

#### Input field component

```html
<tng-input-field appearance="outline" size="md" tone="neutral">
  <span tngInputFieldPrefix aria-hidden="true">Search</span>
  <input tngInput type="search" placeholder="Search docs" />
  <span tngInputFieldSuffix aria-hidden="true">Ctrl+K</span>
</tng-input-field>
```

| Property | Type | Default | Details |
| --- | --- | --- | --- |
| `appearance` | `'outline' \| 'solid' \| 'ghost'` | `'outline'` | Switches the shell presentation while keeping the same projected-control API. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls the shell height, radius, and spacing preset. |
| `tone` | `'neutral' \| 'primary' \| 'success' \| 'danger'` | `'neutral'` | Changes the emphasis palette for the shared shell contract. |
| `fullWidth` | boolean-like | `true` | Controls whether the host stretches to fill the available inline space. |

### Projected control contract

The wrapper does not create a native control. You project exactly one `input[tngInput]` or `textarea[tngInput]`, then theme the wrapper host with `--tng-input-*` CSS variables.

#### Projected input contract

```html
<div class="docs-slug-shell">
  <tng-input-field>
    <input tngInput type="text" value="core-platform" />
    <span tngInputFieldSuffix>.tailng.dev</span>
  </tng-input-field>
</div>

.docs-slug-shell {
  --tng-input-border: #cbd5e1;
  --tng-input-radius: 0.85rem;
  --tng-input-min-height: 2.75rem;
}
```

| Feature | Type | Details |
| --- | --- | --- |
| Projected control | `input[tngInput]` or `textarea[tngInput]` | The projected control keeps native semantics, Angular forms integration, and its own label/ARIA relationship. |
| Shell styling path | `--tng-input-*` CSS variables on `<tng-input-field>` | Use host classes and CSS vars instead of targeting the wrapper internals. |
| State-specific shell selectors | Headless escalation | Focus, invalid, disabled, and readonly attrs live on the inner `<tng-input-group>`. If you need custom shell selectors keyed off those states, switch to the headless primitive. |

#### Escalate to headless for state-driven shell selectors

```html
<!-- Need state-specific shell selectors? Move to the headless primitive. -->
<tng-input-group class="docs-search-group">
  <span tngInputFieldPrefix aria-hidden="true">Search</span>
  <input tngInput type="search" />
</tng-input-group>

.docs-search-group[data-focused] {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.docs-search-group[data-invalid] {
  border-color: #dc2626;
}
```

### Slot directives

Project leading and trailing content with `tngInputFieldPrefix`/`tngInputFieldSuffix`. The older aliases `tngInputLeading`/`tngInputTrailing` map to the same slot markers.

#### Leading and trailing slots

```html
<tng-input-field>
  <span tngInputLeading aria-hidden="true">$
  </span>
  <input tngInput type="text" />
  <button tngInputTrailing type="button" aria-label="Clear value">Clear</button>
</tng-input-field>
```

| Directive | Applies to | Adds | Alias | Details |
| --- | --- | --- | --- | --- |
| `tngInputFieldPrefix` | Projected leading element | `data-slot="input-leading"` | `tngInputLeading` | Marks decorative or semantic content before the projected control. |
| `tngInputFieldSuffix` | Projected trailing element | `data-slot="input-trailing"` | `tngInputTrailing` | Marks helper text, fixed suffix content, or action buttons after the control. |

## Source-derived public Angular API

### `TngInputFieldComponent` — `tng-input-field`

- Inputs: `appearance`, `fullWidth`, `size`, `tone`
