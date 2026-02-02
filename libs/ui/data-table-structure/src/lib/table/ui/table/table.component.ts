import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { TngCol } from '../column/col.component';

import { TngTableController } from '../../core/controller/table.controller';
import type { TngSort, TngAlign, TngResolvedColumn, TngCellContext, TngHeaderContext } from '../../core/types';
import { TNG_TABLE } from '../../core/tokens/table.token';

@Component({
  selector: 'tng-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle],
  templateUrl: './table.component.html',
  providers: [{ provide: TNG_TABLE, useFactory: () => new TngTableController() }],
})
export class TngTable<T extends Record<string, any> = any> implements AfterContentInit {
  @ContentChildren(TngCol)
  private colDefs!: QueryList<TngCol<T>>;

  private readonly controller = inject(TNG_TABLE);

  /** Emits on any sort change (both client & server modes). */
  @Output() readonly sortChange = new EventEmitter<TngSort>();

  /* =====================
   * Inputs
   * ===================== */
  readonly rows = input<T[]>([]);
  readonly rowKey = input<string | null>(null);

  /** Default: client (static) sort */
  readonly sortMode = input<'client' | 'server'>('client');

  /** styling */
  readonly tableKlass = input<string>('w-full text-sm');
  readonly theadKlass = input<string>('bg-alternate-background');
  readonly thKlass = input<string>('px-3 py-2 text-left font-semibold border-b border-border');
  readonly tdKlass = input<string>('px-3 py-2 border-b border-border align-middle');
  readonly tbodyKlass = input<string>('bg-bg');

  /** empty */
  readonly emptyText = input<string>('No data');

  /* =====================
   * Internal projected columns signal
   * ===================== */
  private readonly projectedCols = signal<TngCol<T>[]>([]);

  constructor() {
    // Emit sortChange whenever controller.sort changes (skip initial emission)
    let first = true;
    effect(() => {
      const s = this.controller.sort();
      if (first) {
        first = false;
        return;
      }
      this.sortChange.emit(s);
    });
  }

  ngAfterContentInit(): void {
    const sync = () => this.projectedCols.set(this.colDefs?.toArray() ?? []);
    sync();
    this.colDefs.changes.subscribe(sync);
  }

  /* =====================
   * Columns
   * ===================== */
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

  /* =====================
   * Rows view (client sorting)
   * ===================== */
  readonly viewRows = computed<T[]>(() => {
    const rows = this.rows();
    const mode = this.sortMode();
    const sort = this.controller.sort();

    if (mode !== 'client') return rows;
    if (!sort.active || !sort.direction) return rows;

    const dir = sort.direction === 'asc' ? 1 : -1;
    const colId = sort.active;

    // stable sort
    return rows
      .map((row, i) => ({ row, i, key: this.sortValue(row, colId) }))
      .sort((a, b) => {
        const c = this.compare(a.key, b.key);
        return c !== 0 ? c * dir : a.i - b.i;
      })
      .map((x) => x.row);
  });

  readonly hasRows = computed(() => (this.viewRows()?.length ?? 0) > 0);

  trackRow = (index: number, row: T) => {
    const key = this.rowKey();
    return key ? (row as any)?.[key] ?? index : index;
  };

  /* =====================
   * Rendering helpers
   * ===================== */
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

  /* =====================
   * Sort helpers
   * ===================== */
  private sortValue(row: T, colId: string): unknown {
    const col = this.columns().find((c) => c.id === colId);
    if (col?.value) return col.value(row);
    return (row as any)?.[colId];
  }

  private compare(a: unknown, b: unknown): number {
    // null/undefined first
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    // numbers (avoid booleans)
    if (typeof a === 'number' && typeof b === 'number') {
      return a === b ? 0 : a < b ? -1 : 1;
    }

    const an = typeof a === 'string' ? Number(a) : NaN;
    const bn = typeof b === 'string' ? Number(b) : NaN;
    if (Number.isFinite(an) && Number.isFinite(bn)) {
      return an === bn ? 0 : an < bn ? -1 : 1;
    }

    // ISO-ish dates (string)
    if (typeof a === 'string' && typeof b === 'string') {
      const at = Date.parse(a);
      const bt = Date.parse(b);
      if (!Number.isNaN(at) && !Number.isNaN(bt)) {
        return at === bt ? 0 : at < bt ? -1 : 1;
      }
    }

    // fallback: locale string
    return String(a).localeCompare(String(b));
  }
}
