import { NgStyle, NgTemplateOutlet } from '@angular/common';
import type {
  ElementRef} from '@angular/core';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  output,
  viewChildren,
} from '@angular/core';
import {
  collapseKey,
  expandKey,
  flattenTreeTableRows,
  resolveTreeTableKeydown,
  toggleExpandedKey,
  toggleSelectedKey,
  type TngTreeTableFlatRow,
  type TngTreeTableKey,
  type TngTreeTableRowEvent,
} from '@tailng-ui/primitives';
import {
  isTreeTableGroupColumn,
  normalizeTngTreeTableClassValue,
  normalizeTngTreeTableCssLength,
  type TngTreeTableCellAlign,
  type TngTreeTableClassInput,
  type TngTreeTableColumn,
  type TngTreeTableLeafColumn,
  type TngTreeTableStyleInput,
} from './tng-tree-table-column.type';

// ── Re-exports for consumers ──────────────────────────────────────────────────
export type {
  TngTreeTableCellAlign,
  TngTreeTableClassInput,
  TngTreeTableColumn,
  TngTreeTableGroupColumn,
  TngTreeTableLeafColumn,
  TngTreeTableSlot,
  TngTreeTableStyleInput,
} from './tng-tree-table-column.type';
export type {
  TngTreeTableFlatRow,
  TngTreeTableKey,
  TngTreeTableRowEvent,
} from '@tailng-ui/primitives';

// ── Internal header-tree types ────────────────────────────────────────────────

/** One cell node in the generated header row matrix. */
type TngTreeTableHeaderNode<TRow> = Readonly<{
  column: TngTreeTableColumn<TRow>;
  key: string;
  label: string;
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

type TngTreeTableHeaderModel<TRow> = Readonly<{
  headerRows: readonly (readonly TngTreeTableHeaderNode<TRow>[])[];
  leafColumns: readonly TngTreeTableLeafColumn<TRow>[];
  maxDepth: number;
}>;

// ── Column helpers ────────────────────────────────────────────────────────────

function hasValidKey<TRow>(column: TngTreeTableColumn<TRow>): boolean {
  return typeof column.key === 'string' && column.key.trim().length > 0;
}

function isHidden<TRow>(column: TngTreeTableColumn<TRow>): boolean {
  return (column as { hidden?: boolean }).hidden === true;
}

function getColumnLabel<TRow>(column: TngTreeTableColumn<TRow>): string {
  return column.label ?? column.key;
}

// ── Value helpers ─────────────────────────────────────────────────────────────

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleString();
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }
  return JSON.stringify(value);
}

function normalizeCellAlign(
  value: TngTreeTableCellAlign | null | undefined,
): TngTreeTableCellAlign {
  return value === 'center' || value === 'end' ? value : 'start';
}

// ── Template context types ────────────────────────────────────────────────────

export type TngTreeTableCellContext<TRow = unknown> = Readonly<{
  $implicit: unknown;
  column: TngTreeTableLeafColumn<TRow>;
  columnKey: string;
  row: TRow;
  rowIndex: number;
  flatRow: TngTreeTableFlatRow<TRow>;
  value: unknown;
}>;

export type TngTreeTableHeaderContext<TRow = unknown> = Readonly<{
  $implicit: TngTreeTableColumn<TRow>;
  column: TngTreeTableColumn<TRow>;
  columnKey: string;
  label: string;
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

// ── Template directives ───────────────────────────────────────────────────────

@Directive({
  selector: 'ng-template[tngTreeTableCellTemplate]',
  exportAs: 'tngTreeTableCellTemplate',
})
export class TngTreeTableCellTemplate<TRow = unknown> {
  public readonly columnKey = input<string | null>(null, {
    alias: 'tngTreeTableCellTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTreeTableCellContext<TRow>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngTreeTableHeaderTemplate]',
  exportAs: 'tngTreeTableHeaderTemplate',
})
export class TngTreeTableHeaderTemplate<TRow = unknown> {
  public readonly columnKey = input<string | null>(null, {
    alias: 'tngTreeTableHeaderTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTreeTableHeaderContext<TRow>>>(TemplateRef);
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'tng-tree-table',
  exportAs: 'tngTreeTableComponent',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './tng-tree-table.component.html',
  styleUrl: './tng-tree-table.component.css',
})
export class TngTreeTableComponent<TRow = unknown> {
  // ── Content children (templates) ─────────────────────────────────────────────

  private readonly cellTemplates = contentChildren(TngTreeTableCellTemplate<TRow>);
  private readonly headerTemplates = contentChildren(TngTreeTableHeaderTemplate<TRow>);

  // ── Inputs ──────────────────────────────────────────────────────────────────

  public readonly data = input<readonly TRow[]>([]);
  public readonly columns = input.required<readonly TngTreeTableColumn<TRow>[]>();
  public readonly getKey = input<(row: TRow, indexPath: readonly number[]) => TngTreeTableKey>(
    (_row, indexPath) => indexPath.join('-'),
  );
  public readonly getChildren = input<(row: TRow) => readonly TRow[] | null | undefined>(
    (_row) => undefined,
  );
  public readonly expandedKeys = input<readonly TngTreeTableKey[]>([]);
  public readonly selectedKeys = input<readonly TngTreeTableKey[]>([]);
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly expandOnRowClick = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly selectable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly emptyText = input<string>('No records found');
  public readonly loadingText = input<string>('Loading...');
  public readonly treeColumnKey = input<string | null>(null);
  public readonly indentSize = input<number>(20);
  public readonly ariaLabel = input<string | null>('Tree table');
  public readonly dir = input<'ltr' | 'rtl' | null>(null);
  public readonly density = input<'comfortable' | 'compact'>('comfortable');

  /**
   * Per-row class hook. Receives the original data row and the flat row
   * context (includes level, expanded, selected, disabled).
   */
  public readonly rowClass = input<
    ((row: TRow, flatRow: TngTreeTableFlatRow<TRow>) => TngTreeTableClassInput) | null
  >(null);

  /**
   * Per-row inline-style hook. Receives the original data row and the flat
   * row context. Use `--tng-tree-table-row-bg` to paint the row background.
   */
  public readonly rowStyle = input<
    ((row: TRow, flatRow: TngTreeTableFlatRow<TRow>) => TngTreeTableStyleInput) | null
  >(null);

  // ── Outputs ──────────────────────────────────────────────────────────────────

  public readonly expandedKeysChange = output<readonly TngTreeTableKey[]>();
  public readonly selectedKeysChange = output<readonly TngTreeTableKey[]>();
  public readonly rowClick = output<TngTreeTableRowEvent<TRow>>();
  public readonly rowExpand = output<TngTreeTableRowEvent<TRow>>();
  public readonly rowCollapse = output<TngTreeTableRowEvent<TRow>>();

  // ── Internal computed ────────────────────────────────────────────────────────

  protected readonly expandedSet = computed<ReadonlySet<TngTreeTableKey>>(
    () => new Set(this.expandedKeys()),
  );

  protected readonly selectedSet = computed<ReadonlySet<TngTreeTableKey>>(
    () => new Set(this.selectedKeys()),
  );

  protected readonly flatRows = computed<readonly TngTreeTableFlatRow<TRow>[]>(() =>
    flattenTreeTableRows({
      data: this.data(),
      expandedKeys: this.expandedSet(),
      selectedKeys: this.selectedSet(),
      getKey: this.getKey(),
      getChildren: this.getChildren(),
    }),
  );

  /** Derived header model: multi-row header matrix + flat leaf column list. */
  protected readonly headerModel = computed<TngTreeTableHeaderModel<TRow>>(() =>
    this.buildHeaderModel(this.columns()),
  );

  protected get leafColumns(): readonly TngTreeTableLeafColumn<TRow>[] {
    return this.headerModel().leafColumns;
  }

  protected get headerRows(): readonly (readonly TngTreeTableHeaderNode<TRow>[])[] {
    return this.headerModel().headerRows;
  }

  /** The leaf column that hosts the indent spacer and expand/collapse toggle. */
  protected readonly treeColumn = computed<TngTreeTableLeafColumn<TRow> | null>(() => {
    const leaves = this.headerModel().leafColumns;
    if (leaves.length === 0) return null;

    const withToggle = leaves.find((c) => c.treeToggle === true);
    if (withToggle !== undefined) return withToggle;

    const byKey = this.treeColumnKey();
    if (byKey !== null) {
      const found = leaves.find((c) => c.key === byKey);
      if (found !== undefined) return found;
    }

    return leaves[0] ?? null;
  });

  /** Total visible leaf column count — used for loading/empty colspan. */
  protected readonly colspan = computed<number>(() =>
    Math.max(1, this.headerModel().leafColumns.length),
  );

  // ── Row element refs for focus management ────────────────────────────────────

  private readonly rowRefs = viewChildren<ElementRef<HTMLTableRowElement>>('rowRef');

  // ── Event handlers ────────────────────────────────────────────────────────────

  protected onToggle(flatRow: TngTreeTableFlatRow<TRow>, event: Event): void {
    event.stopPropagation();
    if (flatRow.disabled || this.disabled() || !flatRow.expandable) return;

    const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
    this.expandedKeysChange.emit([...nextSet]);

    const rowEvent = this.makeRowEvent(flatRow, event);
    flatRow.expanded ? this.rowCollapse.emit(rowEvent) : this.rowExpand.emit(rowEvent);
  }

  protected onRowClick(flatRow: TngTreeTableFlatRow<TRow>, event: MouseEvent): void {
    if (flatRow.disabled || this.disabled()) return;

    this.rowClick.emit(this.makeRowEvent(flatRow, event));

    if (this.expandOnRowClick() && flatRow.expandable) {
      const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      const rowEvent = this.makeRowEvent(flatRow, event);
      flatRow.expanded ? this.rowCollapse.emit(rowEvent) : this.rowExpand.emit(rowEvent);
    }
  }

  protected onRowKeydown(
    flatRow: TngTreeTableFlatRow<TRow>,
    event: KeyboardEvent,
    rowIndex: number,
  ): void {
    const intent = resolveTreeTableKeydown(event.key, {
      expandable: flatRow.expandable,
      expanded: flatRow.expanded,
      selectable: this.selectable(),
    });

    if (intent === null) return;

    if (intent === 'select') {
      event.preventDefault();
      this.onSelect(flatRow, event);
      return;
    }

    if (intent === 'focusFirst') {
      event.preventDefault();
      this.focusRow(0);
      return;
    }

    if (intent === 'focusLast') {
      event.preventDefault();
      this.focusRow(this.flatRows().length - 1);
      return;
    }

    if (flatRow.disabled || this.disabled()) return;

    if (intent === 'expand') {
      const nextSet = expandKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      this.rowExpand.emit(this.makeRowEvent(flatRow, event));
      return;
    }

    if (intent === 'collapse') {
      const nextSet = collapseKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      this.rowCollapse.emit(this.makeRowEvent(flatRow, event));
      return;
    }

    if (intent === 'toggle' && flatRow.expandable) {
      const nextSet = toggleExpandedKey(this.expandedSet(), flatRow.key);
      this.expandedKeysChange.emit([...nextSet]);
      const rowEvent = this.makeRowEvent(flatRow, event);
      flatRow.expanded ? this.rowCollapse.emit(rowEvent) : this.rowExpand.emit(rowEvent);
    }
  }

  protected onSelect(flatRow: TngTreeTableFlatRow<TRow>, event: Event): void {
    if (!this.selectable() || flatRow.disabled || this.disabled()) return;
    const nextSet = toggleSelectedKey(this.selectedSet(), flatRow.key);
    this.selectedKeysChange.emit([...nextSet]);
  }

  // ── Template helpers ──────────────────────────────────────────────────────────

  protected isTreeColumn(column: TngTreeTableLeafColumn<TRow>): boolean {
    return column.key === this.treeColumn()?.key;
  }

  protected getIndentWidth(level: number): string {
    return `${level * this.indentSize()}px`;
  }

  protected getCellValue(
    row: TRow,
    column: TngTreeTableLeafColumn<TRow>,
    rowIndex: number,
  ): unknown {
    const { accessor } = column;
    if (typeof accessor === 'function') return accessor(row, rowIndex);
    if (accessor !== undefined) return (row as Record<PropertyKey, unknown>)[accessor as PropertyKey];
    return (row as Record<PropertyKey, unknown>)[column.key];
  }

  protected getCellText(
    row: TRow,
    column: TngTreeTableLeafColumn<TRow>,
    rowIndex: number,
  ): string {
    return normalizeCellValue(this.getCellValue(row, column, rowIndex));
  }

  protected getCellAlign(column: TngTreeTableLeafColumn<TRow>): TngTreeTableCellAlign {
    return normalizeCellAlign(column.align);
  }

  protected getColumnWidth(column: TngTreeTableLeafColumn<TRow>): string | null {
    return normalizeTngTreeTableCssLength(column.width);
  }

  protected getHeaderAlign(node: TngTreeTableHeaderNode<TRow>): TngTreeTableCellAlign {
    if (node.isGroup) return 'center';
    return normalizeCellAlign((node.column as TngTreeTableLeafColumn<TRow>).align);
  }

  protected getNodeKey(node: TngTreeTableHeaderNode<TRow>): string {
    return `${node.depth}:${node.key}`;
  }

  // ── Resolve hooks ─────────────────────────────────────────────────────────────

  protected resolveRowClass(flatRow: TngTreeTableFlatRow<TRow>): string {
    const fn = this.rowClass();
    return fn ? normalizeTngTreeTableClassValue(fn(flatRow.row, flatRow)) : '';
  }

  protected resolveRowStyle(flatRow: TngTreeTableFlatRow<TRow>): TngTreeTableStyleInput {
    const fn = this.rowStyle();
    return fn ? fn(flatRow.row, flatRow) : null;
  }

  protected resolveHeaderClass(node: TngTreeTableHeaderNode<TRow>): string {
    return normalizeTngTreeTableClassValue(
      (node.column as { headerClass?: TngTreeTableClassInput }).headerClass,
    );
  }

  protected resolveHeaderStyle(node: TngTreeTableHeaderNode<TRow>): TngTreeTableStyleInput {
    return (node.column as { headerStyle?: TngTreeTableStyleInput }).headerStyle ?? null;
  }

  protected resolveCellClass(
    column: TngTreeTableLeafColumn<TRow>,
    row: TRow,
  ): string {
    const { cellClass } = column;
    if (cellClass == null) return '';
    if (typeof cellClass === 'function') return normalizeTngTreeTableClassValue(cellClass(row));
    return normalizeTngTreeTableClassValue(cellClass);
  }

  protected resolveCellStyle(
    column: TngTreeTableLeafColumn<TRow>,
    row: TRow,
  ): TngTreeTableStyleInput {
    const { cellStyle } = column;
    if (cellStyle == null) return null;
    if (typeof cellStyle === 'function') return cellStyle(row);
    return cellStyle;
  }

  // ── Template lookup ───────────────────────────────────────────────────────────

  protected getCellTemplate(columnKey: string): TngTreeTableCellTemplate<TRow> | null {
    let fallback: TngTreeTableCellTemplate<TRow> | null = null;
    for (const tpl of this.cellTemplates()) {
      if (tpl.columnKey() === columnKey) return tpl;
      if (tpl.columnKey() === null) fallback = tpl;
    }
    return fallback;
  }

  protected getHeaderTemplate(columnKey: string): TngTreeTableHeaderTemplate<TRow> | null {
    let fallback: TngTreeTableHeaderTemplate<TRow> | null = null;
    for (const tpl of this.headerTemplates()) {
      if (tpl.columnKey() === columnKey) return tpl;
      if (tpl.columnKey() === null) fallback = tpl;
    }
    return fallback;
  }

  protected getCellContext(
    flatRow: TngTreeTableFlatRow<TRow>,
    column: TngTreeTableLeafColumn<TRow>,
    rowIndex: number,
  ): TngTreeTableCellContext<TRow> {
    const value = this.getCellValue(flatRow.row, column, rowIndex);
    return {
      $implicit: value,
      column,
      columnKey: column.key,
      row: flatRow.row,
      rowIndex,
      flatRow,
      value,
    };
  }

  protected getHeaderContext(node: TngTreeTableHeaderNode<TRow>): TngTreeTableHeaderContext<TRow> {
    return {
      $implicit: node.column,
      column: node.column,
      columnKey: node.key,
      label: node.label,
      isGroup: node.isGroup,
      depth: node.depth,
      colspan: node.colspan,
      rowspan: node.rowspan,
    };
  }

  // ── Track-by helpers ──────────────────────────────────────────────────────────

  protected trackByKey(_index: number, flatRow: TngTreeTableFlatRow<TRow>): TngTreeTableKey {
    return flatRow.key;
  }

  protected trackByColumnKey(_index: number, column: { key: string }): string {
    return column.key;
  }

  protected trackByNodeKey(_index: number, node: TngTreeTableHeaderNode<TRow>): string {
    return this.getNodeKey(node);
  }

  // ── Private ───────────────────────────────────────────────────────────────────

  private makeRowEvent(
    flatRow: TngTreeTableFlatRow<TRow>,
    event: Event,
  ): TngTreeTableRowEvent<TRow> {
    return { row: flatRow.row, key: flatRow.key, level: flatRow.level, originalEvent: event };
  }

  private focusRow(index: number): void {
    const target = this.rowRefs()[index];
    if (target !== undefined) target.nativeElement.focus();
  }

  // ── Header model builder (mirrors tng-table pattern) ─────────────────────────

  private buildHeaderModel(
    columns: readonly TngTreeTableColumn<TRow>[],
  ): TngTreeTableHeaderModel<TRow> {
    const filtered = columns.filter((c) => hasValidKey(c) && !isHidden(c));
    const maxDepth = this.computeMaxDepth(filtered);
    const headerRows: TngTreeTableHeaderNode<TRow>[][] = Array.from(
      { length: Math.max(1, maxDepth) },
      () => [],
    );
    const leafColumns: TngTreeTableLeafColumn<TRow>[] = [];

    for (const column of filtered) {
      this.walkColumn(column, 0, maxDepth, headerRows, leafColumns);
    }

    return Object.freeze({
      headerRows: headerRows.map((row) =>
        Object.freeze(row.slice()),
      ) as readonly (readonly TngTreeTableHeaderNode<TRow>[])[],
      leafColumns: Object.freeze(leafColumns.slice()),
      maxDepth: Math.max(1, maxDepth),
    });
  }

  private walkColumn(
    column: TngTreeTableColumn<TRow>,
    depth: number,
    maxDepth: number,
    headerRows: TngTreeTableHeaderNode<TRow>[][],
    leafColumns: TngTreeTableLeafColumn<TRow>[],
  ): number {
    if (isTreeTableGroupColumn(column)) {
      const visibleChildren = column.children.filter((c) => hasValidKey(c) && !isHidden(c));
      if (visibleChildren.length === 0) return 0;

      let colspan = 0;
      for (const child of visibleChildren) {
        colspan += this.walkColumn(child, depth + 1, maxDepth, headerRows, leafColumns);
      }
      if (colspan === 0) return 0;

      headerRows[depth].push(
        Object.freeze({
          column,
          key: column.key,
          label: getColumnLabel(column),
          isGroup: true,
          depth,
          colspan,
          rowspan: 1,
        }),
      );
      return colspan;
    }

    // Leaf
    const leaf = column as TngTreeTableLeafColumn<TRow>;
    leafColumns.push(leaf);
    const rowspan = Math.max(1, maxDepth - depth);
    headerRows[depth].push(
      Object.freeze({
        column: leaf,
        key: leaf.key,
        label: getColumnLabel(leaf),
        isGroup: false,
        depth,
        colspan: 1,
        rowspan,
      }),
    );
    return 1;
  }

  private computeMaxDepth(columns: readonly TngTreeTableColumn<TRow>[]): number {
    let max = 0;
    const walk = (column: TngTreeTableColumn<TRow>, depth: number): void => {
      if (isTreeTableGroupColumn(column)) {
        const visible = column.children.filter((c) => hasValidKey(c) && !isHidden(c));
        if (visible.length === 0) return;
        for (const child of visible) walk(child, depth + 1);
      } else {
        max = Math.max(max, depth + 1);
      }
    };
    for (const column of columns) {
      if (hasValidKey(column) && !isHidden(column)) walk(column, 0);
    }
    return max;
  }
}

export { TngTreeTableComponent as TngTreeTable };
export { TngTreeTableCellTemplate as TngTreeTableCellTpl };
export { TngTreeTableHeaderTemplate as TngTreeTableHeaderTpl };
