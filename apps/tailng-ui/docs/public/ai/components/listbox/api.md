---
id: "components/listbox/api"
title: "ListBox API"
description: "ListBox API reference for Angular applications."
category: "components"
status: "stable"
tags: ["listbox","form","api"]
package: "@tailng-ui/components"
importPath: "@tailng-ui/components"
sourcePaths: ["libs/tailng-ui/components/src/lib/form/listbox/tng-listbox.component.ts","apps/tailng-ui/docs/src/app/pages/components/form/listbox/routes.ts","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/api/listbox-api-page.component.css","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/api/listbox-api-page.component.html","apps/tailng-ui/docs/src/app/pages/components/form/listbox/sections/api/listbox-api-page.component.ts"]
humanDocsUrl: "https://tailng.dev/components/form/listbox/api"
componentGroup: "form"
symbols: ["TngListboxComponent"]
selectors: ["tng-listbox"]
productId: "listbox"
section: "api"
officialCatalog: true
generated: true
---

# ListBox API

Listbox interaction patterns and keyboard behavior reference.

## API reference

`<tng-listbox>` is the component wrapper for an always-open listbox surface. It hosts the primitive keyboard and selection model while accepting options as data.

### `<tng-listbox>`

#### Wrapper attachment

```html
<tng-listbox
  ariaLabel="Release channels"
  [options]="channelOptions"
  [value]="selectedChannel()"
  (valueChange)="onSelectedChannelChange($event)"
></tng-listbox>
```

| Input / Output | Type | Notes |
| --- | --- | --- |
| `options` | `readonly O[]` | Source data rendered into listbox options. |
| `value`, `valueChange` | `V \| readonly V[] \| null` | Controlled selection model. Single mode returns one value; multiple mode returns an array. |
| `multiple` | `boolean` | Switches single vs multiple selection behavior. |
| `orientation` | `'vertical' \| 'horizontal'` | Changes the arrow-key axis for roving focus. |
| `direction` | `'ltr' \| 'rtl'` | Controls horizontal key mapping. |
| `disabled`, `loop`, `typeahead` | `boolean` | Global interaction flags forwarded to the primitive controller. |
| `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` | `string \| null` | Host accessibility labels and description hooks. |
| `getOptionValue` | `(option: O) => V` | Maps each option object to the committed selection value. |
| `getOptionLabel` | `(option: O) => string` | Maps each option object to the primary option text. |
| `getOptionDescription` | `(option: O) => string \| null \| undefined` | Optional supporting copy rendered under the main label. |
| `isOptionDisabled` | `(option: O) => boolean` | Skips the option from keyboard and selection interactions. |
| `trackBy` | `(index: number, option: O) => unknown` | Custom identity for Angular's list rendering. |

### Default accessors

When your option objects follow common shapes, you can skip the accessor inputs. The wrapper resolves values from `value`, `id`, `key`, or `code`; labels from `label`, `title`, or `name`; descriptions from `description`, `copy`, `supportingText`, or `details`; and disabled state from `disabled` or `unavailable`.

### Custom option template

Provide `#tngListboxOptionTpl` when you want custom option markup while keeping the same wrapper API and keyboard behavior.

#### Custom option template

```html
<tng-listbox
  ariaLabel="Release channels"
  [options]="channelOptions"
  [getOptionValue]="getChannelValue"
  [getOptionLabel]="getChannelLabel"
  [getOptionDescription]="getChannelDescription"
  [isOptionDisabled]="isChannelDisabled"
  [value]="selectedChannel()"
  (valueChange)="onSelectedChannelChange($event)"
>
  <ng-template #tngListboxOptionTpl let-item>
    <span class="channel-option__title">{{ item.label }}</span>
    @if (item.description; as description) {
      <span class="channel-option__description">{{ description }}</span>
    }
  </ng-template>
</tng-listbox>
```

## Source-derived public Angular API

### `TngListboxComponent` — `tng-listbox`

- Inputs: `ariaDescribedBy`, `ariaLabel`, `ariaLabelledby`, `getOptionDescription`, `getOptionLabel`, `getOptionValue`, `invalid`, `isOptionDisabled`, `options`, `required`, `trackBy`
- Forwarded inputs: `direction`, `disabled`, `loop`, `multiple`, `orientation`, `typeahead`, `value`
- Forwarded outputs: `valueChange`
