---
id: "components/multi-autocomplete/api"
title: "MultiAutocomplete API"
description: "MultiAutocomplete API reference for Angular applications."
category: "components"
status: "stable"
tags: ["multi-autocomplete","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/multi-autocomplete/tng-multi-autocomplete.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/api/multi-autocomplete-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/api/multi-autocomplete-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/multi-autocomplete/sections/api/multi-autocomplete-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/multi-autocomplete/api"
componentGroup: "form"
symbols: ["TngMultiAutocompleteComponent"]
selectors: ["tng-multi-autocomplete"]
productId: "multi-autocomplete"
section: "api"
officialCatalog: true
generated: true
---

# MultiAutocomplete API

Chip-based autocomplete selection for multiple values.

## API reference

`<tng-multi-autocomplete>` wraps the headless primitive for the standard chip-based multi-select workflow. You pass options and accessors; bind query text when the parent owns local filtering or server-side search.

### `tng-multi-autocomplete`

#### Wrapper attachment

```html
<tng-multi-autocomplete
  [options]="filteredReleaseMarkets()"
  [value]="selectedMarkets()"
  (valueChange)="onSelectedMarketsChange($event)"
  [query]="marketQuery()"
  (queryChange)="marketQuery.set($event)"
  [getOptionValue]="getMarketValue"
  [getOptionLabel]="getMarketLabel"
  [isOptionDisabled]="isMarketDisabled"
  placeholder="Search launch markets"
  [ariaLabel]="'Launch markets'"
></tng-multi-autocomplete>
```

| Property | Type | Details |
| --- | --- | --- |
| options | readonly O[] | Options rendered by the wrapper. Pass a pre-filtered list for local or server-side search. |
| value / valueChange | readonly V[] / output | Controlled multi-select model containing the committed option values. |
| open / openChange | boolean / output | Optional controlled overlay state when the parent needs to observe or drive the menu. |
| scrollStrategy | 'block' \| 'close' \| 'reposition' | Controls external scrolling. Defaults to reposition; block locks scrolling while preserving the document scrollbar. |
| query / queryChange | string / output | Controlled trigger text for local filtering, debounced requests, or server-driven results. |
| disabled, loading, invalid | boolean | Forwarded primitive state inputs reflected onto the wrapper host for visuals and interaction guards. |
| placeholder | string | Trigger input placeholder while no query text is present. |
| emptyText | string | Fallback copy rendered when the filtered option list is empty. |
| ariaLabel | string | Accessible name applied to the owned trigger input when no external label element is present. |

### Query and filtering

`<tng-multi-autocomplete>` exposes the trigger text through `query` and `queryChange`. The wrapper renders the `options` array exactly as provided, so local filtering and remote API requests both live in the parent component.

#### Local filtering

```ts
readonly marketQuery = signal('');

readonly filteredReleaseMarkets = computed(() => {
  const query = this.marketQuery().toLowerCase().trim();

  if (!query) {
    return this.releaseMarkets;
  }

  return this.releaseMarkets.filter((market) =>
    market.label.toLowerCase().includes(query),
  );
});
```

### Option accessors

The wrapper stays generic by delegating option identity, labels, disabled state, and tracking to small accessor functions.

#### Common accessors

```ts
interface ReleaseMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
  readonly disabled?: boolean;
}

readonly getMarketValue = (market: ReleaseMarketOption) => market.code;
readonly getMarketLabel = (market: ReleaseMarketOption) => market.label;
readonly isMarketDisabled = (market: ReleaseMarketOption) => market.disabled === true;
readonly trackMarket = (_index: number, market: ReleaseMarketOption) => market.code;
```

| Accessor | Type | Details |
| --- | --- | --- |
| getOptionValue | (option: O) => V | Maps each option object to the committed selection value stored in the model array. |
| getOptionLabel | (option: O) => string | Maps each option object to the text used for chips and the default option template. |
| isOptionDisabled | (option: O) => boolean | Disables individual options while keeping them visible in the results list. |
| trackBy | (index: number, option: O) => unknown | Custom identity function for stable option rendering when the input list is refreshed. |

### Angular Signal Forms

`<tng-multi-autocomplete>` can bind directly with `[formField]` for readonly array fields. Bind `query` separately when the parent needs to filter options or request them from a server.

#### Signal forms wiring

```ts
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

type MarketOption = {
  readonly code: string;
  readonly label: string;
};

@Component({
  selector: 'app-launch-markets-signal-form',
  standalone: true,
  imports: [FormField, TngMultiAutocompleteComponent],
  template: \`
    <tng-multi-autocomplete
      [formField]="launchForm.markets"
      [options]="markets"
      [getOptionValue]="getMarketValue"
      [getOptionLabel]="getMarketLabel"
      placeholder="Search launch markets"
      ariaLabel="Launch markets"
    ></tng-multi-autocomplete>
  \`,
})
export class LaunchMarketsSignalFormComponent {
  readonly launchModel = signal({
    markets: ['in'] as readonly string[],
  });
  readonly launchForm = form(this.launchModel);

  readonly markets: readonly MarketOption[] = [
    { code: 'in', label: 'India' },
    { code: 'sg', label: 'Singapore' },
    { code: 'us', label: 'United States' },
  ];

  readonly getMarketValue = (market: MarketOption) => market.code;
  readonly getMarketLabel = (market: MarketOption) => market.label;
}
```

### Template hooks

You can replace the default chip body and option rows through content templates while the wrapper keeps the primitive selection logic intact.

#### Template hooks

```html
<tng-multi-autocomplete
  [options]="releaseOwners"
  [value]="selectedOwners()"
  (valueChange)="onSelectedOwnersChange($event)"
  [getOptionValue]="getOwnerValue"
  [getOptionLabel]="getOwnerLabel"
>
  <ng-template #tngMultiAutocompleteChipTpl let-chip>
    <span>{{ chip.label }}</span>
    <button
      type="button"
      (click)="chip.removeItem(chip.value); $event.preventDefault(); $event.stopPropagation()"
      [attr.aria-label]="'Remove ' + chip.label"
    >
      ×
    </button>
  </ng-template>

  <ng-template #tngMultiAutocompleteOptionTpl let-option>
    <div>
      <strong>{{ option.label }}</strong>
      <small>{{ option.option.team }}</small>
    </div>
  </ng-template>
</tng-multi-autocomplete>
```

| Template | Context | Details |
| --- | --- | --- |
| #tngMultiAutocompleteChipTpl | TemplateRef<{ option, value, label, removeItem }> | Overrides the chip body while keeping the wrapper-owned chip container and remove semantics. |
| #tngMultiAutocompleteOptionTpl | TemplateRef<{ option, value, label, disabled, selected, active }> | Overrides each option row for richer metadata layouts without rebuilding the primitive plumbing. |

### Primitive foundation

The wrapper is intentionally opinionated around the common “chips + input + results list” UX. Use the headless primitive when you need to rebuild the shell.

| Capability | Availability | Guidance |
| --- | --- | --- |
| Query model | Wrapper API | Bind query/queryChange when a parent component needs local filtering, debounced requests, or server-driven results. |
| Overlay markup | Wrapper-owned | The wrapper owns the trigger, chip host, overlay container, and listbox wiring for the common multi-tag experience. |
| Primitive escape hatch | Available | Use headless multi autocomplete when you need bespoke trigger markup or custom overlay structure. |

## Source-derived public Angular API

### `TngMultiAutocompleteComponent` — `tng-multi-autocomplete`

- Inputs: `ariaLabel`, `emptyText`, `getOptionLabel`, `getOptionValue`, `isOptionDisabled`, `options`, `placeholder`, `resolveValueLabel`, `scrollStrategy`, `trackBy`
- Forwarded inputs: `disabled`, `invalid`, `loading`, `open`, `query`, `value`
- Forwarded outputs: `openChange`, `queryChange`, `valueChange`
