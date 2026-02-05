import { Component, computed, signal } from '@angular/core';
import { TngCol, TngTable, TngCellDef } from '@tailng-ui/ui/table';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

type Row = { id: string; name: string; score: number; date?: string; label?: string; amount?: number };

@Component({
  standalone: true,
  selector: 'docs-table-examples',
  templateUrl: './table-examples.component.html',
  imports: [TngTable, TngCol, TngCellDef, ExampleBlockComponent, TngExampleDemo],
})
export class TableExamplesComponent {
  readonly rows = signal<Row[]>([
    { id: '1', name: 'Alice', score: 92, date: '2026-01-10', label: 'Item A', amount: 42 },
    { id: '2', name: 'Bob', score: 65, date: '2026-01-09', label: 'Item B', amount: -10 },
  ]);

  readonly emptyRows = signal<Row[]>([]);

  readonly dateValue = (r: Row) => r.date ?? '';
  readonly labelValue = (r: Row) => r.label ?? '';
  readonly amountValue = (r: Row) => r.amount ?? 0;
  readonly nameValue = (r: Row) => r.name;
  readonly scoreValue = (r: Row) => r.score;

  readonly basicHtml = computed(
    () => `
<tng-table [rows]="rows()" rowKey="id" emptyText="No items">
  <tng-col id="date" header="Date" [value]="dateValue"></tng-col>
  <tng-col id="label" header="Label" [value]="labelValue"></tng-col>
  <tng-col id="amount" header="Amount" align="right" [value]="amountValue"></tng-col>
</tng-table>
`,
  );

  readonly basicTs = computed(
    () => `rows = signal([{ id: '1', date: '2026-01-10', label: 'Item A', amount: 42 }, ...]);
dateValue = (r: Row) => r.date;
labelValue = (r: Row) => r.label;
amountValue = (r: Row) => r.amount;`,
  );

  readonly customCellHtml = computed(
    () => `
<tng-col id="score" header="Score" align="right" [value]="scoreValue">
  <ng-template tngCell let-value="value">
    <span [class]="scoreClass(value)">{{ value }}</span>
  </ng-template>
</tng-col>
`,
  );

  readonly emptyHtml = computed(
    () => `
<tng-table [rows]="emptyRows()" rowKey="id" emptyText="No data yet">
  ...
</tng-table>
`,
  );

  scoreClass(value: unknown): string {
    const n = Number(value);
    if (Number.isNaN(n)) return 'text-fg';
    return n >= 80 ? 'text-green-600 font-medium' : n >= 60 ? 'text-amber-600' : 'text-red-600';
  }
}
