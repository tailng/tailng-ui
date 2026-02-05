import { Component, computed, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { ExampleBlockComponent, TngExampleDemo } from '../../../../../shared/example-block/example-block.component';

type Row = { id: string; name: string; score: number };

@Component({
  standalone: true,
  selector: 'docs-table-styling',
  templateUrl: './table-styling.component.html',
  imports: [TngTable, TngCol, ExampleBlockComponent, TngExampleDemo],
})
export class TableStylingComponent {
  readonly rows = signal<Row[]>([
    { id: '1', name: 'Alice', score: 92 },
    { id: '2', name: 'Bob', score: 87 },
  ]);

  readonly nameValue = (r: Row) => r.name;
  readonly scoreValue = (r: Row) => r.score;

  readonly tableTheadHtml = computed(
    () => `
<tng-table
  [rows]="rows()"
  rowKey="id"
  tableKlass="w-full text-sm"
  theadKlass="bg-primary/10"
>
  <tng-col id="name" header="Name" [value]="nameValue"></tng-col>
  <tng-col id="score" header="Score" align="right" [value]="scoreValue"></tng-col>
</tng-table>
`,
  );

  readonly colKlassHtml = computed(
    () => `
<tng-col id="name" header="Name" [value]="nameValue" klass="font-medium"></tng-col>
<tng-col id="score" header="Score" align="right" [value]="scoreValue" klass="text-primary"></tng-col>
`,
  );
}
