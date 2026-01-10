import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  computed,
  ContentChildren,
  input,
  QueryList,
  signal
} from '@angular/core';

import { TailngColComponent } from './col.component';
import { TngAlign, TngCellContext, TngHeaderContext, TngResolvedColumn } from './table.types';

@Component({
  selector: 'tng-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle],
  templateUrl: './table.component.html',
})
export class TailngTableComponent<T extends Record<string, any> = any> implements AfterContentInit {
  @ContentChildren(TailngColComponent)
  private colDefs!: QueryList<TailngColComponent<T>>;

  /* =====================
   * Inputs
   * ===================== */
  readonly rows = input<T[]>([]);

  /** optional trackBy key (property name) */
  readonly rowKey = input<string | null>(null);

  /** styling */
  readonly tableKlass = input<string>('w-full text-sm');
  readonly theadKlass = input<string>('bg-alternate-background');
  readonly thKlass = input<string>('px-3 py-2 text-left font-semibold border-b border-border');
  readonly tdKlass = input<string>('px-3 py-2 border-b border-border align-middle');
  readonly tbodyKlass = input<string>('bg-background');

  /** empty */
  readonly emptyText = input<string>('No data');

  /* =====================
   * Internal projected columns signal
   * ===================== */
  private readonly projectedCols = signal<TailngColComponent<T>[]>([]);

  ngAfterContentInit(): void {
    const sync = () => this.projectedCols.set(this.colDefs?.toArray() ?? []);
    sync();
    this.colDefs.changes.subscribe(sync);
  }

  readonly columns = computed<TngResolvedColumn<T>[]>(() =>
    this.projectedCols().map((c) => ({
      id: c.id(),
      header: c.resolveHeader(),
      align: c.align(),
      width: c.width() ?? undefined,
      klass: c.klass() ?? undefined,
      value: (row: T) => c.resolveValue(row),
      headerTpl: c.resolveHeaderTpl() as any,
      cellTpl: c.resolveCellTpl() as any,
    }))
  );

  readonly hasRows = computed(() => (this.rows()?.length ?? 0) > 0);

  trackRow = (index: number, row: T) => {
    const key = this.rowKey();
    return key ? (row as any)?.[key] ?? index : index;
  };

  alignClass(align?: TngAlign): string {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  }

  styleWidth(col: TngResolvedColumn<T>): Record<string, string> | null {
    return col.width ? { width: col.width } : null;
  }

  cellCtx(row: T, rowIndex: number, col: TngResolvedColumn<T>): TngCellContext<T> {
    const value = col.value ? col.value(row) : (row as any)?.[col.id];
    return { $implicit: row, row, rowIndex, colId: col.id, value };
  }

  headerCtx(col: TngResolvedColumn<T>): TngHeaderContext {
    return { colId: col.id, header: col.header };
  }
}
