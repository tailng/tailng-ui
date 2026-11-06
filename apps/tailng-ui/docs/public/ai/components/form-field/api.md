---
id: "components/form-field/api"
title: "Form Field API"
description: "Form Field API reference for Angular applications."
category: "components"
status: "stable"
tags: ["form-field","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adapter.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-adornment.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field-message.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.component.ts","libs/tailng-ui/components/src/lib/form/form-field/tng-form-field.control.ts","apps/tailng-ui/docs/src/app/pages/components/form/form-field/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/form-field/sections/api/form-field-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/form-field/sections/api/form-field-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/form-field/api"
componentGroup: "form"
symbols: ["TngFormFieldComponent"]
selectors: ["tng-form-field"]
productId: "form-field"
section: "api"
officialCatalog: true
generated: true
---

# Form Field API

Complete field wrapper for labels, controls, hints, errors, and accessibility wiring.

## Form Field API

### Imports

### `<tng-form-field>`

### Messages

Use `tngHint` and `tngError` on projected message elements. Each message receives an id automatically unless one is provided.

### Adornments

Use `tngFormFieldPrefix` and `tngFormFieldSuffix` for content that belongs to the whole field row. Use `tngInputFieldPrefix` and `tngInputFieldSuffix` inside `<tng-input-field>` when the adornment belongs inside the input shell.

### Supported controls

The form-field projects any control via a default `<ng-content>` slot — you don't need to register a selector. Out of the box, the following TailNG controls register themselves through `TNG_FORM_FIELD_CONTROL` so the form-field can route label, `aria-describedby`, and state correctly:

Anything else projected as a child works too: the form-field falls back to the default content slot and visual styling. Use `appearance` and `controlType` to pin the layout when auto-detection isn't what you want.

### Custom Control Contract

Native `input[tngInput]`, `textarea[tngInput]`, and `textarea[tngTextarea]` work directly. Custom controls can provide `TNG_FORM_FIELD_CONTROL`. Add a static `tngFormFieldControl` marker attribute when the custom host is not one of the built-in projected control selectors.

## Source-derived public Angular API

### `TngFormFieldComponent` — `tng-form-field`

- Inputs: `appearance`, `controlType`, `disabled`, `hideHintWhenError`, `inlineWidth`, `invalid`, `labelPosition`, `requiredMarker`, `size`, `slot`
