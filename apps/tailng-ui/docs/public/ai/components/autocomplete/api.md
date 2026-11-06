---
id: "components/autocomplete/api"
title: "AutoComplete API"
description: "AutoComplete API reference for Angular applications."
category: "components"
status: "stable"
tags: ["autocomplete","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/autocomplete/tng-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/api/autocomplete-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/api/autocomplete-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/autocomplete/sections/api/autocomplete-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/autocomplete/api"
componentGroup: "form"
symbols: ["TngAutocompleteComponent"]
selectors: ["tng-autocomplete"]
productId: "autocomplete"
section: "api"
officialCatalog: true
generated: true
---

# AutoComplete API

Single-value autocomplete patterns and filtering behavior.

## `tng-autocomplete`

The wrapper covers the standard searchable single-select case. Pass options, accessors, and the committed value model; bind query text when the parent owns local filtering or server-side search.

#### Wrapper attachment

```html
<tng-autocomplete
  [options]="filteredReleaseOwners()"
  [value]="selectedOwner()"
  (valueChange)="onSelectedOwnerChange($event)"
  [query]="ownerQuery()"
  (queryChange)="ownerQuery.set($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
  [isOptionDisabled]="isOwnerDisabled"
  placeholder="Search release owners"
  [ariaLabel]="'Release owner'"
></tng-autocomplete>
```

| Property | Type | Details |
| --- | --- | --- |
| options | readonly O[] | Options rendered by the wrapper. Pass a pre-filtered list for local or server-side search. |
| value | V \| null | Committed selected value. Forwarded to the primitive host. |
| valueChange | EventEmitter<V \| null> | Emitted when the committed option changes. |
| query | string | Current trigger text. Bind this to drive local filtering or server-side search. |
| queryChange | EventEmitter<string> | Emitted when focus or input updates the current query text. |
| open | boolean | Optional controlled open state for the overlay. |
| openChange | EventEmitter<boolean> | Emitted when the overlay opens or closes. |
| scrollStrategy | 'block' \| 'close' \| 'reposition' | Controls external scrolling. Defaults to reposition; block locks scrolling while preserving the document scrollbar. |
| placeholder | string | Placeholder text for the internal trigger input. |
| ariaLabel | string | Applied to the internal trigger when you do not provide labelledby ids. |
| disabled | boolean | Disables trigger focus, typing, and option selection. |
| loading | boolean | Marks the wrapper loading and reflects data-loading. |
| invalid | boolean | Marks the wrapper invalid and reflects data-invalid. |
| labelId | string \| null | Forwarded to primitive aria-labelledby wiring. |
| descriptionId | string \| null | Forwarded to primitive aria-describedby wiring. |
| errorId | string \| null | Appended to aria-describedby when invalid. |
| iconText | string | Text affordance rendered in the wrapper icon slot. Default is a chevron. |

## Query and filtering

`<tng-autocomplete>` exposes the current input text through `query` and `queryChange`. The wrapper renders the `options` array exactly as provided, so local filtering and remote API requests both live in the parent component.

#### Local filtering

```ts
readonly ownerQuery = signal('');

readonly filteredReleaseOwners = computed(() => {
  const query = this.ownerQuery().toLowerCase().trim();

  if (!query) {
    return this.releaseOwners;
  }

  return this.releaseOwners.filter((owner) =>
    owner.name.toLowerCase().includes(query),
  );
});
```

## Option accessors

The wrapper stays generic by delegating value, label, disabled, and identity mapping to small accessor functions.

#### Common accessors

```ts
readonly getOwnerValue = (owner: ReleaseOwner) => owner.id;
readonly getOwnerLabel = (owner: ReleaseOwner) => owner.name;
readonly isOwnerDisabled = (owner: ReleaseOwner) => owner.disabled === true;
```

| Accessor | Type | Details |
| --- | --- | --- |
| getOptionValue | (option: O) => V | Maps each option object to the committed value model. |
| getOptionLabel | (option: O) => string | Maps each option object to visible label text. |
| isOptionDisabled | (option: O) => boolean | Disables specific options without removing them from the list. |
| trackBy | (index: number, option: O) => unknown | Stabilizes wrapper rendering when async option arrays refresh. |

## Angular Signal Forms

`<tng-autocomplete>` is not yet safe for direct `[formField]` binding. In local interop tests, a later external field update is pushed back to `null`. Use the controlled `value` and `valueChange` pattern below until that sync path is fixed.

#### Current fallback pattern

```ts
readonly selectedOwner = signal<string | null>(null);
readonly ownerQuery = signal('');

<tng-autocomplete
  [options]="filteredReleaseOwners()"
  [value]="selectedOwner()"
  (valueChange)="selectedOwner.set($event)"
  [query]="ownerQuery()"
  (queryChange)="ownerQuery.set($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
  [isOptionDisabled]="isOwnerDisabled"
  placeholder="Search release owners"
  [ariaLabel]="'Release owner'"
></tng-autocomplete>
```

## Primitive foundation

`<tng-autocomplete>` is built on the headless autocomplete primitive. For more advanced behavior, drop to headless so you can own the trigger, content, overlay, and option markup directly.

| Capability | Availability | Guidance |
| --- | --- | --- |
| Query model | Wrapper API | Bind query/queryChange when a parent component needs local filtering, debounced requests, or server-driven results. |
| Free-form create | Headless only | Use the primitive root when you need allowCreate, strict=false, and create events. |
| Custom option markup | Wrapper template or headless | Use wrapper templates for richer option/selected rows; drop to primitives for fully custom trigger or overlay structure. |
| Overlay composition | Headless only | Use the primitive parts when you need custom trigger shells, empty states, or portal-level markup. |

## Source-derived public Angular API

### `TngAutocompleteComponent` — `tng-autocomplete`

- Inputs: `ariaLabel`, `getOptionLabel`, `getOptionValue`, `iconText`, `isOptionDisabled`, `options`, `placeholder`, `scrollStrategy`, `trackBy`, `value`
- Two-way models: `query`
- Outputs: `valueChange`
- Forwarded inputs: `descriptionId`, `disabled`, `errorId`, `invalid`, `labelId`, `loading`, `open`
- Forwarded outputs: `openChange`
