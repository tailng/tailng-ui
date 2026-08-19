import type { RegistryItem } from '../registry.types';

const tablePrimitiveTsTemplate = `import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: 'table[tngTable]',
  exportAs: 'tngTable',
})
export class TngTablePrimitive {
  public readonly items = input<readonly unknown[]>([]);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'table' as const;
}
`;

const tableComponentTsTemplate = `import { Component, input } from '@angular/core';
import { TngTablePrimitive } from './tng-table-primitive';

export type TngTableColumn = Readonly<{
  id: string;
  label: string;
}>;

@Component({
  selector: 'tng-table',
  imports: [TngTablePrimitive],
  templateUrl: './tng-table.html',
  styleUrl: './tng-table.css',
})
export class TngTable {
  public readonly ariaLabel = input<string>('Table');
  public readonly columns = input<readonly TngTableColumn[]>([]);
  public readonly items = input<readonly Record<string, unknown>[]>([]);
}
`;

const tableTemplateHtml = `<div class="tng-table__scroll">
  <table tngTable class="tng-table" [attr.aria-label]="ariaLabel()" [items]="items()">
    <thead>
      <tr>
        @for (column of columns(); track column.id) {
          <th scope="col">{{ column.label }}</th>
        }
      </tr>
    </thead>
    <tbody>
      @for (row of items(); track $index) {
        <tr>
          @for (column of columns(); track column.id) {
            <td>{{ row[column.id] }}</td>
          }
        </tr>
      }
    </tbody>
  </table>
</div>
`;

const tableTemplateCss = `:host {
  display: block;
}

.tng-table__scroll {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  overflow-x: auto;
}

.tng-table {
  border-collapse: collapse;
  min-width: 100%;
}

.tng-table th,
.tng-table td {
  border-top: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

.tng-table th {
  background: #f8fafc;
  border-top: 0;
  font-weight: 700;
}
`;

const tableIndexTsTemplate = `export * from './tng-table';
export * from './tng-table-primitive';
`;

export const tableRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for table primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/table',
    importSymbols: ['TngTable', 'TngTablePrimitive'],
  },
  files: [
    {
      content: tablePrimitiveTsTemplate,
      path: 'src/app/tailng-ui/table/tng-table-primitive.ts',
    },
    {
      content: tableComponentTsTemplate,
      path: 'src/app/tailng-ui/table/tng-table.ts',
    },
    {
      content: tableTemplateHtml,
      path: 'src/app/tailng-ui/table/tng-table.html',
    },
    {
      content: tableTemplateCss,
      path: 'src/app/tailng-ui/table/tng-table.css',
    },
    {
      content: tableIndexTsTemplate,
      path: 'src/app/tailng-ui/table/index.ts',
    },
  ],
  name: 'table',
} satisfies RegistryItem;
