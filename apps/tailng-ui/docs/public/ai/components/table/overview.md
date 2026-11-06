---
id: components/table/overview
title: Table component
description: Render accessible row data from typed TailNG table column metadata.
category: components
status: stable
tags: ["table", "layout", "data"]
package: @tailng-ui/components
sourcePaths: ["libs/tailng-ui/components/src/lib/layout/table/tng-table.component.ts", "apps/tailng-ui/docs/src/app/pages/components/layout/table/sections/overview/table-overview-page.component.ts"]
humanDocsUrl: https://tailng.dev/components/layout/table/overview
---

# Table component

Define typed column metadata and row data:

```ts
import { Component } from '@angular/core';
import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';

type ReleaseRow = Readonly<{ service: string; owner: string; status: string }>;

@Component({
  standalone: true,
  imports: [TngTableComponent],
  template: `
    <tng-table
      ariaLabel="Release status"
      density="compact"
      stickyHeader
      [columns]="columns"
      [items]="rows"
    />
  `,
})
export class ReleaseStatusTableExample {
  readonly columns: readonly TngTableColumn<ReleaseRow>[] = [
    { id: 'service', label: 'Service', sortable: true },
    { id: 'owner', label: 'Owner' },
    { id: 'status', label: 'Status' },
  ];

  readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];
}
```

Provide `ariaLabel` or `ariaLabelledby`. Column IDs default to property lookup when no accessor is provided. Use meaningful column labels because sortable headers announce them.

The component also supports density, sticky headers, sorting state, filtering state, pagination state, loading/error states, row styling, nested column groups, and custom cell/header templates.

## Documentation sections

- [Api](https://tailng.dev/ai/components/table/api.md)
- [Styling](https://tailng.dev/ai/components/table/styling.md)
- [Examples](https://tailng.dev/ai/components/table/examples.md)
